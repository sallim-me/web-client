import { Components, Theme } from "@mui/material";

export const MuiPaper: Components<Theme>["MuiPaper"] = {
  styleOverrides: {
    root: {
      boxShadow: "none",
      // outline: "none",
      outline: "1px solid rgba(0, 0, 0, 0.12)", // 기본 테두리 스타일
    },
  },
};

export default MuiPaper;
