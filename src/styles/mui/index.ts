
import { createTheme } from "@mui/material";

import { palette } from "./palette";
import { button } from "./components/button";
import { typography } from "./typography";

export const theme = createTheme({
  palette: { ...palette },
  typography: { ...typography },
  components: {
    MuiButton: { ...button },
  }
});
