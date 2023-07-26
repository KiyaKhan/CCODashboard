
import {utils,writeFile} from 'xlsx';


import { formattedReport } from '@/types';

const ExportToExcel:(data:formattedReport[],fileName:string)=>Promise<void> = async(data,fileName)=>{
    
    const ws=utils.json_to_sheet(data);
    ws['!autofilter'] = { ref:"A1:AB1" };
    const wb=utils.book_new();
    utils.book_append_sheet(wb,ws,"Data");
    writeFile(wb, `${fileName}.xlsx`);
}

export default ExportToExcel