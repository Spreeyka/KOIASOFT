import { useLocation, useParams } from "react-router-dom";
import { Bar, BarChart, CartesianGrid, Label, Tooltip, XAxis, YAxis } from "recharts";
import { CustomTooltip } from "./CustomTooltip";
import { styled } from "@mui/material";

const SimpleBarChart = () => {
  const { dwellingType, fromYear, fromQuarter, toYear, toQuarter } = useParams();
  const {
    state: { priceValuesByDate },
  } = useLocation();

  return (
    <figure style={{ margin: 0 }}>
      <StyledFigcaption>Prices for dwelling type "{dwellingType?.toLowerCase()}"</StyledFigcaption>
      <BarChart width={600} height={400} data={priceValuesByDate} margin={{ top: 20, left: 25, bottom: 10 }}>
        <CartesianGrid strokeDasharray="3 3" />
        <XAxis dataKey="date" tick={{ fontSize: 14 }} angle={0} hide />
        <YAxis tick={{ fontSize: 14 }}>
          <Label
            value="NOK"
            position="insideLeft"
            angle={-90}
            style={{
              textAnchor: "middle",
              fontSize: 16,
            }}
            offset={-6}
          />
        </YAxis>
        <Tooltip content={<CustomTooltip />} />
        <Bar dataKey="price" fill="#4CAF50" />
      </BarChart>
    </figure>
  );
};

const StyledFigcaption = styled("figcaption")(() => ({
  fontSize: "22px",
  color: "rgb(128, 128, 128)",
  textAlign: "center",
  margin: "0 0 0 56px",
  padding: "0 0 20px 0",
}));

export { SimpleBarChart };
