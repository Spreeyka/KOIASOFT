import { Button, Stack, Typography } from "@mui/material";
import FormControl from "@mui/material/FormControl";
import InputLabel from "@mui/material/InputLabel";
import MenuItem from "@mui/material/MenuItem";
import Select, { SelectChangeEvent } from "@mui/material/Select";
import React, { useState } from "react";
import { useMutation, useQuery } from "react-query";

const fetchData = async (requestBody: RequestBody) => {
  const apiUrl = "https://data.ssb.no/api/v0/en/table/07241";

  const response = await fetch(apiUrl, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(requestBody),
  });

  if (!response.ok) {
    throw new Error("Network response was not ok");
  }

  return response.json();
};

interface RequestBody {
  query: QueryItem[];
  response: {
    format: string;
  };
}

interface QueryItem {
  code: string;
  selection: {
    filter: string;
    values: (string | undefined)[];
  };
}

const requestBody = {
  query: [
    {
      code: "Boligtype",
      selection: {
        filter: "item",
        values: ["00", "02", "03"],
      },
    },
    {
      code: "ContentsCode",
      selection: {
        filter: "item",
        values: ["KvPris", "Omsetninger"],
      },
    },
    {
      code: "Tid",
      selection: {
        filter: "all",
        values: ["*"],
      },
    },
  ],
  response: {
    format: "json-stat2",
  },
};

const Form = () => {
  const [type, setType] = React.useState("");
  const [startYear, setStartYear] = React.useState("");
  const [startQuarter, setStartQuarter] = React.useState("");
  const [endYear, setEndYear] = React.useState("");
  const [endQuarter, setEndQuarter] = React.useState("");
  const [priceValues, setPriceValues] = useState([]);

  const handleChange = (event: SelectChangeEvent, setter: React.Dispatch<React.SetStateAction<string>>) => {
    setter(event.target.value as string);
  };

  const { data, isLoading, isError } = useQuery("myData", () => fetchData(requestBody));
  const mutation = useMutation((body: RequestBody) => fetchData(body));

  if (isLoading) {
    return <p>Loading...</p>;
  }

  if (isError) {
    return <p>Error fetching data</p>;
  }

  type OriginalArrayItem = string;

  type TransformedObject = {
    [year: string]: {
      quartersAvailable: string[];
    };
  };

  function transformArray(originalArray: OriginalArrayItem[]): TransformedObject {
    return originalArray.reduce((acc, item) => {
      const matchResult = item.match(/(\d{4})K(\d)/);

      if (matchResult) {
        const [year, quarter] = matchResult.slice(1) as [string, string]; // Extract year and quarter
        if (!acc[year]) {
          acc[year] = { quartersAvailable: [] };
        }
        acc[year].quartersAvailable.push(`K${quarter}`);
      }

      return acc;
    }, {} as TransformedObject);
  }

  const dwellings = data.dimension.Boligtype.category.label;
  const typeOfDwellings = Object.values(dwellings);

  const allQuarters = Object.keys(data.dimension.Tid.category.label);
  const quartersAvailableByYear = transformArray(allQuarters);
  const yearsAvailable = [...new Set(Object.keys(data.dimension.Tid.category.label).map((item) => item.slice(0, 4)))];

  const selectedDwellingTypeId = Object.keys(dwellings).find((dwellingTypeId) => dwellings[dwellingTypeId] === type);

  const startData = startYear + startQuarter;
  const endData = endYear + endQuarter;

  const quartersRange = allQuarters.slice(allQuarters.indexOf(startData), allQuarters.indexOf(endData) + 1);

  const pricingRequestBody = {
    query: [
      {
        code: "Boligtype",
        selection: {
          filter: "item",
          values: [selectedDwellingTypeId],
        },
      },
      {
        code: "ContentsCode",
        selection: {
          filter: "item",
          values: ["KvPris"],
        },
      },
      {
        code: "Tid",
        selection: {
          filter: "item",
          values: [...quartersRange],
        },
      },
    ],
    response: {
      format: "json-stat2",
    },
  };

  const handleClick = async () => {
    const result = await mutation.mutateAsync(pricingRequestBody);
    setPriceValues(result.value);
  };

  return (
    <>
      <Stack spacing={2.4} width={400}>
        <FormControl fullWidth>
          <InputLabel id="type">Type</InputLabel>
          <Select labelId="type" id="type" value={type} label="Type" onChange={(event) => handleChange(event, setType)}>
            {typeOfDwellings.map((dwellingType, index) => (
              <MenuItem value={String(dwellingType)} key={index}>
                {String(dwellingType)}
              </MenuItem>
            ))}
          </Select>
        </FormControl>
        <Stack spacing={1}>
          <Typography variant="caption" textAlign={"center"} fontSize={"16px"}>
            From
          </Typography>
          <Stack direction="row" spacing={6}>
            <FormControl fullWidth>
              <InputLabel id="startYear">Year</InputLabel>
              <Select
                labelId="startYear"
                id="startYear"
                value={startYear}
                label="Year"
                onChange={(event) => handleChange(event, setStartYear)}
              >
                {yearsAvailable.map((year, index) => (
                  <MenuItem key={index} value={String(year)}>
                    {String(year)}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
            <FormControl fullWidth disabled={!startYear}>
              <InputLabel id="startQuarter">Quarter</InputLabel>
              <Select
                labelId="startQuarter"
                id="startQuarter"
                value={startQuarter}
                label="Quarter"
                onChange={(event) => handleChange(event, setStartQuarter)}
              >
                {quartersAvailableByYear[startYear]?.quartersAvailable.map((quarter, index) => (
                  <MenuItem key={index} value={String(quarter)}>
                    {String(quarter)}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
          </Stack>
        </Stack>
        <Stack spacing={1}>
          <Typography variant="caption" textAlign={"center"} fontSize={"16px"}>
            To
          </Typography>
          <Stack direction="row" spacing={6}>
            <FormControl fullWidth>
              <InputLabel id="endYear">Year</InputLabel>
              <Select
                labelId="endYear"
                id="endYear"
                value={endYear}
                label="Year"
                onChange={(event) => handleChange(event, setEndYear)}
              >
                {yearsAvailable
                  .filter((year) => {
                    const isSameYear = year === startYear;
                    const isLastQuarter = startQuarter === "K4";
                    const isYearAfterStartYear = year >= startYear;

                    // We don't want to allow selecting the same year, if Q4 was selected as starting point
                    return !(isSameYear && isLastQuarter) && isYearAfterStartYear;
                  })
                  .map((year, index) => (
                    <MenuItem key={index} value={String(year)}>
                      {String(year)}
                    </MenuItem>
                  ))}
              </Select>
            </FormControl>
            <FormControl fullWidth disabled={!endYear}>
              <InputLabel id="endQuarter">Quarter</InputLabel>
              <Select
                labelId="endQuarter"
                id="endQuarter"
                value={endQuarter}
                label="Quarter"
                onChange={(event) => handleChange(event, setEndQuarter)}
              >
                {quartersAvailableByYear[endYear]?.quartersAvailable
                  .filter((quarter) => {
                    if (startYear !== endYear) return true;
                    return startQuarter < quarter;
                  })
                  .map((quarter, index) => (
                    <MenuItem key={index} value={String(quarter)}>
                      {String(quarter)}
                    </MenuItem>
                  ))}
              </Select>
            </FormControl>
          </Stack>
        </Stack>
        <Button
          variant="contained"
          color="primary"
          style={{ marginTop: 40, padding: "10px", fontWeight: 600 }}
          onClick={handleClick}
        >
          Show Chart
        </Button>
      </Stack>
    </>
  );
};
export { Form };
