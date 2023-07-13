import { ITeam, PageProps, User } from '@/types'
import React, { FC, useState } from 'react'
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from '../ui/dialog';
import { Button } from '../ui/button';
import { Popover, PopoverContent, PopoverTrigger } from '../ui/popover';
import { cn } from '@/Libs/Utils';
import { Label } from '../ui/label';
import { Input } from '../ui/input';
import AvatarContainer from '../AvatarContainer';
import {RxCaretSort} from 'react-icons/rx'
import { Command, CommandEmpty, CommandGroup, CommandInput, CommandItem, CommandList, CommandSeparator } from '../ui/command';
import { usePage } from '@inertiajs/react';
import { BsCheck,BsPlusCircle } from 'react-icons/bs';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../ui/select';

interface TeamSwitcherProps{
    teams:ITeam[];
    className?:string;
    availableTeamLeaders:User[];
}

const TeamSwitcher:FC<TeamSwitcherProps> = ({teams,className,availableTeamLeaders}) => {
    const {user} = usePage<PageProps>().props.auth;
    const [open, setOpen] = useState(false);
    const [showNewTeamDialog, setShowNewTeamDialog] = useState(false);
    const [selectedTeam, setSelectedTeam] = useState<ITeam>(teams[0]);
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
                    {selectedTeam.name}
                    <RxCaretSort className="ml-auto h-4 w-4 shrink-0 opacity-50" />
                </Button>
                </PopoverTrigger>
                <PopoverContent className="w-[200px] p-0">
                <Command>
                    <CommandList>
                    <CommandInput placeholder="Search team..." />
                    <CommandEmpty>No team found.</CommandEmpty>
                    
                        <CommandGroup heading='CCO Teams'>
                            {teams.map(team => (
                                <CommandItem
                                key={team.id}
                                onSelect={() => {
                                    setSelectedTeam(team)
                                    setOpen(false)
                                }}
                                className="text-sm"
                                >
                                <AvatarContainer user={team.user} />
                                {team.name}
                                <BsCheck
                                    className={cn(
                                    "ml-auto h-4 w-4",
                                    selectedTeam.id === team.id
                                        ? "opacity-100"
                                        : "opacity-0"
                                    )}
                                />
                                </CommandItem>
                            ))}
                        </CommandGroup>
                    
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
            
            <DialogContent>
                <DialogHeader>
                <DialogTitle>Create team</DialogTitle>
                <DialogDescription>
                    Add a new team to manage CCO Agents.
                </DialogDescription>
                </DialogHeader>
                <div>
                <div className="space-y-4 py-2 pb-4">
                    <div className="space-y-2">
                        <Label htmlFor="name">Team name</Label>
                        <Input id="name" placeholder="Name Of Team..." />
                    </div>
                    <div className="space-y-2">
                    <Label htmlFor="plan">Team Leader</Label>
                    <Select>
                        <SelectTrigger>
                            <SelectValue placeholder="Select Team Leader" />
                        </SelectTrigger>
                        <SelectContent>
                            {
                                availableTeamLeaders.map(leader=>(
                                    <SelectItem key={leader.id} value={leader.id.toString()}>
                                        <span className="font-medium">{`${leader.first_name} ${leader.last_name}`}</span>
                                    </SelectItem>
                                ))
                            }
                            {
                                availableTeamLeaders.length<1&&(
                                    <SelectItem value="" disabled>
                                        <span className="font-medium text-muted">No Available Team Leaders...</span>
                                    </SelectItem>
                                )
                            }
                            
                        </SelectContent>
                    </Select>
                    
                    
                    </div>
                </div>
                </div>
                <DialogFooter>
                    <Button variant="outline" onClick={() => setShowNewTeamDialog(false)}>
                        Cancel
                    </Button>
                    <Button type="submit">Continue</Button>
                    </DialogFooter>
            </DialogContent>
        </Dialog>
    )
}

export default TeamSwitcher

