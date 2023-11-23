import { Button, Paper, Stack, Typography, styled } from "@mui/material";
import FormControl from "@mui/material/FormControl";
import InputLabel from "@mui/material/InputLabel";
import MenuItem from "@mui/material/MenuItem";
import Select, { SelectChangeEvent } from "@mui/material/Select";
import React from "react";
import { useMutation, useQuery } from "react-query";
import { Form, useNavigate } from "react-router-dom";
import { StatsList } from "../StatsList";
import { RequestBody, createPricingRequestBody, fetchDwellingPrices } from "./dataLoaders/dwellingPricesLoader";
import { fetchData } from "./dataLoaders/initialDataLoader";
import { transformArray } from "./utils";

interface PriceValue {
  date: string;
  price: number;
}

const DwellingPricesForm = () => {
  const [type, setType] = React.useState("");
  const [startYear, setStartYear] = React.useState("");
  const [startQuarter, setStartQuarter] = React.useState("");
  const [endYear, setEndYear] = React.useState("");
  const [endQuarter, setEndQuarter] = React.useState("");
  const navigate = useNavigate();

  const { data, isLoading } = useQuery("initialData", () => fetchData());
  const mutation = useMutation((body: RequestBody) => fetchDwellingPrices(body));

  if (isLoading) {
    return <p>Loading...</p>;
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
  console.log("quartersRange", quartersRange);

  console.log("selectedDwellingTypeId", selectedDwellingTypeId);
  console.log("quartersRange", quartersRange);
  console.log("Object.keys(dwellings)", dwellings);

  const handleClick = async () => {
    const pricingRequestBody = createPricingRequestBody(selectedDwellingTypeId, quartersRange);
    const result = await mutation.mutateAsync(pricingRequestBody);
    const priceValuesByDate: PriceValue[] = result.value.map((value: number, index: number) => ({
      date: quartersRange[index],
      price: value,
    }));

    const path = `/prices/${selectedDwellingTypeId}/${startYear}/${startQuarter}/${endYear}/${endQuarter}`;

    navigate(path, { state: { type, priceValuesByDate } });
  };

  const handleChange = (event: SelectChangeEvent, setter: React.Dispatch<React.SetStateAction<string>>) => {
    setter(event.target.value as string);
  };

  return (
    <StyledBox>
      <Form method="post">
        <Stack spacing={2.4} width={400}>
          <FormControl fullWidth>
            <InputLabel id="type">Type</InputLabel>
            <Select
              labelId="type"
              id="type"
              value={type}
              label="Type"
              onChange={(event) => handleChange(event, setType)}
            >
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
                      {String(quarter.slice(1))}
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
                        {String(quarter.slice(1))}
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
      </Form>
      <StatsList />
    </StyledBox>
  );
};

const StyledBox = styled(Paper)(() => ({
  padding: "60px 30px",
  backgroundColor: "white",
  borderRadius: "20px",
  boxShadow: "0 0 10px rgba(0, 0, 0, 0.1)",
}));

export { DwellingPricesForm };
