import { IconType } from "react-icons";


export interface User {
    id: number;
    user_level:1|2|3;
    first_name: string;
    last_name: string;
    email: string;
    email_verified_at: string;
    google_id:string|null;
}

export type PageProps<T extends Record<string, unknown> = Record<string, unknown>> = T & {
    auth: {
        user: User;
        my_stores:IStore[];
    };
    current_store:IStore;
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
    user:User;
    users:User[];
}


declare global {
    interface Window {
        Pusher: any;
        Echo:Echo
    }
}