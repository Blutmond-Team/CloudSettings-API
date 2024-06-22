"use client"
import {Button, Card, Col, DatePicker, Row, Typography} from "antd";
import {useTheme} from "@/hooks";
import {useCallback, useMemo, useState} from "react";
import {TitleValueCol} from "@/components/global/TitleValueCol";
import {ActiveUserGraph} from "@/components/admin/ActiveUserGraph";
import {UserTable} from "@/components/admin/UserTable";
import {NewUserGraph} from "@/components/admin/NewUserGraph";
import {TotalUserGraph} from "@/components/admin/TotalUserGraph";
import dayjs, {Dayjs} from "dayjs";
import _ from "lodash";
import {toast} from "react-toastify";
import {DeletedUsers, UserEntries} from "@/src/types/ApiTypes";
import {useMutation, useQuery} from "@tanstack/react-query";
import axios from "axios";

const {RangePicker} = DatePicker;

type Props = {}

export const AdminOverview = ({}: Props) => {
    const token = useTheme();
    const [selectedRange, selectRange] = useState<[Dayjs | null, Dayjs | null] | null>([dayjs().startOf('month'), dayjs()]);
    const [startDate, endDate] = selectedRange || [null, null];
    const {data: userEntries, refetch, isFetching} = useQuery<UserEntries>({
        queryKey: ["api", "admin", "user"],
        staleTime: Infinity
    });
    const {mutate: deleteUnverfiedUsers} = useMutation({
        mutationFn: async () => {
            const {data} = await axios.delete<DeletedUsers>("/api/admin/user?verified=0");
            return data;
        },
        onSuccess: (data) => {
            refetch().then(() => toast(`Deleted ${data.deleted} unverified users`))
        }
    })
    const toPercent = useCallback((value: number) => {
        if (!userEntries) return 0;
        return (100 / (userEntries.users.length) * value).toFixed(0);
    }, [userEntries])
    const [unverified, verified, activeToday] = useMemo(() => {
        if (!userEntries) return [0, 0, 0];
        const unverified = userEntries.users.filter(value => !value.verified).length;
        const verified = userEntries.users.length - unverified;
        const activeToday = userEntries.users.filter(value => {
            const startToday = new Date().setHours(0, 0, 0, 0);
            return value.lastActivity.getTime() >= startToday;
        }).length;

        return [unverified, verified, activeToday];
    }, [userEntries]);
    const [newUsers, activeUsers] = useMemo(() => {
        if (!userEntries) return [[], []];
        const start = startDate?.toDate();
        const end = endDate?.toDate();
        let newUsers = _.cloneDeep(userEntries.users);
        let activeUsers = _.cloneDeep(userEntries.users);

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
    }, [userEntries, endDate, startDate])

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
                                minDate={dayjs(userEntries?.users[userEntries.users.length - 1].jointAt)}
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
                <TotalUserGraph
                    data={userEntries?.users ?? []}
                    selectedStartDate={startDate?.toDate()}
                    selecredEndDate={endDate?.toDate()}
                />
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
                                    value={userEntries?.users.length ?? 0}
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
                            <Col flex={"0 0 200px"} onClick={() => refetch()}
                                 className={"!cursor-pointer"}>
                                <TitleValueCol
                                    title={"Last Update"}
                                    value={isFetching ? "Loading..." : userEntries?.date.toLocaleString()}
                                />
                            </Col>
                            <Col flex={"0 0 200px"}>
                                <Button onClick={() => {
                                    toast(<div>
                                            <p>Are you sure you want to delete {unverified} unverified Users?</p>
                                            <div className={"w-full flex justify-end"}>
                                                <button
                                                    type="button"
                                                    className="relative inline-flex items-center rounded-md bg-white dark:bg-pale-800 px-3 py-2 text-sm font-semibold text-pale-900 dark:text-white ring-1 ring-inset ring-pale-300 dark:ring-pale-700 hover:bg-pale-50 dark:hover:bg-pale-700 focus:z-10 transition-colors"
                                                    onClick={() => deleteUnverfiedUsers}
                                                >
                                                    Yes
                                                </button>
                                            </div>
                                        </div>
                                    )
                                }}>Delete all unverified</Button>
                            </Col>
                        </Row>
                    </div>
                </Card>
            </Col>
            <Col span={24}>
                <UserTable
                    users={userEntries?.users ?? []}
                    revalidateFunction={() => refetch()}
                />
            </Col>
        </Row>
    );
};