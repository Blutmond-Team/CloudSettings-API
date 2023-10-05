"use client"

import {Button, Col, Row, Tooltip} from "antd";
import {ToolOutlined} from "@ant-design/icons";
import {useModal} from "@/hooks";
import type {UserData} from "@/app/admin/users/page";
import {TitleValueCol} from "@/components/global/TitleValueCol";
import {OptionsTable} from "@/components/profile/OptionsTable";

type Props = {
    user: UserData
}

export const InspectUserButton = ({user}: Props) => {
    const {modal, open, close} = useModal({
        title: `'${user.name}' Infos`,
        footer: [
            <Button key={0} type={"primary"} onClick={() => close()}>Close</Button>
        ],
        children: <Row gutter={[16, 8]}>
            <TitleValueCol title={"Id"} value={user.id} span={9}/>
            <TitleValueCol title={"Role"} value={user.role} span={5}/>
            <TitleValueCol title={"Status"} value={user.verified ? 'Verified' : 'Unverified'} span={10}/>
            <TitleValueCol title={"Options"} value={user.options.length} span={9}/>
            <TitleValueCol title={"Joined"} value={user.jointAt.toLocaleString()} span={5}/>
            <TitleValueCol title={"Last active"} value={user.lastActivity.toLocaleString()} span={10}/>
            <Col span={24}>
                <OptionsTable
                    options={user.options}
                />
            </Col>
        </Row>,
        width: 830
    });

    return (
        <>
            <Tooltip title={"Show Info"}>
                <Button
                    icon={<ToolOutlined/>}
                    type={"primary"}
                    onClick={open}
                />
            </Tooltip>
            {modal}
        </>
    );
};