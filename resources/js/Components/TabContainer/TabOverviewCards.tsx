import { FC } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '../ui/card';
import {IoCallOutline, IoPeople} from 'react-icons/io5';
import {SlSizeFullscreen} from 'react-icons/sl';
import { MdOutlineAlternateEmail } from 'react-icons/md';

const TabOverviewCards:FC = () => {
    return (
        <>
            
            <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-sm font-medium">
                        Team Size
                    </CardTitle>
                    <SlSizeFullscreen />
                </CardHeader>
                <CardContent>
                    <div className="text-2xl font-bold">2350</div>
                </CardContent>
            </Card>
            <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-sm font-medium">
                        Total Agents Online
                    </CardTitle>
                    <IoPeople />
                </CardHeader>
                <CardContent>
                    <div className="text-2xl font-bold">100</div>
                    <p className="text-xs text-muted-foreground">
                    10 Agents are on Break and/or Lunch
                    </p>
                </CardContent>
            </Card>
            <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-sm font-medium">Sales</CardTitle>
                    <IoCallOutline />
                </CardHeader>
                <CardContent>
                    <div className="text-2xl font-bold">50</div>
                    <p className="text-xs text-muted-foreground">
                        Available on Calls
                    </p>
                </CardContent>
                </Card>
                <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-sm font-medium">
                    Active Now
                    </CardTitle>
                    <MdOutlineAlternateEmail />
                </CardHeader>
                <CardContent>
                    <div className="text-2xl font-bold">25</div>
                    <p className="text-xs text-muted-foreground">
                        Available on Email
                    </p>
                </CardContent>
            </Card>
        </>
    )
}

export default TabOverviewCards