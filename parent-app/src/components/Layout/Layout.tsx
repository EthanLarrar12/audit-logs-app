import React from 'react';
import { NavLink, useLocation } from 'react-router-dom';
import type { ReactNode } from 'react';
import {
    makeStyles, Drawer, AppBar, Toolbar, Typography, List, ListItem,
    ListItemIcon, ListItemText, Box, Divider, Avatar
} from '@material-ui/core';
interface NavItem {
    to: string;
    icon: string;
    label: string;
}

const NAV_ITEMS: NavItem[] = [
    { to: '/', icon: '⊞', label: 'Dashboard' },
    { to: '/audit', icon: '🔍', label: 'Audit Logs' },
    { to: '/settings', icon: '⚙', label: 'Settings' },
];

const PAGE_TITLES: Record<string, string> = {
    '/': 'Dashboard',
    '/audit': 'Audit Logs',
    '/settings': 'Settings',
};

interface LayoutProps {
    children: ReactNode;
}

const drawerWidth = 240;

const useStyles = makeStyles((theme) => ({
    root: { display: 'flex', height: '100%', width: '100%', overflow: 'hidden', backgroundColor: '#f4f6f8' },
    appBar: {
        width: `calc(100% - ${drawerWidth}px)`,
        marginLeft: drawerWidth,
        backgroundColor: '#ffffff',
        color: '#333',
        boxShadow: '0 1px 3px rgba(0,0,0,0.1)'
    },
    drawer: { width: drawerWidth, flexShrink: 0 },
    drawerPaper: { width: drawerWidth, backgroundColor: '#1e293b', color: '#fff' },
    toolbar: theme.mixins.toolbar,
    brand: { padding: theme.spacing(2), display: 'flex', alignItems: 'center', gap: theme.spacing(1) },
    content: { flexGrow: 1, padding: theme.spacing(3), overflow: 'auto', display: 'flex', flexDirection: 'column' },
    link: { color: '#cbd5e1', textDecoration: 'none' },
    activeLink: { '& .MuiListItem-root': { backgroundColor: 'rgba(255,255,255,0.1)', color: '#fff' } },
    itemIcon: { color: 'inherit', minWidth: '40px' },
    footer: { marginTop: 'auto', padding: theme.spacing(2) }
}));

export function Layout({ children }: LayoutProps) {
    const classes = useStyles();
    const { pathname } = useLocation();
    const title = PAGE_TITLES[pathname] ?? 'Management Portal';

    return (
        <div className={classes.root}>
            <AppBar position="fixed" className={classes.appBar}>
                <Toolbar>
                    <Typography variant="h6" noWrap style={{ flexGrow: 1 }}>
                        {title}
                    </Typography>
                    <Box display="flex" alignItems="center">
                        <Box width={10} height={10} borderRadius="50%" bgcolor="#22c55e" />
                        <Typography variant="body2">System Online</Typography>
                    </Box>
                </Toolbar>
            </AppBar>

            <Drawer
                className={classes.drawer}
                variant="permanent"
                classes={{ paper: classes.drawerPaper }}
                anchor="left"
            >
                <div className={classes.brand}>
                    <Typography variant="h5">🛡 Portal</Typography>
                </div>
                <Divider style={{ backgroundColor: 'rgba(255,255,255,0.1)' }} />

                <List>
                    <Box pl={2} pr={2} pt={2} pb={1}>
                        <Typography variant="caption" style={{ color: '#94a3b8' }}>MAIN</Typography>
                    </Box>
                    {NAV_ITEMS.map(({ to, icon, label }) => (
                        <NavLink
                            key={to}
                            to={to}
                            exact={to === '/'}
                            className={classes.link}
                            activeClassName={classes.activeLink}
                        >
                            <ListItem button>
                                <ListItemIcon className={classes.itemIcon}>{icon}</ListItemIcon>
                                <ListItemText primary={label} />
                            </ListItem>
                        </NavLink>
                    ))}
                </List>

                <div className={classes.footer}>
                    <Divider style={{ backgroundColor: 'rgba(255,255,255,0.1)', marginBottom: '16px' }} />
                    <Box display="flex" alignItems="center">
                        <Avatar>A</Avatar>
                        <Box>
                            <Typography variant="body2">Admin User</Typography>
                            <Typography variant="caption" style={{ color: '#94a3b8' }}>Administrator</Typography>
                        </Box>
                    </Box>
                </div>
            </Drawer>

            <main className={classes.content} style={pathname === '/audit' ? { padding: 0, overflow: 'hidden' } : {}}>
                <div className={classes.toolbar} />
                {children}
            </main>
        </div>
    );
}
