"use client"
import {UserData} from "@/app/admin/users/page";
import {Card, Col, DatePicker, Row, Typography} from "antd";
import {useTheme} from "@/hooks";
import {use, useCallback, useMemo, useState, useTransition} from "react";
import {TitleValueCol} from "@/components/global/TitleValueCol";
import {ActiveUserGraph} from "@/components/admin/ActiveUserGraph";
import {UserTable} from "@/components/admin/UserTable";
import {NewUserGraph} from "@/components/admin/NewUserGraph";
import {TotalUserGraph} from "@/components/admin/TotalUserGraph";
import dayjs, {Dayjs} from "dayjs";
import _ from "lodash";

const {RangePicker} = DatePicker;

type Props = {
    dataPromise: Promise<{ users: UserData[], date: Date }>
    revalidateFunction: VoidFunction
}

export const AdminOverview = ({dataPromise, revalidateFunction}: Props) => {
    const token = useTheme();
    const data = use(dataPromise);
    const [isPending, startTransition] = useTransition();
    const [selectedRange, selectRange] = useState<[Dayjs | null, Dayjs | null] | null>([dayjs().startOf('month'), dayjs()]);
    const [startDate, endDate] = selectedRange || [null, null];

    const toPercent = useCallback((value: number) => {
        return (100 / data.users.length * value).toFixed(0);
    }, [data.users.length])

    const [unverified, verified, activeToday] = useMemo(() => {
        const unverified = data.users.filter(value => !value.verified).length;
        const verified = data.users.length - unverified;
        const activeToday = data.users.filter(value => {
            const startToday = new Date().setHours(0, 0, 0, 0);
            return value.lastActivity.getTime() >= startToday;
        }).length;

        return [unverified, verified, activeToday];
    }, [data.users]);

    const [newUsers, activeUsers] = useMemo(() => {
        const start = startDate?.toDate();
        const end = endDate?.toDate();
        let newUsers = _.cloneDeep(data.users);
        let activeUsers = _.cloneDeep(data.users);

        if (start) {
            newUsers = newUsers.filter(value => value.jointAt.getTime() >= start.getTime());
            activeUsers = activeUsers.map(user => {
                user.logins = user.logins.filter(loginDate => loginDate.getTime() >= start.getTime())
                return user;
            }).filter(value => value.logins.length > 0);
        }

        if (end) {
            newUsers = newUsers.filter(value => value.jointAt.getTime() <= end.getTime());
            activeUsers = activeUsers.map(user => {
                user.logins = user.logins.filter(loginDate => loginDate.getTime() <= end.getTime())
                return user;
            }).filter(value => value.logins.length > 0);
        }

        return [newUsers, activeUsers];
    }, [data.users, endDate, startDate])

    return (
        <Row justify={"center"} gutter={[16, 8]} style={{margin: `0 ${token.margin}px`}} align={"stretch"}>
            <Col xs={24}>
                <Card>
                    <Row justify={"center"}>
                        <Col xs={24} className={"text-center"}>
                            <Typography.Title>Admin Overview</Typography.Title>
                            <Typography.Text>
                                Select a date range for the graphs:
                            </Typography.Text>
                        </Col>
                        <Col>
                            <RangePicker
                                value={selectedRange}
                                onChange={(value) => selectRange(value)}
                                minDate={dayjs(data.users[data.users.length - 1].jointAt)}
                                maxDate={dayjs()}
                                format={"DD.MM.YYYY"}
                            />
                        </Col>
                    </Row>
                </Card>
            </Col>
            <Col xs={24} lg={12}>
                <NewUserGraph data={newUsers}/>
            </Col>
            <Col xs={24} lg={12}>
                <TotalUserGraph data={data.users}/>
            </Col>
            <Col xs={24} lg={12}>
                <ActiveUserGraph data={activeUsers} startDate={startDate?.toDate() || new Date(1687557600000)}/>
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