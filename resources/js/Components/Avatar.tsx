import React, { FC, HTMLAttributes, forwardRef } from 'react'
import { twMerge } from 'tailwind-merge';

const Avatar:FC<HTMLAttributes<HTMLImageElement>> = forwardRef(({className,...props},ref) => {
    return (
        <img className={twMerge('rounded-full h-8 w-8 md:mr-3.5 border-2 border-white shadow-sm shadow-neutral-400',className)} src={`${route('public_path')}/placeholder/placeholder.jpg`} alt='A' />
    )
})

export default Avatar