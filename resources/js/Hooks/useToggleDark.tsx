import { useEffect, useState } from 'react';
import { create } from 'zustand';



interface IToggle{
    isDark:boolean;
    setDark:(dark:boolean)=>void;
}

const toggleDark = create<IToggle>(set=>({
    isDark:false,
    setDark:(dark:boolean)=>set({isDark:dark}),
}));

const useToggleDark = () => {
    const {isDark,setDark}=toggleDark()
    const {classList}=document.documentElement;
    const toggleTheme = () =>{
        
        if(isDark){
            setDark(false);
            localStorage.removeItem('theme');    
            return classList.remove('dark');
        }
        setDark(true);
        
        localStorage.setItem('theme','dark');
        return classList.add('dark');
    }

    useEffect(()=>{
        if (localStorage.getItem('theme')==='dark'){
            classList.add('dark');
            setDark(true);
        }
    },[]);

    return {toggleTheme,isDark};
}

export default useToggleDark