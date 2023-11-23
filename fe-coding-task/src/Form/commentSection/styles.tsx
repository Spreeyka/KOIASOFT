import { Box, IconButtonProps, IconButton as MUIIconButton, TextField, styled } from "@mui/material";

interface CustomIconButtonProps extends IconButtonProps {
  backgroundColor: string;
  hoverBackgroundColor: string;
}

const IconButton = styled(MUIIconButton, {
  shouldForwardProp: (prop) => prop !== "backgroundColor" && prop !== "hoverBackgroundColor",
})<CustomIconButtonProps>(({ backgroundColor, hoverBackgroundColor }) => ({
  padding: 4,
  background: backgroundColor,
  "&:hover": {
    background: hoverBackgroundColor,
    boxShadow: "0 4px 8px rgba(0, 0, 0, 0.1)",
  },
}));

const StyledBox = styled(Box)(() => ({
  display: "flex",
  flexDirection: "row",
  alignItems: "center",
  gap: "20px",
}));

const CommentInput = styled(TextField)({
  width: "100%",
});

export { CommentInput, IconButton, StyledBox };
