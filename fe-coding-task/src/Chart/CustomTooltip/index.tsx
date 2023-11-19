import { Paper, Tooltip, Typography, styled } from "@mui/material";

interface CustomTooltipProps {
  active?: boolean;
  payload?: any;
  label?: string;
}

export const CustomTooltip: React.FC<CustomTooltipProps> = ({ active, payload, label }) => {
  if (!active || !payload || !payload.length || !label) return null;

  var year = label.slice(0, 4);
  var quarter = label.slice(4).replace("K", "Q");

  return (
    <Tooltip title="Price by year and quarter">
      <TooltipContainer>
        <Typography variant="subtitle1" sx={{ color: "#666" }}>
          {year} {quarter}
        </Typography>
        <Typography variant="subtitle2" sx={{ color: "#333", fontWeight: "bold" }}>
          {`${payload[0].value} NOK/m²`}
        </Typography>
      </TooltipContainer>
    </Tooltip>
  );
};

const TooltipContainer = styled(Paper)(() => ({
  backgroundColor: "#f0f0f0",
  padding: "10px",
  borderRadius: "10px",
  boxShadow: "0 2px 4px rgba(0, 0, 0, 0.1)",
  textAlign: "center",
}));
