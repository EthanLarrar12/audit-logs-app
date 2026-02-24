import { useHistory } from 'react-router-dom';
import React from 'react';
import { Grid, Card, CardContent, Typography, Button, Box } from '@material-ui/core';

const STATS = [
    { label: 'Total Events', value: '24,821', change: '+12% vs last month', up: true, icon: '📋', variant: 'blue' },
    { label: 'Active Users', value: '138', change: '+4 today', up: true, icon: '👥', variant: 'green' },
    { label: 'Warnings', value: '17', change: '-3 vs yesterday', up: false, icon: '⚠️', variant: 'yellow' },
    { label: 'Failed Logins', value: '5', change: '+2 vs yesterday', up: true, icon: '🔒', variant: 'red' },
];

const ACTIVITY = [
    { color: 'var(--color-success)', action: <><strong>admin@mirage.io</strong> updated permissions for role <strong>Manager</strong></>, time: '2 min ago' },
    { color: 'var(--color-danger)', action: <><strong>ops@mirage.io</strong> failed login attempt (3rd)</>, time: '8 min ago' },
    { color: 'var(--color-accent)', action: <><strong>dev@mirage.io</strong> exported audit log report</>, time: '21 min ago' },
    { color: 'var(--color-warning)', action: <><strong>system</strong> detected unusual activity from IP 192.168.1.55</>, time: '34 min ago' },
    { color: 'var(--color-success)', action: <><strong>hr@mirage.io</strong> created new user <strong>john.doe</strong></>, time: '1 hr ago' },
    { color: 'var(--color-accent)', action: <><strong>admin@mirage.io</strong> modified entity <strong>Project Alpha</strong></>, time: '2 hr ago' },
];

const QUICK_LINKS = [
    { icon: '🔍', label: 'View Audit Logs', to: '/audit' },
    { icon: '⚙', label: 'System Settings', to: '/settings' },
];

export function Dashboard() {
    const history = useHistory();

    return (
        <Box p={3}>
            <Box mb={3}>
                <Typography variant="h4" component="h1" gutterBottom>Welcome back, Admin</Typography>
                <Typography variant="body1" color="textSecondary">Here's what's happening in your system today.</Typography>
            </Box>

            <Grid container spacing={3} style={{ marginBottom: '24px' }}>
                {STATS.map((s) => (
                    <Grid item xs={12} sm={6} md={3} key={s.label}>
                        <Card>
                            <CardContent>
                                <Box display="flex" justifyContent="space-between" alignItems="center" mb={2}>
                                    <Typography color="textSecondary" variant="subtitle2">{s.label}</Typography>
                                    <Typography variant="h5">{s.icon}</Typography>
                                </Box>
                                <Typography variant="h4" component="div">{s.value}</Typography>
                                <Typography variant="body2" style={{ color: s.up ? 'green' : 'red', marginTop: '8px' }}>
                                    {s.up ? '▲' : '▼'} {s.change}
                                </Typography>
                            </CardContent>
                        </Card>
                    </Grid>
                ))}
            </Grid>

            <Grid container spacing={3}>
                <Grid item xs={12} md={8}>
                    <Card style={{ height: '100%' }}>
                        <CardContent>
                            <Typography variant="h6" gutterBottom>Recent Activity</Typography>
                            <Box mt={2}>
                                {ACTIVITY.map((a, i) => (
                                    <Box key={i} display="flex" alignItems="flex-start" mb={2}>
                                        <Box width={12} height={12} borderRadius="50%" bgcolor={a.color} mt={1} mr={2} flexShrink={0} />
                                        <Box>
                                            <Typography variant="body2">{a.action}</Typography>
                                            <Typography variant="caption" color="textSecondary">{a.time}</Typography>
                                        </Box>
                                    </Box>
                                ))}
                            </Box>
                        </CardContent>
                    </Card>
                </Grid>

                <Grid item xs={12} md={4}>
                    <Card style={{ height: '100%' }}>
                        <CardContent>
                            <Typography variant="h6" gutterBottom>Quick Links</Typography>
                            <Box display="flex" flexDirection="column" mt={2}>
                                {QUICK_LINKS.map((l) => (
                                    <Button
                                        key={l.to}
                                        variant="outlined"
                                        fullWidth
                                        onClick={() => history.push(l.to)}
                                        style={{ justifyContent: 'flex-start', marginBottom: '8px' }}
                                        startIcon={<span style={{ marginRight: '8px' }}>{l.icon}</span>}
                                    >
                                        <Box display="flex" justifyContent="space-between" width="100%" alignItems="center">
                                            <span>{l.label}</span>
                                            <span>›</span>
                                        </Box>
                                    </Button>
                                ))}
                            </Box>
                        </CardContent>
                    </Card>
                </Grid>
            </Grid>
        </Box>
    );
}
