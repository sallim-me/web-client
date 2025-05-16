import { PaletteOptions } from "@mui/material"

export const palette: PaletteOptions = {
  // Primary Colors: 자연의 생동감 있는 그린 계열
  primary: {
    main: '#98B43C',      // 싱그러운 연두 (#98B43C, 이미지 3번째 그린)
    light: '#B9C95A',     // 밝은 연두 (#B9C95A, 이미지 4번째 그린)
    dark: '#8A9B34',      // 안정감 있는 올리브 (#8A9B34, 이미지 2번째 그린)
    contrastText: '#212121' // 그린 위엔 진한 회색 텍스트
  },

  // Secondary Colors: 시원한 블루 계열
  secondary: {
    main: '#9FB3DF',      // 파스텔 블루 (#9FB3DF, 팀원 제안색)
    light: '#BDDDE4',     // 밝은 하늘색 (#BDDDE4)
    dark: '#9EC6F3',      // 청량한 블루 (#9EC6F3)
    contrastText: '#212121'
  },

  // Error Colors
  error: {
    main: '#d32f2f',
    contrastText: '#ffffff'
  },

  // Background Colors
  background: {
    default: '#f5f5f5',
    paper: '#ffffff'
  },

  // Text Colors
  text: {
    primary: '#212121',
    secondary: '#757575',
    disabled: '#bdbdbd'
  },

  // Divider Color
  divider: '#e0e0e0'
}
