import { INavRoute } from "@/types";
import {AiOutlineHome} from 'react-icons/ai'
import {IoMdLogOut} from 'react-icons/io'
import {ImProfile} from 'react-icons/im'
import { router } from "@inertiajs/react";


const navLinks:{
    onClick:()=>void;
    active:boolean;
    label:string;
    link:string;
}[] = [
    {
        label:'Dashboard',
        onClick:()=>router.get(route('index')),
        active:route().current()?.includes('index'),
        link:'index'
    },
    {
        label:'Profile',
        onClick:()=>router.get(route('profile.index')),
        active:route().current()?.includes('profile.index'),
        link:'profile.index'
    },
    // {
    //     label:'Users',
    //     href:"#",
    //     active:false
    //}
];

export default navLinks;