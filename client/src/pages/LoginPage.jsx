import React, { useState, useEffect } from 'react';
import { useSignIn, useUser } from "@clerk/clerk-react";
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
    Alert
} from '@mui/material';
import { Visibility, VisibilityOff, Email, Lock, MarkEmailRead } from '@mui/icons-material';

const LoginPage = () => {
    const { isLoaded, signIn, setActive } = useSignIn();
    const { isSignedIn } = useUser();
    const navigate = useNavigate();

    const [verifying, setVerifying] = useState(false);
    const [code, setCode] = useState("");
    const [showPassword, setShowPassword] = useState(false);
    const [error, setError] = useState("");
    const [formData, setFormData] = useState({
        email: '',
        password: ''
    });

    useEffect(() => {
        if (isSignedIn) {
            navigate("/");
        }
    }, [isSignedIn, navigate]);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: value
        }));
    };

    const handleClickShowPassword = () => setShowPassword(show => !show);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError("");

        if (!isLoaded) return;

        try {
            const result = await signIn.create({
                identifier: formData.email,
                password: formData.password,
            });

            if (result.status === "complete") {
                await setActive({ session: result.createdSessionId });
                navigate("/");
            } else if (result.status === "needs_second_factor") {
                setVerifying(true);
            } else {
                console.log(result);
                setError("An unexpected error occurred.");
            }
        } catch (err) {
            console.error("Login error:", err);
            setError(err.errors?.[0]?.longMessage || "Something went wrong");
        }
    };

    const handleVerification = async (e) => {
        e.preventDefault();
        setError("");

        if (!isLoaded) return;

        try {
            const result = await signIn.attemptSecondFactor({
                strategy: "email_code",
                code,
            });

            if (result.status === "complete") {
                await setActive({ session: result.createdSessionId });
                navigate("/");
            } else {
                console.error(JSON.stringify(result, null, 2));
                setError("Verification incomplete. Please contact support.");
            }
        } catch (err) {
            console.error("Verification error:", err);
            setError(err.errors?.[0]?.longMessage || "Invalid verification code.");
        }
    };

    if (verifying) {
        return (
            <Box sx={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', p: 2 }}>
                <Container maxWidth="xs">
                    <Card sx={{ p: 2 }}>
                        <CardContent>
                            <Box sx={{ mb: 3, textAlign: 'center' }}>
                                <MarkEmailRead sx={{ fontSize: 48, color: 'primary.main', mb: 1 }} />
                                <Typography variant="h5" color="primary" gutterBottom fontWeight="bold">
                                    Check your Email
                                </Typography>
                                <Typography variant="body2" color="text.secondary">
                                    Enter the verification code sent to your email.
                                </Typography>
                            </Box>

                            {error && <Alert severity="error" sx={{ mb: 2 }}>{error}</Alert>}

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
                                <Button fullWidth variant="contained" size="large" type="submit" sx={{ mt: 2, mb: 2 }}>
                                    Verify
                                </Button>
                            </form>
                        </CardContent>
                    </Card>
                </Container>
            </Box>
        );
    }

    return (
        <Box sx={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', p: 2 }}>
            <Container maxWidth="xs">
                <Card sx={{ p: 2 }}>
                    <CardContent>
                        <Box sx={{ mb: 3, textAlign: 'center' }}>
                            <Typography variant="h4" color="primary" gutterBottom fontWeight="bold">
                                Welcome Back
                            </Typography>
                            <Typography variant="body2" color="text.secondary">
                                Please sign in to continue
                            </Typography>
                        </Box>

                        {error && <Alert severity="error" sx={{ mb: 2 }}>{error}</Alert>}

                        <form onSubmit={handleSubmit}>
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
                                            <IconButton onClick={handleClickShowPassword} edge="end">
                                                {showPassword ? <VisibilityOff /> : <Visibility />}
                                            </IconButton>
                                        </InputAdornment>
                                    ),
                                }}
                            />

                            <Box sx={{ mt: 1, mb: 2, textAlign: 'right' }}>
                                <Link component={RouterLink} to="/forgot-password" variant="body2" underline="hover">
                                    Forgot Password?
                                </Link>
                            </Box>

                            <Button fullWidth variant="contained" size="large" type="submit" sx={{ mb: 2 }}>
                                Sign In
                            </Button>

                            <Box sx={{ textAlign: 'center' }}>
                                <Typography variant="body2" color="text.secondary">
                                    Don't have an account?{' '}
                                    <Link component={RouterLink} to="/register" fontWeight="bold" underline="hover">
                                        Sign Up
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

export default LoginPage;
