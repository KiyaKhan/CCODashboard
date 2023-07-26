import { Button } from '@/Components/ui/button';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from '@/Components/ui/dialog'
import useShowActivityEditDialog from '@/Hooks/useShowActivityEditDialog'
import React, { FC } from 'react'



const ActivityEditDialog:FC = () => {
    const {setShowActivityEditDialog,ShowActivityEditDialog} = useShowActivityEditDialog();
    return (
        <Dialog open={ShowActivityEditDialog} onOpenChange={setShowActivityEditDialog}>
            <DialogContent>
                <DialogHeader>
                    <DialogTitle>Edit Status</DialogTitle>
                    <DialogDescription>
                        Edit Status for this agent.
                    </DialogDescription>
                </DialogHeader>
                <div className='p-2.5'>
                    
                </div>
                <DialogFooter>
                    <Button variant='secondary' className='font-semibold'>Cancel</Button>
                    <Button variant='outline' className='font-semibold'>Update</Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    )
}

export default ActivityEditDialog