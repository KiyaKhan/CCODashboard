import { useTrackerDialog } from '@/Hooks/useTrackerDialog'
import React, { useEffect, useState } from 'react'
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from '@/Components/ui/alert-dialog';
import { Button } from '../ui/button';
import { router } from '@inertiajs/react';
import { toast } from 'react-toastify';
import { BiLoaderCircle } from 'react-icons/bi';
import { Input } from '../ui/input';

const TrackerModal = () => {

    const {isOpen,onClose,type} = useTrackerDialog();

    const lbl = type==='SpecialProject'?'Special Project Remarks':type==='Overtime'?'Overtime Reason':'Undertime Reason';
    const [loading,setLoading] = useState(false);
    const [remarks,setRemarks] = useState('');

    const onConfirm = () =>{
        if(remarks==='' || remarks.length<2 || !remarks) return toast.error(`${lbl} is required!`,{autoClose:1000});
        if (type==='SpecialProject'){
            return router.post(route('tracker.update'),{
                    status_id:12,
                    special_project_remark:remarks
                },{
                preserveState:false,
                onStart:()=>setLoading(true),
                onFinish:()=>setLoading(false),
                onError:()=>toast.error('Something went wrong! Please try again'),
                onSuccess:onClose
            });
        }

        router.post(route('tracker.logout'),{
            overtime_reason:type==='Overtime'?remarks:'',
            early_departure_reason:type==='Undertime'?remarks:''
        },{
            onStart:()=>setLoading(true),
            onSuccess:onClose,
            onFinish:()=>{setLoading(false)},
        });
        
    }

    useEffect(()=>setRemarks(''),[isOpen]);

    return (
        <AlertDialog open={isOpen && !!type}>
            <AlertDialogContent>
                <AlertDialogHeader>
                    <AlertDialogTitle>{lbl}</AlertDialogTitle>
                </AlertDialogHeader>
                <Input value={remarks} onChange={({target})=>setRemarks(target.value)} disabled={loading} placeholder={`Input ${lbl}`} autoFocus />
                <AlertDialogFooter>
                    <Button onClick={onClose} size='sm' className='font-semibold' disabled={loading} variant='secondary'>Cancel</Button>
                    <Button onClick={onConfirm} size='sm' className='font-semibold' disabled={loading} variant='outline' >
                        {loading && <BiLoaderCircle className='h-4 w-4 mr-2 animate-spin' />}
                        Continue
                    </Button>
                </AlertDialogFooter>
            </AlertDialogContent>
        </AlertDialog>
    )
}

export default TrackerModal