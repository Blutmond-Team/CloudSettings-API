"use client"

import {Button, Card, Col, Popconfirm, Row, Table, Tooltip} from "antd";
import {useTheme} from "@/hooks";
import {Text} from "@/components/antd/Text";
import {useTransition} from "react";
import DeleteOutlined from "@ant-design/icons/DeleteOutlined";
import EditOutlined from "@ant-design/icons/EditOutlined";
import ReloadOutlined from "@ant-design/icons/ReloadOutlined";
import UnorderedListOutlined from "@ant-design/icons/UnorderedListOutlined";
import {blacklistUserOption, deleteUserOption, whitelistUserOption} from "@/app/actions";

type Props = {
    options: { raw: string, key: string, blacklisted: boolean }[]
    revalidateFunction?: VoidFunction
}
export const OptionsTable = ({options, revalidateFunction}: Props) => {
    const token = useTheme();
    const [isPending, startTransition] = useTransition();

    return (
        <Card
            title={<Text style={{fontSize: token.fontSizeHeading2}}>Stored Options</Text>}
            styles={{
                body: {
                    padding: `0 ${token.paddingLG}px`,
                    paddingBottom: token.paddingXXS
                }
            }}
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
                        onClick={() => revalidateFunction && startTransition(revalidateFunction)}
                        icon={<ReloadOutlined spin={isPending}/>}
                        disabled={!revalidateFunction}
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
                                render: (value: string) => <Text
                                    style={{wordBreak: "break-word"}}>{value.substring(value.indexOf(':') + 1)}</Text>
                            },
                            {
                                title: "Actions",
                                dataIndex: 'key',
                                width: 48 * 3,
                                render: (value, record) => (
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
                                            {
                                                record.blacklisted
                                                    ? <Tooltip title={"Remove from Blacklist"}>
                                                        <Button
                                                            icon={<UnorderedListOutlined/>}
                                                            onClick={() => startTransition(() => whitelistUserOption(value).then(revalidateFunction))}
                                                            type={"dashed"}
                                                        />
                                                    </Tooltip>
                                                    : <Tooltip title={"Add to Blacklist"}>
                                                        <Button
                                                            icon={<UnorderedListOutlined/>}
                                                            onClick={() => startTransition(() => blacklistUserOption(value).then(revalidateFunction))}
                                                            danger
                                                            type={"dashed"}
                                                        />
                                                    </Tooltip>
                                            }
                                        </Col>
                                        <Col>
                                            <Tooltip title={"Delete"}>
                                                <Popconfirm
                                                    title={"Delete this Option"}
                                                    description={"Are you sure to delete this option?"}
                                                    onConfirm={() => startTransition(() => deleteUserOption(value).then(revalidateFunction))}
                                                    okText={"Yes"}
                                                    cancelText={"No"}
                                                >
                                                    <Button
                                                        icon={<DeleteOutlined/>}
                                                        danger
                                                        type={"primary"}
                                                    />
                                                </Popconfirm>
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