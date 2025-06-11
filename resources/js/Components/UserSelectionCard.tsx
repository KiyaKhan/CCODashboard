import { Avatar, AvatarFallback, AvatarImage } from "@/Components/ui/avatar";
import { Button } from "@/Components/ui/button";
import { Card, CardContent, CardDescription, CardTitle } from "@/Components/ui/card";
import { Input } from "@/Components/ui/input";
import { Popover, PopoverContent, PopoverTrigger } from "@/Components/ui/popover";
import { ScrollArea } from "@/Components/ui/scroll-area";
import { Select, SelectContent, SelectItem } from "@/Components/ui/select";
import { Separator } from "@/Components/ui/separator";
import { User } from "@/types";
import { SelectTrigger } from "@radix-ui/react-select";
import React, { FC, useState } from "react";
import { RiAccountCircleFill, RiRefreshFill, RiSearch2Fill } from "react-icons/ri";

interface UserProps {
    label: string;
    user: User | null;
    users: User[];
    onSelectUser: (user: User | null) => void;
    className?: string;
    disabled?: boolean;
}
const UserSelectionCard: FC<UserProps> = ({ disabled = false, className, onSelectUser, label, user, users: initial_users }) => {
    // const [user,setUser] = useState<User|null>(initial_user);
    const [users, setUsers] = useState(initial_users);
    const search = (keyword: string) => {
        const result = initial_users.filter(user => {
            const fullName1 = `${user.first_name} ${user.last_name}`.toLowerCase();
            const fullName2 = `${user.last_name} ${user.first_name}`.toLowerCase();
            return (
                fullName1.includes(keyword.toLowerCase()) || // Check full name
                fullName2.includes(keyword.toLowerCase()) || // Check full name
                user.company_id.toLowerCase().includes(keyword.toLowerCase()) // Check company_id
            );
        })
        setUsers(result);
    }
    const [isFocused, setIsFocused] = useState<boolean>(false);
    const handleFocus = () => setIsFocused(true);
    const handleBlur = () => setIsFocused(false);
    return (
        <>
            {/* className="m-1 max-w-sm max-h-sm shadow-xl " */}
            <div className={`max-h-sm shadow-xl ${className}`}>
                <p className="ml-2">{label}</p>
                <Card className=" border-primary/50 border-2 p-1">
                    {user ? (
                        <>
                            <CardContent className="p-0">
                                <div className="grid grid-cols-1 grid-cols-[0fr_6fr_1fr] gap-2 p-2 flex items-center">
                                    <div>
                                        <Avatar>
                                            <AvatarImage className="w-full h-full" />
                                            <AvatarFallback>{user?.first_name[0] + '' + user?.last_name[0]}</AvatarFallback>
                                        </Avatar>
                                    </div>
                                    <div className="relative w-full">
                                        <h5>{user.first_name + ' ' + user.last_name}</h5>
                                        <CardDescription>{user.position?.position}</CardDescription>
                                    </div>
                                    {!disabled && (
                                        <div className="flex justify-end">
                                            <Button size={"icon"} disabled={disabled} onClick={() => onSelectUser(null)} variant={"ghost"}>
                                                <RiRefreshFill />
                                            </Button>
                                        </div>
                                    )}
                                </div>
                            </CardContent>
                        </>
                    ) : (
                        <>
                            <CardContent className="p-0">
                                <div className="flex items-center">
                                    <div>
                                        <RiAccountCircleFill className="text-gray-500 mr-2" size={40} />
                                    </div>
                                    <div className="relative w-full">
                                        <div className="relative grid w-full items-center gap-1.5">
                                            <div className='flex items-center w-full'>
                                                <div className="w-full relative">
                                                    <Input onFocus={handleFocus} onBlur={handleBlur} onKeyUp={e => search(e.currentTarget.value)} placeholder="Search" className="border-0 w-full text-sm !bg-transparent" />
                                                </div>
                                                <RiSearch2Fill size={18} className="absolute right-3  " />
                                            </div>
                                        </div>
                                        <PopUser setFocused={handleFocus} isFocused={isFocused} onSelectUser={onSelectUser} users={users} />
                                    </div>
                                </div>
                            </CardContent>
                        </>
                    )
                    }
                </Card>
            </div>

        </>
    )
}
interface PopProps {
    setFocused: (b: boolean) => void;
    isFocused: boolean;
    onSelectUser: (user: User) => void;
    users: User[];
}
const PopUser: FC<PopProps> = ({ isFocused, onSelectUser, users, setFocused }) => {
    return (<>
        <Popover open={isFocused} modal>
            <PopoverTrigger className="absolute w-full p-1"></PopoverTrigger>
            <PopoverContent onCloseAutoFocus={(e) => e.preventDefault()} onOpenAutoFocus={(e) => e.preventDefault()} align="center" className="z-50">
                <ScrollArea className="h-40 rounded-md ">
                    <div>
                        {users.length < 1 && <p className="text-lg text-center">- NO AGENT FOUND -</p>}
                        {users.map((user) => (
                            <React.Fragment key={user.id}>
                                <Card className="border-0 cursor-pointer hover:bg-primary/25" onClick={() => onSelectUser(user)}>
                                    <CardContent className="p-1 m-2 ">
                                        <div className="grid grid-cols-1 grid-cols-[1fr_6fr] gap-2 flex items-center">
                                            <div>
                                                <Avatar >
                                                    {/* <AvatarImage src={user?.photo} className="w-full h-full" /> */}
                                                    <AvatarFallback>{user?.first_name[0] + '' + user?.last_name[0]}</AvatarFallback>
                                                </Avatar>
                                            </div>
                                            <div className="relative w-full">
                                                <h5>{user.first_name + ' ' + user.last_name}</h5>
                                                <CardDescription className="text-xs">{user.position?.position}</CardDescription>
                                            </div>
                                        </div>
                                    </CardContent>
                                </Card>
                                <Separator className="my-2" />
                            </React.Fragment>
                        ))}
                    </div>
                </ScrollArea>
            </PopoverContent>
        </Popover>
    </>)
}
export default UserSelectionCard;