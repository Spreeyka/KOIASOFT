import { useLocation, useParams, useResolvedPath } from "react-router-dom";
import { Bar, BarChart, CartesianGrid, Label, XAxis, YAxis, Tooltip as RechartsTooltip } from "recharts";
import { CustomTooltip } from "./CustomTooltip";
import { Box, Paper, Tooltip, styled } from "@mui/material";
import { CommentSection } from "../Form/commentSection";
import StarBorderIcon from "@mui/icons-material/StarBorder";
import StarIcon from "@mui/icons-material/Star";
import IconButton from "@mui/material/IconButton";
import { useStore } from "../store";

const SimpleBarChart = () => {
  const { dwellingType } = useParams();

  const {
    state: { priceValuesByDate },
  } = useLocation();
  const { statToggledAsFavorite, savedStats } = useStore((state) => state);

  const url = useResolvedPath("").pathname;
  const isFavorite = savedStats.find((stat) => stat.path === url);

  const toggleFavoriteStat = () => {
    statToggledAsFavorite({ path: url, data: priceValuesByDate });
  };

  return (
    <StyledBox>
      <Box sx={{ position: "absolute", top: 20, right: 20 }}>
        <Tooltip title={<span style={{ fontSize: "12px" }}>Save to favorites</span>}>
          <IconButton onClick={toggleFavoriteStat} style={{ color: "#FF7F50" }}>
            {isFavorite ? <StarIcon /> : <StarBorderIcon />}
          </IconButton>
        </Tooltip>
      </Box>
      <figure style={{ margin: 0 }}>
        <StyledFigcaption>Prices for dwelling type "{dwellingType?.toLowerCase()}"</StyledFigcaption>
        <BarChart width={600} height={400} data={priceValuesByDate} margin={{ top: 40, left: 0, bottom: 10 }}>
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="date" tick={{ fontSize: 14 }} angle={0} hide />
          <YAxis tick={{ fontSize: 14 }}>
            <Label
              value="NOK"
              position="top"
              style={{
                textAnchor: "middle",
                fontSize: 16,
              }}
              offset={28}
              dx={3}
            />
          </YAxis>
          <RechartsTooltip content={<CustomTooltip />} />
          <Bar dataKey="price" fill="#FF7F50" />
        </BarChart>
      </figure>
      <Box sx={{ marginTop: "24px" }}>
        <CommentSection />
      </Box>
    </StyledBox>
  );
};

const StyledFigcaption = styled("figcaption")(() => ({
  fontSize: "22px",
  color: "rgb(128, 128, 128)",
  textAlign: "center",
  margin: "0 0 0 20px",
  padding: "0 0 20px 0",
}));

const StyledBox = styled(Paper)(() => ({
  position: "relative",
  padding: "40px 40px 40px 20px",
  backgroundColor: "white",
  borderRadius: "20px",
  boxShadow: "0 0 10px rgba(0, 0, 0, 0.1)",
}));

export { SimpleBarChart };
