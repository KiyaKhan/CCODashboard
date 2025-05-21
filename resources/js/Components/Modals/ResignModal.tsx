import { useResignModal } from '@/Hooks/useResignModal'
import React, { FC, useCallback, useState } from 'react'
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '../ui/dialog';
import { Button } from '../ui/button';
import axios from 'axios';
import { toast } from 'react-toastify';
import useGetAgents from '@/Hooks/useGetAgents';
import useSelectedTeam from '@/Hooks/useSelectedTeam';
import { RiFolderWarningFill, RiFolderWarningLine } from 'react-icons/ri';
import { DialogClose } from '@radix-ui/react-dialog';

const ResignModal:FC = () => {
    const {isOpen,onClose,userId} = useResignModal();
    const [loading,setLoading] = useState(false);
    const {getAgents,previousFilters,previousStatusId} = useGetAgents();
    
    const {selectedTeam} = useSelectedTeam();
    const onConfirm = useCallback(()=>{
        if(!userId) return;
        if(!selectedTeam) return;
        setLoading(true);
        axios.post(route('agents.resigned'),{
            id:userId
        })
        .then(async()=>{
            await getAgents(selectedTeam.id,previousFilters,previousStatusId);
            toast.success(`Agent set to 'Resigned'`);
            onClose();
        })
        .catch(()=>toast.error('Something Went Wrong. Please try again'))
        .finally(()=>setLoading(false));
    },[userId,axios])

    if(!userId){
        return null;
    }
    return (
        <Dialog open={isOpen} onOpenChange={onClose}>
            <DialogContent>
                <DialogHeader>
                    <div>
                        <DialogHeader>
                            <DialogTitle className='flex items-center'> 
                                <RiFolderWarningFill className='mr-2' color='#fae207' size={30}/>
                                Are you absolutely sure ?
                            </DialogTitle>
                            <DialogDescription>
                                 Deleting a record from the system is a permanent action and cannot be undone.
                            </DialogDescription>
                        </DialogHeader>
                    </div>
                </DialogHeader>
                <div className='w-full flex justify-end items-center space-x-5'>
                    <DialogClose>
                        Cancel
                    </DialogClose>
                    <Button onClick={onConfirm} disabled={loading} variant='outline'  className='text-base items-center'>Confirm</Button>
                </div>
            </DialogContent>
        </Dialog>
    )
}

export default ResignModal