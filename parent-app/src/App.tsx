import React from 'react';
import { Switch, Route, Redirect } from 'react-router-dom';
import { Layout } from './components/Layout/Layout';
import { Dashboard } from './pages/Dashboard/Dashboard';
import { AuditLogs } from './pages/AuditLogs/AuditLogs';
import { Settings } from './pages/Settings/Settings';

export default function App() {
    return (
        <Switch>
            <Route exact path="/">
                <Layout><Dashboard /></Layout>
            </Route>
            <Route path="/audit">
                <Layout><AuditLogs /></Layout>
            </Route>
            <Route path="/settings">
                <Layout><Settings /></Layout>
            </Route>
            <Route path="*">
                <Redirect to="/" />
            </Route>
        </Switch>
    );
}
