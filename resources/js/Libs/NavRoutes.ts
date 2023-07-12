import { INavRoute } from "@/types";
import {AiOutlineHome} from 'react-icons/ai'
import {IoMdLogOut} from 'react-icons/io'
import {ImProfile} from 'react-icons/im'

const NavRoutes:INavRoute[] = [
    {
        href:"#",
        icon:AiOutlineHome,
        label:"Home"
    },{
        href:"#",
        icon:ImProfile,
        label:"Account"
    },{
        href:"#",
        icon:IoMdLogOut,
        label:"Log Out"
    }
];

export default NavRoutes;