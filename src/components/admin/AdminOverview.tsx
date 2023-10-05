"use client"
import {NewUserGraph} from "@/components/admin/NewUserGraph";
import {TotalUserGraph} from "@/components/admin/TotalUserGraph";
import {UserData} from "@/app/admin/users/page";
import {Card, Col, Row} from "antd";
import {useTheme} from "@/hooks";
import {use, useTransition} from "react";
import {TitleValueCol} from "@/components/global/TitleValueCol";
import {ActiveUserGraph} from "@/components/admin/ActiveUserGraph";
import {UserTable} from "@/components/admin/UserTable";

type Props = {
    dataPromise: Promise<{ users: UserData[] }>
    revalidateFunction: VoidFunction
}

export const AdminOverview = ({dataPromise, revalidateFunction}: Props) => {
    const token = useTheme();
    const data = use(dataPromise);
    const [isPending, startTransition] = useTransition();

    return (
        <Row justify={"center"} gutter={[16, 8]} style={{margin: `0 ${token.margin}px`}} align={"stretch"}>
            <Col xs={24} lg={12}>
                <NewUserGraph data={data.users}/>
            </Col>
            <Col xs={24} lg={12}>
                <TotalUserGraph data={data.users}/>
            </Col>
            <Col xs={24} lg={12}>
                <ActiveUserGraph data={data.users}/>
            </Col>
            <Col xs={24} lg={12}>
                <Card>
                    <div>
                        <Row gutter={[32, 16]}>
                            <Col flex={"0 0 200px"}>
                                <TitleValueCol
                                    title={"Total Users"}
                                    value={data.users.length}
                                />
                            </Col>
                            <Col flex={"0 0 200px"}>
                                <TitleValueCol
                                    title={"Verified Users"}
                                    value={data.users.filter(value => value.verified).length}
                                />
                            </Col>
                            <Col flex={"0 0 200px"}>
                                <TitleValueCol
                                    title={"Unverified Users"}
                                    value={data.users.filter(value => !value.verified).length}
                                />
                            </Col>
                            <Col flex={"0 0 200px"}>
                                <TitleValueCol
                                    title={"Active Today"}
                                    value={data.users.filter(value => {
                                        const startToday = new Date().setHours(0, 0, 0, 0);
                                        return value.lastActivity.getTime() >= startToday;
                                    }).length}
                                />
                            </Col>
                            <Col flex={"0 0 200px"} onClick={() => startTransition(revalidateFunction)}
                                 className={"!cursor-pointer"}>
                                <TitleValueCol
                                    title={"Last Update"}
                                    value={isPending ? "Loading..." : new Date().toLocaleString()}
                                />
                            </Col>
                        </Row>
                    </div>
                </Card>
            </Col>
            <Col span={24}>
                <UserTable
                    users={data.users}
                    revalidateFunction={revalidateFunction}
                />
            </Col>
        </Row>
    );
};