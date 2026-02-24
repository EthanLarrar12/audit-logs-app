import React, { useState } from 'react';
import {
    Box, Typography, Paper, Switch,
    FormControlLabel, TextField, Button, Divider
} from '@material-ui/core';

export function Settings() {
    const [notifications, setNotifications] = useState(true);
    const [darkMode, setDarkMode] = useState(true);
    const [twoFactor, setTwoFactor] = useState(false);
    const [auditUrl, setAuditUrl] = useState('http://localhost:3001/assets/webComponent.js');

    return (
        <Box p={3} maxWidth={800} mx="auto">
            <Box mb={4}>
                <Typography variant="h4" component="h1" gutterBottom>Settings</Typography>
                <Typography variant="body1" color="textSecondary">
                    Manage your portal preferences and system configuration.
                </Typography>
            </Box>

            <Paper>
                {/* Preferences */}
                <Box p={3}>
                    <Typography variant="h6" gutterBottom>Preferences</Typography>
                    <Box display="flex" justifyContent="space-between" alignItems="center" my={2}>
                        <Box>
                            <Typography variant="subtitle1">Email Notifications</Typography>
                            <Typography variant="body2" color="textSecondary">Receive alerts for critical events</Typography>
                        </Box>
                        <FormControlLabel
                            control={<Switch checked={notifications} onChange={(e) => setNotifications(e.target.checked)} color="primary" />}
                            label=""
                        />
                    </Box>
                    <Box display="flex" justifyContent="space-between" alignItems="center" my={2}>
                        <Box>
                            <Typography variant="subtitle1">Dark Mode</Typography>
                            <Typography variant="body2" color="textSecondary">Use dark theme across the portal</Typography>
                        </Box>
                        <FormControlLabel
                            control={<Switch checked={darkMode} onChange={(e) => setDarkMode(e.target.checked)} color="primary" />}
                            label=""
                        />
                    </Box>
                </Box>

                <Divider />

                {/* Security */}
                <Box p={3}>
                    <Typography variant="h6" gutterBottom>Security</Typography>
                    <Box display="flex" justifyContent="space-between" alignItems="center" my={2}>
                        <Box>
                            <Typography variant="subtitle1">Two-Factor Authentication</Typography>
                            <Typography variant="body2" color="textSecondary">Add an extra layer of security to your account</Typography>
                        </Box>
                        <FormControlLabel
                            control={<Switch checked={twoFactor} onChange={(e) => setTwoFactor(e.target.checked)} color="primary" />}
                            label=""
                        />
                    </Box>
                </Box>

                <Divider />

                {/* Integrations */}
                <Box p={3}>
                    <Typography variant="h6" gutterBottom>Integrations</Typography>
                    <Box my={3}>
                        <Typography variant="subtitle1" gutterBottom>Audit Logs Script URL</Typography>
                        <Typography variant="body2" color="textSecondary" gutterBottom>
                            URL of the embedded audit logs web component script
                        </Typography>
                        <TextField
                            fullWidth
                            variant="outlined"
                            size="small"
                            value={auditUrl}
                            onChange={(e) => setAuditUrl(e.target.value)}
                            margin="normal"
                        />
                    </Box>
                </Box>
            </Paper>

            <Box mt={4} display="flex" justifyContent="flex-end">
                <Button variant="contained" color="primary" startIcon={<span>💾</span>}>
                    Save Changes
                </Button>
            </Box>
        </Box>
    );
}
