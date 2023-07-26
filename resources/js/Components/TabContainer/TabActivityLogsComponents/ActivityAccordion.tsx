import React, { FC } from 'react'
import { LogsBySessionId } from '../TabActivityLogs';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/Components/ui/accordion';
import ActivityAccordionContent from './ActivityAccordionContent';

interface ActivityAccordionProps {
    logsBySessionId:LogsBySessionId[];
}

const ActivityAccordion:FC<ActivityAccordionProps> = ({logsBySessionId}) => {
    return (
        <Accordion type="single" collapsible className="w-full">
            {
                logsBySessionId.map(log=>(
                    <AccordionItem key={log.sessionId} value={log.sessionId.toString()}>
                        <AccordionTrigger>{log.dates}</AccordionTrigger>
                        <AccordionContent>
                            <ActivityAccordionContent log={log} />
                        </AccordionContent>
                    </AccordionItem>
                ))
            }
            
        </Accordion>
    )
}

export default ActivityAccordion;


