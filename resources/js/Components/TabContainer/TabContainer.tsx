import React, { FC } from 'react'
import { TabsContent, TabsList, TabsTrigger } from '../ui/tabs'
import TabOverview from './TabOverview'
import TabAgents from './TabAgents'
import TabNotifications from './TabNotifications'
import useSelectedTeam from '@/Hooks/useSelectedTeam'

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