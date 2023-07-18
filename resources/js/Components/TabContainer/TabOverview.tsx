import React from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../ui/card'
import TabOverviewCards from './TabOverviewCards'
import TabOverviewPanel from './TabOverviewPanel';
import TabNotificationContainer from './TabNotificationContainer';




const TabOverview = () => {
    
    
    return (
        <>
            <div className="grid gap-3 md:grid-cols-2 lg:grid-cols-4">
                <TabOverviewCards />
            </div>
            <div className="grid gap-3 grid-cols-1 lg:grid-cols-8">
                <Card className="col-span-1  lg:col-span-5">
                <CardHeader>
                        <CardTitle>Overview of Online Agents</CardTitle>
                    </CardHeader>
                    <CardContent className="pl-2">
                        <TabOverviewPanel />
                    </CardContent>
                </Card>
                <Card className="col-span-1  lg:col-span-3">
                    <CardHeader>
                        <CardTitle>Recent Notifications</CardTitle>
                        <CardDescription>
                            Agent Status
                        </CardDescription>
                    </CardHeader>
                    <CardContent className='w-full'>
                        <TabNotificationContainer />
                    </CardContent>
                </Card>
            </div>
        </>
    )
}

export default TabOverview

