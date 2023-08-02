import { INavRoute } from "@/types";
import {LuLayoutDashboard} from 'react-icons/lu'
import {IoMdLogOut} from 'react-icons/io'
import {CgProfile} from 'react-icons/cg'
import { router } from "@inertiajs/react";
import { IconType } from "react-icons";
import { RiTeamFill } from "react-icons/ri";
import { AiTwotoneProject } from "react-icons/ai";


const navLinks:{
    onClick:()=>void;
    active:boolean;
    label:string;
    link:string;
    Icon:IconType;
}[] = [
    {
        label:'Dashboard',
        onClick:()=>router.get(route('index')),
        active:route().current()?.includes('index'),
        link:'index',
        Icon:LuLayoutDashboard
    },
    {
        label:'Profile',
        onClick:()=>router.get(route('profile.index')),
        active:route().current()?.includes('profile.index'),
        link:'profile.index',
        Icon:CgProfile
    },
    {
        label:'Projects',
        onClick:()=>{},
        active:route().current()?.includes('teams.index'),
        link:'#',
        Icon:AiTwotoneProject

    },
    {
        label:'Teams',
        onClick:()=>router.get(route('teams.index')),
        active:route().current()?.includes('teams.index'),
        link:'teams.index',
        Icon:RiTeamFill

    },
    // {
    //     label:'Users',
    //     href:"#",
    //     active:false
    //}
];

export default navLinks;