import { FC, useCallback } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '../ui/card';
import {IoCallOutline, IoPeople} from 'react-icons/io5';
import {SlSizeFullscreen} from 'react-icons/sl';
import { MdOutlineAlternateEmail } from 'react-icons/md';
import useDashboardInfo from '@/Hooks/useDashboardInfo';
import { ImSpinner2 } from 'react-icons/im';
import useSelectedTeam from '@/Hooks/useSelectedTeam';
import axios from 'axios';
import { toast } from 'react-toastify';

const TabOverviewCards:FC = () => {
    const {agentBreakdown} = useDashboardInfo();
    const {selectedTeam} = useSelectedTeam();
    
    return (
        <>
            
            <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-sm font-medium">
                        {`${selectedTeam?.id===0?'Overall CCO Agents':'Team Size'}`}
                    </CardTitle>
                    {agentBreakdown?<SlSizeFullscreen />:<ImSpinner2 className='animate-spin' />}
                </CardHeader>
                <CardContent>
                    <div className="text-2xl font-bold">{agentBreakdown?.team_size}</div>
                </CardContent>
            </Card>
            <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-sm font-medium">
                        Total Agents Online
                    </CardTitle>
                    {agentBreakdown?<IoPeople />:<ImSpinner2 className='animate-spin' />}
                </CardHeader>
                <CardContent>
                    <div className="text-2xl font-bold">{agentBreakdown?.total_online}</div>
                    <p className="text-xs text-muted-foreground">
                        {agentBreakdown?.total_on_lunch_or_break} Agents on Break/Lunch
                    </p>
                </CardContent>
            </Card>
            <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-sm font-medium">Calls</CardTitle>
                    {agentBreakdown?<IoCallOutline />:<ImSpinner2 className='animate-spin' />}
                </CardHeader>
                <CardContent>
                    <div className="text-2xl font-bold">{agentBreakdown?.total_on_call}</div>
                    <p className="text-xs text-muted-foreground">
                        Agents on Calls
                    </p>
                </CardContent>
            </Card>
            <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-sm font-medium">Emails</CardTitle>
                    {agentBreakdown?<MdOutlineAlternateEmail />:<ImSpinner2 className='animate-spin' />}
                </CardHeader>
                <CardContent>
                    <div className="text-2xl font-bold">{agentBreakdown?.total_on_email}</div>
                    <p className="text-xs text-muted-foreground">
                        Agents on Email
                    </p>
                </CardContent>
            </Card>
            {/* <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-sm font-medium">Agents on Lunch</CardTitle>
                    {agentBreakdown?<MdOutlineAlternateEmail />:<ImSpinner2 className='animate-spin' />}
                </CardHeader>
                <CardContent>
                    <div className="text-2xl font-bold">{agentBreakdown?.total_on_email}</div>
                    <p className="text-xs text-muted-foreground">
                        Click here to view Agents on Overbreak
                    </p>
                </CardContent>
            </Card> */}
        </>
    )
}

export default TabOverviewCards