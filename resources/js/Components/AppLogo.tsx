import React, { FC, HTMLAttributes, RefAttributes, forwardRef } from 'react'
import { twMerge } from 'tailwind-merge';

const AppLogo:FC<HTMLAttributes<HTMLImageElement>> = forwardRef(({className,...props},ref) => {
    return (
        <img {...props}
            className={twMerge('w-32 h-auto',className)}
            src={`${route('index')}/logo/logo.png`} alt="D" />
    )
})

export default AppLogo