import React, { FormEventHandler, useEffect } from 'react'
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from '../ui/dialog'
import { Label } from '../ui/label'
import { Input } from '../ui/input'
import { Button } from '../ui/button'
import useNewAdminDialog from '@/Hooks/useNewAdminDialog'
import { useForm } from '@inertiajs/react'
import { toast } from 'react-toastify'

const NewAdminDialog = () => {
    const {showNewAdminDialog,setShowNewAdminDialog} = useNewAdminDialog();
    const { data, setData, post, processing,errors, reset } = useForm({
        first_name:"",
        last_name:"",
        company_id:"",
        email:""
    });

    const onSubmit:FormEventHandler<HTMLFormElement> = (e) =>{
        e.preventDefault();
        post(route('admin.store'),{
            onSuccess:()=>{
                setShowNewAdminDialog(false);
                toast.success('Admin Account Created...');
            },
            onError:()=>toast.error('Internal Error. Please try again.')
        });
    }

    useEffect(()=>reset(),[showNewAdminDialog]);

    return (
        <Dialog open={showNewAdminDialog} onOpenChange={setShowNewAdminDialog}>
            <DialogContent className="">
                <DialogHeader>
                    <DialogTitle>Add New Admin Account</DialogTitle>
                    <DialogDescription>
                        Default Password is 'password'. Notify the user to change password immediately 
                    </DialogDescription>
                </DialogHeader>
                
                    <form id='form' onSubmit={onSubmit}>
                        <div className="grid gap-4 py-4">
                            <div className="grid grid-cols-4 items-center gap-4">
                                <Label htmlFor="fname" className="text-right">First Name</Label>
                                <Input autoComplete='off' disabled={processing} required onChange={({target})=>setData('first_name',target.value)} value={data.first_name} id="fname" placeholder='First Name...' className="col-span-3" />
                            </div>
                            <div className="grid grid-cols-4 items-center gap-4">
                                <Label htmlFor="last_name" className="text-right">Last Name</Label>
                                <Input autoComplete='off' disabled={processing} required onChange={({target})=>setData('last_name',target.value)} value={data.last_name} id="lname" placeholder='Last Name...' className="col-span-3" />
                                
                            </div>
                            {errors.company_id && <p className='-mt-2.5 text-right text-xs text-destructive'>{errors.company_id}</p>}
                            <div className="grid grid-cols-4 items-center gap-4">
                                <Label htmlFor="company_id" className="text-right">Company ID</Label>
                                <Input autoComplete='off' disabled={processing} required onChange={({target})=>setData('company_id',target.value)} value={data.company_id} id="company_id" placeholder='FFFF' className="col-span-3" />
                            </div>
                            <div className="grid grid-cols-4 items-center gap-4">
                                <Label htmlFor="email" className=" text-right">Email <span className='italic'> (optional)</span></Label>
                                <Input autoComplete='off' disabled={processing} onChange={({target})=>setData('email',target.value)} value={data.email} id="email" type='email' placeholder='name@datacapture.com.ph' className="col-span-3" />
                            </div>
                            {errors.email && <p className='-mt-2.5 text-right text-xs text-destructive'>{errors.email}</p>}
                        </div>
                    </form>
                <DialogFooter>
                    <Button form='form' size='sm' className='font-bold' disabled={processing} type="submit">Confirm</Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    )
}

export default NewAdminDialog