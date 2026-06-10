import { createTheme } from "@mui/material/styles";

export const darkTheme = createTheme({
  palette: {
    mode: "dark",
    primary: {
      main: "#22c55e",
      light: "#4ade80",
      dark: "#16a34a",
    },
    secondary: {
      main: "#22c55e",
    },
    background: {
      default: "#030712",
      paper: "#111827",
    },
    text: {
      primary: "#f9fafb",
      secondary: "#9ca3af",
    },
    error: {
      main: "#f87171",
    },
    divider: "rgba(255,255,255,0.08)",
  },
  shape: { borderRadius: 12 },
  components: {
    MuiTextField: {
      styleOverrides: {
        root: {
          "& .MuiOutlinedInput-root": {
            backgroundColor: "rgba(255,255,255,0.03)",
            "& fieldset": { borderColor: "rgba(255,255,255,0.1)" },
            "&:hover fieldset": { borderColor: "rgba(255,255,255,0.2)" },
            "&.Mui-focused fieldset": { borderColor: "#22c55e" },
          },
          "& .MuiInputLabel-root": { color: "#9ca3af" },
          "& .MuiInputBase-input": { color: "#f9fafb" },
        },
      },
    },
    MuiButton: {
      styleOverrides: {
        root: { textTransform: "none", fontWeight: 600, padding: "12px 24px", borderRadius: 12 },
        containedPrimary: {
          background: "linear-gradient(135deg, #22c55e, #16a34a)",
          "&:hover": { background: "linear-gradient(135deg, #4ade80, #22c55e)" },
          "&.Mui-disabled": { background: "rgba(34,197,94,0.3)" },
        },
      },
    },
    MuiAlert: {
      styleOverrides: {
        root: { borderRadius: 12 },
        standardError: {
          backgroundColor: "rgba(248,113,113,0.1)",
          border: "1px solid rgba(248,113,113,0.2)",
          color: "#f87171",
        },
      },
    },
    MuiPaper: { styleOverrides: { root: { backgroundImage: "none" } } },
  },
  typography: {
    fontFamily: '"Inter", "system-ui", "-apple-system", sans-serif',
    h4: { fontWeight: 700 },
    body2: { color: "#9ca3af" },
  },
});

export const lightTheme = createTheme({
  palette: {
    mode: "light",
    primary: {
      main: "#22c55e",
      light: "#4ade80",
      dark: "#16a34a",
    },
    secondary: {
      main: "#22c55e",
    },
    background: {
      default: "#f9fafb",
      paper: "#ffffff",
    },
    text: {
      primary: "#111827",
      secondary: "#6b7280",
    },
    error: {
      main: "#ef4444",
    },
    divider: "rgba(0,0,0,0.08)",
  },
  shape: { borderRadius: 12 },
  components: {
    MuiTextField: {
      styleOverrides: {
        root: {
          "& .MuiOutlinedInput-root": {
            backgroundColor: "rgba(0,0,0,0.02)",
            "& fieldset": { borderColor: "rgba(0,0,0,0.15)" },
            "&:hover fieldset": { borderColor: "rgba(0,0,0,0.25)" },
            "&.Mui-focused fieldset": { borderColor: "#22c55e" },
          },
          "& .MuiInputLabel-root": { color: "#6b7280" },
          "& .MuiInputBase-input": { color: "#111827" },
        },
      },
    },
    MuiButton: {
      styleOverrides: {
        root: { textTransform: "none", fontWeight: 600, padding: "12px 24px", borderRadius: 12 },
        containedPrimary: {
          background: "linear-gradient(135deg, #22c55e, #16a34a)",
          "&:hover": { background: "linear-gradient(135deg, #4ade80, #22c55e)" },
          "&.Mui-disabled": { background: "rgba(34,197,94,0.3)" },
        },
      },
    },
    MuiAlert: {
      styleOverrides: {
        root: { borderRadius: 12 },
        standardError: {
          backgroundColor: "rgba(239,68,68,0.08)",
          border: "1px solid rgba(239,68,68,0.2)",
          color: "#dc2626",
        },
      },
    },
    MuiPaper: { styleOverrides: { root: { backgroundImage: "none" } } },
  },
  typography: {
    fontFamily: '"Inter", "system-ui", "-apple-system", sans-serif',
    h4: { fontWeight: 700 },
    body2: { color: "#6b7280" },
  },
});
