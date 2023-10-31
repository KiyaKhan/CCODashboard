import { useEffect } from 'react';
import { toast } from 'react-toastify';
import { create } from 'zustand';



interface IuseToggleNotification{
    showNotif:boolean;
    setShow:(showing:boolean)=>void;
}

const toggleDark = create<IuseToggleNotification>(set=>({
    showNotif:false,
    setShow:(showing)=>set({showNotif:showing}),
}));

const useToggleNotification = () => {
    const {showNotif,setShow}=toggleDark();
    const toggleNotif = () =>{
        
        if(showNotif){
            setShow(false);
            localStorage.removeItem('show'); 
            return toast.info('Notifications Turned Off',{autoClose:1200});
        }
        setShow(true);
        toast.info('Notifications Turned On',{autoClose:1200})
        localStorage.setItem('show','yes');
    }

    useEffect(()=>{
        if (localStorage.getItem('show')==='yes'){
            setShow(true);
        }
    },[]);

    return {toggleNotif,showNotif};
}

export default useToggleNotification