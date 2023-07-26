import { Button } from '@/Components/ui/button';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/Components/ui/tooltip';
import useShowActivityEditDialog from '@/Hooks/useShowActivityEditDialog';
import React, { FC, useState } from 'react'
import { LuEdit } from 'react-icons/lu';
import { MdDeleteForever } from 'react-icons/md';

interface ActivityCellActionsProps{
    user_id:string;
    agent_log_id:string;
}

const ActivityCellActions:FC<ActivityCellActionsProps> = ({user_id,agent_log_id}) => {
    const {setShowActivityEditDialog,ShowActivityEditDialog} = useShowActivityEditDialog();
    return (
        <div className='flex flex-row items-center justify-end space-x-2.5'>
            {/* {`user_id: ${user_id} agent_log_id:${agent_log_id}`} */}
            <TooltipProvider delayDuration={250}>
                <Tooltip>
                    <TooltipTrigger asChild>
                        <Button onClick={()=>setShowActivityEditDialog(true)} variant='outline' size='icon'>
                            <LuEdit size={18} />
                        </Button>
                    </TooltipTrigger>
                    <TooltipContent>
                        <p>Edit</p>
                    </TooltipContent>
                </Tooltip>
            </TooltipProvider>

            <TooltipProvider delayDuration={250}>
                <Tooltip>
                    <TooltipTrigger asChild>
                        <Button variant='destructive' size='icon'>
                            <MdDeleteForever size={24} />
                        </Button>
                    </TooltipTrigger>
                    <TooltipContent>
                        <p>Delete</p>
                    </TooltipContent>
                </Tooltip>
            </TooltipProvider>
        </div>
    )
}

export default ActivityCellActions

