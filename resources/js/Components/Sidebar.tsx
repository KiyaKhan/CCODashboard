import { FC,RefAttributes,forwardRef } from 'react'
import AppLogo from './AppLogo';
import NavRoutes from '@/Libs/NavRoutes';
import { twMerge } from 'tailwind-merge';

interface SidebarProps extends RefAttributes<HTMLDivElement>{
    setShowNav:(show:boolean)=>void;
}

const Sidebar:FC<SidebarProps> = forwardRef(({setShowNav},ref) => {
    return (
        <aside ref={ref} className='fixed w-56 h-full bg-white shadow-sm shadow:neutral-700'>
            <div className='flex justify-center items-center mt-5 mb-12'>
                <AppLogo />
            </div>
            <div className='flex flex-col space-y-2.5'>
                {
                    NavRoutes.map(({active,href,label,icon:Icon})=>(
                        <div 
                            key={label}
                            className={twMerge('pl-5 py-2.5 mx-4 rounded text-center flex items-center space-x-1.5 transition-colors',
                                active?'bg-orange-100 text-orange-500':'text-neutral-600 hover:bg-orange-100 hover:text-orange-500'
                            )}>
                            <Icon className='w-5 h-5' />
                            <span>{label}</span>
                        </div>
                    ))
                }
            </div>
        </aside>
    )
});



export default Sidebar