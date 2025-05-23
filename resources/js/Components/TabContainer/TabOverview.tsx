import React, { FC } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../ui/card'
import TabOverviewCards from './TabOverviewCards'
import TabOverviewPanel from './TabOverviewPanel';
import TabNotificationContainer from './TabNotificationContainer';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/Components/ui/tabs"
import useDashboardInfo from '@/Hooks/useDashboardInfo';
import TabEmailLog from './TabEmailLog';
  



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
                <Tabs defaultValue="agent_logs" className="w-full">
                    <TabsList>
                        <TabsTrigger value="agent_logs">Agent Logs</TabsTrigger>
                        <TabsTrigger value="recent_notifications">Recent Notifications</TabsTrigger>
                    </TabsList>
                    <TabsContent value="agent_logs">
                        <TabEmailLog/>
                    </TabsContent>
                    <TabsContent value="recent_notifications">
                        <TabNotificationContainer />
                    </TabsContent>
                </Tabs>
            </div>
        </>
    )
}

export default TabOverview

