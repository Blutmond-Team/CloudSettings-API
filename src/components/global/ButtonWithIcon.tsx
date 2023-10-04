"use client"
import {classNames} from "@/src/utils/ClassNames";
import {HTMLAttributeAnchorTarget, MouseEventHandler} from "react";
import {useTheme} from "@/hooks";
import {Text} from "@/components/antd/Text";

type Props = {
    size?: "small" | "default" | "large"
    className?: string,
    icon?: (classNames: string) => React.ReactNode
    text?: string
    onClick?: MouseEventHandler<HTMLButtonElement>
    href?: string
    target?: HTMLAttributeAnchorTarget
}


export default function ButtonWithIcon({
                                           size = "default",
                                           className = '',
                                           icon,
                                           text = '',
                                           onClick,
                                           href,
                                           target
                                       }: Props) {
    const commonClassNames = "inline-flex items-center rounded-md text-sm font-semibold text-white shadow-sm focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600"
    const token = useTheme();

    switch (size) {
        case "small":
            if (href) {
                return (
                    <a
                        className={classNames(commonClassNames, "gap-x-1.5 px-2.5 py-1.5", className)}
                        href={href}
                        target={target}
                    >
                        {
                            icon && icon("-ml-0.5 h-5 w-5")
                        }
                        <Text>
                            {text}
                        </Text>
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
                    <Text>
                        {text}
                    </Text>
                </button>
            );

        case "large":
            if (href) {
                return (
                    <a
                        className={classNames(commonClassNames, "gap-x-2 px-3.5 py-2.5", className)}
                        href={href}
                        target={target}
                    >
                        {
                            icon && icon("-ml-0.5 h-5 w-5")
                        }
                        <Text>
                            {text}
                        </Text>
                    </a>
                );
            }

            return (
                <button
                    type="button"
                    className={classNames(commonClassNames, "gap-x-2 px-3.5 py-2.5", className)}
                    onClick={onClick}
                >
                    <Text>
                        {
                            icon && icon("-ml-0.5 h-5 w-5")
                        }
                        {text}
                    </Text>
                </button>
            )
        default:
            if (href) {
                return (
                    <a
                        className={classNames(commonClassNames, "gap-x-1.5 px-3 py-2", className)}
                        href={href}
                        target={target}
                    >
                        <Text>
                            {
                                icon && icon("-ml-0.5 h-5 w-5")
                            }

                            {text}
                        </Text>
                    </a>
                );
            }

            return (
                <button
                    type="button"
                    className={classNames(commonClassNames, "gap-x-1.5 px-3 py-2", className)}
                    onClick={onClick}
                >
                    <Text>
                        {
                            icon && icon("-ml-0.5 h-5 w-5")
                        }

                        {text}
                    </Text>
                </button>
            )
    }
}
