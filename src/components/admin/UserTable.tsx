"use client"

import Image from "next/image";
import {Role} from "@prisma/client";
import {Button, Col, Input, InputRef, Row, Space, Table, Tooltip} from "antd";
import {InspectUserButton} from "@/components/admin/InspectUserButton";
import {DeleteOutlined, SearchOutlined, UserAddOutlined, UserDeleteOutlined} from "@ant-design/icons";
import {toast} from "react-toastify";
import type {UserData} from "@/app/admin/users/page";
import {useRef, useTransition} from "react";
import type {FilterConfirmProps} from "antd/es/table/interface";
import {useTheme} from "@/hooks";

type Props = {
    users: UserData[]
    revalidateFunction: VoidFunction
}
export const UserTable = ({users, revalidateFunction}: Props) => {
    const [isPending, startTransition] = useTransition();
    const searchInput = useRef<InputRef>(null);
    const token = useTheme();

    const handleSearch = (
        confirm: (param?: FilterConfirmProps) => void,
    ) => {
        confirm();
    };

    const handleReset = (clearFilters: () => void, confirm: (param?: FilterConfirmProps) => void) => {
        clearFilters();
        confirm();
    };


    return (
        <Table
            dataSource={users}
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
                    sorter: (a, b, sortOrder) => a.name.localeCompare(b.name),
                    filterDropdown: ({setSelectedKeys, selectedKeys, confirm, clearFilters, close}) => (
                        <div style={{padding: 8}} onKeyDown={(e) => e.stopPropagation()}>
                            <Input
                                ref={searchInput}
                                placeholder={`Search Username`}
                                value={selectedKeys[0]}
                                onChange={(e) => setSelectedKeys(e.target.value ? [e.target.value] : [])}
                                onPressEnter={() => confirm()}
                                style={{marginBottom: 8, display: 'block'}}
                            />
                            <Space>
                                <Button
                                    type="primary"
                                    onClick={() => confirm()}
                                    icon={<SearchOutlined/>}
                                    size="small"
                                    style={{width: 90}}
                                >
                                    Search
                                </Button>
                                <Button
                                    onClick={() => clearFilters && handleReset(clearFilters, confirm)}
                                    size="small"
                                    style={{width: 90}}
                                >
                                    Reset
                                </Button>
                                <Button
                                    type="link"
                                    size="small"
                                    onClick={() => close()}
                                >
                                    Close
                                </Button>
                            </Space>
                        </div>
                    ),
                    filterIcon: (filtered: boolean) => (
                        <SearchOutlined style={{color: filtered ? token.colorPrimary : undefined}}/>
                    ),
                    onFilter: (value, record) =>
                        record["name"]
                            .toLowerCase()
                            .includes((value as string).toLowerCase()),
                    onFilterDropdownOpenChange: (visible) => {
                        if (visible) {
                            setTimeout(() => searchInput.current?.select(), 100);
                        }
                    },
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
    );
};