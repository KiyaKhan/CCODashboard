import React, { FC } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../ui/card'
import TabOverviewCards from './TabOverviewCards'
import TabOverviewPanel from './TabOverviewPanel';
import TabNotificationContainer from './TabNotificationContainer';




const TabOverview:FC = () => {
    
    
    return (
        <>
            <div className="grid gap-3 md:grid-cols-2 lg:grid-cols-4">
                <TabOverviewCards />
            </div>
            <div className="flex flex-col py-3.5 space-y-3.5 2xl:py-0 2xl:space-y-0 2xl:flex-row 2xl:space-x-1.5">
                <Card className="w-full 2xl:w-[65%]">
                    <CardHeader>
                        <CardTitle>Overview of Online Agents</CardTitle>
                    </CardHeader>
                    <CardContent className="pl-2">
                        <TabOverviewPanel />
                    </CardContent>
                </Card>
                <Card className="w-full 2xl:w-[35%] max-h-[24rem] overflow-y-auto">
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

