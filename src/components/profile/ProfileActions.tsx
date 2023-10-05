"use client"

import {Button, Card, Col, Row} from "antd";
import {Text} from "@/components/antd/Text";
import {useModal, useTheme} from "@/hooks";
import {signOut} from "next-auth/react";
import {toast} from "react-toastify";
import type {User} from ".prisma/client";

type Props = {
    user: User | null | undefined
}

export const ProfileActions = ({user}: Props) => {
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

    return (
        <Card
            title={<Text style={{fontSize: token.fontSizeHeading2}}>Account</Text>}
            bodyStyle={{paddingTop: 0}}
        >
            <Row gutter={[16, 8]}>
                <Col span={24}>

                </Col>
                <Col>
                    <Button danger type={"primary"} onClick={deleteAccountModal.open}>
                        Delete Account
                    </Button>
                    {deleteAccountModal.modal}
                </Col>
            </Row>
        </Card>
    );
};