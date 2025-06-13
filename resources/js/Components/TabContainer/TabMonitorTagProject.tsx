import { FC, useEffect, useMemo, useState } from "react";
import { Card, CardContent } from "../ui/card";
import { RiArrowDownLine, RiArrowUpLine, RiFileExcel2Fill, RiFilter2Fill, RiPriceTag2Fill, RiPriceTag3Line, RiPriceTagLine } from "react-icons/ri";
import { Table, TableBody, TableCaption, TableCell, TableHead, TableHeader, TableRow } from "../ui/table";
import { AgentLogsFormat, IAgentLogs, IProject, LogData, ProjectMonitoring, Tag, TagData } from "@/types";
import { cn } from "@/Libs/Utils";
import useSelectedTeam from "@/Hooks/useSelectedTeam";
import ExportToExcelAgentLogs from "@/Libs/ExportToExcelAgentLogs";
import { Button } from "../ui/button";
import { EmailLogDataTable } from "./TabEmailLogComponents/EmailLogDataTable";
import { EmailLogColumn } from "./TabEmailLogComponents/EmailLogColumn";
import { Skeleton } from "../ui/skeleton";
import { Loader } from "./TabAgents";

interface Props {
    filter: { open: boolean, data: TagData | undefined };
    onFilter: (b: { open: boolean, data: TagData | undefined }) => void;
    dataset: ProjectMonitoring;
}
const TabMonitorTagProject = ({ dataset, filter, onFilter }: Props) => {
    const [tagData, setTagData] = useState<TagData | undefined>(dataset.data[0] ?? undefined);
    const { selectedTeam } = useSelectedTeam();
    const [isDesc, setDesc] = useState(true);
    const [breakdownRows, setbreakdownRows] = useState<LogData[]>([]);
    const [loading, setLoading] = useState(true);
    const onConfirm = async () => {
        const parseTime = (isoString: string): string => {
            const isoFormat = isoString.replace(' ', 'T');
            const date = new Date(isoFormat);
            if (isNaN(date.getTime())) {
                return "Invalid Time";
            }
            // Use user's local time
            const userTimeZone = Intl.DateTimeFormat().resolvedOptions().timeZone;
            const formattedTime = new Intl.DateTimeFormat('en-US', {
                hour: '2-digit',
                minute: '2-digit',
                second: '2-digit',
                hour12: true,
                timeZone: userTimeZone,
            }).format(date);
            return formattedTime;
        }
        const parseTimeDuration = (startIso: string, endIso: string): string => {
            const isoFormatStart = startIso.replace(' ', 'T');
            const isoFormatEnd = endIso.replace(' ', 'T');

            const startDateUTC = new Date(isoFormatStart);
            const endDateUTC = new Date(isoFormatEnd);

            if (isNaN(startDateUTC.getTime()) || isNaN(endDateUTC.getTime())) {
                return 'Invalid Duration';
            }

            // Convert both dates to local timezone (but times stay in UTC for correct duration)
            const diffMs = Math.abs(endDateUTC.getTime() - startDateUTC.getTime());
            const totalSeconds = Math.floor(diffMs / 1000);

            const hours = Math.floor(totalSeconds / 3600).toString().padStart(2, '0');
            const minutes = Math.floor((totalSeconds % 3600) / 60).toString().padStart(2, '0');
            const seconds = (totalSeconds % 60).toString().padStart(2, '0');
            return `${hours}:${minutes}:${seconds}`;
        };
        try {
            if (tagData?.breakDown) {
                const parseFormat = (): AgentLogsFormat[] => {
                    let response: AgentLogsFormat[] = [];
                    tagData.breakDown.forEach(log => {
                        response.push({
                            Date: formatToUserLocalTime(log.created_at),
                            "Company ID": log.user.company_id,
                            "First Name": log.user.first_name,
                            "Last Name": log.user.last_name,
                            Type: log.phone_or_email,
                            Driver: log.driver,
                            Details: log.phone_or_email,
                            "Start Time": parseTime(log?.start_time ?? ""),
                            "End Time": parseTime(log?.end_time ?? ""),
                            Duration: parseTimeDuration(log?.start_time ?? "", log?.end_time ?? "")
                        })
                    });
                    return response;
                }
                await ExportToExcelAgentLogs(parseFormat(), `${selectedTeam?.name} (${dataset.project_name}) - ${tagData.tag.name}`);
            }
        } catch (error) {
            console.error(error);
        }
    };
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
            return <p className="font-semibold text-red-500">Invalid Date Time</p>
        }

        // Use user's local time
        const userTimeZone = Intl.DateTimeFormat().resolvedOptions().timeZone;
        const formattedTime = new Intl.DateTimeFormat('en-US', {
            hour: '2-digit',
            minute: '2-digit',
            second: '2-digit',
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
        const totalSeconds = Math.floor(diffMs / 1000);

        const hours = Math.floor(totalSeconds / 3600).toString().padStart(2, '0');
        const minutes = Math.floor((totalSeconds % 3600) / 60).toString().padStart(2, '0');
        const seconds = (totalSeconds % 60).toString().padStart(2, '0');

        const formatted = `${hours}:${minutes}:${seconds}`;


        return (
            <p className="font-semibold ">
                {`${hours}:${minutes}:${seconds}`}
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
        return Math.floor(diffMs / 1000);
    }
    function formatNumberWithCommas(value: number): string {
        if (typeof value !== 'number' || isNaN(value)) {
            return '0';
        }
        return value.toLocaleString('en-US');
    }
    const sortDate = () => {
        const result = (tagData?.breakDown || []).sort((a, b) => {
            const isoFormatA = a.created_at.replace(' ', 'T');
            const isoFormatB = b.created_at.replace(' ', 'T');
            const dateA = new Date(isoFormatA ?? 0).getTime();
            const dateB = new Date(isoFormatB ?? 0).getTime();
            return (isDesc) ? dateA - dateB : dateB - dateA;
        });
        setTagData({ tag: tagData?.tag ?? {} as Tag, breakDown: result });
        setDesc(!isDesc);
    }
    useEffect(() => {
        const data = dataset.data.find(data => data.tag.id === tagData?.tag.id) ?? tagData;
        setTagData(data);
    }, [dataset])
    const summarizedTagData = useMemo(() => {
        // COMPUTING AVG. DURATION
        return dataset.data.map(data => {
            const totalSeconds = data.breakDown.reduce((sum, log) => sum + getSeconds(log?.start_time ?? "", log?.end_time ?? ""), 0);
            const avg_seconds = totalSeconds / data.breakDown.length || 0;

            const hours = Math.floor(avg_seconds / 3600).toString().padStart(2, '0');
            const minutes = Math.floor((avg_seconds % 3600) / 60).toString().padStart(2, '0');
            const seconds = Math.floor(avg_seconds % 60).toString().padStart(2, '0');

            return {
                ...data,
                avgDurationFormatted: `${hours}:${minutes}:${seconds}`,
                count: data.breakDown.length
            };
        });
    }, [dataset.data]);
    // const breakdownRows = useMemo(() => {
    //     return (tagData?.breakDown || []).map(log => ({
    //         createdAt: formatToUserLocalTime(log.created_at),
    //         fullName: `${log.user.first_name} ${log.user.last_name}`,
    //         companyId: log.user.company_id,
    //         type: log.type,
    //         driver: log.driver,
    //         details: log.phone_or_email,
    //         start: formatTo12Hour(log?.start_time ?? ""),
    //         end: formatTo12Hour(log?.end_time ?? ""),
    //         duration: getTimeDuration(log?.start_time ?? "", log?.end_time ?? "")
    //     }));
    // }, [tagData]);

    useEffect(() => {
        if (!tagData?.breakDown) return;

        setLoading(true); // 🌀 Show spinner or skeleton

        const processRows = () => {
            const rows = tagData.breakDown.map(log => ({
                createdAt: formatToUserLocalTime(log.created_at),
                fullName: `${log.user.first_name} ${log.user.last_name}`,
                companyId: log.user.company_id,
                type: log.type,
                driver: log.driver,
                details: log.phone_or_email,
                start: formatTo12Hour(log?.start_time ?? ""),
                end: formatTo12Hour(log?.end_time ?? ""),
                duration: getTimeDuration(log?.start_time ?? "", log?.end_time ?? "")
            }));

            setbreakdownRows(rows);
            setLoading(false); // ✅ Done loading
        };

        // Optional: Delay execution to prevent blocking UI immediately
        setTimeout(processRows, 0);
    }, [tagData]);

    return <>
        <div className="flex items-center pb-2 space-x-2">
            {(summarizedTagData || []).map(data => {
                return <Card
                    key={`tag-${data.tag.id}`}
                    className={
                        cn(`hover:scale-105 hover:shadow-md hover:shadow-primary/30  shadow shadow-md shadow-primary/30 p-5 w-[200px] space-y-2`, tagData?.tag.id === data.tag.id && 'bg-green-500/30')
                    }
                    onClick={() => setTagData(data)}>
                    <div className="flex flex-1 justify-between items-center">
                        <p className="text-sm font-semibold">{data.tag.name}</p>
                        <RiPriceTag2Fill />
                    </div>
                    <p className="font-bold text-2xl">{formatNumberWithCommas(data.count)}</p>
                    <div className="flex flex-1 justify-between items-center">
                        <p className="text-sm font-semibold text-green-500">Avg. Duration</p>
                        <p>{data.avgDurationFormatted}</p>
                    </div>
                </Card>
            })}
        </div>
        <div className="flex flex-1 justify-between items-center">
            <p className="font-bold text-2xl mb-5 mt-5">{tagData?.tag.name ?? dataset.project_name}</p>
            <div className="flex items-center space-x-2">
                <Button onClick={onConfirm} className='font-semibold text-sm flex items-center justify-center space-x-0.5'>
                    <RiFileExcel2Fill size={18} />
                    <span >{`Download (${dataset.project_name}) - ${tagData?.tag.name}`}</span>
                </Button>
                <Button onClick={() => onFilter({ open: !filter.open, data: tagData })} variant={"ghost"} size={"icon"}>
                    <RiFilter2Fill size={18} />
                </Button>
            </div>
        </div>
        {loading && <Skeleton className="h-[350px]">
            <Loader />
        </Skeleton>}
        {!loading && <EmailLogDataTable columns={EmailLogColumn} data={breakdownRows} />}
        {/* <div className="flex-1 flex flex-col overflow-auto rounded h-[350px] border rounded-xl">
            <Table className="w-full">
                <TableHeader className="bg-background z-50 sticky top-0">
                    <TableRow>
                        <TableHead>Date</TableHead>
                        <TableHead>Agent</TableHead>
                        <TableHead>Type</TableHead>
                        <TableHead>Driver</TableHead>
                        <TableHead>Details</TableHead>
                        <TableHead>Start Time</TableHead>
                        <TableHead>End Time</TableHead>
                        <TableHead className="text-right">
                            <Button onClick={sortDate} variant={'ghost'}>
                                {isDesc && <RiArrowUpLine className="mr-2" />}
                                {!isDesc && <RiArrowDownLine className="mr-2" />}
                                Duration
                            </Button>
                        </TableHead>
                    </TableRow>
                </TableHeader>
                <TableBody>
                    {breakdownRows.map((log, index) => <TableRow key={`email_log${index}`}>
                        <TableCell className="font-medium">{log.createdAt}</TableCell>
                        <TableCell>
                            <div>
                                <p className="font-semibold">{log.fullName}</p>
                                <p className="text-xs text-muted-foreground">{log.companyId}</p>
                            </div>
                        </TableCell>
                        <TableCell>{log.type}</TableCell>
                        <TableCell>{log.driver}</TableCell>
                        <TableCell>{log.details}</TableCell>
                        <TableCell >{log.start}</TableCell>
                        <TableCell >{log.end}</TableCell>
                        <TableCell className="text-right">{log.duration}</TableCell>
                    </TableRow>)
                    }
                </TableBody>
            </Table>
        </div > */}
    </>
}
export default TabMonitorTagProject;