import { IconType } from "react-icons";

export interface INavRoute{
    href:string;
    icon:IconType;
    active?:boolean;
    label:string;
}