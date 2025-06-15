
import { createTheme } from "@mui/material";

import { palette } from "./palette";
import { MuiButton } from "./components/MuiButton";
import { MuiContainer } from "./components/MuiContainer";
import { MuiPaper } from "./components/MuiPaper";
import { typography } from "./typography";

export const theme = createTheme({
  palette: { ...palette },
  typography: { ...typography },
  components: {
    MuiButton: { ...MuiButton },
    MuiContainer: { ...MuiContainer },
    // MuiPaper: { ...MuiPaper },
  }
});
