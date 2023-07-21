import React, { FC } from 'react'
import { GrReactjs } from 'react-icons/gr'

const ReactLoader:FC<{size?:number,label?:string}> = ({size=50,label}) => {
    return (
        <div className='flex items-center justify-center inset-0 absolute z-50 backdrop-blur-3xl'>
            <div className='flex flex-col items-center space-y-3.5'>
                <GrReactjs size={size} className='animate-spin' />
                {label&&<p className='text-2xl font-semibold tracking-wider'>{label}</p>}
            </div>
        </div>
    )
}

export default ReactLoader