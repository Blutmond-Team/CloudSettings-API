"use client"
import {NewUserGraph} from "@/components/admin/NewUserGraph";
import {TotalUserGraph} from "@/components/admin/TotalUserGraph";
import {UserData} from "@/app/admin/users/page";
import {Button, Card, Col, Row, Table, Tooltip} from "antd";
import {useTheme} from "@/hooks";
import {use, useTransition} from "react";
import Image from "next/image";
import {DeleteOutlined, UserAddOutlined, UserDeleteOutlined} from "@ant-design/icons";
import {TitleValueCol} from "@/components/global/TitleValueCol";
import {ActiveUserGraph} from "@/components/admin/ActiveUserGraph";
import {Role} from "@prisma/client";
import {toast} from "react-toastify";
import {InspectUserButton} from "@/components/admin/InspectUserButton";

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
                <Table
                    dataSource={data.users}
                    size={"small"}
                    columns={[
                        {
                            title: "Head",
                            dataIndex: 'id',
                            render: value => (
                                <Image
                                    src={`https://mc-heads.net/avatar/${value}`}
                                    alt={"Player Head"}
                                    width={32}
                                    height={32}
                                />
                            ),
                            width: 40
                        },
                        {
                            title: "Username",
                            dataIndex: 'name',
                            sorter: (a, b, sortOrder) => a.name.localeCompare(b.name)
                        },
                        {
                            title: "Role",
                            dataIndex: 'role',
                            width: 80,
                            onFilter: (value, record) => record.role === value,
                            filters: [
                                {
                                    text: "Admin",
                                    value: Role.ADMIN
                                },
                                {
                                    text: "Moderator",
                                    value: Role.MODERATOR
                                },
                                {
                                    text: "User",
                                    value: Role.USER
                                },
                                {
                                    text: "Banned",
                                    value: Role.BANNED
                                },
                            ]
                        },
                        {
                            title: "Registered",
                            dataIndex: 'jointAt',
                            render: (value: Date) => value.toLocaleString(),
                            width: 160
                        },
                        {
                            title: "Last Active",
                            dataIndex: 'lastActivity',
                            render: (value: Date) => value.toLocaleString(),
                            width: 160,
                            sorter: (a, b, sortOrder) => b.lastActivity.getTime() - a.lastActivity.getTime(),
                            defaultSortOrder: "ascend"
                        },
                        {
                            title: "Options",
                            dataIndex: 'options',
                            render: (value: any[]) => value.length,
                            width: 80,
                            sorter: (a, b) => b.options.length - a.options.length
                        },
                        {
                            title: "Actions",
                            dataIndex: 'id',
                            render: (value, record) => (
                                <Row gutter={8} justify={"center"}>
                                    <Col span={8}>
                                        <Tooltip title={"Show Info"}>
                                            <InspectUserButton
                                                user={record}
                                            />
                                        </Tooltip>
                                    </Col>
                                    <Col span={8}>
                                        {
                                            record.role === "BANNED"
                                                ? <Tooltip title={"Unban"}>
                                                    <Button
                                                        icon={<UserAddOutlined/>}
                                                        onClick={() => {
                                                            const body: { role: Role } = {role: "USER"}

                                                            fetch(`/api/user/${value}/role`, {
                                                                method: "POST",
                                                                headers: {
                                                                    "Content-Type": "application/json",
                                                                    "Accept": "application/json"
                                                                },
                                                                body: JSON.stringify(body)
                                                            }).then(value => {
                                                                if (value.ok) {
                                                                    toast(`User ${record.name} was successfully unbanned.`, {
                                                                        position: "bottom-right",
                                                                        autoClose: 5000,
                                                                        hideProgressBar: false,
                                                                        theme: window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light',
                                                                        type: "success"
                                                                    })
                                                                    startTransition(() => revalidateFunction());
                                                                }
                                                            })
                                                        }}
                                                    />
                                                </Tooltip>
                                                : <Tooltip title={"Ban"}>
                                                    <Button
                                                        icon={<UserDeleteOutlined/>}
                                                        danger
                                                        onClick={() => {
                                                            toast(<div>
                                                                <p>Are you sure you want to ban {record.name}?</p>
                                                                <div className={"w-full flex justify-end"}>
                                                                    <button
                                                                        type="button"
                                                                        className="relative inline-flex items-center rounded-md bg-white dark:bg-pale-800 px-3 py-2 text-sm font-semibold text-pale-900 dark:text-white ring-1 ring-inset ring-pale-300 dark:ring-pale-700 hover:bg-pale-50 dark:hover:bg-pale-700 focus:z-10 transition-colors"
                                                                        onClick={() => {
                                                                            const body: { role: Role } = {role: "BANNED"}
                                                                            fetch(`/api/user/${value}/role`, {
                                                                                method: "POST",
                                                                                headers: {
                                                                                    "Content-Type": "application/json",
                                                                                    "Accept": "application/json"
                                                                                },
                                                                                body: JSON.stringify(body)
                                                                            }).then(value => {
                                                                                if (value.ok) {
                                                                                    toast(`User ${record.name} was successfully banned.`, {
                                                                                        position: "bottom-right",
                                                                                        autoClose: 5000,
                                                                                        hideProgressBar: false,
                                                                                        theme: window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light',
                                                                                        type: "success"
                                                                                    })
                                                                                    startTransition(() => revalidateFunction());
                                                                                }
                                                                            })
                                                                        }}
                                                                    >Ban {record.name}</button>
                                                                </div>
                                                            </div>, {
                                                                position: "bottom-right",
                                                                autoClose: 4000,
                                                                hideProgressBar: false,
                                                                theme: window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light',
                                                                type: "warning"
                                                            })
                                                        }}
                                                    />
                                                </Tooltip>
                                        }

                                    </Col>
                                    <Col span={8}>
                                        <Tooltip title={"Delete"}>
                                            <Button
                                                icon={<DeleteOutlined/>}
                                                danger
                                                type={"primary"}
                                                onClick={() => {
                                                    toast(<div>
                                                        <p>Are you sure you want to delete {record.name}?</p>
                                                        <div className={"w-full flex justify-end"}>
                                                            <button
                                                                type="button"
                                                                className="relative inline-flex items-center rounded-md bg-white dark:bg-pale-800 px-3 py-2 text-sm font-semibold text-pale-900 dark:text-white ring-1 ring-inset ring-pale-300 dark:ring-pale-700 hover:bg-pale-50 dark:hover:bg-pale-700 focus:z-10 transition-colors"
                                                                onClick={() => {
                                                                    fetch(`/api/user/${value}`, {
                                                                        method: "DELETE",
                                                                        headers: {
                                                                            "Content-Type": "application/json",
                                                                            "Accept": "application/json"
                                                                        }
                                                                    }).then(value => {
                                                                        if (value.ok) {
                                                                            toast(`User ${record.name} was successfully deleted.`, {
                                                                                position: "bottom-right",
                                                                                autoClose: 5000,
                                                                                hideProgressBar: false,
                                                                                theme: window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light',
                                                                                type: "success"
                                                                            })
                                                                            startTransition(() => revalidateFunction());
                                                                        }
                                                                    })
                                                                }}
                                                            >Delete {record.name}</button>
                                                        </div>
                                                    </div>, {
                                                        position: "bottom-right",
                                                        autoClose: 5000,
                                                        hideProgressBar: false,
                                                        theme: window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light',
                                                        type: "error"
                                                    })
                                                }}
                                            />
                                        </Tooltip>
                                    </Col>
                                </Row>
                            ),
                            width: 150
                        }
                    ]}
                />
            </Col>
        </Row>
    );
};