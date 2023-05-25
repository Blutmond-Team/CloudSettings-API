"use client"
import {Disclosure} from '@headlessui/react'
import {Bars3Icon, XMarkIcon} from '@heroicons/react/24/outline'
import {HTMLAttributeAnchorTarget, useMemo} from "react";
import {signIn, signOut, useSession} from "next-auth/react";
import {UserProfileImg} from "@/app/UserProfileImg";
import CloudSettingsLogo from '@/public/cloudsettings_logo_transparent.png';
import {ProfileDropdown} from "@/app/ProfileDropdown";
import {CloudSettingsSession} from "@/src/types/AuthTypes";
import {usePathname} from "next/navigation";
import AppFooter from "@/app/AppFooter";

type Props = {
    children: React.ReactNode
}

function classNames(...classes: string[]) {
    return classes.filter(Boolean).join(' ');
}

type NavigationItem = {
    name: string,
    href: string,
    current: (path: string) => boolean
    target?: HTMLAttributeAnchorTarget
}

const navigation: NavigationItem[] = [
    {
        name: 'Home',
        href: '/',
        current: path => path === "" || path === "/"
    },
    {
        name: 'GitHub (Mod)',
        href: 'https://github.com/Blutmond-Team/CloudSettings-Mod',
        current: () => false,
        target: "_blank"
    },
    {
        name: 'GitHub (Web App)',
        href: 'https://github.com/Blutmond-Team/CloudSettings-API',
        current: () => false,
        target: "_blank"
    }
]

type UserNavigationItem = {
    key: string,
    name: string,
    href: string
}

const userNavigation: UserNavigationItem[] = [
    {
        key: "profile",
        name: 'Your Profile',
        href: '/profile'
    }
]

export function AppShell({children}: Props) {
    const path = usePathname();
    const session = useSession();
    const user = useMemo(() => {
        switch (session.status) {
            default:
                return undefined;
            case "authenticated":
                return session.data as CloudSettingsSession;
        }
    }, [session]);
    return (
        <div className={"min-h-full"}>
            <Disclosure as={"nav"} className={
                "border-b border-gray-200 bg-white " +
                "dark:border-pale-700 dark:bg-pale-800"
            }>
                {({open}) => (
                    <>
                        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
                            <div className="flex h-16 justify-between">
                                <div className="flex">
                                    <div className="flex flex-shrink-0 items-center">
                                        <img
                                            className="block h-8 w-auto lg:hidden"
                                            src={CloudSettingsLogo.src}
                                            alt="CloudSettings"
                                        />
                                        <img
                                            className="hidden h-8 w-auto lg:block"
                                            src={CloudSettingsLogo.src}
                                            alt="CloudSettings"
                                        />
                                    </div>
                                    <div className="hidden sm:-my-px sm:ml-6 sm:flex sm:space-x-8">
                                        {navigation.map((item) => (
                                            <a
                                                key={item.name}
                                                href={item.href}
                                                target={item.target}
                                                className={classNames(
                                                    item.current(path)
                                                        ? 'border-indigo-700 text-pale-900 dark:text-white'
                                                        : 'border-transparent text-pale-500 hover:border-gray-300 hover:text-pale-800 dark:hover:text-pale-100',
                                                    'inline-flex items-center border-b-2 px-1 pt-1 text-sm font-medium'
                                                )}
                                                aria-current={item.current(path) ? 'page' : undefined}
                                            >
                                                {item.name}
                                            </a>
                                        ))}
                                    </div>
                                </div>
                                <div className="hidden sm:ml-6 sm:flex sm:items-center">
                                    {
                                        // Profile dropdown
                                        user ? <ProfileDropdown session={session.data as CloudSettingsSession}
                                                                navigation={userNavigation}/> :
                                            // Login Button
                                            <div onClick={() => signIn('azure-ad')} className={"cursor-pointer"}>Log
                                                In</div>
                                    }
                                </div>
                                <div className="-mr-2 flex items-center sm:hidden">
                                    {/* Mobile menu button */}
                                    <Disclosure.Button
                                        className="inline-flex items-center justify-center rounded-md bg-white dark:bg-pale-700 p-2 text-pale-400 dark:text-white hover:bg-pale-100 dark:hover:bg-pale-600 hover:text-pale-500 dark:hover:text-white">
                                        <span className="sr-only">Open main menu</span>
                                        {open ? (
                                            <XMarkIcon className="block h-6 w-6" aria-hidden="true"/>
                                        ) : (
                                            <Bars3Icon className="block h-6 w-6" aria-hidden="true"/>
                                        )}
                                    </Disclosure.Button>
                                </div>
                            </div>
                        </div>

                        <Disclosure.Panel className="sm:hidden">
                            <div className="space-y-1 pb-3 pt-2">
                                {navigation.map((item) => (
                                    <Disclosure.Button
                                        key={item.name}
                                        as="a"
                                        href={item.href}
                                        className={classNames(
                                            item.current(path)
                                                ? 'border-indigo-500 bg-pale-100 dark:bg-pale-600 dark:text-white text-black'
                                                : 'border-transparent text-gray-600 hover:border-gray-300 hover:bg-gray-50 hover:text-gray-800',
                                            'block border-l-4 py-2 pl-3 pr-4 text-base font-medium'
                                        )}
                                        aria-current={item.current(path) ? 'page' : undefined}
                                    >
                                        {item.name}
                                    </Disclosure.Button>
                                ))}
                            </div>
                            {
                                user ? <div className="border-t border-gray-200 pb-3 pt-4">
                                    <div className="flex items-center px-4">
                                        <div className="flex-shrink-0">
                                            <UserProfileImg session={session.data as CloudSettingsSession}
                                                            className={"h-10 w-10"}/>
                                        </div>
                                        <div className="ml-3">
                                            <div className="text-base font-medium text-gray-800">{user.postLogin ? user.minecraft.username : user.user?.name}</div>
                                            <div className="text-sm font-medium text-gray-500">{user.postLogin ? user.minecraft.uuid : user.user?.email}</div>
                                        </div>
                                    </div>
                                    <div className="mt-3 space-y-1">
                                        {userNavigation.map((item) => (
                                            <Disclosure.Button
                                                key={item.name}
                                                as="a"
                                                href={item.href}
                                                className="block px-4 py-2 text-base font-medium text-gray-500 hover:bg-gray-100 hover:text-gray-800"
                                            >
                                                {item.name}
                                            </Disclosure.Button>
                                        ))}
                                        <Disclosure.Button
                                            key={"sign out"}
                                            as="a"
                                            className="block px-4 py-2 text-base font-medium text-gray-500 hover:bg-gray-100 hover:text-gray-800 cursor-pointer"
                                            onClick={()=> signOut()}
                                        >
                                            Sign Out
                                        </Disclosure.Button>
                                    </div>
                                </div> : <div className="border-t border-gray-200 pb-3 pt-4">
                                    <div className="mt-3 space-y-1">
                                        <Disclosure.Button
                                            key={"sign out"}
                                            as="a"
                                            className="block px-4 py-2 text-base font-medium text-gray-500 hover:bg-gray-100 hover:text-gray-800 cursor-pointer"
                                            onClick={()=> signIn('azure-ad')}
                                        >
                                            Sign In
                                        </Disclosure.Button>
                                    </div>
                                </div>
                            }
                        </Disclosure.Panel>
                    </>
                )}
            </Disclosure>
            <div className="py-10">
                {children}
            </div>
            <AppFooter/>
        </div>
    );
}