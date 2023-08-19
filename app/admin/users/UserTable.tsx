"use client"
import {UserData} from "@/app/admin/users/page";
import {toast} from "react-toastify";
import {useMemo, useState, useTransition} from "react";
import {InspectUserModal} from "@/app/admin/users/InspectUserModal";
import {ArrowDownIcon, ArrowUpIcon} from "@heroicons/react/24/outline";
import Image from "next/image";
import {Role} from ".prisma/client";

type Props = {
    title: string
    description?: string
    items: UserData[],
    revalidateFunction: VoidFunction
}

type SortingMethod = "Last Activity decreasing" | "Last Activity increasing" |
    "Joined decreasing" | "Joined increasing" |
    "Stored Option count decreasing" | "Stored Option count increasing" |
    "Username decreasing" | "Username increasing";

export default function UserTable({title, description, items, revalidateFunction}: Props) {
    const [isPending, startTransition] = useTransition();
    const [openModals, setOpenModals] = useState<Record<string, boolean>>({});
    const [sortingMethod, setSortingMethod] = useState<SortingMethod>("Last Activity decreasing");

    const sortedItems = useMemo(() => {
        return items.sort((a, b) => {
            switch (sortingMethod) {
                default:
                    return 0;
                case "Username decreasing":
                    return a.name.localeCompare(b.name);
                case "Username increasing":
                    return b.name.localeCompare(a.name);
                case "Joined decreasing":
                    return b.jointAt.getTime() - a.jointAt.getTime();
                case "Joined increasing":
                    return a.jointAt.getTime() - b.jointAt.getTime();
                case "Last Activity decreasing":
                    return b.lastActivity.getTime() - a.lastActivity.getTime();
                case "Last Activity increasing":
                    return a.lastActivity.getTime() - b.lastActivity.getTime();
                case "Stored Option count decreasing":
                    return b.options.length - a.options.length;
                case "Stored Option count increasing":
                    return a.options.length - b.options.length;
            }
        });
    }, [items, sortingMethod]);

    return (
        <div className="px-4 sm:px-6 lg:px-8">
            <div className="sm:flex sm:items-center">
                <div className="sm:flex-auto">
                    <h1 className="text-base font-semibold leading-6 text-pale-900 dark:text-white">{title}</h1>
                    {
                        description && <p
                            className="mt-2 text-sm text-pale-700 dark:text-pale-200 cursor-pointer dark:hover:text-blue-300 transition-colors"
                            onClick={() => startTransition(() => revalidateFunction())}
                            title={"Click to refresh data"}
                        >
                            {description}
                        </p>
                    }
                </div>
            </div>
            <div className="mt-8 flow-root user-table-items overflow-y-auto overflow-x-hidden max-w-full">
                <div className="-mx-4 -my-2 overflow-x-auto sm:-mx-6 lg:-mx-8">
                    <div className="inline-block min-w-full py-2 align-middle sm:px-6 lg:px-8">
                        <table className="min-w-full divide-y divide-pale-300 dark:divide-pale-600">
                            <thead>
                            <tr>
                                <th scope="col"
                                    className="px-3 py-3.5 text-left text-sm font-semibold text-pale-900 dark:text-white">
                                    User Head
                                </th>
                                <th scope="col"
                                    className="py-3.5 pl-4 pr-3 text-left text-sm font-semibold text-pale-900 dark:text-white sm:pl-0 cursor-pointer select-none hover:bg-pale-50 transition-colors dark:hover:bg-pale-800"
                                    onClick={() => {
                                        if (sortingMethod === "Username decreasing") {
                                            setSortingMethod("Username increasing");
                                        } else {
                                            setSortingMethod("Username decreasing");
                                        }
                                    }}
                                >
                                    <div className={"flex justify-between"}>
                                        <span>
                                            Username
                                        </span>
                                        {sortingMethod === "Username increasing" &&
                                            <ArrowUpIcon
                                                className={"w-4"}/>} {sortingMethod === "Username decreasing" &&
                                        <ArrowDownIcon className={"w-4"}/>}
                                    </div>
                                </th>
                                <th scope="col"
                                    className="px-3 py-3.5 text-left text-sm font-semibold text-pale-900 dark:text-white select-none hidden lg:table-cell"
                                >
                                    Role
                                </th>
                                <th scope="col"
                                    className="px-3 py-3.5 text-left text-sm font-semibold text-pale-900 dark:text-white cursor-pointer select-none hover:bg-pale-50 transition-colors dark:hover:bg-pale-800 hidden md:table-cell"
                                    onClick={() => {
                                        if (sortingMethod === "Joined decreasing") {
                                            setSortingMethod("Joined increasing");
                                        } else {
                                            setSortingMethod("Joined decreasing");
                                        }
                                    }}
                                >
                                    <div className={"flex justify-between"}>
                                        <span>
                                            Joined
                                        </span>
                                        {sortingMethod === "Joined increasing" &&
                                            <ArrowUpIcon
                                                className={"w-4"}/>} {sortingMethod === "Joined decreasing" &&
                                        <ArrowDownIcon className={"w-4"}/>}
                                    </div>
                                </th>
                                <th scope="col"
                                    className="px-3 py-3.5 text-left text-sm font-semibold text-pale-900 dark:text-white cursor-pointer select-none hover:bg-pale-50 transition-colors dark:hover:bg-pale-800"
                                    onClick={() => {
                                        if (sortingMethod === "Last Activity decreasing") {
                                            setSortingMethod("Last Activity increasing");
                                        } else {
                                            setSortingMethod("Last Activity decreasing");
                                        }
                                    }}
                                >
                                    <div className={"flex justify-between"}>
                                        <span>
                                            Last activity
                                        </span>
                                        {sortingMethod === "Last Activity increasing" &&
                                            <ArrowUpIcon
                                                className={"w-4"}/>} {sortingMethod === "Last Activity decreasing" &&
                                        <ArrowDownIcon className={"w-4"}/>}
                                    </div>
                                </th>
                                <th scope="col"
                                    className="px-3 py-3.5 text-left text-sm font-semibold text-pale-900 dark:text-white cursor-pointer select-none hover:bg-pale-50 transition-colors dark:hover:bg-pale-800"
                                    onClick={() => {
                                        if (sortingMethod === "Stored Option count decreasing") {
                                            setSortingMethod("Stored Option count increasing");
                                        } else {
                                            setSortingMethod("Stored Option count decreasing");
                                        }
                                    }}
                                >
                                    <div className={"flex justify-between"}>
                                        <span>
                                            Stored Options
                                        </span>
                                        {sortingMethod === "Stored Option count increasing" &&
                                            <ArrowUpIcon
                                                className={"w-4"}/>} {sortingMethod === "Stored Option count decreasing" &&
                                        <ArrowDownIcon className={"w-4"}/>}
                                    </div>
                                </th>
                                <th scope="col"
                                    className="px-3 py-3.5 text-left text-sm font-semibold text-pale-900 dark:text-white">
                                    Actions
                                </th>
                            </tr>
                            </thead>
                            <tbody className="divide-y divide-pale-200">
                            {sortedItems.map((item) => (
                                <tr key={item.name}
                                    className={"hover:bg-pale-50 transition-colors dark:hover:bg-pale-800 cursor-default select-none"}
                                >
                                    <td className="whitespace-nowrap px-3 py-4 text-sm text-pale-500 dark:text-pale-200">
                                        <Image
                                            src={`https://mc-heads.net/avatar/${item.id}`}
                                            alt={"Player Head"}
                                            width={32}
                                            height={32}
                                        />
                                    </td>
                                    <td className="whitespace-nowrap py-4 pl-4 pr-3 text-sm font-medium text-pale-900 sm:pl-0 dark:text-white">
                                        {item.name}
                                    </td>
                                    <td className="whitespace-nowrap px-3 py-4 text-sm text-pale-500 dark:text-pale-200 hidden lg:table-cell">{item.role}</td>
                                    <td className="whitespace-nowrap px-3 py-4 text-sm text-pale-500 dark:text-pale-200 hidden md:table-cell">{item.jointAt?.toLocaleString() ?? ""}</td>
                                    <td className="whitespace-nowrap px-3 py-4 text-sm text-pale-500 dark:text-pale-200">{item.lastActivity?.toLocaleString() ?? ""}</td>
                                    <td className="whitespace-nowrap px-3 py-4 text-sm text-pale-500 dark:text-pale-200">{item.options.length}</td>
                                    <td className="whitespace-nowrap px-3 py-4 text-sm text-pale-500 dark:text-pale-200">
                                        <span className="isolate rounded-md shadow-sm flex-col lg:columns-3 columns-1">
                                            {
                                                item.role === "BANNED" ? <button
                                                    type="button"
                                                    className="relative inline-flex items-center rounded-l-md bg-white dark:bg-pale-800 px-3 py-2 text-sm font-semibold text-pale-900 dark:text-white ring-1 ring-inset ring-pale-300 dark:ring-pale-700 hover:bg-pale-50 dark:hover:bg-pale-700 focus:z-10 transition-colors"
                                                    onClick={() => {
                                                        toast(<div>
                                                            <p>Are you sure you want to unban {item.name}?</p>
                                                            <div className={"w-full flex justify-end"}>
                                                                <button
                                                                    type="button"
                                                                    className="relative inline-flex items-center rounded-md bg-white dark:bg-pale-800 px-3 py-2 text-sm font-semibold text-pale-900 dark:text-white ring-1 ring-inset ring-pale-300 dark:ring-pale-700 hover:bg-pale-50 dark:hover:bg-pale-700 focus:z-10 transition-colors"
                                                                    onClick={() => {
                                                                        const body: { role: Role } = {role: "USER"}

                                                                        fetch(`/api/user/${item.id}/role`, {
                                                                            method: "POST",
                                                                            headers: {
                                                                                "Content-Type": "application/json",
                                                                                "Accept": "application/json"
                                                                            },
                                                                            body: JSON.stringify(body)
                                                                        }).then(value => {
                                                                            if (value.ok) {
                                                                                toast(`User ${item.name} was successfully unbanned.`, {
                                                                                    position: "bottom-right",
                                                                                    autoClose: 5000,
                                                                                    hideProgressBar: false,
                                                                                    theme: window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light',
                                                                                    type: "success"
                                                                                })
                                                                                startTransition(() => revalidateFunction());
                                                                            }
                                                                        })
                                                                    }}
                                                                >Unban {item.name}</button>
                                                            </div>
                                                        </div>, {
                                                            position: "bottom-right",
                                                            autoClose: 4000,
                                                            hideProgressBar: false,
                                                            theme: window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light',
                                                            type: "warning"
                                                        })
                                                    }}
                                                >
                                                    Unban User
                                                </button> : <button
                                                    type="button"
                                                    className="relative inline-flex items-center rounded-l-md bg-white dark:bg-pale-800 px-3 py-2 text-sm font-semibold text-pale-900 dark:text-white ring-1 ring-inset ring-pale-300 dark:ring-pale-700 hover:bg-pale-50 dark:hover:bg-pale-700 focus:z-10 transition-colors"
                                                    onClick={() => {
                                                        toast(<div>
                                                            <p>Are you sure you want to ban {item.name}?</p>
                                                            <div className={"w-full flex justify-end"}>
                                                                <button
                                                                    type="button"
                                                                    className="relative inline-flex items-center rounded-md bg-white dark:bg-pale-800 px-3 py-2 text-sm font-semibold text-pale-900 dark:text-white ring-1 ring-inset ring-pale-300 dark:ring-pale-700 hover:bg-pale-50 dark:hover:bg-pale-700 focus:z-10 transition-colors"
                                                                    onClick={() => {
                                                                        const body: { role: Role } = {role: "BANNED"}
                                                                        fetch(`/api/user/${item.id}/role`, {
                                                                            method: "POST",
                                                                            headers: {
                                                                                "Content-Type": "application/json",
                                                                                "Accept": "application/json"
                                                                            },
                                                                            body: JSON.stringify(body)
                                                                        }).then(value => {
                                                                            if (value.ok) {
                                                                                toast(`User ${item.name} was successfully banned.`, {
                                                                                    position: "bottom-right",
                                                                                    autoClose: 5000,
                                                                                    hideProgressBar: false,
                                                                                    theme: window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light',
                                                                                    type: "success"
                                                                                })
                                                                                startTransition(() => revalidateFunction());
                                                                            }
                                                                        })
                                                                    }}
                                                                >Ban {item.name}</button>
                                                            </div>
                                                        </div>, {
                                                            position: "bottom-right",
                                                            autoClose: 4000,
                                                            hideProgressBar: false,
                                                            theme: window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light',
                                                            type: "warning"
                                                        })
                                                    }}
                                                >
                                                    Ban User
                                                </button>
                                            }
                                            {
                                                item.options.length > 0 && <>
                                                    <button
                                                        className={"relative inline-flex items-center bg-white dark:bg-pale-800 px-3 py-2 text-sm font-semibold text-pale-900 dark:text-white ring-1 ring-inset ring-pale-300 dark:ring-pale-700 hover:bg-pale-50 dark:hover:bg-pale-700 focus:z-10 transition-colors"}
                                                        onClick={() => {
                                                            const copy = {
                                                                ...openModals
                                                            };
                                                            copy[item.id] = true;
                                                            setOpenModals(copy);
                                                        }}
                                                    >
                                                        Inspect Options
                                                    </button>
                                                    <InspectUserModal
                                                        userName={item.name}
                                                        options={item.options}
                                                        open={openModals[item.id] ?? false}
                                                        setOpen={value => {
                                                            const copy = {
                                                                ...openModals
                                                            };
                                                            copy[item.id] = value;
                                                            setOpenModals(copy);
                                                        }}
                                                        revalidate={revalidateFunction}
                                                    />
                                                </>
                                            }
                                            <button
                                                type="button"
                                                className="relative -ml-px inline-flex items-center rounded-r-md bg-white dark:bg-pale-800 px-3 py-2 text-sm font-semibold text-pale-900 dark:text-white ring-1 ring-inset ring-pale-300 dark:ring-pale-700 hover:bg-pale-50 dark:hover:bg-pale-700 focus:z-10 transition-colors"
                                                onClick={() => {
                                                    toast(<div>
                                                        <p>Are you sure you want to delete {item.name}?</p>
                                                        <div className={"w-full flex justify-end"}>
                                                            <button
                                                                type="button"
                                                                className="relative inline-flex items-center rounded-md bg-white dark:bg-pale-800 px-3 py-2 text-sm font-semibold text-pale-900 dark:text-white ring-1 ring-inset ring-pale-300 dark:ring-pale-700 hover:bg-pale-50 dark:hover:bg-pale-700 focus:z-10 transition-colors"
                                                                onClick={() => {
                                                                    fetch(`/api/user/${item.id}`, {
                                                                        method: "DELETE",
                                                                        headers: {
                                                                            "Content-Type": "application/json",
                                                                            "Accept": "application/json"
                                                                        }
                                                                    }).then(value => {
                                                                        if (value.ok) {
                                                                            toast(`User ${item.name} was successfully deleted.`, {
                                                                                position: "bottom-right",
                                                                                autoClose: 5000,
                                                                                hideProgressBar: false,
                                                                                theme: window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light',
                                                                                type: "success"
                                                                            })
                                                                            startTransition(() => revalidateFunction());
                                                                        }
                                                                    })
                                                                }}
                                                            >Delete {item.name}</button>
                                                        </div>
                                                    </div>, {
                                                        position: "bottom-right",
                                                        autoClose: 5000,
                                                        hideProgressBar: false,
                                                        theme: window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light',
                                                        type: "error"
                                                    })
                                                }}
                                            >
                                                Delete User
                                              </button>
                                        </span>
                                    </td>
                                </tr>
                            ))}
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>
        </div>
    )
}
