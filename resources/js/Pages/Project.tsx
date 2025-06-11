import NavBar from '@/Components/NavBar'
import { Button } from '@/Components/ui/button'
import { Card, CardContent } from '@/Components/ui/card'
import { Checkbox } from '@/Components/ui/checkbox'
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from '@/Components/ui/dialog'
import { Input } from '@/Components/ui/input'
import { Label } from '@/Components/ui/label'
import { ScrollArea } from '@/Components/ui/scroll-area'
import { Separator } from '@/Components/ui/separator'
import { Table, TableBody, TableCaption, TableCell, TableHead, TableHeader, TableRow } from '@/Components/ui/table'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/Components/ui/tabs'
import { Driver, IProject, ITeam, ProjectSettings, Tag, User } from '@/types'
import { Head, router, useForm } from '@inertiajs/react'
import { CheckboxItem } from '@radix-ui/react-dropdown-menu'
import { CircleIcon, TrashIcon } from '@radix-ui/react-icons'
import axios from 'axios'
import React, { FC, FormEventHandler, useCallback, useEffect, useRef, useState } from 'react'
import { BiCheckCircle } from 'react-icons/bi'
import { MdCancel } from 'react-icons/md'
import { RiAddBoxFill, RiArchiveLine, RiChatDeleteFill, RiCheckFill, RiCircleLine, RiCloseFill, RiCloseLine, RiDeleteBack2Fill, RiDeleteBack2Line, RiDeleteBin2Fill, RiDeleteBinLine, RiDeleteColumn, RiDraggable, RiEdit2Fill, RiFlagFill, RiPriceTag2Fill, RiPriceTag3Fill, RiPriceTag3Line, RiPriceTagLine } from 'react-icons/ri'
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
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/Components/ui/select'
import { watch } from 'fs'
import ConfirmationDialog from '@/Components/Dialogs/ConfirmationDialog'
type configuration = {
    type: string;
    editable: boolean;
    confirm: boolean;
    delete: boolean;
    tag: boolean;
}
const Project: FC<{
    available_team_leaders: User[];
    teams: ITeam[];
    projects: IProject[];
}> = ({ available_team_leaders, teams, projects }) => {
    const [open, setOpen] = useState(false);
    const [openConfirmation, setConfirmation] = useState(false);
    const [functions, setFunctions] = useState();
    const [typeOpen, setTypeOpen] = useState(false);
    const [project, setProject] = useState<IProject>({} as IProject);
    useEffect(() => {
        const updated = projects.find(p => p.id == project.id) ?? project;
        setProject(updated);
    }, [projects])
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
                        <Button size='sm' className='font-semibold ml-auto' onClick={() => setOpen(true)}>New Project</Button>
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
                                            <ProjectItem
                                                project={project}
                                                key={project.id}
                                                onOpen={(b: boolean) => { setTypeOpen(b); setProject(project) }}
                                                isOpen={typeOpen}
                                                hasConfirmation={openConfirmation}
                                                onOpenConfirmation={setConfirmation}
                                                setConfirmationAction={setFunctions}
                                            />
                                        ))}
                                    </TableBody>
                                </Table>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
            <ConfirmationDialog open={openConfirmation} handleDialog={setConfirmation} confirm={functions} header={"Are you absolutely sure?"} message={""} />
            <NewProjectDialog onOpenChange={() => setOpen(false)} open={open} />
            <SettingsDialog project={project} onOpenChange={(b: boolean) => setTypeOpen(b)} open={typeOpen} />
        </>
    )
}

export default Project


const NewProjectDialog: FC<{ open: boolean; onOpenChange: () => void }> = ({ open, onOpenChange }) => {
    const { data, setData, post, processing, errors } = useForm<{ name: string }>({ name: "" });
    const onSubmit: FormEventHandler<HTMLFormElement> = useCallback((e) => {
        e.preventDefault();
        post(route('projects.store'), {
            onSuccess: () => {
                onOpenChange();
                toast.success('Project Added...');
            }
        });
    }, [data.name]);
    return (
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
                            <Input autoComplete='off' required disabled={processing} id="name" value={data.name} onChange={({ target }) => setData('name', target.value)} className="col-span-3" />
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
    project: IProject,
    isOpen: boolean,
    onOpen: (b: boolean) => void;
    hasConfirmation: boolean;
    onOpenConfirmation: (b: boolean) => void;
    setConfirmationAction: (fun: any) => void;
}
const ProjectItem = ({ isOpen, onOpen, project, setConfirmationAction, onOpenConfirmation, hasConfirmation }: ProjectItemsProps) => {
    interface payload extends ProjectSettings {
        to_save: boolean;
    }
    const { name, id, users } = project;
    const [renaming, setRenaming] = useState(false);
    const { post, processing, errors, setData, data } = useForm<{ id: number, name: string }>({ id, name })
    const { post: postSettings, setData: setSettings, data: settings } = useForm<payload>({
        id: project.settings?.id ?? 0,
        is_monitored: project.settings?.is_monitored ?? 0,
        project_id: project.id,
        to_save: false
    });

    const onRename: FormEventHandler<HTMLFormElement> = (e) => {
        e.preventDefault();
        post(route('projects.update'), {
            onError: () => toast.error('Server Error. Please Try Again'),
            onSuccess: () => {
                setRenaming(false);
                toast.success('Project Renamed');
            }
        });
    }
    const onDelete = () => {
        post(route('projects.delete'), {
            onError: () => toast.error('Server Error. Please Try Again'),
            onSuccess: () => {
                setRenaming(false);
                toast.success('Project Deleted');
            }
        });
    }
    const dialogAlertConfirmation = () => {
        setConfirmationAction(() => () => {
            post(route('projects.delete'), {
                onError: () => toast.error('Server Error. Please Try Again'),
                onSuccess: () => {
                    setRenaming(false);
                    toast.success('Project Deleted');
                }
            });
        });
        onOpenConfirmation(!hasConfirmation);
    }
    const input = useRef<HTMLInputElement>(null);
    useEffect(() => {
        if (input && renaming) {
            input.current?.focus();
        }
    }, [renaming])
    useEffect(() => {
        if (settings.to_save) {
            postSettings(route('projects.settings.add'), {
                onSuccess: () => {
                    setSettings('to_save', false);
                }
            });
        }
    }, [settings]);

    return (
        <TableRow key={id}>
            <TableCell className="font-medium">
                {
                    !renaming ? <p>{name}</p> : (
                        <form onSubmit={onRename} className='flex items-center space-x-1.5'>
                            <Input required ref={input} onChange={({ target }) => setData('name', target.value)} value={data.name} disabled={processing} />
                            <Button type='button' onClick={() => setRenaming(false)} disabled={processing} size='icon' variant='destructive' > <MdCancel className='w-5 h-5' /> </Button>
                            <Button type='submit' disabled={processing} size='icon' variant='outline' className='text-green-500 dark:text-green-400 border-green-500 dark:text-border-400'>
                                <BiCheckCircle className='w-5 h-5' />
                            </Button>
                        </form>
                    )
                }
            </TableCell>
            <TableCell>{users.length}</TableCell>
            <TableCell className='flex items-center space-x-2'>
                <Button variant={'outline'} size={'sm'} onClick={() => { onOpen(!isOpen) }}>Project Settings</Button>
                <Button disabled={processing || renaming} onClick={() => setRenaming(true)} size='sm' variant='outline'>Rename</Button>
                <Button onClick={dialogAlertConfirmation} size='icon' variant='ghost'><RiDeleteBinLine className='text-red-500' /></Button>
                {/* <div className="flex items-start gap-3">
                    <Checkbox checked={settings.is_monitored > 0} onCheckedChange={(e: boolean) => setSettings((prev) => ({ ...prev, 'is_monitored': e ? 1 : 0, to_save: true }))} />
                    <Label htmlFor="toggle">Enable Tag Monitoring</Label>
                </div> */}
            </TableCell>
        </TableRow>
    );
}

interface CardItemProps {
    id: number;
    taggable?: boolean;
    name: string;
    project: IProject;
    config: configuration;
    update: (name: string, tag_id?: number | null) => void;
    handleCheck: (id: number) => void;
    checked: boolean;
}
const Carditem = ({ id, name: initial_name, handleCheck, config, update, checked, project, taggable = false }: CardItemProps) => {
    const [configuration, setConfig] = useState(config);
    const [name, setName] = useState<string>(initial_name);
    const [tag, setTag] = useState<number | undefined>();
    const handleUpdate = () => {
        update(name, tag);
        setConfig({ ...configuration, editable: false, tag: false });
    }
    useEffect(() => {
        setName(initial_name);
    }, [initial_name]);
    useEffect(() => {
        if (taggable) {
            const current_tag = project.drivers.find((data) => data.id == id);
            setTag(current_tag?.tag_id ?? undefined);
        }
    }, [project])
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
        <Card ref={setNodeRef} style={style}  {...attributes} className='m-2 p-2 border-2'>
            <div className="flex">
                <div className="flex-1 m-auto">
                    {configuration.editable && <Input onChange={(e) => setName(e.currentTarget.value)} defaultValue={name} />}
                    {configuration.tag && <Select value={tag !== undefined ? tag.toString() : ""} onValueChange={(e) => setTag(e ? parseInt(e) : undefined)}>
                        <SelectTrigger >
                            <SelectValue placeholder="Select Tag (Optional)" />
                        </SelectTrigger>
                        <SelectContent>
                            {(project.tags || []).length < 1 && <p className='text-center'>No Records</p>}
                            <SelectItem value="">- No Tag -</SelectItem>
                            {(project.tags || []).map(data => <SelectItem key={data.id} value={data.id.toString()}>{data.name}</SelectItem>)}
                        </SelectContent>
                    </Select>}
                    {!configuration.editable && !configuration.tag && <div className='flex items-center space-x-2'>
                        <div className='p-2' {...listeners}><RiDraggable /></div>
                        <Checkbox checked={checked} onCheckedChange={() => handleCheck(id)} />
                        <p >{initial_name}</p>
                    </div>}
                </div>
                <div className="flex-none">
                    {!(configuration.delete || configuration.editable || configuration.tag) && <>
                        <Button onClick={() => setConfig({ ...configuration, editable: true })} disabled={!id || id < 1} variant={'ghost'} size={'icon'}><RiEdit2Fill /></Button>
                        {taggable && <Button onClick={() => setConfig({ ...configuration, editable: false, tag: true })} disabled={!id || id < 1} variant={'ghost'} size={'icon'}><RiPriceTag3Line /></Button>}
                    </>}
                    {(configuration.editable || configuration.tag) && <>
                        <Button onClick={handleUpdate} disabled={!id || id < 1} variant={'ghost'} size={'icon'} className='text-green-500'><RiCheckFill size={20} /></Button>
                        <Button onClick={() => setConfig({ ...configuration, editable: false, tag: false })} disabled={!id || id < 1} variant={'ghost'} size={'icon'}><RiCloseFill size={20} /></Button>
                    </>}
                </div>
            </div>
        </Card>
    </>
}
interface SettingsProps {
    open: boolean;
    onOpenChange: (b: boolean) => void;
    project: IProject;
}
const SettingsDialog = ({ open, onOpenChange, project: initial_project }: SettingsProps) => {

    const [tagIDS, setTagIDS] = useState<number[]>([]);
    const [driverIDS, setDriverIDS] = useState<number[]>([]);
    const [stateConfig, setStateConfig] = useState({
        tagOnDelete: false,
        driverOnDelete: false,
        tagSubmit: false,
        driverSubmit: false,
        tagShowOptions: false,
        driverShowOptions: false,
    });
    const [project, setProject] = useState<IProject>(initial_project);
    const { post: postDriver, data: dataDriver, setData: setDriver, processing: processingDriver, reset: resetDriver } = useForm<Driver>({
        id: 0,
        driver: '',
        project_id: project.id,
        position: 0,
        tag_id: null
    });
    const { post: postTag, data: dataTag, setData: setTag, processing: processingTag } = useForm<Tag>({
        id: 0,
        name: '',
        project_id: project.id
    });
    useEffect(() => {
        setProject(initial_project);
        setDriver('project_id', initial_project.id);
        setTag('project_id', initial_project.id);
        setTagIDS([]);
        setDriverIDS([]);
    }, [initial_project]);
    useEffect(() => {
        if (stateConfig.driverSubmit) {
            postDriver(route('projects.driver.save'), {
                onSuccess: () => {
                    toast.success('Driver Saved');
                    // resetDriver('driver', 'tag_id');
                    setDriver({ ...dataDriver, driver: '', tag_id: undefined });
                }
            });
            setStateConfig({ ...stateConfig, driverSubmit: false });
        }
    }, [dataDriver, setDriver, initial_project]);
    useEffect(() => {
        if (stateConfig.tagSubmit) {
            postTag(route('projects.tag.save'), {
                onSuccess: () => {
                    toast.success('Tag Saved');
                    setTag({ ...dataTag, name: '' });
                }
            });
            setStateConfig({ ...stateConfig, tagSubmit: false });
        }
    }, [dataTag, setTag, initial_project]);
    useEffect(() => {
        setStateConfig((prev) => ({ ...prev, tagShowOptions: tagIDS.length > 0 }));
    }, [tagIDS])
    useEffect(() => {
        setStateConfig((prev) => ({ ...prev, driverShowOptions: driverIDS.length > 0 }));
    }, [driverIDS])
    const SaveDriver = (id: number | null = null, driver: string | null = null, tag_id: number | null = null) => {
        if (driver && id) {
            setDriver({ ...dataDriver, driver, id, tag_id: tag_id ?? dataDriver.tag_id ?? null })
        } else { setDriver({ ...dataDriver, id: 0 }); }
        setStateConfig({ ...stateConfig, driverSubmit: true });
    }
    const SaveTag = (id: number | null = null, name: string | null = null) => {
        if (name && id) {
            setTag({ ...dataTag, name, id })
        } else { setTag({ ...dataTag, id: 0 }); }
        setStateConfig({ ...stateConfig, tagSubmit: true });
    }
    const DeleteTags = () => {
        axios.post(route('projects.tag.delete'), { ids: tagIDS })
            .then(() => {
                toast.success('Deleted Successfully');
                router.reload();
            })
    }
    const DeleteDriver = () => {
        axios.post(route('projects.driver.delete'), { ids: driverIDS })
            .then(() => {
                toast.success('Deleted Successfully');
                router.reload();
            })
    }
    // TODO: Finish Select Action then Report and Overview should be done today. 
    const handleCheckboxDriver = (id: number) => {
        const driverID = driverIDS.find(val => val === id);
        if (driverID) {
            const removed = driverIDS.filter(val => val != id);
            setDriverIDS(removed)
        } else { setDriverIDS([...driverIDS, id]) }
    }
    const selectAllDriver = (all: boolean) => {
        if (all) {
            setDriverIDS(project.drivers.map(tag => tag.id));
        } else { setDriverIDS([]); }
    }
    const handleCheckboxTag = (id: number) => {
        const tagID = tagIDS.find(val => val === id);
        if (tagID) {
            const removed = tagIDS.filter(val => val != id);
            setTagIDS(removed)
        } else { setTagIDS([...tagIDS, id]) }
    }
    const selectAllTag = (all: boolean) => {
        if (all) {
            setTagIDS(project.tags.map(tag => tag.id));
        } else { setTagIDS([]); }
    }
    const sensorsDriver = useSensors(useSensor(PointerSensor));

    const handleDragEndDriver = (event: any) => {
        const { active, over } = event;
        if (active.id !== over?.id) {
            const oldIndex = (project.drivers || []).findIndex(
                (driver) => driver.id === active.id
            );
            const newIndex = (project.drivers || []).findIndex(
                (driver) => driver.id === over.id
            );
            const result = () => {
                let elements: Driver[] = arrayMove(project.drivers, oldIndex, newIndex);
                elements.map((e, index) => {
                    e.position = index + 1;
                });
                return elements;
            }
            setProject((prev) => ({ ...prev, drivers: result() }));
            axios.post(route('projects.driver.position.save'), {
                drivers: result()
            }).then(() => {
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
                <Tabs defaultValue="drivers" className="w-[400px]">
                    <TabsList>
                        <TabsTrigger value="drivers">Drivers</TabsTrigger>
                        <TabsTrigger value="tags">Tags</TabsTrigger>
                    </TabsList>
                    <TabsContent value="drivers">
                        <div className="flex w-full max-w-sm items-center space-x-2 p-5">
                            <div className='flex-1 space-y-2'>
                                <Input value={dataDriver.driver} type="email" placeholder="Driver (Press Enter to Add)" onKeyDown={(e) => { if (e.key === 'Enter') { SaveDriver() } }} onChange={(e) => setDriver('driver', e.currentTarget.value)} />
                                {(project.tags || []).length > 1 && <Select key={dataDriver.tag_id ?? "empty"} value={dataDriver.tag_id ? dataDriver.tag_id.toString() : undefined} onValueChange={(e) => setDriver('tag_id', parseInt(e))}>
                                    <SelectTrigger >
                                        <SelectValue placeholder="Select Tag (Optional)" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        {(project.tags || []).length < 1 && <p className='text-center'>No Records</p>}
                                        {(project.tags || []).map(data => <SelectItem key={data.id} value={data.id.toString()}>{data.name}</SelectItem>)}
                                    </SelectContent>
                                </Select>}
                                <Button className='flex ml-auto' type="submit" onClick={() => SaveDriver()}>Add Driver</Button>
                            </div>
                        </div>
                        <div className="flex items-center space-x-2 pl-3 pb-3">
                            <Checkbox checked={stateConfig.driverShowOptions} onCheckedChange={selectAllDriver} />
                            {(!stateConfig.driverShowOptions && !stateConfig.driverOnDelete) && <label
                                className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                            >
                                Select All Drivers
                            </label>}
                            {stateConfig.driverShowOptions && <div className='space-x-2'>
                                <Button onClick={DeleteDriver} variant={'ghost'} size={'sm'} ><TrashIcon className='mr-2' /> Delete</Button>
                            </div>}
                        </div>
                        <ScrollArea className='h-[250px] w-full overflow-auto pr-4'>
                            {((project.drivers || []).length < 1 && <p className='text-center w-full'>- No Records Found - </p>)}
                            <DndContext sensors={sensorsDriver} collisionDetection={closestCenter} onDragEnd={handleDragEndDriver}>
                                <SortableContext items={(project.drivers || [])} strategy={verticalListSortingStrategy}>
                                    {(project.drivers || []).map(data => {
                                        const driverConfig: configuration = { type: 'driver', confirm: false, delete: false, editable: false, tag: false };
                                        return <Carditem
                                            taggable
                                            checked={driverIDS.includes(data.id)}
                                            key={`driver${data.id}`}
                                            update={(name: string, tag_id?: number | null) => SaveDriver(data.id, name, tag_id)}
                                            handleCheck={(id: number) => { handleCheckboxDriver(id) }}
                                            config={driverConfig}
                                            id={data.id}
                                            name={data.driver}
                                            project={project}
                                        />;
                                    })}
                                </SortableContext>
                            </DndContext>
                        </ScrollArea>
                    </TabsContent>
                    <TabsContent value="tags">
                        <div className="flex w-full max-w-sm items-center space-x-2 p-5">
                            <Input value={dataTag.name} placeholder="Press Enter To Add Tag" onKeyDown={(e) => { if (e.key === 'Enter') { SaveTag() } }} onChange={(e) => setTag('name', e.currentTarget.value)} />
                            <Button type="submit" onClick={() => SaveTag()}>Add</Button>
                        </div>
                        <div className="flex items-center space-x-2 pl-3 pb-3">
                            <Checkbox checked={stateConfig.tagShowOptions} onCheckedChange={selectAllTag} />
                            {(!stateConfig.tagShowOptions && !stateConfig.tagOnDelete) && <label
                                className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                            >
                                Select All Tags
                            </label>}
                            {stateConfig.tagShowOptions && <div className='space-x-2'>
                                <Button onClick={DeleteTags} variant={'ghost'} size={'sm'} ><TrashIcon className='mr-2' /> Delete</Button>
                            </div>}
                        </div>
                        <ScrollArea className='h-[350px] w-full overflow-auto'>
                            {((project.tags || []).length < 1 && <p className='text-center w-full'>- No Records Found - </p>)}
                            {(project.tags || []).map(data => {
                                const tagConfig: configuration = { type: 'tag', confirm: false, delete: false, editable: false, tag: false };
                                return <Carditem
                                    checked={tagIDS.includes(data.id)}
                                    key={`tag${data.id}`}
                                    update={(name: string) => SaveTag(data.id, name)}
                                    handleCheck={(id: number) => { handleCheckboxTag(id) }}
                                    config={tagConfig}
                                    id={data.id}
                                    name={data.name}
                                    project={project}
                                />
                            })}
                        </ScrollArea>
                    </TabsContent>
                </Tabs>
            </DialogContent>
        </Dialog>
    </>
}
