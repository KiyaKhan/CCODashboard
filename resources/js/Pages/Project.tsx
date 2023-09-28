import NavBar from '@/Components/NavBar'
import { Button } from '@/Components/ui/button'
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from '@/Components/ui/dialog'
import { Input } from '@/Components/ui/input'
import { Label } from '@/Components/ui/label'
import { Separator } from '@/Components/ui/separator'
import { Table, TableBody, TableCaption, TableCell, TableHead, TableHeader, TableRow } from '@/Components/ui/table'
import { IProject, ITeam, User } from '@/types'
import { Head, useForm } from '@inertiajs/react'
import React, { FC, FormEventHandler, useCallback, useEffect, useRef, useState } from 'react'
import { BiCheckCircle } from 'react-icons/bi'
import { MdCancel } from 'react-icons/md'
import { toast } from 'react-toastify'

const Project:FC<{
    available_team_leaders:User[];
    teams:ITeam[];
    projects:IProject[];
}> = ({available_team_leaders,teams,projects}) => {
    const [open,setOpen] = useState(false);
    return (
        <>
            <Head title='Projects' />
            <div className="flex flex-col h-screen">
                <NavBar availableTeamLeaders={available_team_leaders} teams={teams} />
                <div className="flex-1 space-y-4 p-8 pt-6 h-full">
                    <div className="flex flex-col  space-y-3.5">
                        <div>
                            <h2 className="text-3xl font-bold tracking-tight">Projects</h2>
                            <p className='text-muted-foreground'>Manage Projects</p>
                        </div>
                        <Separator />
                        <Button size='sm' className='font-semibold ml-auto' onClick={()=>setOpen(true)}>New Project</Button>
                        <div className='flex '>
                            <div className='w-full lg:w-9/12 mx-auto ' >
                                <Table>
                                    <TableCaption>List of Projects.</TableCaption>
                                    <TableHeader>
                                        <TableRow className='text-base'>
                                            <TableHead className="!font-bold">Project Name</TableHead>
                                            <TableHead className="!font-bold">Agent Count</TableHead>
                                            <TableHead className="!font-bold">Actions</TableHead>
                                        </TableRow>
                                    </TableHeader>
                                    <TableBody>
                                        {projects.map((project) => (
                                            <ProjectItem project={project} key={project.id} />
                                        ))}
                                    </TableBody>
                                </Table>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
            <NewProjectDialog onOpenChange={()=>setOpen(false)} open={open} />
        </>
    )
}

export default Project


const NewProjectDialog:FC<{open:boolean;onOpenChange:()=>void}> = ({open,onOpenChange}) =>{
    const { data, setData, post, processing, errors } = useForm<{name:string}>({name:""});
    const onSubmit:FormEventHandler<HTMLFormElement> = useCallback((e)=>{
        e.preventDefault();
        post(route('projects.store'),{
            onSuccess:()=>{
                onOpenChange();
                toast.success('Project Added...');
            }
        });
    },[data.name]);
    return(
        <Dialog open={open} onOpenChange={onOpenChange}>
            
                <DialogContent className="sm:max-w-[425px]">
                    <DialogHeader>
                        <DialogTitle>Create New Project</DialogTitle>
                        <DialogDescription>
                            Input New Project Name...
                        </DialogDescription>
                    </DialogHeader>
                    <div className="grid gap-4 py-4">
                    <form id='project' onSubmit={onSubmit}>
                        <div className="grid grid-cols-4 items-center gap-4">
                            <Label htmlFor="name" className="text-right">Name</Label>
                            <Input autoComplete='off' required disabled={processing} id="name" value={data.name} onChange={({target})=>setData('name',target.value)} className="col-span-3" />
                        </div>
                    </form>
                    
                    </div>
                    <DialogFooter>
                        <Button form='project' size='sm' className='font-semibold' disabled={processing} type="submit">Save changes</Button>
                    </DialogFooter>
                </DialogContent>
        </Dialog>
    );
}


const ProjectItem:FC<{project:IProject}> = ({project}) =>{
    const {name,id,users} = project;
    const [renaming,setRenaming] = useState(false);
    const onRename:FormEventHandler<HTMLFormElement> = (e) =>{
        e.preventDefault();
        post(route('projects.update'),{
            onError:()=>toast.error('Server Error. Please Try Again'),
            onSuccess:()=>{
                setRenaming(false);
                toast.success('Project Renamed');
            }
        });
    }
    const input = useRef<HTMLInputElement>(null);
    useEffect(()=>{
        if(input&&renaming){
            input.current?.focus();
        }
    },[renaming])

    const {post,processing,errors,setData,data} = useForm<{id:number,name:string}>({id,name})

    return (
        <TableRow key={id}>
            <TableCell className="font-medium">
                {
                    !renaming?<p>{name}</p>:(
                        <form onSubmit={onRename} className='flex items-center space-x-1.5'>
                            <Input required ref={input} onChange={({target})=>setData('name',target.value)} value={data.name} disabled={processing} />
                            <Button type='button' onClick={()=>setRenaming(false)} disabled={processing} size='icon' variant='destructive' > <MdCancel className='w-5 h-5'/> </Button>
                            <Button type='submit' disabled={processing} size='icon' variant='outline' className='text-green-500 dark:text-green-400 border-green-500 dark:text-border-400'> <BiCheckCircle className='w-5 h-5'/> </Button>
                        </form>
                    )
                }
                
            </TableCell>
            <TableCell>{users.length}</TableCell>
            <TableCell> <Button disabled={processing||renaming} onClick={()=>setRenaming(true)} size='sm' variant='outline'>Rename</Button> </TableCell>
        </TableRow>
    );
}
