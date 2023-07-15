import { Button } from '@/Components/ui/button'
import React, { FC } from 'react'

const AgentCellActions:FC = () => {
    return (
        <div className='flex items-center space-x-3.5'>
            <Button size='sm' variant='outline'>Status Log</Button>
            <Button size='sm' variant='destructive'>Delete</Button>
        </div>
    )
}

export default AgentCellActions