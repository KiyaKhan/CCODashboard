import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/Components/ui/tooltip";
import { FC, ReactNode } from "react";

const TimeInputToolTip:FC<{children:ReactNode}> = ({children}) =>{
    return(
        <TooltipProvider delayDuration={50}>
            <Tooltip>
                <TooltipTrigger asChild>{children}</TooltipTrigger>
                <TooltipContent side='bottom'>
                    <p className='font-semibold'>!! IMPORTANT !!</p>
                    <p>Please make sure you are using Manila Time.</p> 
                    <p>It will be automatically converted to Eastern Time when updating.</p>
                </TooltipContent>
            </Tooltip>
        </TooltipProvider>
    );
}

export default TimeInputToolTip;