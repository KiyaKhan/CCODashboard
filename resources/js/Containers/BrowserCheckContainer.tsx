import { AlertDialog, AlertDialogAction, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle } from '@/Components/ui/alert-dialog';
import React, { FC, useEffect, useState } from 'react'
import { RiErrorWarningLine } from 'react-icons/ri';


const BrowserCheckContainer:FC = () => {
    
    const [showAlert,setShowAlert]=useState<boolean>(false);

    useEffect(()=>{
        if(!window.navigator.userAgent.toLowerCase().includes('chrome')) setShowAlert(true) ;
    },[]);

    return (
        <AlertDialog open={showAlert}>
            <AlertDialogContent>
                <AlertDialogHeader>
                    <AlertDialogTitle className='flex items-center space-x-3.5'>
                        <RiErrorWarningLine size={48} />
                        <span>Warning!</span>
                    </AlertDialogTitle>
                    <AlertDialogDescription className='flex flex-col space-y-2.5 pt-12'>
                        <span>We've detected that your're not using Google Chrome.</span>
                        <span>For best results, please use Google Chrome to avoid compatibilty issues...</span>
                    </AlertDialogDescription>
                </AlertDialogHeader>
                <AlertDialogFooter>
                    <AlertDialogAction className='font-semibold' onClick={()=>setShowAlert(false)}>Understood!</AlertDialogAction>
                </AlertDialogFooter>
            </AlertDialogContent>
        </AlertDialog>
    )
}

export default BrowserCheckContainer