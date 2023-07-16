
import { INotification, User } from '@/types';
import {create} from 'zustand'

interface IDashboardInfo{
    recentNotifications?:INotification[];
    setRecentNotifications:(notifications:INotification[])=>void;
}

const useDashboardInfo = create<IDashboardInfo>(set=>({
    recentNotifications:undefined,
    setRecentNotifications:(notifications)=>set({recentNotifications:notifications}),
}));



export default useDashboardInfo