import { PageProps } from '@/types';
import { usePage } from '@inertiajs/react';
import { FC } from 'react'
import { Bar, BarChart, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts"
const TabOverviewPanel:FC = () => {
    
    const {statuses} = usePage<PageProps>().props;
    
    const sampleData = statuses.filter(({id})=>id!==10).map(({name})=>({name,total: Math.floor(Math.random() * 5) + 1,}));
    return (
        <ResponsiveContainer width="100%" height={400}>
            <BarChart data={sampleData}>
                <XAxis
                    dataKey="name"
                    stroke="#22c55e"
                    fontSize={11}
                    tickLine={true}
                    axisLine={true}
                    />
                <YAxis
                stroke="#22c55e"
                fontSize={12}
                tickLine={true}
                axisLine={true}
                //tickFormatter={(value) => `$${value}`}
                />
                <Tooltip 
                    itemStyle={{ backgroundColor: 'black' }} 
                    wrapperStyle={{ backgroundColor: 'black' }} 
                    contentStyle={{ backgroundColor: 'black' }} 
                    labelStyle={{ backgroundColor: 'black' }}/>
                <Bar dataKey="total" fill="#adfa1d" radius={[4, 4, 0, 0]} />
            </BarChart>
        </ResponsiveContainer>
    )
}

export default TabOverviewPanel




