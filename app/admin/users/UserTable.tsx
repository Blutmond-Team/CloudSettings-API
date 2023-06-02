"use client"
import {UserData} from "@/app/admin/users/page";
import {toast} from "react-toastify";
import {Role} from "@prisma/client";
import {useState} from "react";
import {InspectUserModal} from "@/app/admin/users/InspectUserModal";

type Props = {
    title: string
    description?: string
    items: UserData[],
}

export default function UserTable({title, description, items}: Props) {
    const [openModals, setOpenModals] = useState<Record<string, boolean>>({});

    return (
        <div className="px-4 sm:px-6 lg:px-8">
            <div className="sm:flex sm:items-center">
                <div className="sm:flex-auto">
                    <h1 className="text-base font-semibold leading-6 text-pale-900 dark:text-white">{title}</h1>
                    {
                        description && <p className="mt-2 text-sm text-pale-700 dark:text-pale-200">
                            {description}
                        </p>
                    }
                </div>
            </div>
            <div className="mt-8 flow-root">
                <div className="-mx-4 -my-2 overflow-x-auto sm:-mx-6 lg:-mx-8">
                    <div className="inline-block min-w-full py-2 align-middle sm:px-6 lg:px-8">
                        <table className="min-w-full divide-y divide-pale-300 dark:divide-pale-600">
                            <thead>
                            <tr>
                                <th scope="col"
                                    className="py-3.5 pl-4 pr-3 text-left text-sm font-semibold text-pale-900 dark:text-white sm:pl-0">
                                    Username
                                </th>
                                <th scope="col"
                                    className="px-3 py-3.5 text-left text-sm font-semibold text-pale-900 dark:text-white">
                                    Role
                                </th>
                                <th scope="col"
                                    className="px-3 py-3.5 text-left text-sm font-semibold text-pale-900 dark:text-white">
                                    Joined
                                </th>
                                <th scope="col"
                                    className="px-3 py-3.5 text-left text-sm font-semibold text-pale-900 dark:text-white">
                                    Last activity
                                </th>
                                <th scope="col"
                                    className="px-3 py-3.5 text-left text-sm font-semibold text-pale-900 dark:text-white">
                                    Stored Options
                                </th>
                                <th scope="col"
                                    className="px-3 py-3.5 text-left text-sm font-semibold text-pale-900 dark:text-white">
                                    Actions
                                </th>
                            </tr>
                            </thead>
                            <tbody className="divide-y divide-pale-200">
                            {items.map((item) => (
                                <tr key={item.name}
                                    className={"hover:bg-pale-50 transition-colors dark:hover:bg-pale-800 cursor-default select-none"}>
                                    <td className="whitespace-nowrap py-4 pl-4 pr-3 text-sm font-medium text-pale-900 sm:pl-0 dark:text-white">
                                        {item.name}
                                    </td>
                                    <td className="whitespace-nowrap px-3 py-4 text-sm text-pale-500 dark:text-pale-200">{item.role}</td>
                                    <td className="whitespace-nowrap px-3 py-4 text-sm text-pale-500 dark:text-pale-200">{item.jointAt?.toLocaleString() ?? ""}</td>
                                    <td className="whitespace-nowrap px-3 py-4 text-sm text-pale-500 dark:text-pale-200">{item.lastActivity?.toLocaleString() ?? ""}</td>
                                    <td className="whitespace-nowrap px-3 py-4 text-sm text-pale-500 dark:text-pale-200">{item.options.length}</td>
                                    <td className="whitespace-nowrap px-3 py-4 text-sm text-pale-500 dark:text-pale-200">
                                        <span className="isolate inline-flex rounded-md shadow-sm">
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
