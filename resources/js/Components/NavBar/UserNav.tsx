import { PageProps } from '@/types';
import { router, usePage } from '@inertiajs/react';
import React, { FC } from 'react'
import { DropdownMenu, DropdownMenuContent, DropdownMenuGroup, DropdownMenuItem, DropdownMenuLabel, DropdownMenuShortcut, DropdownMenuTrigger } from '../ui/dropdown-menu';
import { Button } from '../ui/button';
import AvatarContainer from '../AvatarContainer';
import { DropdownMenuSeparator } from '@radix-ui/react-dropdown-menu';
import useNewTeamDialog from '@/Hooks/useNewTeamDialog';
import { Dialog, DialogTrigger } from '../ui/dialog';
import { BsPlusCircle } from 'react-icons/bs';
import NewAgentDialog from '../Dialogs/NewAgentDialog';
import useNewAgentDialog from '@/Hooks/useNewAgentDialog';
import useToggleDark from '@/Hooks/useToggleDark';
import useNewAdminDialog from '@/Hooks/useNewAdminDialog';



const UserNav:FC = () => {
    const {user} = usePage<PageProps>().props.auth;
    const {setShowNewTeamDialog} = useNewTeamDialog();
    const {setShowNewAgentDialog} = useNewAgentDialog();
    const {toggleTheme} = useToggleDark();
    
    const {setShowNewAdminDialog} = useNewAdminDialog();
    return (
        <DropdownMenu>
            <DropdownMenuTrigger asChild>
                <Button variant="ghost" className="relative h-8 w-8 rounded-full">
                <AvatarContainer user={user} className="h-8 w-8"/>
                </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent className="w-56" align="end" forceMount>
                <DropdownMenuLabel className="font-normal">
                <div className="flex flex-col space-y-1">
                    <p className="text-sm font-medium leading-none">{user.first_name}</p>
                    <p className="text-xs leading-none text-muted-foreground">
                    {user.email}
                    </p>
                </div>
                </DropdownMenuLabel>
                <DropdownMenuSeparator />
                <DropdownMenuGroup>
                    <DropdownMenuItem onClick={()=>router.get(route('profile.index'))}>
                        Profile
                    </DropdownMenuItem>
                    {/* <DropdownMenuItem>
                        Settings
                    </DropdownMenuItem> */}
                    {user.user_level.toString()==='1'&&<DropdownMenuItem onClick={()=>setShowNewTeamDialog(true)}>New Team</DropdownMenuItem>}
                    <DropdownMenuItem onClick={()=>setShowNewAgentDialog(true)}>
                        Add New Agent
                    </DropdownMenuItem>
                    <DropdownMenuItem onClick={toggleTheme}>
                        Toggle Dark Mode
                    </DropdownMenuItem>
                </DropdownMenuGroup>
                <DropdownMenuSeparator />
                    {
                        user.user_level.toString()==='1'&&(
                            <DropdownMenuItem onClick={()=>setShowNewAdminDialog(true)}>
                                Add New Admin Account
                            </DropdownMenuItem>
                        )
                    }<DropdownMenuSeparator />
                <DropdownMenuItem onClick={()=>router.post(route('logout'))}>
                    Log out
                </DropdownMenuItem>
            </DropdownMenuContent>
        </DropdownMenu>
    )
}

export default UserNav