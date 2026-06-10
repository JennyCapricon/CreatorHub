import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import useAuthStore from "../store/authStore";
import { useTheme } from "../context/ThemeContext";
import {
  Container, Box, Typography, TextField, Button, Alert,
  InputAdornment, IconButton, Paper, CircularProgress,
} from "@mui/material";
import {
  Email, Lock, Person, Visibility, VisibilityOff,
  PersonAdd, LightMode, DarkMode,
} from "@mui/icons-material";

export default function Register() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const register = useAuthStore((s) => s.register);
  const navigate = useNavigate();
  const { darkMode, toggleDarkMode } = useTheme();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    if (!email || !password) {
      setError("Please fill in all fields");
      return;
    }

    if (password.length < 6) {
      setError("Password must be at least 6 characters");
      return;
    }

    setLoading(true);
    try {
      await register(email, password, name);
      navigate("/dashboard");
    } catch (err) {
      setError(err.response?.data?.message || "Registration failed");
    } finally {
      setLoading(false);
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
            Create your account
          </Typography>
          <Typography variant="body2" sx={{ mt: 0.5 }}>
            Start building your creator workspace
          </Typography>
        </Box>

        <Paper
          elevation={0}
          sx={{
            p: 4,
            bgcolor: "background.paper",
            border: "1px solid",
            borderColor: "divider",
            borderRadius: 3,
          }}
        >
          <Box component="form" onSubmit={handleSubmit} sx={{ display: "flex", flexDirection: "column", gap: 2.5 }}>
            {error && (
              <Alert severity="error" variant="standard">
                {error}
              </Alert>
            )}

            <TextField
              fullWidth
              label="Name (optional)"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Your name"
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <Person sx={{ color: "text.secondary", fontSize: 20 }} />
                  </InputAdornment>
                ),
              }}
            />

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
              helperText="At least 6 characters"
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

            <Button
              type="submit"
              variant="contained"
              color="primary"
              fullWidth
              disabled={loading}
              startIcon={loading ? <CircularProgress size={18} sx={{ color: "rgba(255,255,255,0.7)" }} /> : <PersonAdd />}
              sx={{ py: 1.5 }}
            >
              {loading ? "Creating account..." : "Create Account"}
            </Button>
          </Box>

          <Typography variant="body2" sx={{ textAlign: "center", mt: 3 }}>
            Already have an account?{" "}
            <Link to="/login" style={{ color: "#a78bfa", textDecoration: "none" }}>
              Sign in
            </Link>
          </Typography>
        </Paper>
      </Container>
    </Box>
  );
}
