import { styled } from "@mui/material";
import { useStore } from "../store";
import { Link } from "react-router-dom";

const StatsList = () => {
  const { savedStats } = useStore((state) => state);

  if (savedStats.length === 0) return null;

  return (
    <>
      <h2>Saved charts</h2>
      <StyledList>
        {savedStats.map((stat) => {
          const formattedUrl = decodeURIComponent(stat.path).split("/prices/")[1];
          return (
            <li key={stat.path}>
              <Link to={stat.path} state={{ priceValuesByDate: stat.data }}>
                {formattedUrl}
              </Link>
            </li>
          );
        })}
      </StyledList>
    </>
  );
};

const StyledList = styled("ul")({
  listStyle: "none",
  padding: 0,
  margin: 0,
  textAlign: "left",
  "& h2": {
    margin: "40px 0 0",
    fontSize: "1.5em",
    color: "#333",
  },
  "& li:not(:last-child)": {
    marginBottom: "10px",
  },
  "& a": {
    textDecoration: "none",
    color: "#007bff",
    "&:hover": {
      textDecoration: "underline",
    },
  },
});

export { StatsList };
