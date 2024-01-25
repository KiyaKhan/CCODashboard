import TrackerModal from '@/Components/Modals/TrackerModal'
import TrackerHeader from '@/Components/TrackerComponents/TrackerHeader'
import React, { FC, ReactNode } from 'react'


interface Props{
    children:ReactNode
}

const TrackerLayout:FC<Props> = ({children}) => {
    return (
        <>
            <div className='h-screen w-full relative pt-14 '>
                <TrackerHeader />
                {children}
            </div>
            <TrackerModal />
        </>
    )
}

export default TrackerLayout