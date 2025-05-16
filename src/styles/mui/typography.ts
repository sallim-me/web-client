import { TypographyOptions } from "@mui/material/styles/createTypography";

export const typography: TypographyOptions = {
  fontFamily: [
    /* Main font */
    'Pretendard',
    /* iOS, macOS */
    '-apple-system', 'BlinkMacSystemFont',
     /* Windows */
    '"Segoe UI"',
    /* Android */
    'Roboto',
    /* Other OS */
    '"Helvetica Neue"', 'Arial',
    /* Universal fallback */
    'sans-serif',
  ].join(','),
  
  h1: {
    fontSize: '2.5rem',
    fontWeight: 600,
    lineHeight: 1.2,
  },
  h2: {
    fontSize: '2rem',
    fontWeight: 600,
    lineHeight: 1.2,
  },
  h3: {
    fontSize: '1.75rem',
    fontWeight: 600,
    lineHeight: 1.2,
  },
  h4: {
    fontSize: '1.5rem',
    fontWeight: 600,
    lineHeight: 1.2,
  },
  h5: {
    fontSize: '1.25rem',
    fontWeight: 600,
    lineHeight: 1.2,
  },
  h6: {
    fontSize: '1rem',
    fontWeight: 600,
    lineHeight: 1.2,
  },
  body1: {
    fontSize: '1rem',
    lineHeight: 1.5,
  },
  body2: {
    fontSize: '0.875rem',
    lineHeight: 1.5,
  },
  button: {
    textTransform: 'none',
  },
}
