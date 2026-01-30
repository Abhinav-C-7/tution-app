import React, { useState } from 'react';
import { useSignUp } from "@clerk/clerk-react";
import { useNavigate, Link as RouterLink } from 'react-router-dom';
import {
    Box,
    Card,
    CardContent,
    Typography,
    TextField,
    Button,
    Link,
    Container,
    InputAdornment,
    IconButton,
    Alert,
    Stack
} from '@mui/material';
import { Visibility, VisibilityOff, Email, Lock, Person, MarkEmailRead } from '@mui/icons-material';

const RegisterPage = () => {
    const { isLoaded, signUp, setActive } = useSignUp();
    const navigate = useNavigate();

    const [showPassword, setShowPassword] = useState(false);
    const [verifying, setVerifying] = useState(false);
    const [code, setCode] = useState("");
    const [error, setError] = useState("");

    const [formData, setFormData] = useState({
        name: '',
        email: '',
        password: '',
        confirmPassword: ''
    });

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: value
        }));
    };

    const handleClickShowPassword = () => setShowPassword((show) => !show);

    // Step 1: Initiate Sign Up
    const handleSubmit = async (e) => {
        e.preventDefault();
        setError("");

        if (!isLoaded) return;

        if (formData.password !== formData.confirmPassword) {
            setError("Passwords do not match");
            return;
        }

        try {
            await signUp.create({
                emailAddress: formData.email,
                password: formData.password,
                firstName: formData.name.split(" ")[0],
                lastName: formData.name.split(" ").slice(1).join(" "),
            });

            // Prepare for email verification
            await signUp.prepareEmailAddressVerification({ strategy: "email_code" });
            setVerifying(true);
        } catch (err) {
            console.error("Registration error:", err);
            setError(err.errors?.[0]?.longMessage || "Registration failed");
        }
    };

    // Step 2: Verify Email
    const handleVerification = async (e) => {
        e.preventDefault();
        setError("");

        if (!isLoaded) return;

        try {
            const completeSignUp = await signUp.attemptEmailAddressVerification({
                code,
            });

            if (completeSignUp.status === "complete") {
                await setActive({ session: completeSignUp.createdSessionId });
                navigate("/");
            } else {
                console.error(JSON.stringify(completeSignUp, null, 2));
                setError("Verification incomplete. Please contact support.");
            }
        } catch (err) {
            console.error("Verification error:", err);
            setError(err.errors?.[0]?.longMessage || "Invalid code");
        }
    };

    if (verifying) {
        return (
            <Box
                sx={{
                    minHeight: '100vh',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    backgroundColor: 'background.default',
                    p: 2
                }}
            >
                <Container maxWidth="xs">
                    <Card sx={{ p: 2 }}>
                        <CardContent>
                            <Box sx={{ mb: 3, textAlign: 'center' }}>
                                <MarkEmailRead sx={{ fontSize: 48, color: 'primary.main', mb: 1 }} />
                                <Typography variant="h5" color="primary" gutterBottom fontWeight="bold">
                                    Verify your Email
                                </Typography>
                                <Typography variant="body2" color="text.secondary">
                                    Enter the code sent to {formData.email}
                                </Typography>
                            </Box>

                            {error && (
                                <Alert severity="error" sx={{ mb: 2 }}>
                                    {error}
                                </Alert>
                            )}

                            <form onSubmit={handleVerification}>
                                <TextField
                                    fullWidth
                                    label="Verification Code"
                                    value={code}
                                    onChange={(e) => setCode(e.target.value)}
                                    margin="normal"
                                    required
                                    autoFocus
                                />
                                <Button
                                    fullWidth
                                    variant="contained"
                                    size="large"
                                    type="submit"
                                    sx={{ mt: 2, mb: 2 }}
                                >
                                    Verify Account
                                </Button>
                            </form>
                        </CardContent>
                    </Card>
                </Container>
            </Box>
        );
    }

    return (
        <Box
            sx={{
                minHeight: '100vh',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                backgroundColor: 'background.default',
                p: 2
            }}
        >
            <Container maxWidth="xs">
                <Card sx={{ p: 2 }}>
                    <CardContent>
                        <Box sx={{ mb: 3, textAlign: 'center' }}>
                            <Typography variant="h4" color="primary" gutterBottom fontWeight="bold">
                                Create Account
                            </Typography>
                            <Typography variant="body2" color="text.secondary">
                                Join us to get started with your journey
                            </Typography>
                        </Box>

                        {error && (
                            <Alert severity="error" sx={{ mb: 2 }}>
                                {error}
                            </Alert>
                        )}

                        <form onSubmit={handleSubmit}>
                            <TextField
                                fullWidth
                                label="Full Name"
                                name="name"
                                value={formData.name}
                                onChange={handleChange}
                                margin="normal"
                                required
                                InputProps={{
                                    startAdornment: (
                                        <InputAdornment position="start">
                                            <Person color="action" />
                                        </InputAdornment>
                                    ),
                                }}
                            />

                            <TextField
                                fullWidth
                                label="Email Address"
                                name="email"
                                type="email"
                                value={formData.email}
                                onChange={handleChange}
                                margin="normal"
                                required
                                InputProps={{
                                    startAdornment: (
                                        <InputAdornment position="start">
                                            <Email color="action" />
                                        </InputAdornment>
                                    ),
                                }}
                            />

                            <TextField
                                fullWidth
                                label="Password"
                                name="password"
                                type={showPassword ? 'text' : 'password'}
                                value={formData.password}
                                onChange={handleChange}
                                margin="normal"
                                required
                                InputProps={{
                                    startAdornment: (
                                        <InputAdornment position="start">
                                            <Lock color="action" />
                                        </InputAdornment>
                                    ),
                                    endAdornment: (
                                        <InputAdornment position="end">
                                            <IconButton
                                                aria-label="toggle password visibility"
                                                onClick={handleClickShowPassword}
                                                edge="end"
                                            >
                                                {showPassword ? <VisibilityOff /> : <Visibility />}
                                            </IconButton>
                                        </InputAdornment>
                                    ),
                                }}
                            />

                            <TextField
                                fullWidth
                                label="Confirm Password"
                                name="confirmPassword"
                                type={showPassword ? 'text' : 'password'}
                                value={formData.confirmPassword}
                                onChange={handleChange}
                                margin="normal"
                                required
                                InputProps={{
                                    startAdornment: (
                                        <InputAdornment position="start">
                                            <Lock color="action" />
                                        </InputAdornment>
                                    ),
                                }}
                            />

                            <Button
                                fullWidth
                                variant="contained"
                                size="large"
                                type="submit"
                                sx={{ mt: 2, mb: 2 }}
                            >
                                Sign Up
                            </Button>

                            <Box sx={{ textAlign: 'center' }}>
                                <Typography variant="body2" color="text.secondary">
                                    Already have an account?{' '}
                                    <Link component={RouterLink} to="/login" fontWeight="bold" underline="hover">
                                        Sign In
                                    </Link>
                                </Typography>
                            </Box>
                        </form>
                    </CardContent>
                </Card>
            </Container>
        </Box>
    );
};

export default RegisterPage;
