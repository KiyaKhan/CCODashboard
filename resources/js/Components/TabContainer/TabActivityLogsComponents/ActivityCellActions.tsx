import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle } from '@/Components/ui/alert-dialog';
import { Button } from '@/Components/ui/button';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/Components/ui/tooltip';
import useActivityLogs from '@/Hooks/useActivityLogs';
import useShowActivityEditDialog from '@/Hooks/useShowActivityEditDialog';
import axios from 'axios';
import React, { FC, ReactNode, useCallback, useState } from 'react'
import { LuFileEdit } from 'react-icons/lu';
import { MdDeleteForever } from 'react-icons/md';
import { toast } from 'react-toastify';

interface ActivityCellActionsProps{
    user_id:string;
    agent_log_id:string;
    session_id:string;
}

const ActivityCellActions:FC<ActivityCellActionsProps> = ({user_id,agent_log_id,session_id}) => {
    const {setShowActivityEditDialog} = useShowActivityEditDialog();
    const [showConfirmation,setShowConfirmation] = useState(false);
    const {logs,setLogs} = useActivityLogs();
    const [deleting,setdDeleting] = useState(false);
    const handleEdit = useCallback(()=>{
        setShowActivityEditDialog(true,agent_log_id.toString());
    },[user_id,agent_log_id]);

    const handleDelete = useCallback(async()=>{
        if(!logs) return;
        setdDeleting(true);
        axios.post(route('agent_log.destroy'),{
            agent_log_id
        })
        .then(()=>{
            setLogs(logs.map(lg=>{
                const {logs:LOGS,...rest} = lg;
                const updatedLog=LOGS.filter(LG=>LG.id.toString()!==agent_log_id);
                return {
                    logs:updatedLog,
                    ...rest
                };
            }));
            setShowConfirmation(false);
            toast.success('Deleted...',{position:'top-center',delay:1000});
        })
        .catch(e=>toast.error('Internal Error. Please refresh the page'))
        .finally(()=>setdDeleting(false));
    },[agent_log_id,logs]);


    return (
        <>
            <div className='flex flex-row items-center justify-end space-x-2.5'>
                <ActivityCellActionTooltip label='Edit'>
                    <Button onClick={handleEdit} variant='outline' size='icon'>
                        <LuFileEdit size={18} />
                    </Button>
                </ActivityCellActionTooltip>


                <ActivityCellActionTooltip label='Delete'>
                    <Button onClick={()=>setShowConfirmation(true)} variant='destructive' size='icon'>
                        <MdDeleteForever size={24} />
                    </Button>
                </ActivityCellActionTooltip>
            </div>
            <AlertDialog open={showConfirmation} >
                <AlertDialogContent>
                    <AlertDialogHeader>
                    <AlertDialogTitle>Confirm Delete</AlertDialogTitle>
                    <AlertDialogDescription>
                        This may cause conflict. Are you sure?
                    </AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter>
                        <AlertDialogCancel disabled={deleting} onClick={()=>setShowConfirmation(false)}>Cancel</AlertDialogCancel>
                        <AlertDialogAction disabled={deleting} onClick={handleDelete}>Delete</AlertDialogAction>
                    </AlertDialogFooter>
                </AlertDialogContent>
            </AlertDialog>
        </>
    )
}

export default ActivityCellActions

interface ActivityCellActionTooltipProps{
    label:string;
    children:ReactNode;
}

const ActivityCellActionTooltip:FC<ActivityCellActionTooltipProps> = ({label,children}) => {
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




