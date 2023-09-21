import { IProject, ITeam, PageProps } from '@/types'
import React, { FC, FormEventHandler, ReactNode, useCallback, useEffect, useState } from 'react'
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from '../ui/dialog'
import useSelectedTeam from '@/Hooks/useSelectedTeam'
import { Button } from '../ui/button';
import { Label } from '../ui/label';
import { Input } from '../ui/input';
import { Select, SelectContent, SelectGroup, SelectItem, SelectLabel, SelectTrigger, SelectValue } from '../ui/select';
import { router, useForm, usePage } from '@inertiajs/react';
import { toast } from 'react-toastify';
import { AiOutlineLoading3Quarters } from 'react-icons/ai';
import axios from 'axios';
import useGetAgents from '@/Hooks/useGetAgents';
import { GrReactjs } from 'react-icons/gr';
import ReactLoader from '../ReactLoader';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '../ui/tooltip';
import useEditAgentDialog from '@/Hooks/useNewEditDialog';

type Agent={
    id:string;
    company_id:string;
    first_name:string;
    last_name:string;
    site:string;
    team_id:string;
    project_id:string;
    shift_start:string;
    shift_end:string;
}


const EditAgentDialog:FC = () => {
    const {showEditAgentDialog,setShowEditAgentDialog,agent} = useEditAgentDialog();
    
    const [teams,setTeams] = useState<ITeam[]>();
    const {user} = usePage<PageProps>().props.auth;
    const [projects,setProjects] = useState<IProject[]>();
    const [loadingTeams,setLoadingTeams] = useState<boolean>(true);
    const {selectedTeam} = useSelectedTeam();
    const {getAgents,isAgentsTabOpen,previousFilters,previousStatusId} = useGetAgents();
    
    const initialData:Agent={
        id:"",
        company_id:"",
        first_name:"",
        last_name:"",
        site:"",
        team_id:"",
        project_id:"",
        shift_start:"",
        shift_end:"",
    }
    const { data, setData, post, processing, errors } = useForm<Agent>(initialData);

    const reset = () => setData(initialData);

    const onSubmit:FormEventHandler<HTMLFormElement> = useCallback((e) =>{
        e.preventDefault();
        post(route('agents.update'),{
            preserveState:true,
            onSuccess:()=>{
                setShowEditAgentDialog(false);
                toast.success('Agent Updated...');
                reset();
                if(isAgentsTabOpen && selectedTeam)getAgents(selectedTeam.id,previousFilters,previousStatusId);
            }
        });
    },[data,post]);

    useEffect(()=>{
        if(!showEditAgentDialog) return;
        if(!agent) return;
        setData({
            id:agent.id.toString(),
            company_id:agent.company_id,
            first_name:agent.first_name,
            last_name:agent.last_name,
            site:agent.site,
            team_id:agent.team_id.toString(),
            project_id:agent.project_id.toString(),
            shift_start:agent.shift_start.slice(0,-3),
            shift_end:agent.shift_end.slice(0,-3)
        });
        
        setLoadingTeams(true);
        axios.get(route('api.teams_and_projects'))
        .then(({data}:{data:{teams:ITeam[],projects:IProject[]}})=>{
            setTeams(user.user_level.toString()==='1'?data.teams:data.teams.filter(team=>team.user_id===user.id));
            setProjects(data.projects);
        })
        .catch(e=>toast.error('Internal Error. Please refresh the page'))
        .finally(()=>setLoadingTeams(false));
        
    },[showEditAgentDialog]);
    useEffect(()=>{
        if(errors.company_id)toast.error(errors.company_id);
        if(errors.first_name)toast.error(errors.first_name);
        if(errors.last_name)toast.error(errors.last_name);
        if(errors.site)toast.error(errors.site);
        if(errors.team_id)toast.error(errors.team_id);
        if(errors.project_id)toast.error(errors.project_id);
        if(errors.shift_start)toast.error(errors.shift_start);
        if(errors.shift_end)toast.error(errors.shift_end);
    },[errors]);

    
    
    return (
        <Dialog open={showEditAgentDialog} onOpenChange={setShowEditAgentDialog}>
            <DialogContent className='max-w-sm min-w-[24rem]'>
                    <DialogHeader>
                        <DialogTitle>Edit Agent</DialogTitle>
                        <DialogDescription>{agent?.first_name}&nbsp;{agent?.last_name}</DialogDescription>
                    </DialogHeader>
                    {(data.id!=="")&&(
                        <form onSubmit={onSubmit} id='new_agent_form'>
                            <div className='flex flex-col space-y-3.5 relative'>
                                {(loadingTeams)&&
                                    <ReactLoader />
                                }
                                
                                <div className='flex space-x-2.5 items-center justify-between'>
                                    <div className='flex flex-col space-y-1.5 flex-1'>
                                        <Label htmlFor='team' className='text-sm' >Team:</Label>
                                        <Select disabled={processing} value={data.team_id} onValueChange={val=>setData('team_id',val.toString())} required >
                                            <SelectTrigger >
                                                <SelectValue placeholder="Select Team..." />
                                            </SelectTrigger>
                                            <SelectContent>
                                                <SelectGroup>
                                                    {
                                                        (teams||[]).map(team=><SelectItem key={team.id} value={team.id.toString()}>{team.name}</SelectItem>)
                                                    }
                                                </SelectGroup>
                                            </SelectContent>
                                        </Select>
                                    </div>
                                    <div className='flex flex-col space-y-1.5 flex-1'>
                                        <Label htmlFor='first_name' className='text-sm' >Site:</Label>
                                        <Select disabled={processing} value={data.site} onValueChange={val=>setData('site',val)} required >
                                            <SelectTrigger >
                                                <SelectValue placeholder="Select Site..." />
                                            </SelectTrigger>
                                            <SelectContent>
                                                <SelectGroup>
                                                    <SelectItem value="Manila">Manila</SelectItem>
                                                    <SelectItem value="Leyte">Leyte</SelectItem>
                                                </SelectGroup>
                                            </SelectContent>
                                        </Select>
                                    </div>
                                </div>
                                <div className='flex flex-col space-y-1.5 '>
                                    <Label htmlFor='team' className='text-sm' >Project:</Label>
                                    <Select disabled={processing} value={data.project_id} onValueChange={val=>setData('project_id',val.toString())} required >
                                        <SelectTrigger >
                                            <SelectValue placeholder="Select Project..." />
                                        </SelectTrigger>
                                        <SelectContent>
                                            <SelectGroup>
                                                {
                                                    (projects||[]).map(project=><SelectItem key={project.id} value={project.id.toString()}>{project.name}</SelectItem>)
                                                }
                                            </SelectGroup>
                                        </SelectContent>
                                    </Select>
                                </div>
                                <div className='flex flex-col space-y-1.5 '>
                                    <Label htmlFor='first_name' className='text-sm' >First Name:</Label>
                                    <Input autoComplete='off' disabled={processing} id="first_name" value={data.first_name} onChange={({target})=>setData('first_name',target.value)} required/>
                                </div>

                                <div className='flex flex-col space-y-1.5 '>
                                    <Label htmlFor='last_name' className='text-sm' >Last Name:</Label>
                                    <Input autoComplete='off' disabled={processing} id="last_name" value={data.last_name} onChange={({target})=>setData('last_name',target.value)} required/>
                                </div>

                                <div className='flex flex-col space-y-1.5 '>
                                    <Label htmlFor='company_id' className='text-sm' >Company ID:</Label>
                                    <Input  autoComplete='off' disabled id="company_id" value={data.company_id} onChange={({target})=>setData('company_id',target.value)} required/>
                                </div>

                                <div className='flex space-x-2.5 items-center justify-between'>
                                    <div className='flex flex-col space-y-1.5 flex-1'>
                                        <Label htmlFor='shift_start' className='text-sm' >Shift Start:</Label>
                                        <ShiftStartEndTooltip label='24Hr. Format PH Time (ex. 23:00)'>
                                            <Input autoComplete='off' disabled={processing} id="shift_start" value={data.shift_start} onChange={({target})=>setData('shift_start',target.value)} required/>
                                        </ShiftStartEndTooltip>
                                    </div>
                                    <div className='flex flex-col space-y-1.5 flex-1'>
                                        <Label htmlFor='shift_end' className='text-sm' >Shift End:</Label>
                                        <ShiftStartEndTooltip label='24Hr. Format PH Time (ex. 23:00)'>
                                            <Input autoComplete='off' disabled={processing} id="shift_end" value={data.shift_end} onChange={({target})=>setData('shift_end',target.value)} required/>
                                        </ShiftStartEndTooltip>
                                    </div>
                                </div>
                            </div>
                        </form>
                    )}
                    
                    <DialogFooter>
                        <Button disabled={processing} form='new_agent_form' type="submit" className='flex space-x-1.5 items-center'>
                            <span className='font-semibold'>Continue...</span>
                            {processing&&<AiOutlineLoading3Quarters size={20} className='animate-spin' />}
                        </Button>
                    </DialogFooter>
            </DialogContent>
        </Dialog>
    )
}

export default EditAgentDialog


const ShiftStartEndTooltip:FC<{
    label:string;
    children:ReactNode;
}> = ({label,children}) => {
    return(
    <TooltipProvider delayDuration={250}>
        <Tooltip>
            <TooltipTrigger asChild>
                {children}
            </TooltipTrigger>
            <TooltipContent>
                <p>{label}</p>
            </TooltipContent>
        </Tooltip>
    </TooltipProvider>);
}