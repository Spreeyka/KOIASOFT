import { styled } from "@mui/material";
import { ReactNode } from "react";

const Layout = ({ children }: { children: ReactNode }) => {
  return <StyledMain>{children}</StyledMain>;
};

const StyledMain = styled("main")(() => ({
  display: "flex",
  flexDirection: "column",
  alignItems: "center",
  minHeight: "100vh",
  position: "relative",
  padding: "100px 0 60px 0",
  backgroundColor: "#DEFFE0 ",
}));

export { Layout };
