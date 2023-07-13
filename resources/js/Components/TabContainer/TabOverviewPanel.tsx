import { FC } from 'react'
import { Bar, BarChart, ResponsiveContainer, XAxis, YAxis } from "recharts"
const TabOverviewPanel:FC = () => {
    return (
        <ResponsiveContainer width="100%" height={350}>
            <BarChart data={sampleData}>
                <XAxis
                dataKey="name"
                stroke="#888888"
                fontSize={12}
                tickLine={false}
                axisLine={false}
                />
                <YAxis
                stroke="#888888"
                fontSize={12}
                tickLine={false}
                axisLine={false}
                //tickFormatter={(value) => `$${value}`}
                />
                <Bar dataKey="total" fill="#adfa1d" radius={[4, 4, 0, 0]} />
            </BarChart>
        </ResponsiveContainer>
    )
}

export default TabOverviewPanel




const sampleData = [
    {
        name: "Break",
        total: Math.floor(Math.random() * 5) + 1,
    },
    {
        name: "Lunch",
        total: Math.floor(Math.random() * 5) + 1,
    },
    {
        name: "Training",
        total: Math.floor(Math.random() * 5) + 1,
    },
    {
        name: "Coaching",
        total: Math.floor(Math.random() * 5) + 1,
    },
    {
        name: "PC Issue",
        total: Math.floor(Math.random() * 5) + 1,
    },
    {
        name: "Floor Support",
        total: Math.floor(Math.random() * 5) + 1,
    },
    {
        name: "OTP",
        total: Math.floor(Math.random() * 5) + 1,
    },
    {
        name: "Special Project",
        total: Math.floor(Math.random() * 5) + 1,
    },
]