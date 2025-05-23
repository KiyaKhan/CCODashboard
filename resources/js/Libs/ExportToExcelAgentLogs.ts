
import {utils,writeFile} from 'xlsx';


import { AgentLogsFormat, formattedReport, IAgentLogs } from '@/types';


const ExportToExcelAgentLogs:(data:AgentLogsFormat[],fileName:string)=>Promise<void> = async(data,fileName)=>{
    
    const ws=utils.json_to_sheet(data);
    ws['!autofilter'] = { ref:"A1:AB1" };
    const wb=utils.book_new();
    utils.book_append_sheet(wb,ws,"Data");
    writeFile(wb, `${fileName}.xlsx`);
}

export default ExportToExcelAgentLogs