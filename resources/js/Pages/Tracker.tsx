import { Button } from '@/Components/ui/button'
import { Card,CardHeader,CardTitle,CardDescription,CardContent, CardFooter } from '@/Components/ui/card'
import { Input } from '@/Components/ui/input'
import { Label } from '@/Components/ui/label'
import TrackerLayout from '@/Layouts/TrackerLayout'
import { Head, useForm } from '@inertiajs/react'
import React, { FormEventHandler } from 'react'
import { BiLoaderCircle } from 'react-icons/bi'

const Tracker = () => {
    const { data, setData, post, processing, errors } = useForm({
        company_id: '',
        password: '',
    });

    const onSubmit:FormEventHandler<HTMLFormElement> = (e)=>{
        e.preventDefault();
        post(route('tracker.store'))
    }

    return (
        <>
            <Head title='RMS Tracker' />
            <TrackerLayout>
                <Card className="w-full md:w-96 mx-auto mt-12 md:mt-32">
                    <CardHeader>
                        <CardTitle>Welcome to RMS Tracker (BETA)</CardTitle>
                        <CardDescription>Enter your credentials below</CardDescription>
                    </CardHeader>
                    <CardContent>
                        <form onSubmit={onSubmit} id='form' className='flex flex-col space-y-2.5'>
                            <div className='flex flex-col space-y-1'>
                                <Label>Company ID</Label>
                                <Input required  placeholder='Enter your Company ID...' value={data.company_id} onChange={({target})=>setData('company_id',target.value)} autoFocus disabled={processing} />
                                {errors.company_id && <p className='text-destructive text-sm'>{errors.company_id}</p>}
                            </div>
                            <div className='flex flex-col space-y-1'>
                                <Label>Password</Label>
                                <Input required placeholder='Password...' type='password' value={data.password} onChange={({target})=>setData('password',target.value)} autoFocus disabled={processing}/>
                                {errors.password && <p className='text-destructive text-sm'>{errors.password}</p>}
                            </div>
                        </form>
                    </CardContent>
                    <CardFooter className="flex justify-between">
                        <Button disabled={processing} type='submit' form='form' className='font-semibold ml-auto'>
                            {processing && <BiLoaderCircle className='animate-spin h-4 w-4 mr-2' />}
                            Sign In
                        </Button>
                    </CardFooter>
                    </Card>
            </TrackerLayout>
        </>
    )
}

export default Tracker