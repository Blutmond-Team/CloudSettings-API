"use client"
import {UserData} from "@/app/admin/users/page";
import {Area, AreaChart, CartesianGrid, ResponsiveContainer, Tooltip, XAxis, YAxis} from "recharts";
import {useMemo} from "react";
import {Card, Col, Row} from "antd";
import {Text} from "@/components/antd/Text";
import {useTheme} from "@/hooks";

type ChartItem = {
    key: string,
    count: number
}

type Props = {
    data: UserData[]
}
export const ActiveUserGraph = ({data}: Props) => {
    const token = useTheme();
    const chartData = useMemo(() => {
        const mapped = data.flatMap(value => {
            const sortedLogins = value.logins.sort((a, b) => b.getTime() - a.getTime());

            let lastLogin = 0;
            const uniqueLogins: ChartItem[] = [];

            for (const login of sortedLogins) {
                const loginDay = new Date(login).setHours(0, 0, 0, 0);
                if (loginDay === lastLogin) continue;
                lastLogin = loginDay;
                uniqueLogins.push({
                    key: new Date(loginDay).toLocaleDateString(),
                    count: 1
                })
            }

            return uniqueLogins;
        });

        const distinctData: ChartItem[] = [];

        for (let timeStamp = 1687557600000; timeStamp < Date.now()-86400000; timeStamp += 86400000) {
            const key = new Date(timeStamp).toLocaleDateString();
            distinctData.push({
                key: key,
                count: mapped.filter(value => value.key === key).length
            });
        }

        return distinctData;
    }, [data]);

    return (
        <Row justify={"center"}>
            <Col flex={"1"}>
                <Card
                    bodyStyle={{textAlign: "center", paddingLeft: 0, paddingRight: 0}}
                >
                    <Text style={{fontSize: token.fontSizeHeading3}}>Active Users</Text>
                    <ResponsiveContainer width={"95%"} height={200}>
                        <AreaChart
                            data={chartData}
                        >
                            <CartesianGrid strokeDasharray={"3 3"}/>
                            <YAxis/>
                            <XAxis dataKey={"key"}/>
                            <Area
                                dataKey={"count"}
                                type={"monotone"}
                                stroke={"#8884d8"}
                                fill={"#8884d8"}
                            />
                            <Tooltip
                                wrapperClassName={"!bg-white dark:!bg-pale-800"}
                            />
                        </AreaChart>
                    </ResponsiveContainer>
                </Card>
            </Col>
        </Row>
    )
};