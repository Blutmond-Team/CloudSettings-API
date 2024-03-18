"use client"

import {Button, Card, Col, Row} from "antd";
import {Text} from "@/components/antd/Text";
import {useModal, useTheme} from "@/hooks";
import {signOut} from "next-auth/react";
import {toast} from "react-toastify";
import type {Option, User} from "@prisma/client";
import {TitleValueCol} from "@/components/global/TitleValueCol";
import Image from "next/image";
import {ColProps} from "antd/es/grid/col";
import {WarningOutlined} from "@ant-design/icons";

type Props = {
    user: User | null | undefined
    options: Option[]
}

export const ProfileActions = ({user, options}: Props) => {
    const token = useTheme();
    const deleteAccountModal = useModal({
        title: "Are you sure you want to delete your Account?",
        children: <Row>
            <Col>
                <Text style={{color: token.colorTextSecondary}}>
                    This can not be undone and will delete all information stored about you!
                </Text>
            </Col>
        </Row>,
        okText: "Yes",
        okType: "danger",
        onOk: () => {
            fetch(`/api/user/${user?.id}`, {
                method: "DELETE",
                headers: {
                    "Content-Type": "application/json",
                    "Accept": "application/json"
                }
            }).then(value => {
                if (value.ok) {
                    signOut().then(() => toast(`Your Account was successfully deleted.`, {
                        position: "bottom-right",
                        autoClose: 5000,
                        hideProgressBar: false,
                        theme: window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light',
                        type: "success"
                    }))
                }
            })
        },
        cancelText: "No",
    });

    const infoColSettings: {
        xs?: ColProps['xs']
        sm?: ColProps['sm']
        md?: ColProps['md']
        lg?: ColProps['lg']
        xl?: ColProps['xl']
        xxl?: ColProps['xxl']
    } = {
        xs: 24,
        sm: 24,
        md: 12,
        lg: 8
    }

    return (
        <Card
            title={<Text style={{fontSize: token.fontSizeHeading2}}>Account</Text>}
            styles={{
                body: {
                    paddingTop: 0
                }
            }}
        >
            <Row gutter={[16, 8]}>
                <Col span={24}>
                    <Row gutter={[32, 16]}>
                        <Col xs={8} sm={6} md={4} xl={3}>
                            <Image
                                src={`https://mc-heads.net/body/${user?.id}/100`}
                                alt={"User Skin"}
                                width={100}
                                height={240}
                            />
                        </Col>
                        <Col xs={16} sm={18} md={20} xl={21}>
                            <Row gutter={[16, 8]}>
                                <TitleValueCol
                                    title={"UUID"}
                                    value={user?.id}
                                    {...infoColSettings}
                                />
                                <TitleValueCol
                                    title={"Name"}
                                    value={user?.name}
                                    {...infoColSettings}
                                />
                                <TitleValueCol
                                    title={"Registered Since"}
                                    value={user?.joinedAt.toLocaleDateString()}
                                    {...infoColSettings}
                                />
                                <TitleValueCol
                                    title={"Role"}
                                    value={user?.role}
                                    {...infoColSettings}
                                />
                                <TitleValueCol
                                    title={"Stored Options"}
                                    value={options.length}
                                    {...infoColSettings}
                                />
                            </Row>
                        </Col>
                        <Col span={24} style={{textAlign: "right"}}>
                            <Button
                                danger
                                type={"primary"}
                                onClick={deleteAccountModal.open}
                                icon={<WarningOutlined />}
                            >
                                Delete Account
                            </Button>
                            {deleteAccountModal.modal}
                        </Col>
                    </Row>
                </Col>
            </Row>
        </Card>
    );
};