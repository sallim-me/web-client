import { Components, Theme } from "@mui/material";

export const MuiContainer: Components<Theme>["MuiContainer"] = {
  styleOverrides: {
    root: {
      padding: 0,
      boxShadow: "none",
    },
  },
};

export default MuiContainer;
