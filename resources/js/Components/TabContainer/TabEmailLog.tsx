import useDashboardInfo from "@/Hooks/useDashboardInfo";
import { FC, ReactElement, useEffect, useState } from "react";
import { ScrollArea } from '../ui/scroll-area';
import { parseISO, isValid, intervalToDuration } from 'date-fns';
import {
    Table,
    TableBody,
    TableCaption,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
  } from "@/Components/ui/table"
import { Input } from "../ui/input";
import { RiArrowDownCircleFill, RiArrowDownLine, RiArrowUpLine, RiSearch2Fill, RiSearch2Line } from "react-icons/ri";
import { Button } from "../ui/button";
import { IAgentLogs } from "@/types";

const TabEmailLog:FC = () => {
    const {agentLogs:initialAgentLogs} = useDashboardInfo();
    const formatToUserLocalTime = (utcString: string): string => {
        const date = new Date(utcString);
        if (isNaN(date.getTime())) return "Invalid date ❌";
        // Get user's current time zone
        const userTimeZone = Intl.DateTimeFormat().resolvedOptions().timeZone;
      
        // Format in 12-hour clock for user
        return new Intl.DateTimeFormat('en-US', {
            year: 'numeric',
            month: '2-digit',
            day: '2-digit',
            timeZone: userTimeZone,
        }).format(date);
      };
    const formatTo12Hour = (isoString: string): React.ReactElement => {
        const isoFormat = isoString.replace(' ', 'T');
        const date = new Date(isoFormat);
      
        if (isNaN(date.getTime())) {
          return <p className="text-red-500">Invalid time</p>;
        }
      
        // Use user's local time
        const userTimeZone = Intl.DateTimeFormat().resolvedOptions().timeZone;
        const formattedTime = new Intl.DateTimeFormat('en-US', {
          hour: '2-digit',
          minute: '2-digit',
          hour12: true,
          timeZone: userTimeZone,
        }).format(date);
      
        return <div>
          <p className="font-semibold">{formattedTime}</p>
          <p className="text-muted-foreground text-xs">{formatToUserLocalTime(isoString)}</p>
        </div>;
      };
      
      const getTimeDuration = (startIso: string, endIso: string): React.ReactElement => {
        const isoFormatStart = startIso.replace(' ', 'T');
        const isoFormatEnd = endIso.replace(' ', 'T');
      
        const startDateUTC = new Date(isoFormatStart);
        const endDateUTC = new Date(isoFormatEnd);
      
        if (isNaN(startDateUTC.getTime()) || isNaN(endDateUTC.getTime())) {
          return <p className="text-red-500">Invalid</p>;
        }
      
        // Convert both dates to local timezone (but times stay in UTC for correct duration)
        const diffMs = Math.abs(endDateUTC.getTime() - startDateUTC.getTime());
        const totalMinutes = Math.floor(diffMs / (1000 * 60));
        const hours = Math.floor(totalMinutes / 60).toString().padStart(2, '0');
        const minutes = (totalMinutes % 60).toString().padStart(2, '0');
      
        return (
          <p className="font-semibold ">
            {hours} {parseInt(hours) === 1 ? 'hr' : 'hrs'} {minutes}{' '}
            {parseInt(minutes) === 1 ? 'min' : 'mins'}
          </p>
        );
      };

      const getSeconds = (startIso: string, endIso: string) => {
        const isoFormatStart = startIso.replace(' ', 'T');
        const isoFormatEnd = endIso.replace(' ', 'T');

        const startDateUTC = new Date(isoFormatStart);
        const endDateUTC = new Date(isoFormatEnd);

        if (isNaN(startDateUTC.getTime()) || isNaN(endDateUTC.getTime())) {
          return 0;
        }
        const diffMs = Math.abs(endDateUTC.getTime() - startDateUTC.getTime());
        return Math.floor(diffMs / (1000));
      }
      const [agentLogs, setAgentLogs] = useState<IAgentLogs[] | undefined>(initialAgentLogs);
      const [filter,setFilter] = useState<{name:string,sort_duration:boolean, sort_date:boolean}>({
        name:'',
        sort_duration:false, // true - desc | false - asc
        sort_date:true,  
      });
      const filteredData = () => {
        const result = (initialAgentLogs||[])
        .filter(item =>
          (`${item.user.first_name} ${item.user.last_name}`).toLowerCase().includes(filter.name.toLowerCase()) ||
          item.user.company_id.toLowerCase().includes(filter.name.toLowerCase())
        );
        if(filter.name.length < 1) {
          setAgentLogs(initialAgentLogs);
          return;
        }
        setAgentLogs(result);
        // Return to default state sorting
        setFilter((prev) => ({...prev, sort_date: true, sort_duration:false}));
      }
      const sortDuration = () => {
        const result = (agentLogs||[]).sort((a,b) => {
            const sec_a = getSeconds(a?.start_time?? "", a.created_at);
            const sec_b = getSeconds(b?.start_time?? "", b.created_at);
            return filter.sort_duration? sec_a - sec_b : sec_b - sec_a;
        });
        setAgentLogs(result);
        setFilter((prev) => ({...prev, sort_duration: !prev.sort_duration}));
      }
      const sortDate = () => {
        const result = (agentLogs||[]).sort((a,b) => {
          const isoFormatA = a.created_at.replace(' ', 'T');
          const isoFormatB = b.created_at.replace(' ', 'T');
          const dateA = new Date(isoFormatA ?? 0).getTime();
          const dateB = new Date(isoFormatB ?? 0).getTime();
          return (filter.sort_date)? dateA - dateB : dateB - dateA;
        });
        setAgentLogs(result);
        setFilter((prev) => ({...prev, sort_date: !prev.sort_date}));
      }
      const search = (e:React.ChangeEvent<HTMLInputElement>) => {
        const name = e.currentTarget.value;
        setFilter((prev) => ({...prev, name}));
      }
      
      useEffect(() => {
       const delayDebounce = setTimeout(() => {
          filteredData();
        },300);
        return () => clearTimeout(delayDebounce);
      }, [filter.name,initialAgentLogs]);
      
    return (<>
        <div className="relative grid w-1/3 items-center mb-2">
              <div className='flex items-center w-full'>
                  <div className="w-full relative">                 
                      <Input  onChange={search} placeholder="Search Agent Name / ID"  className=" w-full text-sm" />
                  </div>
                  <RiSearch2Line size={18} className="absolute right-3  " />
              </div>
        </div>
        <div className="flex-1 flex flex-col overflow-auto rounded h-[350px] border rounded-xl">
          <Table className="w-full">
              {(agentLogs || []).length < 1 && <TableCaption>- No Data -</TableCaption>}
              <TableHeader className="bg-background z-50 sticky top-0">
                  <TableRow>
                    <TableHead className="w-[200px]">
                      <Button onClick={sortDate} variant={'ghost'}>
                          {filter.sort_date && <RiArrowUpLine className="mr-2"/>}
                          {!filter.sort_date && <RiArrowDownLine className="mr-2"/>}
                          Date
                        </Button>
                    </TableHead>
                    <TableHead>Agent</TableHead>
                    <TableHead>Type</TableHead>
                    <TableHead>Driver</TableHead>
                    <TableHead>Start Time</TableHead>
                    <TableHead>End Time</TableHead>
                    <TableHead className="text-right">
                      <Button onClick={sortDuration} variant={'ghost'}>
                        {filter.sort_duration && <RiArrowUpLine className="mr-2"/>}
                        {!filter.sort_duration && <RiArrowDownLine className="mr-2"/>}
                        Duration
                      </Button>
                    </TableHead>
                  </TableRow>
              </TableHeader>
              <TableBody>
                  {(agentLogs || []).map((log,index) => <TableRow key={`email_log${index}`}>
                      <TableCell className="font-medium">{formatToUserLocalTime(log.created_at)}</TableCell>
                      <TableCell>
                        <div>
                        <p className="font-semibold">{`${log.user.first_name} ${log.user.last_name}`}</p>
                        <p className="text-xs text-muted-foreground">{log.user.company_id}</p>
                        </div>
                      </TableCell>
                      <TableCell>{log.type}</TableCell>
                      <TableCell>{log.driver}</TableCell>
                      <TableCell >{formatTo12Hour(log?.start_time ?? "")}</TableCell>
                      <TableCell >{formatTo12Hour(log.created_at)}</TableCell>
                      <TableCell className="text-right">{getTimeDuration(log?.start_time ?? "",log.created_at)}</TableCell>
                  </TableRow>)
                  }
              </TableBody>
            </Table>
          </div>
    </>)
}
export default TabEmailLog;