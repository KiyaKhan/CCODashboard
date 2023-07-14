
import AppLogo from '@/Components/AppLogo';
import { Alert, AlertDescription, AlertTitle } from '@/Components/ui/alert';
import { Button } from '@/Components/ui/button';
import { Input } from '@/Components/ui/input';
import { Label } from '@/Components/ui/label';
import { Head, useForm } from '@inertiajs/react';
import React, { FC, FormEventHandler, useEffect } from 'react'
import {LuLoader2} from 'react-icons/lu';

const Login:FC = () => {
    const { data, setData, post, processing, errors } = useForm({
        company_id: '',
        password: '',
    })

    const onSubmit:FormEventHandler = (e) =>{
        e.preventDefault();
        post(route('login'));
    }
    
    return (
        <>
            <Head title='Log In' />
            <div className='flex flex-col lg:flex-row relative '  style={{ backgroundImage: `url(${route('index')}/logo/bg.jpg)` }}>
                <div className='hidden lg:flex flex-col items-center py-60 w-1/2 bg-transparent'>
                    <h1 className='text-4xl tracking-wider font-bold mb-28 text-white'>
                        Welcome To CCO Dashboard
                    </h1>
                </div>
                <div className="lg:p-8 bg-transparent h-screen flex items-center justify-center w-full lg:w-1/2">
                    <div className="mx-auto flex w-full flex-col justify-center space-y-6 sm:w-[350px]">
                        <div className='flex items-center justify-center w-full'>
                            <AppLogo className='w-28 h-2w-28 dark:invert' />
                        </div>
                        <div className="flex flex-col space-y-2 text-center">
                        <h1 className="text-2xl font-semibold tracking-tight text-white">
                            Log In to View Dashboard
                        </h1>
                        <p className="text-sm text-muted-foreground text-white">
                            Enter your Employee ID and Password
                        </p>
                        <div className="grid gap-6">
                            {(errors.company_id||errors.password)&&
                                <Alert variant='destructive' className='my-3.5'>
                                    <AlertTitle>Heads up!</AlertTitle>
                                    <AlertDescription>
                                        {errors.company_id}
                                        {errors.password}
                                    </AlertDescription>
                                </Alert>

                            }
                            <form onSubmit={onSubmit}>
                                <div className="grid gap-2">
                                <div className="grid gap-1">
                                    <Label className="sr-only" htmlFor="company_id">
                                        Employee ID
                                    </Label>
                                    <Input
                                    id="company_id"
                                    placeholder="Employe ID..."
                                    type="text"
                                    autoCapitalize="characters"
                                    autoComplete="off"
                                    autoCorrect="off"
                                    required
                                    value={data.company_id}
                                    onChange={({target})=>setData('company_id',target.value)}
                                    disabled={processing}
                                    />
                                </div>
                                <div className="grid gap-1">
                                    <Label className="sr-only" htmlFor="password">
                                        Password
                                    </Label>
                                    <Input
                                    id="password"
                                    placeholder="Password..."
                                    type="password"
                                    autoComplete="off"
                                    autoCorrect="off"
                                    required
                                    value={data.password}
                                    onChange={({target})=>setData('password',target.value)}
                                    disabled={processing}
                                    />
                                </div>
                                <Button disabled={processing}>
                                    {processing && (
                                        <LuLoader2   className="mr-2 h-4 w-4 animate-spin" />
                                    )}
                                    Continue...
                                </Button>
                                </div>
                            </form>
                        </div>
                    </div>
                    </div>
                </div>
            </div>
        </>
    )
}

export default Login