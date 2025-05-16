import { Box } from "@mui/material";
import { PropsWithChildren } from "react";

export function CustomLayout({ children }: PropsWithChildren) {
  return (
    <Box
      sx={{
        width: "100%",
        minHeight: "100vh",
        backgroundColor: { xs: "background.default", sm: "#f5f5f5" },
        display: { sm: "flex" },
        justifyContent: { sm: "center" },
      }}
    >
      <Box
        sx={{
          width: "100%",
          minHeight: "100vh",
          backgroundColor: "background.default",
          position: "relative",
          overflowX: "hidden",
          maxWidth: { sm: 520 },
        }}
      >
        {children}
      </Box>
    </Box>
  );
}
