"use client"
import {UserData} from "@/app/admin/users/page";

type Props = {
    title: string
    description?: string
    items: UserData[],
}

export default function UserTable({title, description, items}: Props) {
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
                            </tr>
                            </thead>
                            <tbody className="divide-y divide-pale-200">
                            {items.map((item) => (
                                <tr key={item.name}
                                    className={"hover:bg-pale-50 transition-colors dark:hover:bg-pale-800"}>
                                    <td className="whitespace-nowrap py-4 pl-4 pr-3 text-sm font-medium text-pale-900 sm:pl-0 dark:text-white">
                                        {item.name}
                                    </td>
                                    <td className="whitespace-nowrap px-3 py-4 text-sm text-pale-500 dark:text-pale-200">{item.role}</td>
                                    <td className="whitespace-nowrap px-3 py-4 text-sm text-pale-500 dark:text-pale-200">{item.jointAt?.toLocaleString() ?? ""}</td>
                                    <td className="whitespace-nowrap px-3 py-4 text-sm text-pale-500 dark:text-pale-200">{item.lastActivity?.toLocaleString() ?? ""}</td>
                                    <td className="whitespace-nowrap px-3 py-4 text-sm text-pale-500 dark:text-pale-200">{item.options}</td>
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
