import {ForwardRefExoticComponent} from "react";

export type UsageStatItem = {
    id: number,
    name: string,
    stat: string,
    icon: ForwardRefExoticComponent<any>
}

type Props = {
    items: UsageStatItem[]
    className?: string
    itemClassName?: string
}

function classNames(...classes: string[]) {
    return classes.filter(Boolean).join(' ')
}

export default function UsageStats({items, className = '', itemClassName = ''}: Props) {
    return (
        <dl className={classNames("mt-5 grid grid-cols-1 gap-10 sm:grid-cols-2 lg:grid-cols-3", className)}>
            {items.map((item) => (
                <div
                    key={item.id}
                    className={classNames("relative overflow-hidden rounded-lg bg-white dark:bg-pale-800 px-4 pb-5 pt-5 shadow sm:px-6 sm:pt-6", itemClassName)}
                >
                    <dt>
                        <div className="absolute rounded-md bg-indigo-500 p-3">
                            <item.icon className="h-6 w-6 text-white" aria-hidden="true"/>
                        </div>
                        <p className="ml-16 truncate text-sm font-medium text-pale-500 dark:text-pale-100">{item.name}</p>
                    </dt>
                    <dd className="ml-16 flex items-baseline">
                        <p className="text-2xl font-semibold text-pale-900 dark:text-white">{item.stat}</p>
                    </dd>
                </div>
            ))}
        </dl>
    )
}