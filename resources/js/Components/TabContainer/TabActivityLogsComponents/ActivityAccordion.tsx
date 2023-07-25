import React, { FC } from 'react'
import { LogsBySessionId } from '../TabActivityLogs';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/Components/ui/accordion';

interface ActivityAccordionProps {
    logsBySessionId:LogsBySessionId[];
}

const ActivityAccordion:FC<ActivityAccordionProps> = ({logsBySessionId}) => {
    return (
        <Accordion type="single" collapsible className="w-full">
            {
                logsBySessionId.map(log=>(
                    <AccordionItem value={log.sessionId.toString()}>
                        <AccordionTrigger>{log.dates}</AccordionTrigger>
                        <AccordionContent>
                            TODO: Display Logs Here
                        </AccordionContent>
                    </AccordionItem>
                ))
            }
            
        </Accordion>
    )
}

export default ActivityAccordion