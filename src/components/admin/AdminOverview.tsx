"use client"
import {UserData} from "@/app/admin/users/page";
import {Card, Col, Row} from "antd";
import {useTheme} from "@/hooks";
import {use, useTransition} from "react";
import {TitleValueCol} from "@/components/global/TitleValueCol";
import {ActiveUserGraph} from "@/components/admin/ActiveUserGraph";
import {UserTable} from "@/components/admin/UserTable";
import {NewUserGraph} from "@/components/admin/NewUserGraph";
import {TotalUserGraph} from "@/components/admin/TotalUserGraph";

type Props = {
    dataPromise: Promise<{ users: UserData[], date: Date }>
    revalidateFunction: VoidFunction
}

export const AdminOverview = ({dataPromise, revalidateFunction}: Props) => {
    const token = useTheme();
    const data = use(dataPromise);
    const [isPending, startTransition] = useTransition();

    function toPercent(value: number) {
        return (100 / data.users.length * value).toFixed(0);
    }


    const unverified = data.users.filter(value => !value.verified).length;
    const verified = data.users.length - unverified;
    const activeToday = data.users.filter(value => {
        const startToday = new Date().setHours(0, 0, 0, 0);
        return value.lastActivity.getTime() >= startToday;
    }).length;


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
                                    value={`${verified} | ${toPercent(verified)}%`}
                                />
                            </Col>
                            <Col flex={"0 0 200px"}>
                                <TitleValueCol
                                    title={"Unverified Users"}
                                    value={`${unverified} | ${toPercent(unverified)}%`}
                                />
                            </Col>
                            <Col flex={"0 0 200px"}>
                                <TitleValueCol
                                    title={"Active Today"}
                                    value={`${activeToday} | ${toPercent(activeToday)}%`}
                                />
                            </Col>
                            <Col flex={"0 0 200px"} onClick={() => startTransition(revalidateFunction)}
                                 className={"!cursor-pointer"}>
                                <TitleValueCol
                                    title={"Last Update"}
                                    value={isPending ? "Loading..." : data.date.toLocaleString()}
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