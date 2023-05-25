import {ForwardRefExoticComponent} from "react";

type HeroItem = {
    name: string,
    description: string
    icon: ForwardRefExoticComponent<any>
}

type Props = {
    items: [HeroItem, HeroItem, HeroItem, HeroItem]
    noteText: string
    title: string
    description?: string
    bottomRow?: React.ReactNode
}

export default function Hero2x2Grid({noteText, items, title, description, bottomRow}: Props) {
    return (
        <div className="bg-white dark:bg-pale-800 py-24 sm:py-32">
            <div className="mx-auto max-w-7xl px-6 lg:px-8">
                <div className="mx-auto max-w-2xl lg:text-center">
                    <h2 className="text-base font-semibold leading-7 text-indigo-600">{noteText}</h2>
                    <p className="mt-2 text-3xl font-bold tracking-tight text-pale-900 dark:text-white sm:text-4xl">
                        {title}
                    </p>
                    <p className="mt-6 text-lg leading-8 text-pale-600 dark:text-pale-200">
                        {description}
                    </p>
                </div>
                {
                    bottomRow && <div className="mx-auto max-w-2xl lg:max-w-4xl flex justify-center mt-7 gap-4">
                        {bottomRow}
                    </div>
                }
                <div className="mx-auto mt-16 max-w-2xl sm:mt-20 lg:mt-24 lg:max-w-4xl">
                    <dl className="grid max-w-xl grid-cols-1 gap-x-8 gap-y-10 lg:max-w-none lg:grid-cols-2 lg:gap-y-16">
                        {items.map((feature) => (
                            <div key={feature.name} className="relative pl-16">
                                <dt className="text-base dark:text-white font-semibold leading-7 text-pale-900">
                                    <div
                                        className="absolute left-0 top-0 flex h-10 w-10 items-center justify-center rounded-lg bg-indigo-600">
                                        <feature.icon className="h-6 w-6 text-white" aria-hidden="true"/>
                                    </div>
                                    {feature.name}
                                </dt>
                                <dd className="mt-2 text-base leading-7 text-pale-600 dark:text-pale-200">{feature.description}</dd>
                            </div>
                        ))}
                    </dl>
                </div>
            </div>
        </div>
    )
}