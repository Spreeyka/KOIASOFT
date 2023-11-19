import { styled } from "@mui/material";
import { ReactNode } from "react";

const Layout = ({ children }: { children: ReactNode }) => {
  return <StyledMain>{children}</StyledMain>;
};

const StyledMain = styled("main")(() => ({
  display: "flex",
  flexDirection: "column",
  justifyContent: "flex-start", // Change this to "flex-start"
  alignItems: "center",
  padding: "100px",
  minHeight: "calc(100vh)",
  backgroundColor: "#f5fdf9",
}));

export { Layout };
