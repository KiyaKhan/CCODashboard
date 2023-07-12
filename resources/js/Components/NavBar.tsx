import  { FC , Fragment } from 'react';
import { GiHamburgerMenu} from 'react-icons/gi';
import { SlPencil } from 'react-icons/sl';
import { FaChevronDown } from 'react-icons/fa';
import { HiMiniCog8Tooth,HiOutlineCheck } from 'react-icons/hi2';
import { BiBell } from 'react-icons/bi';
import {  Menu,Transition,Popover } from '@headlessui/react';
import { twMerge } from 'tailwind-merge';
import { IconType } from 'react-icons';
import Avatar from './Avatar';


interface NavBarProps{
    showNav?:boolean;
    setShowNav:(show:boolean)=>void;
}

const NavBar:FC<NavBarProps> = ({setShowNav,showNav}) => {
    return (
        <nav className={twMerge('fixed w-full h-16 flex justify-between items-center transition-all duration-300',
                showNav&&'pl-56'
            )}>
            <div className='pl-3.5 md:pl-10'>
                <GiHamburgerMenu className='h-8 w-8 text-neutral-700 cursor-pointer' onClick={()=>setShowNav(!showNav)} />
            </div>
            <div className='flex items-center pr-3.5 md:pr-16'>
                <Popover className='relative'>
                    <Popover.Button className='!outline-none mr-4 md:mr-7 cursor-pointer text-neutral-700'>
                        <BiBell className='h-6 w-6' />
                    </Popover.Button>
                    <Transition
                        as={Fragment}
                        enter='transition ease-out duration-100'
                        enterFrom='transform scale-95'
                        enterTo='transform scale-100'
                        leave='transition ease-in duration-75'
                        leaveFrom='transform scale-100'
                        leaveTo='transform scale-95'
                        >
                        <Popover.Panel className='absolute -right-16 sm:right-4 z-50 mt-1.5 shadow-sm shadow-neutral-700 rounded w-screen max-w-xs sm:max-w-sm '>
                            <div className='relative p-2.5'>
                                <div className='flex justify-between items-center w-full'>
                                    <p className='text-neutral-700 font-medium'>
                                        Notifications
                                    </p>
                                    <button className='text-sm text-orange-800 hover:opacity-80 hover:font-bold transition duration-300'>
                                        Dismiss All
                                    </button>
                                </div>
                                <div className='mt-3.5 grid gap-3.5 grid-cols-1 overflow-hidden'>
                                    {
                                        notificationSamples.map(({title,text})=>(
                                            <div key={title} className='flex space-x-3.5'>
                                                <div className='rounded-full shrink-0 bg-green-200 h-8 w-8 flex items-center justify-center'>
                                                    <HiOutlineCheck className='h-4 w-4 text-green-600' />
                                                </div>
                                                <div>
                                                    <p className='font-medium text-neutral-700'>
                                                        {title}
                                                    </p>
                                                    <p className='text-sm text-neutral-500 truncate'>
                                                        {text}
                                                    </p>
                                                </div>
                                            </div>
                                        ))
                                    }
                                    
                                </div>
                            </div>
                        </Popover.Panel>
                    </Transition>
                </Popover>
                <Menu as='div' className='relative inline-block text-left'>
                    <Menu.Button className='inline-flex w-full justify-center items-center'>
                        <Avatar />
                        <p className='hidden md:block font-medium text-neutral-700'>Admin</p>
                        <FaChevronDown className='ml-1.5 h-3.5 w-3.5 text-neutral-700' />
                    </Menu.Button>
                    <Transition
                        as={Fragment}
                        enter='transition ease-out duration-100'
                        enterFrom='transform scale-95'
                        enterTo='transform scale-100'
                        leave='transition ease-in duration-75'
                        leaveFrom='transform scale-100'
                        leaveTo='transform scale-95'
                        >
                        <Menu.Items className='absolute right-0 w-56 z-50 mt-1.5 origin-top-right bg-white rounded shadow-sm shadow-neutral-500'>
                            <div className='p-1'>
                                {
                                    popoverItems.map(({label,icon:Icon,onClick})=>(
                                        <Menu.Item key={label}>
                                            <div className='flex items-center space-x-1.5 hover:bg-orange-500 hover:text-white text-neutral-700 rounded p-1.5 text-sm transition-colors '>
                                                <Icon className='h-4 w-4' />
                                                <span>{label}</span>
                                            </div>
                                        </Menu.Item>
                                    ))
                                }
                            </div>
                        </Menu.Items>
                    </Transition>
                </Menu>
            </div>
        </nav>
    )
}

export default NavBar

type item={
    label:string;
    icon:IconType;
    onClick?:()=>void;
}

const navItems:item[] = [
    {
        label:"Notifications",
        icon: BiBell
    }
]


const popoverItems:item[]=[
    {
        label:"Edit Profile",
        icon:SlPencil
    },{
        label:"Settings",
        icon:HiMiniCog8Tooth
    }
];


const notificationSamples:{title:string;text:string}[]=[
    {title:"Lorem ipsum", text:"Lorem ipsum, dolor sit amet consectetur adipisicing." },
    {title:"Lorem title", text:"Lorem ipsum dolor sit amet." },
    {title:"Title ipsum", text:"Lorem ipsum dolor, sit amet consectetur adipisicing elit. Tempora aperiam quisquam nobis?" },
    {title:"Title Lorem", text:"Lorem ipsum dolor sit, amet consectetur adipisicing elit." },
    {title:"Title Title", text:"Lorem, ipsum dolor sit amet consectetur adipisicing elit. Tempore, quos!." },
    {title:"Lorem Lorem", text:"Lorem ipsum, dolor sit amet consectetur adipisicing." },
    {title:"Ipsum ipsum", text:"Lorem ipsum dolor sit, amet consectetur adipisicing elit. Praesentium mollitia quisquam ullam dicta provident." }
]