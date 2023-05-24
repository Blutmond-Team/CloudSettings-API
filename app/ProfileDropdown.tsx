import {Menu, Transition} from "@headlessui/react";
import {UserProfileImg} from "@/app/UserProfileImg";
import {Fragment} from "react";
import {DefaultSession} from "next-auth";
import {signOut} from "next-auth/react";

type Props = {
    user: DefaultSession['user'],
    navigation: { key: string, name: string | React.ReactNode, href: string }[]
}

function classNames(...classes: string[]) {
    return classes.filter(Boolean).join(' ');
}

export const ProfileDropdown = ({user, navigation}: Props) => {
    return (
        <Menu as="div" className="relative ml-3">
            <div>
                <Menu.Button
                    className="flex max-w-xs items-center rounded-full bg-white text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2">
                    <span className="sr-only">Open user menu</span>
                    <UserProfileImg user={user} className={"h-8 w-8 rounded-full"}/>
                </Menu.Button>
            </div>
            <Transition
                as={Fragment}
                enter="transition ease-out duration-200"
                enterFrom="transform opacity-0 scale-95"
                enterTo="transform opacity-100 scale-100"
                leave="transition ease-in duration-75"
                leaveFrom="transform opacity-100 scale-100"
                leaveTo="transform opacity-0 scale-95"
            >
                <Menu.Items
                    className="absolute right-0 z-10 mt-2 w-48 origin-top-right rounded-md bg-white py-1 shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none">
                    {navigation.map((item) => (
                        <Menu.Item key={item.key}>
                            {({active}) => (
                                <a href={item.href}
                                   className={classNames(active ? 'bg-gray-100' : '', 'block px-4 py-2 text-sm text-gray-700')}
                                >
                                    {item.name}
                                </a>
                            )}
                        </Menu.Item>
                    ))}
                    <Menu.Item>
                        {({active}) => (
                            <a onClick={()=> signOut()}
                               className={classNames(active ? 'bg-gray-100 cursor-pointer' : '', 'block px-4 py-2 text-sm text-gray-700')}
                            >
                                Sign Out
                            </a>
                        )}
                    </Menu.Item>
                </Menu.Items>
            </Transition>
        </Menu>
    );
};