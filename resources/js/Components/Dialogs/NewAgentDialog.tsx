import { ITeam } from '@/types'
import React, { FC, FormEventHandler } from 'react'
import { DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from '../ui/dialog'
import useSelectedTeam from '@/Hooks/useSelectedTeam'
import { Button } from '../ui/button';
import { Label } from '../ui/label';
import { Input } from '../ui/input';



const NewAgentDialog:FC = () => {
    const {selectedTeam} = useSelectedTeam();
    if(!selectedTeam)return null;

    const onSubmit:FormEventHandler<HTMLFormElement> = (e) =>{
        e.preventDefault();
        console.log('test');
    }

    return (
        
            <DialogContent>
                    <DialogHeader>
                        <DialogTitle>New Agent</DialogTitle>
                        <DialogDescription>Add New Agent to this Team</DialogDescription>
                    </DialogHeader>
                    <div className='flex flex-col space-y-2.5'>
                        <div className='flex flex-col space-y-1.5 '>
                            <Label htmlFor='first_name' className='text-sm' >First Name:</Label>
                            <Input id="first_name" />
                        </div>

                        <div className='flex flex-col space-y-1.5 '>
                            <Label htmlFor='last_name' className='text-sm' >Last Name:</Label>
                            <Input id="last_name" />
                        </div>

                        <div className='flex flex-col space-y-1.5 '>
                            <Label htmlFor='company_id' className='text-sm' >Company ID:</Label>
                            <Input id="company_id" />
                        </div>
                    </div>
                    <DialogFooter>
                        <Button type="button">Continue...</Button>
                    </DialogFooter>
            </DialogContent>
    )
}

export default NewAgentDialog