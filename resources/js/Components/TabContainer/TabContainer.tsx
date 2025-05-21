import React, { FC } from 'react'
import { TabsContent, TabsList, TabsTrigger } from '../ui/tabs'
import TabOverview from './TabOverview'
import TabAgents from './TabAgents'
import TabNotifications from './TabNotifications'
import useSelectedTeam from '@/Hooks/useSelectedTeam'
import TabActivityLogs from './TabActivityLogs'
import TabOverbreak from './TabOverbreak'
import TabLates from './TabLates'
import TabCommunicationLogs from './TabCommunicationLogs'

const TabContainer:FC = () => {
    
    const {selectedTeam} = useSelectedTeam();

    if(!selectedTeam){
        return (
            <div className='w-full h-full flex items-center justify-center'>
                <h1 className='text-2xl font-semibold tracking-wide'>
                    No Team Selected
                </h1>
            </div>
        )
    }

    return (
        <>
            <TabsList>
                <TabsTrigger value="overview">Overview</TabsTrigger>
                <TabsTrigger value="agents">Agents</TabsTrigger>
                <TabsTrigger value="notifications">Notifications</TabsTrigger>
                <TabsTrigger value="logs">Activity Logs</TabsTrigger>
                <TabsTrigger value="o_break">Over Break/Lunch</TabsTrigger>
                <TabsTrigger value="lates">Lates</TabsTrigger>
                <TabsTrigger value="com_logs">example</TabsTrigger>
            </TabsList>

            <TabsContent value="overview" className="space-y-4">
                <TabOverview />
            </TabsContent>
            <TabsContent value="agents" className="space-y-4">
                <TabAgents />
            </TabsContent>
            <TabsContent value="notifications" className="space-y-4">
                <TabNotifications />
            </TabsContent>
            <TabsContent value="logs" className="space-y-4">
                <TabActivityLogs />
            </TabsContent>
            <TabsContent value="o_break" className="space-y-4">
                <TabOverbreak />
            </TabsContent>
            <TabsContent value="lates" className="space-y-4">
                <TabLates />
            </TabsContent>
            <TabsContent value="com_logs" className="space-y-4">
                <TabCommunicationLogs />
            </TabsContent>
        </>
    )
}

export default TabContainer