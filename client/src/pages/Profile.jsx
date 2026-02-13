import React from 'react';
import { useUser } from '@clerk/clerk-react';
import { Box, Typography, Paper, Avatar, Grid, Divider } from '@mui/material';

const Profile = () => {
    const { user, isLoaded, isSignedIn } = useUser();

    if (!isLoaded || !isSignedIn) {
        return null;
    }

    return (
        <Box sx={{ flexGrow: 1, p: 3 }}>
            <Typography variant="h4" gutterBottom>
                My Profile
            </Typography>
            <Paper elevation={3} sx={{ p: 3, mt: 3 }}>
                <Grid container spacing={3} alignItems="center">
                    <Grid item>
                        <Avatar
                            src={user.imageUrl}
                            alt={user.fullName}
                            sx={{ width: 100, height: 100 }}
                        />
                    </Grid>
                    <Grid item xs>
                        <Typography variant="h5">{user.fullName}</Typography>
                        <Typography variant="body1" color="textSecondary">
                            {user.primaryEmailAddress?.emailAddress}
                        </Typography>
                    </Grid>
                </Grid>
                <Divider sx={{ my: 3 }} />
                <Box>
                    <Typography variant="h6" gutterBottom>Account Details</Typography>
                    <Grid container spacing={2}>
                        <Grid item xs={12} sm={6}>
                            <Typography variant="subtitle2" color="textSecondary">Username</Typography>
                            <Typography variant="body1">{user.username || 'N/A'}</Typography>
                        </Grid>
                        <Grid item xs={12} sm={6}>
                            <Typography variant="subtitle2" color="textSecondary">Last Sign In</Typography>
                            <Typography variant="body1">{user.lastSignInAt ? new Date(user.lastSignInAt).toLocaleString() : 'N/A'}</Typography>
                        </Grid>
                    </Grid>
                </Box>
            </Paper>
        </Box>
    );
};

export default Profile;
