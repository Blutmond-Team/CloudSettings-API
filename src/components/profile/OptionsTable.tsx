"use client"

import {Button, Card, Col, Row, Table, Tooltip} from "antd";
import {useTheme} from "@/hooks";
import {Text} from "@/components/antd/Text";
import {useTransition} from "react";
import {DeleteOutlined, EditOutlined, ReloadOutlined, UnorderedListOutlined} from "@ant-design/icons";

type Props = {
    options: { raw: string, key: string }[]
    revalidateFunction: VoidFunction
}
export const OptionsTable = ({options, revalidateFunction}: Props) => {
    const token = useTheme();
    const [isPending, startTransition] = useTransition();

    return (
        <Card
            title={<Text style={{fontSize: token.fontSizeHeading2}}>Stored Options</Text>}
            bodyStyle={{padding: `0 ${token.paddingLG}px`, paddingBottom: token.paddingXXS}}
        >
            <Row>
                <Col flex={"1 1"}>
                    <Row>
                        <Col span={24}>
                            <Text style={{color: token.colorTextSecondary, fontSize: token.fontSizeSM}}>
                                A list of all stored Options
                            </Text>
                        </Col>
                        <Col span={24}>
                            <Text style={{color: token.colorTextSecondary, fontSize: token.fontSizeSM}}>
                                Be careful when editing them!
                            </Text>
                        </Col>
                    </Row>
                </Col>
                <Col>
                    <Button
                        type={"primary"}
                        onClick={() => startTransition(revalidateFunction)}
                        icon={<ReloadOutlined spin={isPending}/>}
                    >
                        Refresh Data
                    </Button>
                </Col>
                <Col span={24} style={{marginTop: token.marginMD}}>
                    <Table
                        dataSource={options}
                        columns={[
                            {
                                title: "Option Key",
                                dataIndex: 'key',
                            },
                            {
                                title: "Option Value",
                                dataIndex: "raw",
                                render: (value: string) => value.substring(value.indexOf(':') + 1)
                            },
                            {
                                title: "Actions",
                                width: 48 * 3,
                                render: value => (
                                    <Row justify={"center"} gutter={[8, 4]}>
                                        <Col>
                                            <Tooltip title={"Edit"}>
                                                <Button
                                                    icon={<EditOutlined/>}
                                                    disabled
                                                    type={"primary"}
                                                />
                                            </Tooltip>
                                        </Col>
                                        <Col>
                                            <Tooltip title={"Blacklist"}>
                                                <Button
                                                    icon={<UnorderedListOutlined/>}
                                                    disabled
                                                />
                                            </Tooltip>
                                        </Col>
                                        <Col>
                                            <Tooltip title={"Delete"}>
                                                <Button
                                                    icon={<DeleteOutlined/>}
                                                    disabled
                                                    danger
                                                />
                                            </Tooltip>
                                        </Col>
                                    </Row>
                                )
                            }
                        ]}
                        size={"small"}
                        pagination={{
                            size: "default",
                            showTotal: (total, range) => `${range[0]}-${range[1]} of ${total} Options`
                        }}
                    />
                </Col>
            </Row>
        </Card>
    );
};