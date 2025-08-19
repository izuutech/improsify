import {DefaultTheme} from 'react-native-paper';

export const theme = {
  ...DefaultTheme,
  colors: {
    ...DefaultTheme.colors,
    primary: '#FF7B25', // Main orange
    accent: '#FF9F5A', // Lighter orange
    background: '#121212', // Dark background
    surface: '#1E1E1E', // Slightly lighter surface
    text: '#FFFFFF', // White text
    disabled: '#4D4D4D', // Disabled elements
    placeholder: '#7A7A7A', // Placeholder text
    backdrop: '#00000080', // Backdrop for modals
    error: '#FF5252', // Error color
    success: '#4CAF50', // Success color
    warning: '#FFC107', // Warning color
    info: '#2196F3', // Info color
  },
  roundness: 12,
};

export type AppTheme = typeof theme;
