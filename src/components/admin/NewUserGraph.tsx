"use client"
import {UserData} from "@/app/admin/users/page";
import {Area, AreaChart, CartesianGrid, ResponsiveContainer, Tooltip, XAxis, YAxis} from "recharts";
import _ from "lodash"
import {useMemo} from "react";
import {Text} from "@/components/antd/Text";
import {useTheme} from "@/hooks";
import {Card, Col, Row} from "antd";

type Props = {
    data: UserData[]
}
export const NewUserGraph = ({data}: Props) => {
    const token = useTheme();
    const chartData = useMemo(() => {
        const sortedData = _.sortBy(data, value => value.jointAt.getTime());
        const seperatedData = _.groupBy(sortedData, value => value.jointAt.setHours(0, 0, 0, 0));
        const seperatedArray = _.values(seperatedData);
        const firstEntry = seperatedArray[0];
        const lastEntry = seperatedArray[seperatedArray.length - 1];

        const resultData: { key: string, count: number, unverified: number }[] = [];
        for (let date = firstEntry[0].jointAt.setHours(0, 0, 0, 0); date < lastEntry[0].jointAt.setHours(0, 0, 0, 0); date += 24 * 60 * 60 * 1000) {
            const seperatedDataEntry = seperatedData[date];
            const key = new Date(date).toLocaleDateString();
            if (!seperatedDataEntry || seperatedDataEntry.length === 0) {
                resultData.push({
                    key: key,
                    count: 0,
                    unverified: 0
                });
            } else {
                resultData.push({
                    key: key,
                    count: seperatedDataEntry.length,
                    unverified: seperatedDataEntry.filter(value => !value.verified).length
                });
            }
        }

        return resultData;
    }, [data]);

    return (
        <Row justify={"center"}>
            <Col flex={"1"}>
                <Card bodyStyle={{textAlign: "center", paddingLeft: 0, paddingRight: 0}}>
                    <Text style={{fontSize: token.fontSizeHeading3}}>New Users</Text>
                    <ResponsiveContainer width={"95%"} height={200}>
                        <AreaChart
                            data={chartData}
                            width={497 - 24}
                            height={384}
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
                            <Area
                                dataKey={"unverified"}
                                type={"monotone"}
                                stroke={"#f04eff"}
                                fill={"#f04eff"}
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