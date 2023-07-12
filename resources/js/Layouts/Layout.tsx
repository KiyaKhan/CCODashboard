import NavBar from '@/Components/NavBar';
import Sidebar from '@/Components/Sidebar';
import { Popover, Transition } from '@headlessui/react';
import { ReactNode ,FC, useState, useCallback, useEffect, Fragment } from 'react';
import { twMerge } from 'tailwind-merge';



interface LayoutProps{
    children:ReactNode;
}

const Layout:FC<LayoutProps> = ({children}) => {
    const [showNav,setShowNav] = useState(true);
    const [isMobile,setIsMobile] = useState(true);

    const handleResize = useCallback(() =>{
        if(innerWidth<=640){
            setShowNav(false);
            setIsMobile(true);
        }else{
            setShowNav(true);
            setIsMobile(false);
        }
    },[innerWidth])

    useEffect(()=>{
        if(typeof window ===undefined) return;
        addEventListener("resize",handleResize);
        return ()=>removeEventListener("resize",handleResize);
    },[]);

    return (
        <>
            <NavBar setShowNav={setShowNav} showNav={showNav} />
            <Transition 
                as={Fragment}
                show={showNav} 
                enter='transform transition duration-300'
                enterFrom='-translate-x-full'
                enterTo='translate-x-0'
                leave='transform transition duration-300 ease-in-out'
                leaveFrom='translate-x-0'
                leaveTo='-translate-x-full'
                >
                <Sidebar setShowNav={setShowNav} />
            </Transition>
            <main className={twMerge('pt-16 transition-all duration-300',
                    (showNav && !isMobile)&&'pl-56'
                )}>
                <div className='px-3.5 md:px-16'>
                    {children}
                </div>
            </main>
        </>
    )
}

export default Layout

