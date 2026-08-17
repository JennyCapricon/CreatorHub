import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import useAuthStore from "../store/authStore";
import { useTheme } from "../context/ThemeContext";
import {
  Container, Box, Typography, TextField, Button, Alert,
  InputAdornment, IconButton, Paper, CircularProgress,
} from "@mui/material";
import { Email, Lock, Visibility, VisibilityOff, Login as LoginIcon, LightMode, DarkMode, ArrowBack, MarkEmailReadOutlined } from "@mui/icons-material";

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

const getLoginError = (err) => {
  const code = err?.code || "";
  switch (code) {
    case "auth/invalid-credential":
    case "auth/wrong-password":
    case "auth/user-not-found":
    case "auth/invalid-login-credentials":
      return "Incorrect email or password. Please try again, or use \"Forgot password?\" to reset it.";
    case "auth/invalid-email":
    case "auth/missing-email":
      return "Please enter a valid email address.";
    case "auth/network-request-failed":
      return "Network error. Check your connection and try again.";
    case "auth/too-many-requests":
      return "Too many attempts. Please wait a moment and try again.";
    default:
      return "Sign in failed. Please try again.";
  }
};

const getResetError = (err) => {
  const code = err?.code || "";
  switch (code) {
    case "auth/invalid-email":
      return "Please enter a valid email address.";
    case "auth/missing-email":
      return "Please enter your email address.";
    case "auth/user-not-found":
      return "No account found with that email address.";
    case "auth/network-request-failed":
      return "Network error. Check your connection and try again.";
    case "auth/too-many-requests":
      return "Too many attempts. Please wait a moment and try again.";
    default:
      return "Something went wrong. Please try again.";
  }
};

export default function Login() {
  const [mode, setMode] = useState("login");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [forgotEmail, setForgotEmail] = useState("");
  const [forgotError, setForgotError] = useState("");
  const [forgotSuccess, setForgotSuccess] = useState("");
  const [sending, setSending] = useState(false);
  const login = useAuthStore((s) => s.login);
  const resetPassword = useAuthStore((s) => s.resetPassword);
  const navigate = useNavigate();
  const { darkMode, toggleDarkMode } = useTheme();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    if (!email || !password) {
      setError("Please fill in all fields");
      return;
    }

    setLoading(true);
    try {
      await login(email.trim().toLowerCase(), password);
      navigate("/dashboard");
    } catch (err) {
      setError(getLoginError(err));
    } finally {
      setLoading(false);
    }
  };

  const handleForgotSubmit = async (e) => {
    e.preventDefault();
    setForgotError("");
    setForgotSuccess("");

    if (!forgotEmail) {
      setForgotError("Please enter your email address.");
      return;
    }
    if (!EMAIL_RE.test(forgotEmail)) {
      setForgotError("Please enter a valid email address.");
      return;
    }

    setSending(true);
    try {
      await resetPassword(forgotEmail.trim());
      setForgotSuccess(
        `If an account exists for ${forgotEmail.trim()}, a password reset link is on its way. Check your inbox (and spam folder) to continue.`
      );
    } catch (err) {
      setForgotError(getResetError(err));
    } finally {
      setSending(false);
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
          {mode === "login" ? (
            <>
              <Typography variant="h4" sx={{ color: "text.primary" }}>
                Welcome back
              </Typography>
              <Typography variant="body2" sx={{ mt: 0.5 }}>
                Sign in to your creator workspace
              </Typography>
            </>
          ) : (
            <>
              <Typography variant="h4" sx={{ color: "text.primary" }}>
                Forgot your password?
              </Typography>
              <Typography variant="body2" sx={{ mt: 0.5 }}>
                Enter your email and we'll send you a reset link
              </Typography>
            </>
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
          {mode === "login" ? (
            <>
              <Box component="form" onSubmit={handleSubmit} sx={{ display: "flex", flexDirection: "column", gap: 2.5 }}>
                {error && (
                  <Alert severity="error" variant="standard">
                    {error}
                  </Alert>
                )}

                <TextField
                  fullWidth
                  label="Email"
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="you@example.com"
                  InputProps={{
                    startAdornment: (
                      <InputAdornment position="start">
                        <Email sx={{ color: "text.secondary", fontSize: 20 }} />
                      </InputAdornment>
                    ),
                  }}
                />

                <TextField
                  fullWidth
                  label="Password"
                  type={showPassword ? "text" : "password"}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
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

                <Box sx={{ display: "flex", justifyContent: "flex-end" }}>
                  <Button
                    size="small"
                    sx={{ textTransform: "none", color: "primary.main", fontWeight: 600 }}
                    onClick={() => {
                      setMode("forgot");
                      setForgotEmail("");
                      setForgotError("");
                      setForgotSuccess("");
                    }}
                  >
                    Forgot password?
                  </Button>
                </Box>

                <Button
                  type="submit"
                  variant="contained"
                  color="primary"
                  fullWidth
                  disabled={loading}
                  startIcon={loading ? <CircularProgress size={18} sx={{ color: "rgba(255,255,255,0.7)" }} /> : <LoginIcon />}
                  sx={{ py: 1.5 }}
                >
                  {loading ? "Signing in..." : "Sign In"}
                </Button>
              </Box>

              <Typography variant="body2" sx={{ textAlign: "center", mt: 3 }}>
                Don't have an account?{" "}
                <Link to="/register" style={{ color: "#a78bfa", textDecoration: "none" }}>
                  Create one
                </Link>
              </Typography>
            </>
          ) : (
            <Box component="form" onSubmit={handleForgotSubmit} noValidate sx={{ display: "flex", flexDirection: "column", gap: 2.5 }}>
              {forgotSuccess && (
                <Alert severity="success" variant="standard" icon={<MarkEmailReadOutlined fontSize="small" />}>
                  {forgotSuccess}
                </Alert>
              )}
              {forgotError && (
                <Alert severity="error" variant="standard">
                  {forgotError}
                </Alert>
              )}

              <TextField
                fullWidth
                label="Email"
                type="email"
                value={forgotEmail}
                onChange={(e) => {
                  setForgotEmail(e.target.value);
                  setForgotError("");
                }}
                placeholder="you@example.com"
                autoFocus
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">
                      <Email sx={{ color: "text.secondary", fontSize: 20 }} />
                    </InputAdornment>
                  ),
                }}
              />

              <Button
                type="submit"
                variant="contained"
                color="primary"
                fullWidth
                disabled={sending}
                startIcon={sending ? <CircularProgress size={18} sx={{ color: "rgba(255,255,255,0.7)" }} /> : <Email />}
                sx={{ py: 1.5 }}
              >
                {sending ? "Sending..." : "Send Reset Link"}
              </Button>

              <Button
                fullWidth
                variant="text"
                startIcon={<ArrowBack />}
                sx={{ textTransform: "none", color: "text.secondary" }}
                onClick={() => {
                  setMode("login");
                  setForgotError("");
                  setForgotSuccess("");
                }}
              >
                Back to Sign In
              </Button>
            </Box>
          )}
        </Paper>
      </Container>
    </Box>
  );
}