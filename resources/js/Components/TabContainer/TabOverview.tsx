import React from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../ui/card'
import TabOverviewCards from './TabOverviewCards'
import TabOverviewPanel from './TabOverviewPanel';
import TabNotificationContainer from './TabNotificationContainer';

const TabOverview = () => {
    return (
        <>
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
                <TabOverviewCards />
            </div>
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-7">
            <Card className="col-span-4">
            <CardHeader>
                    <CardTitle>Overview</CardTitle>
                </CardHeader>
                <CardContent className="pl-2">
                    <TabOverviewPanel />
                </CardContent>
            </Card>
            <Card className="col-span-3">
                <CardHeader>
                    <CardTitle>Recent Notifications</CardTitle>
                    <CardDescription>
                        Agent Status
                    </CardDescription>
                </CardHeader>
                <CardContent>
                    <TabNotificationContainer />
                </CardContent>
            </Card>
        </div>
        </>
    )
}

export default TabOverview

