import React, { FC } from 'react'
import AvatarContainer from '../AvatarContainer'

const TabNotificationContainer:FC = () => {
    return (
        <div className="space-y-8">
            <div className="flex items-center">
                <div className="ml-4 space-y-1">
                <p className="text-sm font-medium leading-none">Olivia Martin</p>
                <p className="text-sm text-muted-foreground">
                    went on Break
                </p>
                </div>
                <div className="ml-auto font-medium text-sm ">30mins ago...</div>
            </div>
        </div>
    )
}

export default TabNotificationContainer