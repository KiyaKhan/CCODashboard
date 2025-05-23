import { IconType } from "react-icons";


export interface User {
    id: number;
    user_level:1|2|3;
    first_name: string;
    company_id:string;
    site:'Manila'|'Leyte'
    status:IStatus;
    group:ITeam;
    team?:ITeam;
    project_id:number;
    project:IProject;
    team_id:number;
    last_name: string;
    email: string;
    shift_start:string;
    shift_end:string;
    email_verified_at: string;
    updated_at:string;
    is_resigned:1|0;
    status_id:number;
    position_id: number | null;
    position?:Position;
}

export interface Position {
    id: number;
    position:string;
}

interface IProject{
    id:number;
    name:string;
    created_at:string;
    updated_at:string;
    users:User[];
    statuses: Status[];
    drivers: Driver[];
}
interface Status {
    id:number;
    name:string;
    project_id: number;
    position: number;
}
interface  Driver {
    id:number;
    driver:string;
    project_id: number;
    position:number;
}
export type PageProps<T extends Record<string, unknown> = Record<string, unknown>> = T & {
    auth: {
        user: User;
    };
    statuses:IStatus[];
    teams:ITeam[];
    projects:IProject[];
    positions:Position[];
};


export interface INavRoute{
    href:string;
    icon:IconType;
    active?:boolean;
    label:string;
}

export interface ITeam{
    id:number;
    name:string;
    user_id:number;
    user:User|null;
    users:User[];
}

export interface IStatus{
    id:number;
    name:string;
}

export interface INotification{
    id:number;
    user_id:number;
    team_id:number;
    status_id:number;
    user:User;
    status:IStatus;
    message:string;
    created_at:string;
    updated_at:string;
}

export interface IAgentStatus{
    id:number; 
    user_id:number;
    user:User;
    status_id:number;
    status:IStatus; 
    agent_session_id:number; 
    overtime_reason:string|null; 
    early_departure_reason:string|null; 
    special_project_remark:string|null;
    created_at:string; 
    updated_at:string;
}

export interface IAgentSession{
    id:number;
    user_id:number;
    user:User;
    created_at:string; 
    updated_at:string;

}
export interface IAgentLogs{
    id:number;
    user_id: number;
    user:User;
    driver:string;
    type:string;
    phone_or_email:string;
    start_time:string; // as Start Time
    created_at:string; // as End Time
    updated_at: string;
}

declare global {
    interface Window {
        Pusher: any;
        Echo:Echo
    }
}



type reportResponse = {
    report_items:{
        agent:User;
        breakdown:{
            session_date:string;
            calls:number;
            emails:number;
            project:string;
            break:number;
            bio_break:number;
            lunch:number;
            training:number;
            coaching:number;
            meeting:number;
            system_issue:number;
            floor_support:number;
            special_assignment:number;
            not_ready:number;
            session_id:number;
            special_assignment_remarks:string;
            login_time:string;
            early_departure_reason:string;
            overtime_reason:string;
            end_of_shift_time:string;
        }
    }[];
    from:string;
    to:string;
}

type formattedReport = {
    Month:string;
    ["Week Ending"]:string;
    Date:string;
    Site:string;
    Project:string;
    ["DDC ID#"]:string;
    Name:string;
    ["Total Hours"]:string;
    ["Login Time"]:string;
    ["Online - Calls"]:string;
    ["Online - Emails"]:string;
    Break:string;
    ["Bio Break"]:string;
    Lunch	:string;
    Training	:string;
    Coaching	:string;
    Meeting	:string;
    ["System Issue"]	:string;
    ["Floor Support"]	:string;
    ["Special Assignment"]	:string;
    ["Early Departure Time"]	:string;
    ["Overtime Hours"]	:string;
    ["End of Shift Time"]	:string;
    ["Unallocated Hours"]	:string;
    ["Special Assignment Remarks"]	:string;
    ["Early Departure Reason"]	:string;
    ["Overtime Reason"]	:string;
}