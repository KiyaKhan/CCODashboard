import NavBar from '@/Components/NavBar'
import { Button } from '@/Components/ui/button'
import { Card } from '@/Components/ui/card'
import { Checkbox } from '@/Components/ui/checkbox'
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from '@/Components/ui/dialog'
import { Input } from '@/Components/ui/input'
import { Label } from '@/Components/ui/label'
import { ScrollArea } from '@/Components/ui/scroll-area'
import { Separator } from '@/Components/ui/separator'
import { Table, TableBody, TableCaption, TableCell, TableHead, TableHeader, TableRow } from '@/Components/ui/table'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/Components/ui/tabs'
import { Driver, IProject, ITeam, Status, User } from '@/types'
import { Head, router, useForm } from '@inertiajs/react'
import { CheckboxItem } from '@radix-ui/react-dropdown-menu'
import { CircleIcon, TrashIcon } from '@radix-ui/react-icons'
import axios from 'axios'
import React, { FC, FormEventHandler, useCallback, useEffect, useRef, useState } from 'react'
import { BiCheckCircle } from 'react-icons/bi'
import { MdCancel } from 'react-icons/md'
import { RiAddBoxFill, RiArchiveLine, RiCheckFill, RiCloseFill, RiCloseLine, RiDeleteBack2Fill, RiDeleteBack2Line, RiDeleteBin2Fill, RiDeleteBinLine, RiDraggable, RiEdit2Fill } from 'react-icons/ri'
import { toast } from 'react-toastify';
import {
    DndContext,
    closestCenter,
    PointerSensor,
    useSensor,
    useSensors
  } from "@dnd-kit/core";
  import {
    arrayMove,
    SortableContext,
    useSortable,
    verticalListSortingStrategy
  } from "@dnd-kit/sortable";
  import { CSS } from "@dnd-kit/utilities";

type configuration = {
    type: string;
    editable:boolean;
    confirm:boolean;
    delete:boolean;
}
const Project:FC<{
    available_team_leaders:User[];
    teams:ITeam[];
    projects:IProject[];
}> = ({available_team_leaders,teams,projects}) => {
    const [open,setOpen] = useState(false);
    const [typeOpen, setTypeOpen] = useState(false);
    const [project, setProject] = useState<IProject>({} as IProject);
    useEffect(() => {
     const updated = projects.find(p => p.id == project.id)?? project;
     setProject(updated);
    },[projects])
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
                                            <ProjectItem project={project} key={project.id} onOpen={(b:boolean) => {setTypeOpen(b); setProject(project)}} isOpen = {typeOpen } />
                                        ))}
                                    </TableBody>
                                </Table>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
            <NewProjectDialog onOpenChange={()=>setOpen(false)} open={open} />
            <SettingsDialog project={project} onOpenChange={(b:boolean) => setTypeOpen(b)} open={typeOpen}/>
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

interface ProjectItemsProps {
    project:IProject , 
    isOpen: boolean,
    onOpen: (b:boolean) => void
}
const ProjectItem = ({isOpen, onOpen, project} : ProjectItemsProps) => {
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
                            <Button type='submit' disabled={processing} size='icon' variant='outline' className='text-green-500 dark:text-green-400 border-green-500 dark:text-border-400'>
                                 <BiCheckCircle className='w-5 h-5'/> 
                            </Button>
                        </form>
                    )
                }
                
            </TableCell>
            <TableCell>{users.length}</TableCell>
            <TableCell className='space-x-2'> 
                <Button variant={'outline'} size={'sm'} onClick={() => {onOpen(!isOpen)}}>Project Settings</Button>
                <Button disabled={processing||renaming} onClick={()=>setRenaming(true)} size='sm' variant='outline'>Rename</Button> 
            </TableCell>
        </TableRow>
    );
}

interface CardItemProps {
    id:number;
    name:string;
    project_id:number;
    config: configuration;
    update: (name:string) => void;
    handleCheck: (id:number) => void;
    checked:boolean;
}
const Carditem = ({id,name:initial_name,handleCheck,config, update,checked}:CardItemProps) => {
    const [configuration, setConfig] = useState(config);
    const [name,setName] = useState<string>(initial_name);
    const handleUpdate = () => {
        update(name);
        setConfig({...configuration, editable:false});
    }
    useEffect(() => {
        setName(initial_name);
    }, [initial_name]);
    const {
        attributes,
        listeners,
        setNodeRef,
        transform,
        transition
      } = useSortable({ id });
      const style = {
        transform: CSS.Transform.toString(transform),
        transition
      };
    return <>
        <Card ref={setNodeRef} style={style}  {...attributes}  className='m-2 p-2 border-2'>
            <div className="flex">
                <div className="flex-1 m-auto">
                    {configuration.editable && <Input onChange={(e) => setName(e.currentTarget.value)} defaultValue={name}/>}
                    {!configuration.editable && <div className='flex items-center space-x-2'>
                        <div className='p-2' {...listeners}><RiDraggable/></div>
                        <Checkbox  checked={checked} onCheckedChange={() => handleCheck(id)}/>
                        <p >{initial_name}</p>
                    </div>}
                </div>
                <div className="flex-none">
                   {!(configuration.delete || configuration.editable) && <>
                     <Button onClick={() => setConfig({...configuration, editable:true})} disabled={!id || id < 1} variant={'ghost'} size={'icon'}><RiEdit2Fill/></Button>
                   </>}
                   {(configuration.editable) && <>
                    <Button onClick={handleUpdate} disabled={!id || id < 1} variant={'ghost'} size={'icon'} className='text-green-500'><RiCheckFill/></Button>
                    <Button onClick={() => setConfig({...configuration, editable:false})} disabled={!id || id < 1} variant={'ghost'} size={'icon'}><RiCloseFill/></Button>
                   </>}
                </div>
            </div>
        </Card>
    </>
}
interface SettingsProps {
    open:boolean;
    onOpenChange: (b:boolean) => void;
    project: IProject;
}
const SettingsDialog = ({open, onOpenChange, project:initial_project} : SettingsProps) => {
    
    const [tagIDS, setTagIDS] = useState<number[]>([]);
    const [driverIDS, setDriverIDS] = useState<number[]>([]);
    const [stateConfig, setStateConfig] = useState({
        tagOnDelete:false,
        driverOnDelete:false,
        tagSubmit:false, 
        driverSubmit:false,
        tagShowOptions:false,
        driverShowOptions:false,
    });
    const [project,setProject] = useState<IProject>(initial_project);
    const {post:postStatus,data:dataStatus,setData:setStatus,processing:processingStatus} = useForm<Status>({
        id:0,
        name:'',
        project_id: project.id,
        position:0,
    });
    const {post:postDriver,data:dataDriver,setData:setDriver,processing:processingDriver} = useForm<Driver>({
        id:0,
        driver:'',
        project_id: project.id,
        position:0,
    });
    useEffect(() => {
        setProject(initial_project);
        setStatus('project_id', initial_project.id);
        setDriver('project_id', initial_project.id);
        setTagIDS([]);
        setDriverIDS([]);
    },[initial_project]);
    useEffect(() => {
        if(stateConfig.tagSubmit) {
            postStatus(route('projects.status.save'), {
                onSuccess:()=>{
                    toast.success('Status Saved');
                    setStatus({...dataStatus,name: ''});
                }
            });
            setStateConfig({...stateConfig, tagSubmit:false});
        }
    },[dataStatus, setStatus]);
    useEffect(() => {
        if(stateConfig.driverSubmit) {
            postDriver(route('projects.driver.save'), {
                onSuccess:()=>{
                    toast.success('Status Saved');
                    setDriver({...dataDriver,driver: ''});
                }
            });
            setStateConfig({...stateConfig, driverSubmit:false});
        }
    },[dataDriver, setDriver, initial_project]);
    useEffect(() => {
        setStateConfig((prev) => ({...prev, tagShowOptions:tagIDS.length > 0}));
    },[tagIDS])
    useEffect(() => {

        setStateConfig((prev) => ({...prev, driverShowOptions:driverIDS.length > 0}));
    },[driverIDS])
    const SaveStatus = (id:number|null = null,name:string|null = null) => {
        if(name && id) {
            setStatus({...dataStatus, name, id})
        } else {
            setStatus({...dataStatus, id:0});
        }
        setStateConfig({...stateConfig, tagSubmit:true});
    }
    
    const SaveDriver = (id:number|null = null,driver:string|null = null) => {
        if(driver && id) {
            setDriver({...dataDriver, driver, id})
        } else {setDriver({...dataDriver, id:0});}
        setStateConfig({...stateConfig, driverSubmit:true});
    }
    const DeleteTags = () => {
        axios.post(route('projects.status.delete'), {ids: tagIDS})
        .then(() => {
            toast.success('Deleted Successfully');
            router.reload();
        })
    }
    const DeleteDriver = () => {
        axios.post(route('projects.driver.delete'),{ids:driverIDS})
        .then(() => {
            toast.success('Deleted Successfully');
            router.reload();
        })
    }
    // TODO: Finish Select Action then Report and Overview should be done today.
    const handleCheckboxTag = (id:number) => {
        const tagID = tagIDS.find(val => val === id);
        if(tagID) {
            const removed = tagIDS.filter(val => val != id);
            setTagIDS(removed)
        } else { setTagIDS([...tagIDS, id])}
    }
    const selectAllTag = (all:boolean) => {
        if(all) {
            setTagIDS(project.statuses.map(tag => tag.id));
        } else {setTagIDS([]);}
    }
    const handleCheckboxDriver = (id:number) => {
        const driverID = driverIDS.find(val => val === id);
        if(driverID) {
            const removed = driverIDS.filter(val => val != id);
            setDriverIDS(removed)
        } else { setDriverIDS([...driverIDS, id])}
    }
    const selectAllDriver = (all:boolean) => {
        if(all) {
            setDriverIDS(project.drivers.map(tag => tag.id));
        } else {setDriverIDS([]);}
    }
    const sensorsTag = useSensors(useSensor(PointerSensor));
    const sensorsDriver = useSensors(useSensor(PointerSensor));

    const handleDragEndTag = (event:any) => {
      const { active, over } = event;
      if (active.id !== over?.id) {
        const oldIndex = (project.statuses || []).findIndex(
            (status) => status.id === active.id
          );
          const newIndex = (project.statuses || []).findIndex(
            (status) => status.id === over.id
          );
        const result = () => {
            let elements:Status[] = arrayMove(project.statuses, oldIndex, newIndex);
            elements.map((e,index) => {
                e.position = index + 1;
            });
           return elements;
        }
        setProject((prev) => ({...prev, statuses:result()}));
        axios.post(route('projects.status.position.save'),{
            statuses: result()
        }).then(() => {
            // toast.success('Status Order Saved.');
            router.reload();
        })
      }
    };

    const handleDragEndDriver = (event:any) => {
        const { active, over } = event;
        if (active.id !== over?.id) {
          const oldIndex = (project.drivers || []).findIndex(
              (driver) => driver.id === active.id
            );
            const newIndex = (project.drivers || []).findIndex(
              (driver) => driver.id === over.id
            );
          const result = () => {
              let elements:Driver[] = arrayMove(project.drivers, oldIndex, newIndex);
              elements.map((e,index) => {
                  e.position = index + 1;
              });
             return elements;
          }
          setProject((prev) => ({...prev, drivers:result()}));
          axios.post(route('projects.driver.position.save'),{
              drivers: result()
          }).then(() => {
            //   toast.success('Driver Order Saved.');
            router.reload();
          })
        }
      };
    return <>
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent className="sm:max-w-[425px]">
                <DialogHeader>
                    <DialogTitle>{project.name} Data Build Up</DialogTitle>
                    <DialogDescription>
                        Assign Attributes such as Tags/Status and Driver
                    </DialogDescription>
                </DialogHeader>
                <Tabs defaultValue="tags" className="m-auto w-[300px]">
                    <TabsList className="grid w-full grid-cols-2">
                        <TabsTrigger value="tags">Tags</TabsTrigger>
                        <TabsTrigger value="driver">Driver</TabsTrigger>
                    </TabsList>
                    {/* TAGS */}
                    <TabsContent value="tags">
                    <div className="flex w-full max-w-sm items-center space-x-2 p-5">
                        <Input value={dataStatus.name} type="email" placeholder="Tag (Press Enter to Add)" onKeyDown={(e) => {if(e.key === 'Enter') {SaveStatus()}}} onChange={(e) => setStatus('name',e.currentTarget.value) }/>
                        <Button type="submit" onClick={() => {SaveStatus()}}>Add</Button>
                    </div>
                    <div className="flex items-center space-x-2 pl-3 pb-3">
                        <Checkbox checked={stateConfig.tagShowOptions} onCheckedChange={selectAllTag}  />
                        {(!stateConfig.tagShowOptions && !stateConfig.tagOnDelete) && <label
                            className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                        >
                           Select All Tags
                        </label>}
                        {stateConfig.tagShowOptions && <div className='space-x-2'>
                            <Button onClick={DeleteTags} variant={'ghost'} size={'sm'} ><TrashIcon className='mr-2'/> Delete</Button>
                        </div>}
                    </div>
                    <ScrollArea className='h-[300px] w-full overflow-y-auto'>
                        {((project.statuses || []).length < 1 &&  <p className='text-center w-full'>- No Records Found - </p>)}
                        <DndContext sensors={sensorsTag} collisionDetection={closestCenter} onDragEnd={handleDragEndTag}>
                            <SortableContext items={(project.statuses || [])} strategy={verticalListSortingStrategy}>
                                {(project.statuses || []).map((data) => {
                                    const tagConfig:configuration = {type:'tag', confirm:false, delete:stateConfig.tagOnDelete, editable:false};
                                    return <Carditem 
                                    checked={tagIDS.includes(data.id)}
                                    key={`status${data.id}`} 
                                    update={(name:string)=>SaveStatus(data.id,name)} 
                                    handleCheck={(id:number)=>{handleCheckboxTag(id)}} 
                                    config={tagConfig} id={data.id} 
                                    name={data.name}
                                    project_id={data.project_id}
                                    />;
                                })}
                            </SortableContext>
                        </DndContext>
                    </ScrollArea>
                    </TabsContent>
                    {/* DRIVER */}
                    <TabsContent value="driver">
                    <div className="flex w-full max-w-sm items-center space-x-2 p-5">
                        <Input value={dataDriver.driver} type="email" placeholder="Driver (Press Enter to Add)" onKeyDown={(e) => {if(e.key === 'Enter') {SaveDriver()}}} onChange={(e) => setDriver('driver',e.currentTarget.value)} />
                        <Button type="submit" onClick={() => SaveDriver()}>Add</Button>
                    </div>
                    <div className="flex items-center space-x-2 pl-3 pb-3">
                        <Checkbox checked={stateConfig.driverShowOptions} onCheckedChange={selectAllDriver}  />
                        {(!stateConfig.driverShowOptions && !stateConfig.driverOnDelete) && <label
                            className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                        >
                           Select All Drivers
                        </label>}
                        {stateConfig.driverShowOptions && <div className='space-x-2'>
                            <Button onClick={DeleteDriver} variant={'ghost'} size={'sm'} ><TrashIcon className='mr-2'/> Delete</Button>
                        </div>}
                    </div>
                    <ScrollArea className='h-[350px] w-full overflow-auto'>
                    {((project.drivers || []).length < 1 &&  <p className='text-center w-full'>- No Records Found - </p>)}
                    <DndContext sensors={sensorsDriver} collisionDetection={closestCenter} onDragEnd={handleDragEndDriver}>
                        <SortableContext items={(project.drivers || [])} strategy={verticalListSortingStrategy}>
                            {(project.drivers || []).map(data => {
                                const driverConfig:configuration = {type:'driver', confirm:false, delete:false, editable:false};
                                return <Carditem 
                                checked={driverIDS.includes(data.id)}
                                key={`driver${data.id}`} 
                                update={(name:string)=>SaveDriver(data.id,name)} 
                                handleCheck={(id:number)=>{handleCheckboxDriver(id)}} 
                                config={driverConfig} 
                                id={data.id} 
                                name={data.driver} 
                                project_id={data.project_id}
                                />;
                            })}
                        </SortableContext>
                    </DndContext>
                    </ScrollArea>
                    </TabsContent>
                </Tabs>
            </DialogContent>
    </Dialog>
    </>
}
