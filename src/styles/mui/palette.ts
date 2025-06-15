import { PaletteOptions } from "@mui/material";

export const palette: PaletteOptions = {
  primary: {
    main: "#9FB3DF", // 파스텔 블루 (#9FB3DF, 팀원 제안색)
    light: "#BDDDE4", // 밝은 하늘색 (#BDDDE4)
    dark: "#9EC6F3", // 청량한 블루 (#9EC6F3)
    contrastText: "#212121",
  },

  // Error Colors
  error: {
    main: "#d32f2f",
    contrastText: "#ffffff",
  },

  // Background Colors
  background: {
    default: "#ffffff",
    paper: "#ffffff",
  },

  // Text Colors
  text: {
    primary: "#212121",
    secondary: "#757575",
    disabled: "#bdbdbd",
  },

  // Divider Color
  divider: "#e0e0e0",
};
