import { ThemeProvider as MuiThemeProvider } from "@mui/material/styles";
import CssBaseline from "@mui/material/CssBaseline";
import { darkTheme, lightTheme } from "../theme/muiTheme";
import { useTheme } from "../context/ThemeContext";

export default function MuiThemeWrapper({ children }) {
  const { darkMode } = useTheme();
  return (
    <MuiThemeProvider theme={darkMode ? darkTheme : lightTheme}>
      <CssBaseline />
      {children}
    </MuiThemeProvider>
  );
}
