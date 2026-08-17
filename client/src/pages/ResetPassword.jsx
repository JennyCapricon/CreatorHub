import { useEffect, useState } from "react";
import { Link, useNavigate, useSearchParams } from "react-router-dom";
import useAuthStore from "../store/authStore";
import { useTheme } from "../context/ThemeContext";
import {
  Container, Box, Typography, TextField, Button, Alert,
  InputAdornment, IconButton, Paper, CircularProgress,
} from "@mui/material";
import {
  Lock, Visibility, VisibilityOff, LightMode, DarkMode, CheckCircle,
} from "@mui/icons-material";

const getResetError = (err) => {
  const code = err?.code || "";
  switch (code) {
    case "auth/expired-action-code":
      return "This reset link has expired. Please request a new one.";
    case "auth/invalid-action-code":
      return "This reset link is invalid or has already been used. Please request a new one.";
    case "auth/user-disabled":
      return "This account has been disabled.";
    case "auth/user-not-found":
      return "No account found for this reset link.";
    case "auth/weak-password":
      return "Password must be at least 6 characters.";
    case "auth/network-request-failed":
      return "Network error. Check your connection and try again.";
    default:
      return "Something went wrong. Please try again.";
  }
};

export default function ResetPassword() {
  const [searchParams] = useSearchParams();
  const oobCode = searchParams.get("oobCode");
  const verifyResetCode = useAuthStore((s) => s.verifyResetCode);
  const confirmReset = useAuthStore((s) => s.confirmReset);
  const navigate = useNavigate();
  const { darkMode, toggleDarkMode } = useTheme();

  const [status, setStatus] = useState("verifying"); // verifying | ready | invalid | done
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState("");
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    if (!oobCode) {
      setStatus("invalid");
      setError("This reset link is missing required information. Please request a new one.");
      return;
    }
    verifyResetCode(oobCode)
      .then((verifiedEmail) => {
        setEmail(verifiedEmail);
        setStatus("ready");
      })
      .catch((err) => {
        setError(getResetError(err));
        setStatus("invalid");
      });
  }, [oobCode, verifyResetCode]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    if (!password || !confirmPassword) {
      setError("Please fill in all fields");
      return;
    }
    if (password.length < 6) {
      setError("Password must be at least 6 characters");
      return;
    }
    if (password !== confirmPassword) {
      setError("Passwords do not match");
      return;
    }

    setSubmitting(true);
    try {
      await confirmReset(oobCode, password);
      setStatus("done");
    } catch (err) {
      setError(getResetError(err));
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <Box
      sx={{
        minHeight: "100vh",
        bgcolor: "background.default",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        p: 2,
        position: "relative",
      }}
    >
      <IconButton
        onClick={toggleDarkMode}
        sx={{ position: "absolute", top: 16, right: 16, color: "text.secondary" }}
      >
        {darkMode ? <LightMode /> : <DarkMode />}
      </IconButton>
      <Container maxWidth="xs">
        <Box sx={{ textAlign: "center", mb: 4 }}>
          <Box
            component={Link}
            to="/"
            sx={{
              display: "inline-flex",
              alignItems: "center",
              gap: 1,
              mb: 3,
              textDecoration: "none",
            }}
          >
            <Box
              sx={{
                width: 40,
                height: 40,
                borderRadius: "12px",
                background: "linear-gradient(135deg, #22c55e, #16a34a)",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                color: "#fff",
                fontWeight: 700,
                fontSize: 18,
              }}
            >
              C
            </Box>
            <Typography variant="h5" sx={{ fontWeight: 700 }}>
              <Box component="span" sx={{ background: "linear-gradient(135deg, #22c55e, #16a34a)", WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent" }}>
                Creator
              </Box>
              <Box component="span" sx={{ color: "text.primary" }}>
                Hub
              </Box>
            </Typography>
          </Box>
          <Typography variant="h4" sx={{ color: "text.primary" }}>
            Reset your password
          </Typography>
          {status === "ready" && (
            <Typography variant="body2" sx={{ mt: 0.5 }}>
              Choose a new password for {email}
            </Typography>
          )}
        </Box>

        <Paper
          elevation={0}
          sx={{
            p: { xs: 3, sm: 4 },
            bgcolor: "background.paper",
            border: "1px solid",
            borderColor: "divider",
            borderRadius: 3,
          }}
        >
          {status === "verifying" && (
            <Box sx={{ display: "flex", justifyContent: "center", py: 3 }}>
              <CircularProgress size={28} />
            </Box>
          )}

          {status === "invalid" && (
            <>
              <Alert severity="error" variant="standard" sx={{ mb: 2.5 }}>
                {error}
              </Alert>
              <Button
                component={Link}
                to="/login"
                fullWidth
                variant="contained"
                color="primary"
                sx={{ py: 1.5 }}
              >
                Back to Sign In
              </Button>
            </>
          )}

          {status === "done" && (
            <>
              <Alert severity="success" variant="standard" icon={<CheckCircle fontSize="small" />} sx={{ mb: 2.5 }}>
                Your password has been reset. You can now sign in with your new password.
              </Alert>
              <Button
                fullWidth
                variant="contained"
                color="primary"
                sx={{ py: 1.5 }}
                onClick={() => navigate("/login")}
              >
                Sign In
              </Button>
            </>
          )}

          {status === "ready" && (
            <Box component="form" onSubmit={handleSubmit} noValidate sx={{ display: "flex", flexDirection: "column", gap: 2.5 }}>
              {error && (
                <Alert severity="error" variant="standard">
                  {error}
                </Alert>
              )}

              <TextField
                fullWidth
                label="New password"
                type={showPassword ? "text" : "password"}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                helperText="At least 6 characters"
                autoFocus
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">
                      <Lock sx={{ color: "text.secondary", fontSize: 20 }} />
                    </InputAdornment>
                  ),
                  endAdornment: (
                    <InputAdornment position="end">
                      <IconButton onClick={() => setShowPassword(!showPassword)} edge="end" sx={{ color: "text.secondary" }}>
                        {showPassword ? <VisibilityOff fontSize="small" /> : <Visibility fontSize="small" />}
                      </IconButton>
                    </InputAdornment>
                  ),
                }}
              />

              <TextField
                fullWidth
                label="Confirm new password"
                type={showPassword ? "text" : "password"}
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                placeholder="••••••••"
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">
                      <Lock sx={{ color: "text.secondary", fontSize: 20 }} />
                    </InputAdornment>
                  ),
                }}
              />

              <Button
                type="submit"
                variant="contained"
                color="primary"
                fullWidth
                disabled={submitting}
                startIcon={submitting ? <CircularProgress size={18} sx={{ color: "rgba(255,255,255,0.7)" }} /> : null}
                sx={{ py: 1.5 }}
              >
                {submitting ? "Resetting..." : "Reset Password"}
              </Button>
            </Box>
          )}
        </Paper>
      </Container>
    </Box>
  );
}
