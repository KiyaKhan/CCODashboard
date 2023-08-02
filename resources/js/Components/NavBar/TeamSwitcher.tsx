import { ITeam, PageProps, User } from '@/types'
import React, { FC, FormEventHandler, useCallback, useEffect, useMemo, useState } from 'react'
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from '../ui/dialog';
import { Button } from '../ui/button';
import { Popover, PopoverContent, PopoverTrigger } from '../ui/popover';
import { cn } from '@/Libs/Utils';
import { Label } from '../ui/label';
import { Input } from '../ui/input';
import AvatarContainer from '../AvatarContainer';
import {RxCaretSort} from 'react-icons/rx'
import { Command, CommandEmpty, CommandGroup, CommandInput, CommandItem, CommandList, CommandSeparator } from '../ui/command';
import { useForm, usePage } from '@inertiajs/react';
import { BsCheck,BsCheckLg,BsPlusCircle } from 'react-icons/bs';
import useSelectedTeam from '@/Hooks/useSelectedTeam';
import useNewTeamDialog from '@/Hooks/useNewTeamDialog';
import axios from 'axios';
import { RiExpandUpDownLine } from 'react-icons/ri';
import { toast } from 'react-toastify';
import { AiOutlineLoading3Quarters } from 'react-icons/ai';
import ReactLoader from '../ReactLoader';

interface TeamSwitcherProps{
    teams:ITeam[];
    className?:string;
    availableTeamLeaders:User[];
}

type AgentsData={
    id:number;
    name:string;
}

const TeamSwitcher:FC<TeamSwitcherProps> = ({teams,className,availableTeamLeaders}) => {

    const {user} = usePage<PageProps>().props.auth;
    const {projects} = usePage<PageProps>().props;
    const {selectTeam,selectedTeam} = useSelectedTeam();
    const [open, setOpen] = useState(false);
    const [showAgentsPopOver, setShowAgentsPopOver] = useState(false);
    const [loadingAgents, setLoadingAgents] = useState(true);
    const {showNewTeamDialog, setShowNewTeamDialog} = useNewTeamDialog();
    const [agents,setAgents] = useState<User[]>();
    const agentsData:AgentsData[]|undefined = useMemo(()=>agents?.map(agent=>({id:agent.id,name:`${agent.first_name} ${agent.last_name}`})),[agents]);
    const { data, setData, post, processing, errors } = useForm<{
        team_name:string;
        agent?:AgentsData;
    }>({
        team_name:"",
    })
    const onSubmit:FormEventHandler<HTMLFormElement> = useCallback((e) =>{
        e.preventDefault();
        if(!data.agent)return toast.error('Select Team Leader before proceeding...');
        post(route('teams.store'),{
            onSuccess:()=>{
                toast.success('Team Created');
                setShowNewTeamDialog(false);
            }
        });
    },[post,data]);

    

    useEffect(()=>{
        if(!showNewTeamDialog) return;
        setLoadingAgents(true);
        axios.get(route('agents.get_non_leaders'))
        .then(({data})=>setAgents(data))
        .catch(e=>'Something went wrong. Please refresh the page...')
        .finally(()=>setLoadingAgents(false));
    },[showNewTeamDialog]);
    

    return (
        <Dialog open={showNewTeamDialog} onOpenChange={setShowNewTeamDialog}>
            <Popover open={open} onOpenChange={setOpen}>
                <PopoverTrigger asChild>
                    <Button
                        variant="outline"
                        role="combobox"
                        aria-expanded={open}
                        aria-label="Select a team"
                        className={cn("w-[200px] justify-between", className)}
                    >
                        <AvatarContainer user={user}/>
                        {selectedTeam?.name}
                        <RxCaretSort className="ml-auto h-4 w-4 shrink-0 opacity-50" />
                    </Button>
                </PopoverTrigger>
                <PopoverContent className="w-[200px] p-0">
                    <Command>
                        <CommandList>
                            <CommandInput placeholder="Search team..." />
                            <CommandEmpty>No team found.</CommandEmpty>
                            {
                                projects.map(({id,name,teams})=>(
                                    <CommandGroup key={id} heading={name}>
                                        {teams.map(team => (
                                            <CommandItem
                                            key={team.id}
                                            onSelect={() => {
                                                selectTeam(team)
                                                setOpen(false)
                                            }}
                                            className="text-sm"
                                            >
                                            <AvatarContainer user={team.user} />
                                            {team.name}
                                            <BsCheck
                                                className={cn(
                                                "ml-auto h-4 w-4",
                                                selectedTeam?.id === team.id
                                                    ? "opacity-100"
                                                    : "opacity-0"
                                                )}
                                            />
                                            </CommandItem>
                                        ))}
                                    </CommandGroup>
                                ))
                            }
                        </CommandList>
                        <CommandSeparator />
                        <CommandList>
                            <CommandGroup>
                                <DialogTrigger asChild>
                                    <CommandItem
                                        onSelect={() => {
                                        setOpen(false)
                                        setShowNewTeamDialog(true)
                                        }}
                                        >
                                        <BsPlusCircle className="mr-2 h-5 w-5" />
                                        Create Team
                                    </CommandItem>
                                </DialogTrigger>
                            </CommandGroup>
                        </CommandList>
                    </Command>
                </PopoverContent>
            </Popover>
            
            <DialogContent className='max-w-sm'>
                <DialogHeader>
                    <DialogTitle>Create team</DialogTitle>
                    <DialogDescription>
                        Add a new team to manage CCO Agents.
                    </DialogDescription>
                </DialogHeader>
                <form onSubmit={onSubmit} id='team_form'>
                    <div className="space-y-4 py-2 pb-4 relative">
                        {loadingAgents&&
                            <ReactLoader />
                        }
                        <div className="space-y-2">
                            <Label htmlFor="name">Team name</Label>
                            <Input disabled={processing} autoComplete='off' required id="name" placeholder="Name Of Team..." value={data.team_name} onChange={({target})=>setData('team_name',target.value)} />
                        </div>
                        <div className="space-y-2">
                            <Label htmlFor="plan">Team Leader</Label>
                            <Popover open={showAgentsPopOver} onOpenChange={setShowAgentsPopOver} >
                                <PopoverTrigger asChild>
                                    <Button
                                        disabled={processing}
                                        variant="outline"
                                        role="combobox"
                                        className="justify-between w-full"
                                        >
                                        {data.agent
                                            ? (agentsData||[]).find((agent) => agent.name === data.agent?.name)?.name
                                            : "Select Agent..."}
                                        <RiExpandUpDownLine className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                                    </Button>
                                </PopoverTrigger>
                                <PopoverContent className="max-w-[21rem] min-w-[21rem] p-0 ">
                                    <Command className='px-2.5 '>
                                        <CommandInput className=' ' placeholder="Search Agent..." />
                                        <CommandEmpty>No Agent found.</CommandEmpty>
                                        <CommandGroup className='max-h-[11rem] overflow-y-scroll'>
                                            {(agentsData||[]).map((agent) => (
                                                <CommandItem
                                                
                                                    key={agent.id}
                                                    onSelect={() => {
                                                        setData('agent',agent)
                                                        setShowAgentsPopOver(false);
                                                    }}
                                                    >
                                                        <BsCheckLg
                                                        className={cn(
                                                            "mr-2 h-4 w-4",
                                                            data.agent?.name === agent.name ? "opacity-100" : "opacity-0"
                                                        )}
                                                        />
                                                        {agent.name}
                                                </CommandItem>
                                            ))}
                                        </CommandGroup>
                                    </Command>
                                </PopoverContent>
                            </Popover>
                        </div>
                    </div>
                </form>
            
                <DialogFooter>
                    <Button disabled={processing} variant="outline" onClick={() => setShowNewTeamDialog(false)}>
                        Cancel
                    </Button>
                    <Button disabled={processing} form='team_form' type="submit" className='flex space-x-1.5 items-center'>
                        <span className='font-semibold'>Continue...</span>
                        {processing&&<AiOutlineLoading3Quarters size={20} className='animate-spin' />}
                    </Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    )
}

export default TeamSwitcher

