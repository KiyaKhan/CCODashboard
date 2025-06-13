import React, { FC, useEffect, useMemo, useState } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../ui/card'
import TabOverviewCards from './TabOverviewCards'
import TabOverviewPanel from './TabOverviewPanel';
import TabNotificationContainer from './TabNotificationContainer';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/Components/ui/tabs"
import useDashboardInfo from '@/Hooks/useDashboardInfo';
import TabEmailLog from './TabEmailLog';
import TabMonitorTagProject from './TabMonitorTagProject';
import { Driver, IAgentLogs, IProject, ProjectSettings, Tag, User } from '@/types';
import axios from 'axios';
import useSelectedTeam from '@/Hooks/useSelectedTeam';
import {
    Sheet,
    SheetContent,
    SheetDescription,
    SheetFooter,
    SheetHeader,
    SheetTitle,
} from "@/Components/ui/sheet"
import {
    Accordion,
    AccordionContent,
    AccordionItem,
    AccordionTrigger,
} from "@/Components/ui/accordion"
import UserSelectionCard from '../UserSelectionCard';
import { RiAccountCircleFill, RiCalendarTodoFill, RiCloseCircleFill, RiListIndefinite, RiUser2Line, RiUserSearchLine } from 'react-icons/ri';
import { Label } from '../ui/label';
import { Button } from '../ui/button';
import { ScrollArea } from '../ui/scroll-area';
import { DateRange } from 'react-day-picker';
import { addDays, setDate } from 'date-fns';
import DateRangePicker from '../DateRangePicker';
import {
    Select,
    SelectContent,
    SelectGroup,
    SelectItem,
    SelectLabel,
    SelectTrigger,
    SelectValue,
} from "@/Components/ui/select"
import useAgentLogFilter from '@/Hooks/useAgentLogFilter';
type TagData = {
    tag: Tag,
    breakDown: IAgentLogs[]
}
type ProjectMonitoring = {
    project_name: string;
    data: TagData[];
};
const TabOverview: FC = () => {
    const { users, date, driver_id, insertUser, removeUser, selectDate, selectDriver, setUsers } = useAgentLogFilter();
    const [filter, onFilter] = useState<{ open: boolean, data: TagData | undefined }>({ open: false, data: undefined });
    const { selectedTeam } = useSelectedTeam();
    const [projects, setProjects] = useState<IProject[]>();
    const [monitoring_dataset, set_monitoring_dataset] = useState<ProjectMonitoring[]>();
    const { agentLogs } = useDashboardInfo();
    const [tab, setTab] = useState<string>('recent_notifications')
    const [drivers, setDrivers] = useState<Driver[]>([]);
    const [driversProject, setDriversProject] = useState();

    const initialize_data_tag_monitoring = (initialize_project?: IProject[], modified_logs?: IAgentLogs[]) => {
        console.log('Triggered Loaded!');
        const ref_dataset = modified_logs ?? agentLogs;
        const dataset: ProjectMonitoring[] = (projects || initialize_project || []).map((project) => {
            const tagData: TagData[] = (project.tags || []).map(tag => {
                const tagdata: TagData = {
                    tag: tag,
                    breakDown: (ref_dataset || []).filter((log) => log.tag_id === tag.id)
                };
                return tagdata;
            });
            const data: ProjectMonitoring = {
                project_name: project.name,
                data: [
                    {
                        tag: { id: 0, name: `Overall ${project.name}`, project_id: project.id },
                        breakDown: (ref_dataset || []).filter((log) => log.user.project_id === project.id)
                    } as TagData,
                    ...tagData
                ]
            }
            return data;
        });
        set_monitoring_dataset(dataset);
    }
    const OnPressFilter = () => {
        const from = date?.from?.setHours(0, 0, 0, 0);
        const to = date?.to?.setHours(0, 0, 0, 0) ?? from;

        const results = (agentLogs || []).filter(log => {
            const normalizeDate = (date: string) => {
                const d = new Date(date);
                d.setHours(0, 0, 0, 0);
                return d.getTime();
            };
            const objDate = normalizeDate(log.created_at);
            const matchStart = from ? objDate >= from : true;
            const matchEnd = (from !== to) ? (to ? objDate <= to : true) : (from ? objDate <= from : true);
            return matchStart && matchEnd;
        }).filter(log => {
            const matchDriver = driver_id ? log.driver_id == driver_id : true;
            return matchDriver;
        }).filter(log => {
            const hasUser = Array.isArray(users) && users.length > 0
                ? users.some(agent => String(agent.id) === String(log.user_id))
                : true; // allow all if no agents specified
            return hasUser;
        });
        initialize_data_tag_monitoring(projects, results);
    }
    const OnPressClear = () => {
        selectDate(undefined);
        setUsers([])
        selectDriver(undefined);
        initialize_data_tag_monitoring();
    }
    useEffect(() => {
        axios.get(route('projects.settings.monitored', { team_id: selectedTeam?.id })).then((response) => {
            setProjects(response.data);
            initialize_data_tag_monitoring(response.data);
        });
        // Initialize Drivers By Project ID
        axios.get(route('drivers.all'))
            .then((response) => {
                setDriversProject(response.data);
            })
    }, []);
    useEffect(() => {
        const hasRecords = (projects || []).some(project =>
            (agentLogs || [])?.some(al => al.user.project_id === project.id)
        );
        if (hasRecords) {
            OnPressFilter();
        }
    }, [projects, agentLogs])
    useEffect(() => {
        OnPressClear();
        setDrivers(driversProject ? driversProject[tab] ?? [] : []);

    }, [tab])
    return (
        <>
            <div className="grid gap-3 md:grid-cols-2 lg:grid-cols-4">
                <TabOverviewCards />
            </div>
            {/* <div className="flex flex-col py-3.5 space-y-3.5 2xl:py-0 2xl:space-y-0 2xl:flex-row 2xl:space-x-1.5">
                
            </div> */}
            <Card className="w-full">
                <CardHeader>
                    <CardTitle>Overview of Online Agents</CardTitle>
                </CardHeader>
                <CardContent className="pl-2">
                    <TabOverviewPanel />
                </CardContent>
            </Card>
            <Tabs value={tab} onValueChange={setTab} className="w-full">
                <TabsList>
                    {/* <TabsTrigger value="agent_logs">Agent Logs</TabsTrigger> */}
                    <TabsTrigger value="recent_notifications">Recent Notifications</TabsTrigger>
                    {(projects || []).map((p) => <TabsTrigger key={p.name} value={p.name}>{p.name}</TabsTrigger>)}
                </TabsList>
                {/* <TabsContent value="agent_logs">
                        <TabEmailLog />
                    </TabsContent> */}
                <TabsContent value="recent_notifications">
                    <TabNotificationContainer />
                </TabsContent>
                {(monitoring_dataset || []).map((dataset, index) => (tab === dataset.project_name && (<TabsContent key={dataset.project_name} value={dataset.project_name}>
                    <TabMonitorTagProject key={`tab-${index}`} filter={filter} onFilter={onFilter} dataset={dataset} />
                </TabsContent>)))}
            </Tabs>
            <Sheet open={filter.open} onOpenChange={(e: boolean) => onFilter((prev) => ({ ...prev, open: e }))}>
                <SheetContent>
                    <SheetHeader>
                        <SheetTitle>{filter.data?.tag.name}</SheetTitle>
                        <SheetDescription>
                        </SheetDescription>
                    </SheetHeader>
                    <Accordion type="single" defaultValue={'date'} collapsible>
                        <AccordionItem value="date" className="no-underline hover:no-underline  hover:bg-muted/30 rounded-md transition-colors">
                            <AccordionTrigger className="no-underline hover:no-underline p-2 hover:bg-muted/30 rounded-md transition-colors">
                                <div className="flex items-center space-x-2">
                                    <RiCalendarTodoFill size={20} />
                                    <div className="text-left">
                                        <Label className="text-sm font-medium">Date Range</Label>
                                        <p className="text-xs text-muted-foreground">Select Date to filter in {filter.data?.tag.name}</p>
                                    </div>
                                </div>
                            </AccordionTrigger>
                            <AccordionContent>
                                <DateRangePicker enablePrevDate date={date} onSelect={selectDate} />
                            </AccordionContent>
                        </AccordionItem>
                        <AccordionItem value="agent">
                            <AccordionTrigger className="no-underline hover:no-underline p-2 hover:bg-muted/30 rounded-md transition-colors">
                                <div className="flex items-center space-x-2">
                                    <RiUserSearchLine size={20} />
                                    <div className="text-left">
                                        <Label className="text-sm font-medium">Select Agents</Label>
                                        <p className="text-xs text-muted-foreground">Select to filter in {filter.data?.tag.name}</p>
                                    </div>
                                </div>
                            </AccordionTrigger>
                            <AccordionContent>
                                <div className='space-y-2'>
                                    <UserSelectionCard
                                        className='!border-1'
                                        label=""
                                        onSelectUser={insertUser}
                                        user={null}
                                        users={
                                            [
                                                ...new Map(
                                                    (filter.data?.breakDown || [])
                                                        .map(entry => [entry.user.id, entry.user])
                                                ).values()
                                            ]
                                        } />
                                    <ScrollArea className='h-[200px] border border-primary/70 rounded-xl p-2'>
                                        {(users || []).length < 1 && <p className='text-center'>-Select Agent To Filter-</p>}
                                        {(users || []).map((agent) => (<div key={agent.id} className='m-2 border border-primary/20 rounded-lg p-2 flex items-center justify-between'>
                                            <div className='text-xs'>
                                                <p className='font-bold text-lg'>{`${agent.first_name} ${agent.last_name}`}</p>
                                                <p>{agent.company_id}</p>
                                            </div>
                                            <Button onClick={() => removeUser(agent)} variant={'ghost'} size={'icon'}>
                                                <RiCloseCircleFill />
                                            </Button>
                                        </div>))}
                                    </ScrollArea>
                                </div>
                            </AccordionContent>
                        </AccordionItem>
                        <AccordionItem value="driver">
                            <AccordionTrigger className="no-underline hover:no-underline p-2 hover:bg-muted/30 rounded-md transition-colors">
                                <div className="flex items-center space-x-2">
                                    <RiListIndefinite size={20} />
                                    <div className="text-left">
                                        <Label className="text-sm font-medium">Filter Drivers</Label>
                                        <p className="text-xs text-muted-foreground">Select to filter in {filter.data?.tag.name}</p>
                                    </div>
                                </div>
                            </AccordionTrigger>
                            <AccordionContent>
                                <Select value={driver_id ? driver_id.toString() : ""} onValueChange={(e) => selectDriver(parseInt(e))}>
                                    <SelectTrigger className="w-full">
                                        <SelectValue placeholder="Select Driver" />
                                    </SelectTrigger>
                                    <SelectContent className=" overflow-auto">
                                        <SelectGroup>
                                            <SelectLabel>Drivers</SelectLabel>
                                            {(drivers || []).map(data => <SelectItem key={data.id} value={data.id.toString()}>{data.driver}</SelectItem>)}
                                        </SelectGroup>
                                    </SelectContent>
                                </Select>
                            </AccordionContent>
                        </AccordionItem>
                    </Accordion>
                    <SheetFooter className='p-2'>
                        <Button onClick={OnPressClear} variant={'destructive'}>Clear</Button>
                        <Button onClick={OnPressFilter}>Filter</Button>
                    </SheetFooter>
                </SheetContent>
            </Sheet>
        </>
    )
}

export default TabOverview;