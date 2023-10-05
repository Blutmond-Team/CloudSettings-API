"use client"

import {useCallback, useEffect, useRef, useState} from "react";

type Props = {
    speed?: number
    direction?: "left" | "right"

} & React.PropsWithChildren

export const InfiniteLooper = ({speed = 4, direction = "right", children}: Props) => {
    const [looperInstances, setLooperInstances] = useState<number>(1);
    const outerRef = useRef<HTMLDivElement>(null);
    const innerRef = useRef<HTMLDivElement>(null);

    function resetAnimation() {
        if (innerRef?.current) {
            innerRef.current.setAttribute("data-animate", "false");

            setTimeout(() => {
                if (innerRef?.current) {
                    innerRef.current.setAttribute("data-animate", "true");
                }
            }, 10);
        }
    }

    const setupInstances = useCallback(() => {
        if (!innerRef?.current || !outerRef?.current) return;

        const {width} = innerRef.current.getBoundingClientRect();

        const {width: parentWidth} = outerRef.current.getBoundingClientRect();

        const widthDeficit = parentWidth - width;

        const instanceWidth = width / innerRef.current.children.length;

        if (widthDeficit) {
            setLooperInstances(
                looperInstances + Math.ceil(widthDeficit / instanceWidth) + 1
            );
        }

        resetAnimation();
    }, [looperInstances]);

    useEffect(() => setupInstances(), [setupInstances]);

    useEffect(() => {
        window.addEventListener("resize", setupInstances);

        return () => {
            window.removeEventListener("resize", setupInstances);
        };
    }, [looperInstances, setupInstances]);

    return (
        <div className="looper" ref={outerRef}>
            <div className="looper__innerList" ref={innerRef} data-animate={true}>
                {[...Array(looperInstances)].map((_, ind) => (
                    <div
                        key={ind}
                        className="looper__listInstance"
                        style={{
                            animationDuration: `${speed}s`,
                            animationDirection: direction === "right" ? "reverse" : "normal",
                        }}
                    >
                        {children}
                    </div>
                ))}
            </div>
        </div>
    );
};