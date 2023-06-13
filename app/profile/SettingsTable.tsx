"use client"
import {useMemo, useTransition} from "react";
import ButtonWithIcon from "@/app/ButtonWithIcon";
import {ArrowPathIcon} from "@heroicons/react/24/outline";

export type TableItem = {
    key: string,
    value: string,
    lastChanged?: Date,
}

type Props = {
    title?: string
    description?: string
    items: TableItem[],
    showLastEdited?: boolean
    revalidateFunction: VoidFunction
}

export default function SettingsTable({title, description, items, revalidateFunction, showLastEdited = true}: Props) {
    const [isPending, startTransition] = useTransition();
    const cachedItems: TableItem[] = useMemo(() => {
        if (items.length == 0) {
            return [
                {
                    key: "No Data",
                    value: "",
                }
            ];
        }
        return items;
    }, [items]);
    if (items.length == 0) {
        items.push({
            key: "No Data",
            value: "",
        })
    }

    return (
        <div className="px-4 sm:px-6 lg:px-8">
            <div className={"sm:flex sm:justify-between grid-cols-1"}>
                {
                    (title || description) && <div className="sm:flex sm:items-center">
                        <div className="sm:flex-auto">
                            {
                                title &&
                                <h1 className="font-semibold leading-6 text-pale-900 dark:text-white text-2xl mb-2">{title}</h1>
                            }

                            {
                                description && <p className="mt-2 text-sm text-pale-700 dark:text-pale-200">
                                    {description}
                                </p>
                            }

                        </div>
                    </div>
                }
                <div className={"mt-2 flex justify-center sm:justify-end"}>
                    <ButtonWithIcon
                        text={"Refresh Data"}
                        icon={classNames => <ArrowPathIcon className={classNames}/>}
                        onClick={() => startTransition(() => revalidateFunction())}
                        size={"large"}
                        className={"dark:bg-pale-700 bg-pale"}
                    />
                </div>
            </div>
            <div className="mt-2 sm:mt-8 flow-root">
                <div className="-mx-4 -my-2 overflow-x-auto sm:-mx-6 lg:-mx-8">
                    <div
                        className="inline-block min-w-full py-2 align-middle sm:px-6 lg:px-8 settings-table-items overflow-y-auto overflow-x-hidden">
                        <table className="min-w-full divide-y divide-pale-300 dark:divide-pale-600">
                            <thead>
                            <tr>
                                <th scope="col"
                                    className="py-3.5 pl-4 pr-3 text-left text-sm font-semibold text-pale-900 dark:text-white sm:pl-0">
                                    Option Key
                                </th>
                                <th scope="col"
                                    className="px-3 py-3.5 text-left text-sm font-semibold text-pale-900 dark:text-white">
                                    Option value
                                </th>
                                {
                                    showLastEdited && <th scope="col"
                                                          className="px-3 py-3.5 text-left text-sm font-semibold text-pale-900 dark:text-white">
                                        Last edited
                                    </th>
                                }

                            </tr>
                            </thead>
                            <tbody className="divide-y divide-pale-200">
                            {cachedItems.map((item) => (
                                <tr key={item.key}
                                    className={"hover:bg-pale-50 transition-colors dark:hover:bg-pale-800"}>
                                    <td className="whitespace-nowrap py-4 pl-4 pr-3 text-sm font-medium text-pale-900 sm:pl-0 dark:text-white">
                                        {item.key}
                                    </td>
                                    <td className="whitespace-nowrap px-3 py-4 text-sm text-pale-500 dark:text-pale-200">{item.value}</td>
                                    {
                                        showLastEdited &&
                                        <td className="whitespace-nowrap px-3 py-4 text-sm text-pale-500 dark:text-pale-200">{item.lastChanged?.toLocaleString() ?? ""}</td>
                                    }
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
