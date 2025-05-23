import useDashboardInfo from "@/Hooks/useDashboardInfo";
import { FC, ReactElement } from "react";
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

const TabEmailLog:FC = () => {
    const {agentLogs} = useDashboardInfo();
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
      
      /*WITH DATE-FNS*/
      // const getTimeDuration = (startIso: string, endIso: string): React.ReactElement => {
      //   // Ensure strings are valid ISO 8601 format
      //   const start = parseISO(startIso.replace(' ', 'T'));
      //   const end = parseISO(endIso.replace(' ', 'T'));

      //   if (!isValid(start) || !isValid(end)) {
      //     return <p className="text-red-500">Invalid</p>;
      //   }

      //   // Calculate duration object
      //   const duration = intervalToDuration({ start, end });

      //   const hours = String(duration.hours || 0).padStart(2, '0');
      //   const minutes = String(duration.minutes || 0).padStart(2, '0');

      //   return (
      //     <p>
      //       {hours} {parseInt(hours) === 1 ? 'hr' : 'hrs'} {minutes}{' '}
      //       {parseInt(minutes) === 1 ? 'min' : 'mins'}
      //     </p>
      //   );
      // };

    return (<>
        <ScrollArea className="w-full h-[28rem]  border p-4 rounded-xl">
            <Table>
                {(agentLogs || []).length < 1 && <TableCaption>- No Data -</TableCaption>}
                <TableHeader className="sticky top-0 x-10 bg-background">
                    <TableRow>
                    <TableHead className="w-[200px]">Date</TableHead>
                    <TableHead>Agent</TableHead>
                    <TableHead>Type</TableHead>
                    <TableHead>Driver</TableHead>
                    <TableHead>Start Time</TableHead>
                    <TableHead>End Time</TableHead>
                    <TableHead className="text-right">Duration</TableHead>
                    </TableRow>
                </TableHeader>
                <TableBody>
                    {(agentLogs || []).map((log,index) => <TableRow key={`email_log${index}`}>
                        <TableCell className="font-medium">{formatToUserLocalTime(log.created_at)}</TableCell>
                        <TableCell>{`${log.user.first_name} ${log.user.last_name}`}</TableCell>
                        <TableCell>{log.type}</TableCell>
                        <TableCell>{log.driver}</TableCell>
                        <TableCell >{formatTo12Hour(log.start_time)}</TableCell>
                        <TableCell >{formatTo12Hour(log.created_at)}</TableCell>
                        <TableCell className="text-right">{getTimeDuration(log.start_time,log.created_at)}</TableCell>
                    </TableRow>)
                    }
                </TableBody>
            </Table>
        </ScrollArea>
    </>)
}
export default TabEmailLog;