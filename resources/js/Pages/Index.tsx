import CalendarDateRangePicker from '@/Components/CalendarDateRangePicker';
import NavBar from '@/Components/NavBar';
import TabContainer from '@/Components/TabContainer/TabContainer';
import { Button } from '@/Components/ui/button';
import { Tabs } from '@/Components/ui/tabs';
import useCurrentUser from '@/Hooks/useCurrentUser';
import { INotification, ITeam, PageProps, User, formattedReport, reportResponse } from '@/types'
import { Head, Link, usePage } from '@inertiajs/react'
import React, { FC, useCallback, useEffect, useState } from 'react'
import { BiCircle } from 'react-icons/bi';
import useSelectedTeam from '@/Hooks/useSelectedTeam';
import axios from 'axios';
import { toast } from 'react-toastify';
import useDashboardInfo, { AgentBreakdown, BarChart } from '@/Hooks/useDashboardInfo';
import EchoCointainer from '@/Containers/EchoCointainer';
import { RiFileExcel2Fill } from 'react-icons/ri';
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle } from '@/Components/ui/alert-dialog';
import { addDays, format, parseISO } from 'date-fns';
import { DateRange } from 'react-day-picker';
import { FaCircleNotch } from 'react-icons/fa';
import ExportToExcel from '@/Libs/ExportToExcel';

interface IndexProps{
    teams:ITeam[];
    available_team_leaders:User[];
}

type GetDataResponse = {
    data:{
        recent_notifications:INotification[],
        dashboard_cards:AgentBreakdown,
        bar_chart:BarChart
    };
}

const Index:FC<IndexProps> = ({teams,available_team_leaders}) => {
    const {selectTeam,selectedTeam} = useSelectedTeam();
    const [loading,setLoading] = useState<boolean>(true);
    const {setRecentNotifications,setAgentBreakdown,setBarChart} = useDashboardInfo();
    const [date, setDate] = React.useState<DateRange | undefined>({
        from: addDays(new Date,-7),
        to: new Date,
    });
    const [showConfirmDialog,setShowConfirmDialog] = useState(false);
    
    const handleDownloadConfirmation = useCallback(() =>{
        if(!date) return toast.error('Pick a date before Proceeding...');
        setShowConfirmDialog(true);
    },[date]);

    const onConfirm = async(report:formattedReport[])=>{
        await ExportToExcel(report,`RMS_Report_${selectedTeam?.name}_${report[0]['Week Ending']}_${report[0].Date}`);
    };

    useEffect(()=>{
        if(teams) selectTeam(teams[0]);
    },[]);

    useEffect(()=>{
        if(!selectedTeam)return;
        const team_id=selectedTeam.id
        setLoading(true);
        axios.get(route('get_data',{
            team_id
        }))
        .then(({data}:GetDataResponse)=>{ 
            setRecentNotifications(data.recent_notifications);
            setAgentBreakdown(data.dashboard_cards);
            setBarChart(data.bar_chart);
        })
        .catch(e=>toast.error('Something went wront. Please refresh the page and try again'))
        .finally(()=>setLoading(false));
    },[selectedTeam]);

    return (
        <>
            <Head title='Dashboard' />
            <div className="flex flex-col h-screen">
                <NavBar availableTeamLeaders={available_team_leaders} teams={teams} />
                <div className="flex-1 space-y-4 p-8 pt-6 h-full">
                    <div className="flex flex-col space-y-3.5 md:space-y-0 md:justify-between md:flex-row md:items-center md:space-x-2">
                        <h2 className="text-3xl font-bold tracking-tight">Dashboard</h2>
                        <div className="flex flex-col space-y-3.5 md:space-y-0 md:flex-row md:items-center md:space-x-2">
                            <CalendarDateRangePicker className='' date={date} setDate={setDate} />
                            <Button onClick={handleDownloadConfirmation} className='font-semibold text-sm flex items-center justify-center space-x-0.5'>
                                <RiFileExcel2Fill size={18} />
                                <span >Download Report</span>
                            </Button>
                        </div>
                    </div>
                    <Tabs defaultValue="overview" className="space-y-4 h-full w-full">
                        {loading?<div className='w-full flex items-center justify-center'><BiCircle size={96}  className='text-sky-500 animate-ping mt-48' /></div>:<TabContainer />}
                    </Tabs>
                </div>
            </div>
            <EchoCointainer />
            {
                (date&&selectedTeam)&&<ConfirmDownload onConfirm={onConfirm} date={date} team={selectedTeam} isOpen={showConfirmDialog} onClose={()=>setShowConfirmDialog(false)} />
            }
            
        </>
    )
}

export default Index

interface ConfirmDownloadProps{
    isOpen?:boolean;
    onClose:()=>void;
    team:ITeam;
    date:DateRange;
    onConfirm:(report:formattedReport[])=>void
}


const ConfirmDownload:FC<ConfirmDownloadProps> = ({isOpen,onClose,team,onConfirm,date}) =>{
    const {selectedTeam} = useSelectedTeam();
    const [loading,setLoading] = useState(false);
    const handleConfirm = useCallback(async()=>{
        try {
            setLoading(true);
            const {data} = await axios.get(route('teams.reports',{
                team_id:team.id,
                date
            })) as {data:reportResponse};
            const report:formattedReport[] = await formatReport(data,selectedTeam!.name);
            onConfirm(report);
        } catch (error) {
            toast.error('Something went wrong. Please try again...');
        } finally{
            setLoading(false);
        }
        
        
    },[date,team]);

    
    

    return(
        <AlertDialog open={isOpen}>
            <AlertDialogContent>
                <AlertDialogHeader>
                    <AlertDialogTitle>{`${loading?'Generating Reports...':'Confirm Download'}`}</AlertDialogTitle>
                    <AlertDialogDescription className='flex flex-col space-y-1.5'>
                        <span>Generate Report for {team.name}</span>
                        <span>From: { format( date.from!,'P')}</span>
                        {
                            date.to&& <span>{`To: ${format(date.to,'P')}`}</span>
                        }
                    </AlertDialogDescription>
                </AlertDialogHeader>
                <AlertDialogFooter>
                <AlertDialogCancel className='font-semibold' disabled={loading} onClick={onClose}>Cancel</AlertDialogCancel>
                <AlertDialogAction className='font-semibold flex items-center justify-center space-x-1.5' disabled={loading} onClick={handleConfirm}>
                    {loading&&<FaCircleNotch size={18} className='animate-spin' />}
                    <span>{`${loading?'Please wait...':'Continue'}`}</span>
                </AlertDialogAction>
                </AlertDialogFooter>
            </AlertDialogContent>
        </AlertDialog>
    );
}

const formatReport:(reports:reportResponse,teamName:string)=>Promise<formattedReport[]>= async({report_items,from,to},teamName) =>{
    const formattedReport:formattedReport[] = report_items.map(({agent,breakdown})=>{
        const {
            calls,
            emails,
            break:Break,
            bio_break,
            lunch:Lunch,
            training:Training,
            coaching:Coaching,
            meeting:Meeting,
            system_issue,
            floor_support,
            special_assignment
        } = breakdown;
        const totalHrs=calls+emails+Break+bio_break+Lunch+Training+Coaching+Meeting+system_issue+floor_support+special_assignment;
        return{
            Month: `${format(parseISO(from),'MMM').toString()}-${format(parseISO(from),'yy').toString()}`,
            "Week Ending":from,
            "Date":to,
            Site:agent.site,
            Project:teamName,
            "DDC ID#":agent.company_id,
            "Name":`${agent.last_name}, ${agent.first_name}`,
            "Total Hours":  minsToDuration(totalHrs),
            "Login Time":"",
            "Online - Calls": minsToDuration(calls),
            "Online - Emails": minsToDuration(emails),
            Break: minsToDuration(Break),
            "Bio Break": minsToDuration(bio_break),
            Lunch: minsToDuration(Lunch),
            Training: minsToDuration(Training),
            Coaching: minsToDuration(Coaching),
            Meeting: minsToDuration(Meeting),
            "System Issue": minsToDuration(system_issue),
            "Floor Support": minsToDuration(special_assignment),
            "Special Assignment": minsToDuration(special_assignment),
            "Early Departure Time":"",
            "Overtime Hours":"",
            "End of Shift Time":"",
            "Unallocated Hours":"",
            "Special Assignment Remarks":"",
            "Early Departure Reason":"",
            "Overtime Reason":""
        } 
    });
    
    return formattedReport;
}

export const minsToDuration:(minutes:number)=>string = (minutes:number) =>{
    // Create a new date object with the minutes as milliseconds
    const date = new Date(minutes * 60 * 1000);
    // Use UTC methods to avoid time zone issues
    const hours = date.getUTCHours();
    const mins = date.getUTCMinutes();
    const secs = date.getUTCSeconds();
    // Add leading zeros if needed
    const hh = hours.toString().padStart(2, "0");
    const mm = mins.toString().padStart(2, "0");
    const ss = secs.toString().padStart(2, "0");
    // Return the formatted string
    return `${hh}:${mm}:${ss}`;
}
