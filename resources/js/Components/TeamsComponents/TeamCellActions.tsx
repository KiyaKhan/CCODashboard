import { User } from '@/types'
import React, { FC, FormEventHandler, MouseEventHandler, useCallback, useEffect, useMemo, useState } from 'react'
import { Button } from '../ui/button';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from '../ui/dialog';
import { Label } from '../ui/label';
import { Input } from '../ui/input';
import { useForm } from '@inertiajs/react';
import { toast } from 'react-toastify';
import { Popover, PopoverContent, PopoverTrigger } from '../ui/popover';
import { RiExpandUpDownFill } from 'react-icons/ri';
import { Command, CommandEmpty, CommandGroup, CommandInput, CommandItem } from '../ui/command';
import { BsCheckLg } from 'react-icons/bs';
import { cn } from '@/Libs/Utils';

interface TeamCellActions{
    members:User[];
    leader:User;
    team_id:number;
    name:string;
}

const TeamCellActions:FC<TeamCellActions> = ({members,leader,team_id,name}) => {
    const [showRenameDialog,setShowRenameDialog] =useState(false);
    const [showChangeTLDialog,setShowChangeTLDialog] =useState(false);
    return (
        <>
            <div className='flex flex-row justify-end items-center space-x-1.5'>
                <Button onClick={()=>setShowRenameDialog(true)}  className='font-bold tracking' variant='secondary' size='sm'>Rename</Button>
                <Button onClick={()=>setShowChangeTLDialog(true)} className='font-bold tracking' variant='outline' size='sm'>Assign new TL</Button>
            </div>
            <RenameDialog key={0} team_id={team_id} onClose={()=>setShowRenameDialog(false)} open={showRenameDialog} originalName={name}  />
            <ChangeLeaderDialog key={1} team_id={team_id} onClose={()=>setShowChangeTLDialog(false)} show={showChangeTLDialog} currentTL={leader} members={members} />
        </>
    )
}

export default TeamCellActions

interface RenameDialogProps{
    originalName:string;
    open?:boolean;
    onClose:()=>void;
    team_id:number;
}

const RenameDialog:FC<RenameDialogProps> = ({originalName,open,onClose,team_id}) =>{
    const { data, setData, post, processing, errors } = useForm<{name:string,team_id:number}>({name:originalName,team_id:team_id})

    const handleUpdate:FormEventHandler<HTMLFormElement> = (e)=>{
        e.preventDefault();
        post(route('teams.update'),{
            onSuccess:()=>{
                toast.success('Team Renamed!');
                onClose();
            }
        });
    }

    useEffect(()=>{
        if(open){
            setData(val=>({...val,name:originalName}));
        }
    },[open]);

    return(
        <Dialog open={open} onOpenChange={onClose}>
            <DialogContent>
                <form onSubmit={handleUpdate} >
                    <DialogHeader>
                        <DialogTitle>Rename</DialogTitle>
                        <DialogDescription>
                            Rename this Team...
                        </DialogDescription>
                    </DialogHeader>
                    <div className="grid gap-4 py-4">
                        <div className="grid grid-cols-4 items-center gap-4">
                            <Label htmlFor="name" className="text-right">
                                Name
                            </Label>
                            <Input required autoComplete='off' disabled={processing} id="name" value={data.name} onChange={({target})=>setData(val=>({...val,name:target.value}))} className="col-span-3" />
                        </div>
                    </div>
                    <DialogFooter>
                        <Button disabled={processing} className='font-semibold' size='sm' variant='secondary' onClick={onClose}>Cancel</Button>
                        <Button disabled={processing} className='font-semibold' size='sm' type="submit">Rename</Button>
                    </DialogFooter>
                    
                </form>
            </DialogContent>
        </Dialog>
    );
}

interface ChangeLeaderDialogProps{
    members:User[];
    currentTL:User;
    show?:boolean;
    onClose:()=>void;
    team_id:number;
}

const ChangeLeaderDialog:FC<ChangeLeaderDialogProps> = ({members,currentTL,show,onClose,team_id}) =>{
    type MembersData = {
        id:string;
        name:string;
    }
    const [open,setOpen] = useState(false);
    const { data, setData, post, processing, errors } = useForm<{TL:MembersData,team_id:number}>({team_id:team_id,TL:{id:currentTL.id.toString(),name:`${currentTL.first_name} ${currentTL.last_name}, ${currentTL.company_id}`}})

    const membersData:MembersData[] = useMemo(()=>members.map(({id,first_name,last_name,company_id})=>({id:id.toString(),name:`${first_name} ${last_name}, ${company_id}`})),[members]);

    const handleUpdate:MouseEventHandler<HTMLButtonElement> = ()=>{
        post(route('teams.update'),{
            onSuccess:()=>{
                toast.success('Team Leader Changed!');
                onClose();
            }
        });
    }

    useEffect(()=>{
        if(open){
            setData('TL',({id:currentTL.id.toString(),name:`${currentTL.first_name} ${currentTL.last_name}, ${currentTL.company_id}`}));
        }
    },[open]);
    

    return(
        <Dialog open={show} onOpenChange={onClose}>
            <DialogContent>
                <DialogHeader>
                    <DialogTitle>Assign a new Team Leader</DialogTitle>
                    <DialogDescription>
                        Current Team Leader: {`${currentTL.first_name} ${currentTL.last_name}, ${currentTL.company_id}`}
                    </DialogDescription>
                </DialogHeader>
                <Popover open={open} onOpenChange={setOpen}>
                    <PopoverTrigger asChild>
                        <Button
                        disabled={processing}
                        variant="outline"
                        role="combobox"
                        aria-expanded={open}
                        className="w-[200px] justify-between"
                        >
                        {data.TL
                            ? membersData.find((member) => member.name === data.TL.name)?.name
                            : "Select framework..."}
                        <RiExpandUpDownFill className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                        </Button>
                    </PopoverTrigger>
                    <PopoverContent className="w-full max-h-[16rem] overflow-y-auto p-0">
                        <Command>
                            <CommandInput placeholder="Search agent..." />
                            <CommandEmpty>No agent found.</CommandEmpty>
                            <CommandGroup>
                                {membersData.map((member) => (
                                    <CommandItem
                                        key={member.id}
                                        onSelect={(val) => {
                                        setData('TL',val === member.id ? {id:"",name:""} : member)
                                        setOpen(false)
                                        }}>
                                        <BsCheckLg
                                            className={cn(
                                                "mr-2 h-4 w-4",
                                                data.TL.id === member.id ? "opacity-100" : "opacity-0"
                                                )}/>
                                        {member.name}
                                    </CommandItem>
                                ))}
                            </CommandGroup>
                        </Command>
                    </PopoverContent>
                </Popover>
                <DialogFooter>
                    <Button disabled={processing} className='font-semibold' size='sm' variant='secondary' onClick={onClose}>Cancel</Button>
                    <Button onClick={handleUpdate} disabled={processing} className='font-semibold' size='sm' type="button">Confirm</Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    );
}