import { Button, Paper, Stack, Typography, styled } from "@mui/material";
import FormControl from "@mui/material/FormControl";
import InputLabel from "@mui/material/InputLabel";
import MenuItem from "@mui/material/MenuItem";
import Select, { SelectChangeEvent } from "@mui/material/Select";
import React from "react";
import { SubmitHandler, useForm } from "react-hook-form";
import { useMutation, useQuery } from "react-query";
import { useNavigate } from "react-router-dom";
import { StatsList } from "../StatsList";
import { RequestBody, createPricingRequestBody, fetchDwellingPrices } from "./dataLoaders/dwellingPricesLoader";
import { fetchData } from "./dataLoaders/initialDataLoader";
import { useLocalStorage } from "./hooks/useLocalStorage";
import { transformArray } from "./utils";

interface PriceValue {
  date: string;
  price: number;
}

type FormData = {
  type: string;
  startYear: number;
  startQuarter: number;
  endYear: number;
  endQuarter: number;
};

const DwellingPricesForm = () => {
  const [type, setType] = useLocalStorage<string>("type", "");
  const [startYear, setStartYear] = useLocalStorage<string>("startYear", "");
  const [startQuarter, setStartQuarter] = useLocalStorage<string>("startQuarter", "");
  const [endYear, setEndYear] = useLocalStorage<string>("endYear", "");
  const [endQuarter, setEndQuarter] = useLocalStorage<string>("endQuarter", "");
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<FormData>();

  const { data, isLoading } = useQuery("initialData", () => fetchData());
  const mutation = useMutation((body: RequestBody) => fetchDwellingPrices(body));
  const navigate = useNavigate();

  if (isLoading) {
    return <p>Loading...</p>;
  }

  const dwellings = data.dimension.Boligtype.category.label;
  const allQuarters = Object.keys(data.dimension.Tid.category.label);
  const yearsAvailable = [...new Set(Object.keys(data.dimension.Tid.category.label).map((item) => item.slice(0, 4)))];

  const selectedDwellingTypeId = Object.keys(dwellings).find((dwellingTypeId) => dwellings[dwellingTypeId] === type);
  const quartersAvailableByYear = transformArray(allQuarters);
  const typeOfDwellings = Object.values(dwellings);
  const startData = startYear + startQuarter;
  const endData = endYear + endQuarter;
  const quartersRange = allQuarters.slice(allQuarters.indexOf(startData), allQuarters.indexOf(endData) + 1);

  const onSubmit: SubmitHandler<FormData> = async () => {
    const pricingRequestBody = createPricingRequestBody(selectedDwellingTypeId, quartersRange);
    const result = await mutation.mutateAsync(pricingRequestBody);
    const priceValuesByDate: PriceValue[] = result.value.map((value: number, index: number) => ({
      date: quartersRange[index],
      price: value,
    }));

    const path = `/prices/${type}/${startYear}/${startQuarter}/${endYear}/${endQuarter}`;
    navigate(path, { state: { type, priceValuesByDate } });
  };

  const handleInputChange = (e: SelectChangeEvent<string>, setter: React.Dispatch<React.SetStateAction<string>>) =>
    setter(e.target.value);

  return (
    <StyledBox>
      <form onSubmit={handleSubmit(onSubmit)}>
        <Stack spacing={2.4} width={400}>
          <FormControl fullWidth>
            <InputLabel id="type">Type</InputLabel>
            <Select
              labelId="type"
              id="type"
              value={type}
              label="Type"
              {...register("type", { required: "Type is required" })}
              onChange={(e) => handleInputChange(e, setType)}
            >
              {typeOfDwellings.map((dwellingType, index) => (
                <MenuItem value={String(dwellingType)} key={index}>
                  {String(dwellingType)}
                </MenuItem>
              ))}
            </Select>
          </FormControl>
          <Stack spacing={1}>
            <Typography variant="caption" textAlign="center" fontSize="16px">
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
                  {...register("startYear", { required: "Start year is required" })}
                  onChange={(e) => handleInputChange(e, setStartYear)}
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
                  {...register("startQuarter", { required: "Start quarter is required" })}
                  onChange={(e) => handleInputChange(e, setStartQuarter)}
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
                  {...register("endYear", { required: "End year is required" })}
                  onChange={(e) => handleInputChange(e, setEndYear)}
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
                  {...register("endQuarter", { required: "End quarter is required" })}
                  onChange={(e) => handleInputChange(e, setEndQuarter)}
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
            type="submit"
            variant="contained"
            color="primary"
            style={{ marginTop: 40, padding: "10px", fontWeight: 600 }}
          >
            Show Chart
          </Button>
        </Stack>
        {Object.keys(errors).length > 0 && (
          <StyledErrorBox role="alert" aria-live="assertive" aria-atomic="true">
            <p style={{ margin: 0 }}>
              <strong>Error:</strong> Please fill all form inputs.
            </p>
          </StyledErrorBox>
        )}
      </form>
      <StatsList />
    </StyledBox>
  );
};

const StyledErrorBox = styled(Paper)(() => ({
  marginTop: "18px",
  padding: "10px",
  borderRadius: "5px",
  backgroundColor: "#ffe6e6",
  textAlign: "center",
  boxShadow: "0 0 3px rgba(255, 0, 0, 0.5)",
}));

const StyledBox = styled(Paper)(() => ({
  padding: "60px 30px",
  backgroundColor: "white",
  borderRadius: "20px",
  boxShadow: "0 0 10px rgba(0, 0, 0, 0.1)",
}));

export { DwellingPricesForm };
