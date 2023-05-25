import {HTMLAttributeAnchorTarget, MouseEventHandler} from "react";

type Props = {
    size?: "small" | "default" | "large"
    className?: string,
    icon?: (classNames: string) => React.ReactNode
    text?: string
    onClick?: MouseEventHandler<HTMLButtonElement>
    href?: string
    target?: HTMLAttributeAnchorTarget
}

function classNames(...classes: string[]) {
    return classes.filter(Boolean).join(' ')
}

export default function ButtonWithIcon({size = "default", className = '', icon, text = '', onClick, href, target}: Props) {
    const commonClassNames = "inline-flex items-center rounded-md text-sm font-semibold text-white shadow-sm focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600"

    switch (size) {
        case "small":
            if(href){
                return (
                    <a
                        className={classNames(commonClassNames, "gap-x-1.5 px-2.5 py-1.5", className)}
                        href={href}
                        target={target}
                    >
                        {
                            icon && icon("-ml-0.5 h-5 w-5")
                        }
                        {text}
                    </a>
                );
            }
            return (
                <button
                    type="button"
                    className={classNames(commonClassNames, "gap-x-1.5 px-2.5 py-1.5", className)}
                    onClick={onClick}
                >
                    {
                        icon && icon("-ml-0.5 h-5 w-5")
                    }
                    {text}
                </button>
            );

        case "large":
            if(href){
                return (
                    <a
                        className={classNames(commonClassNames, "gap-x-2 px-3.5 py-2.5", className)}
                        href={href}
                        target={target}
                    >
                        {
                            icon && icon("-ml-0.5 h-5 w-5")
                        }
                        {text}
                    </a>
                );
            }

            return (
                <button
                    type="button"
                    className={classNames(commonClassNames, "gap-x-2 px-3.5 py-2.5", className)}
                    onClick={onClick}
                >
                    {
                        icon && icon("-ml-0.5 h-5 w-5")
                    }
                    {text}
                </button>
            )
        default:
            if(href){
                return (
                    <a
                        className={classNames(commonClassNames, "gap-x-1.5 px-3 py-2", className)}
                        href={href}
                        target={target}
                    >
                        {
                            icon && icon("-ml-0.5 h-5 w-5")
                        }
                        {text}
                    </a>
                );
            }

            return (
                <button
                    type="button"
                    className={classNames(commonClassNames, "gap-x-1.5 px-3 py-2", className)}
                    onClick={onClick}
                >
                    {
                        icon && icon("-ml-0.5 h-5 w-5")
                    }
                    {text}
                </button>
            )
    }
}
