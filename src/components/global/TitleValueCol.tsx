"use client"
import {useTheme} from "@/hooks";
import {Col, Row} from "antd";
import {Text} from "@/components/antd/Text";
import type {ColProps} from "antd/es/grid/col";

type Props = {
    title: React.ReactNode
    value: React.ReactNode
} & ColProps

export const TitleValueCol = ({title, value, ...col}: Props) => {
    const token = useTheme();

    return (
        <Col {...col}>
            <Row>
                <Col span={24}>
                    <Text style={{fontWeight: token.fontWeightStrong}}>{title}</Text>
                </Col>
                <Col span={24}>
                    <Text>{value}</Text>
                </Col>
            </Row>
        </Col>
    );
};