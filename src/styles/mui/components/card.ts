import { Components, Theme } from '@mui/material';

export const button: Components<Theme>['MuiCard'] = {
  styleOverrides: {
    root: {
      borderRadius: '12px',
      boxShadow: '0 1px 3px 0 rgb(0 0 0 / 0.1)',
    },
  },
};

export default button;
