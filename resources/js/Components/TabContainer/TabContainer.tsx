import React from 'react'
import { TabsContent, TabsList, TabsTrigger } from '../ui/tabs'
import TabOverview from './TabOverview'
import TabAgents from './TabAgents'
import TabNotifications from './TabNotifications'

const TabContainer = () => {
    return (
        <>
            <TabsList>
                <TabsTrigger value="overview">Overview</TabsTrigger>
                <TabsTrigger value="agents">
                    Agents
                </TabsTrigger>
                <TabsTrigger value="notifications">
                    Notifications
                </TabsTrigger>
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
        </>
    )
}

export default TabContainer