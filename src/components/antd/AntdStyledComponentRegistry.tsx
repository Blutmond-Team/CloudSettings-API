"use client"

import {useMemo} from "react";
import {createCache, extractStyle, StyleProvider} from "@ant-design/cssinjs";
import {useServerInsertedHTML} from "next/navigation";

export const AntdStyledComponentRegistry = ({children}: React.PropsWithChildren) => {
    const cache = useMemo(() => createCache(), []);
    useServerInsertedHTML(() => (
        <style id="antd" dangerouslySetInnerHTML={{__html: extractStyle(cache, true)}}/>
    ));

    return (
        <StyleProvider cache={cache}>
            {children}
        </StyleProvider>
    );
};