"use client"

import {Typography} from "antd";
import type {TextProps} from "antd/es/typography/Text";

const AntDText = Typography.Text;

export const Text = (props: TextProps) => {
    return (
        <AntDText {...props}/>
    );
};