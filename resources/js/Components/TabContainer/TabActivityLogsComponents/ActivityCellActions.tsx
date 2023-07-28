import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle } from '@/Components/ui/alert-dialog';
import { Button } from '@/Components/ui/button';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/Components/ui/tooltip';
import useShowActivityEditDialog from '@/Hooks/useShowActivityEditDialog';
import React, { FC, ReactNode, useCallback, useState } from 'react'
import { LuEdit } from 'react-icons/lu';
import { MdDeleteForever } from 'react-icons/md';

interface ActivityCellActionsProps{
    user_id:string;
    agent_log_id:string;
    session_id:string;
}

const ActivityCellActions:FC<ActivityCellActionsProps> = ({user_id,agent_log_id,session_id}) => {
    const {setShowActivityEditDialog} = useShowActivityEditDialog();
    const [showConfirmation,setShowConfirmation] = useState(false);

    const handleEdit = useCallback(()=>{
        setShowActivityEditDialog(true,agent_log_id.toString());
    },[user_id,agent_log_id]);


    return (
        <>
            <div className='flex flex-row items-center justify-end space-x-2.5'>
                <ActivityCellActionTooltip label='Edit'>
                    <Button onClick={handleEdit} variant='outline' size='icon'>
                        <LuEdit size={18} />
                    </Button>
                </ActivityCellActionTooltip>


                <ActivityCellActionTooltip label='Delete'>
                    <Button onClick={()=>setShowConfirmation(true)} variant='destructive' size='icon'>
                        <MdDeleteForever size={24} />
                    </Button>
                </ActivityCellActionTooltip>
            </div>
            <ActivityDeleteConfirmation open={showConfirmation} onClose={()=>setShowConfirmation(false)} onConfirm={()=>{}} />
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

interface ActivityDeleteConfirmation{
    open?:boolean;
    onConfirm:()=>void;
    onClose:()=>void;
}

const ActivityDeleteConfirmation:FC<ActivityDeleteConfirmation> = ({onClose,onConfirm,open}) =>{
    return(
        <AlertDialog open={open} >
            <AlertDialogContent>
                <AlertDialogHeader>
                <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
                <AlertDialogDescription>
                    This action cannot be undone. This will permanently delete your account
                    and remove your data from our servers.
                </AlertDialogDescription>
                </AlertDialogHeader>
                <AlertDialogFooter>
                    <AlertDialogCancel>Cancel</AlertDialogCancel>
                    <AlertDialogAction>Continue</AlertDialogAction>
                </AlertDialogFooter>
            </AlertDialogContent>
        </AlertDialog>
    );
}

