import NavBar from '@/Components/NavBar';
import { Button } from '@/Components/ui/button';
import { Input } from '@/Components/ui/input';
import { Label } from '@/Components/ui/label';
import { Separator } from '@/Components/ui/separator';
import useCurrentUser from '@/Hooks/useCurrentUser';
import { cn } from '@/Libs/Utils';
import { ITeam, PageProps, User } from '@/types';
import { Head, router, useForm, usePage } from '@inertiajs/react';
import React, { ChangeEventHandler, FC, FormEventHandler, Fragment, ReactNode, useCallback, useEffect, useMemo, useState } from 'react';
import { toast } from 'react-toastify';
import {  PiPasswordFill } from 'react-icons/pi'
import { IconType } from 'react-icons';
import { BiSolidUserCircle } from 'react-icons/bi';
import { RiLogoutBoxRLine } from 'react-icons/ri';

interface ProfileProps{
    teams:ITeam[];
    available_team_leaders:User[];
    user:User;
}

type ProfileType = {
    company_id:string;
    email:string;
    first_name:string;
    last_name:string;
    
}
type PasswordType = {
    
    current_password:string;
    password:string;
    password_confirmation:string;
}

type ProfileSidebarItems ={
    onClick:()=>void;
    Icon:IconType;
    label:string;
    variant?:"secondary" | "outline" | "link" | "default" | "destructive" | "ghost" | null | undefined;
}

const Profile:FC<ProfileProps> = ({available_team_leaders,teams,user}) => {
    const [panel,setPanel] = useState<'PROFILE'|'PASSWORD'>('PROFILE');
    const { data, setData, post, processing, errors } = useForm<ProfileType>({
        company_id:user.company_id,
        email:user.email,
        first_name:user.first_name,
        last_name:user.last_name,
        
    });

    const { data:pwData, setData:setPw, post:updatePw, processing:processingPw, errors:pwErrors } = useForm<PasswordType>({
        current_password:"",
        password:"",
        password_confirmation:""
    });
    
    
    

    const handleChange:ChangeEventHandler<HTMLInputElement> = ({target})=>{        
        const {id,value} = target;
        setData(val=>({...val,[id]:value}));
    }
    
    const handlePwChange:ChangeEventHandler<HTMLInputElement> = ({target})=>{
        const {id,value} = target;
        setPw(val=>({...val,[id]:value}));
    }

    const handleSubmit:FormEventHandler<HTMLFormElement> = useCallback((e)=>{
        e.preventDefault();
        if(panel==='PASSWORD'){
            updatePw(route('profile.password.update'),{
                onSuccess:()=>toast.success('Password Changed!')
            });
        }
        if(panel==='PROFILE'){
            post(route('profile.update'),{
                onSuccess:()=>toast.success('Profile Updated!')
            });
        }
    },[data,pwData,panel]);
    
    useEffect(()=>{
        panel==='PROFILE'?setData({
            company_id:user.company_id,
            email:user.email,
            first_name:user.first_name,
            last_name:user.last_name
        }):setPw({
            current_password:"",
            password:"",
            password_confirmation:""
        });
    },[panel,user]);

    let panelContent:ReactNode=useMemo(()=>{
        if(panel==='PROFILE'){
            return(
                <form onSubmit={handleSubmit}>
                    <div className='flex flex-col'>
                        <h3 className='font-bold text-3xl'>Profile Settings</h3>
                        <Separator className='my-3.5'/>
                        <div className='flex-1 flex flex-col space-y-5 '>
                            <div className='flex flex-col space-y-2.5'>
                                <Label htmlFor='company_id' className='font-semibold tracking-wide'>Company ID</Label>
                                <Input disabled={processing}  required onChange={handleChange} value={data.company_id} id='company_id' />
                                {errors.company_id&&<p className='text-xs text-destructive'>{errors.company_id}</p>}
                            </div>
                            <div className='flex flex-col space-y-2.5'>
                                <Label htmlFor='email' className='font-semibold tracking-wide'>Email</Label>
                                <Input disabled={processing}  required onChange={handleChange} value={data.email} id='email' />
                                {errors.email&&<p className='text-xs text-destructive'>{errors.email}</p>}
                            </div>
                            <div className='flex flex-col space-y-2.5'>
                                <Label htmlFor='first_name' className='font-semibold tracking-wide'>First Name</Label>
                                <Input disabled={processing}  required onChange={handleChange} value={data.first_name} id='first_name' />
                                {errors.first_name&&<p className='text-xs text-destructive'>{errors.first_name}</p>}
                            </div>
                            <div className='flex flex-col space-y-2.5'>
                                <Label htmlFor='last_name' className='font-semibold tracking-wide'>Last Name</Label>
                                <Input disabled={processing}  required onChange={handleChange} value={data.last_name} id='last_name' />
                                {errors.last_name&&<p className='text-xs text-destructive'>{errors.last_name}</p>}
                            </div>
                        </div>
                        <Button  disabled={processing} type='submit' className='ml-auto font-bold  my-3.5' size='sm'>Submit</Button>
                    </div>
                </form>
            );
        }
        if(panel==='PASSWORD'){
            return (
                <form onSubmit={handleSubmit}>
                    <div className='flex flex-col'>
                        <h3 className='font-bold text-3xl'>Change Password</h3>
                        <Separator className='my-3.5'/>
                        <div className='flex-1 flex flex-col space-y-5 '>
                            <div className='flex flex-col space-y-2.5'>
                                <Label htmlFor='current_password' className='font-semibold tracking-wide'>Old Password</Label>
                                <Input disabled={processingPw} required type='password' onChange={handlePwChange} value={pwData.current_password} id='current_password' />
                                {pwErrors.current_password&&<p className='text-xs text-destructive'>{pwErrors.current_password}</p>}
                            </div>
                            <div className='flex flex-col space-y-2.5'>
                                <Label htmlFor='password' className='font-semibold tracking-wide'>New Password</Label>
                                <Input disabled={processingPw} required type='password' onChange={handlePwChange} value={pwData.password} id='password' />
                                {pwErrors.password&&<p className='text-xs text-destructive'>{pwErrors.password}</p>}
                            </div>
                            <div className='flex flex-col space-y-2.5'>
                                <Label htmlFor='password_confirmation' className='font-semibold tracking-wide'>Confirm New Password</Label>
                                <Input disabled={processingPw} required type='password' onChange={handlePwChange} value={pwData.password_confirmation} id='password_confirmation' />
                                {pwErrors.password_confirmation&&<p className='text-xs text-destructive'>{pwErrors.password_confirmation}</p>}
                            </div>
                        </div>
                        <Button disabled={processingPw} type='submit' className='ml-auto font-bold  my-3.5' size='sm'>Submit</Button>
                    </div>
                </form>
            );
        }
    },[panel,data,pwData,processing,processingPw]);

    const profileSidebarItems:ProfileSidebarItems[]=useMemo(()=>[
        {
            onClick:()=>setPanel('PROFILE'),
            Icon:BiSolidUserCircle,
            label:'Profile',
            variant:panel==='PROFILE'?'secondary':'outline'
        },
        {
            onClick:()=>setPanel('PASSWORD'),
            Icon:PiPasswordFill,
            label:'Password',
            variant:panel==='PASSWORD'?'secondary':'outline'
        },
        {
            onClick:()=>router.post(route('logout')),
            Icon:RiLogoutBoxRLine,
            label:'Log Out'
        }
    ],[panel]);
    
    return (
        <>
            <Head title='Profile' />
            <div className="flex flex-col h-screen">
                <NavBar availableTeamLeaders={available_team_leaders} teams={teams} />
                <div className="flex-1 space-y-4 p-8 pt-6 h-full">
                    <div className="flex flex-col  space-y-3.5">
                        <div>
                            <h2 className="text-3xl font-bold tracking-tight">Profile</h2>
                            <p className='text-muted-foreground'>Manage your Account</p>
                        </div>
                        <Separator />
                        <div className='flex space-x-5 '>
                            <div className='h-full flex flex-col space-y-3.5 w-auto sm:w-52'>
                                {
                                    profileSidebarItems.map(({onClick,Icon,label,variant})=>(
                                        <Fragment key={label}>
                                            <Button disabled={processing||processingPw} onClick={onClick} variant={variant||'outline'} className='hidden sm:flex space-x-1.5 items-center  text-base justify-start'  >
                                                <Icon size={24} />
                                                <span>{label}</span>
                                            </Button>
                                            <Button disabled={processing||processingPw} onClick={onClick} variant={variant||'outline'} size='icon' className='flex sm:hidden'  >
                                                <Icon size={24} />
                                            </Button>
                                        </Fragment>
                                    ))
                                }
                            </div>
                            <div className='w-full sm:w-96'>
                                {panelContent}
                            </div>
                        </div>
                        
                    </div>
                </div>
            </div>
        </>
    )
}

export default Profile