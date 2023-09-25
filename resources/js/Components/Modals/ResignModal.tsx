import { useResignModal } from '@/Hooks/useResignModal'
import React, { FC, useCallback, useState } from 'react'
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '../ui/dialog';
import { Button } from '../ui/button';
import axios from 'axios';
import { toast } from 'react-toastify';
import useGetAgents from '@/Hooks/useGetAgents';
import useSelectedTeam from '@/Hooks/useSelectedTeam';

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
                    <DialogTitle>Are you sure absolutely sure?</DialogTitle>
                    <DialogDescription>
                        This action cannot be undone.
                    </DialogDescription>
                </DialogHeader>
                <div className='w-full flex justify-end items-center'>
                    <Button onClick={onConfirm} disabled={loading} variant='outline'  className='text-base items-center'>Confirm</Button>
                </div>
            </DialogContent>
        </Dialog>
    )
}

export default ResignModal