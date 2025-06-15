import { Components, Theme } from "@mui/material";

export const MuiButton: Components<Theme>["MuiButton"] = {
  styleOverrides: {
    root: {
      borderRadius: 8,
      padding: "8px 16px",
      boxShadow: "none",
    },
    contained: {
      color: "white",
    },
  },
};

export default MuiButton;
