import React, { FC } from 'react'
import { LogsBySessionId } from '../TabActivityLogs';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/Components/ui/accordion';
import ActivityAccordionContent from './ActivityAccordionContent';
import useShowActivityAddDialog from '@/Hooks/useShowActivityAddDialog';
import { Button } from '@/Components/ui/button';
import { TbCirclePlus } from 'react-icons/tb';

interface ActivityAccordionProps {
    logsBySessionId:LogsBySessionId[];
}

const ActivityAccordion:FC<ActivityAccordionProps> = ({logsBySessionId}) => {
    const {setShowActivityAddDialog} = useShowActivityAddDialog();
    const handleInsert = (sessionId:string) =>{
        setShowActivityAddDialog(true,sessionId)
    }
    return (
        <Accordion type="single" collapsible className="w-full">
            {
                logsBySessionId.map(log=>(
                    
                    <AccordionItem key={log.sessionId} value={log.sessionId.toString()}>
                        <AccordionTrigger>{log.dates}</AccordionTrigger>
                        <AccordionContent>
                            <div className='border rounded-lg border-muted-foreground py-3.5 px-2.5' >
                                <Button variant='secondary' size='default' className='ml-auto mb-2.5 flex items-center justify-center space-x-1.5' onClick={()=>handleInsert(log.sessionId.toString())}>
                                    <span className='font-semibold'>Insert</span>
                                    <TbCirclePlus size={20} />
                                </Button>
                                <ActivityAccordionContent log={log} />
                            </div>
                        </AccordionContent>
                    </AccordionItem>
                ))
            }
            
        </Accordion>
    )
}

export default ActivityAccordion;


