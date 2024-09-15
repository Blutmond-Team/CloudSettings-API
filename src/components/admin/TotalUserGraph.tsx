"use client"
import {UserData} from "@/app/admin/users/page";
import {Area, AreaChart, CartesianGrid, ResponsiveContainer, Tooltip, XAxis, YAxis} from "recharts";
import {useMemo} from "react";
import {Card, Col, Row} from "antd";
import {Text} from "@/components/antd/Text";
import {useTheme} from "@/hooks";
import {groupBy, sortBy, values} from "lodash-es";

type Props = {
    data: UserData[]
    selectedStartDate?: Date
    selecredEndDate?: Date
}
export const TotalUserGraph = ({data, selectedStartDate, selecredEndDate}: Props) => {
    const token = useTheme();
    const chartData = useMemo(() => {
        const sortedData = sortBy(data, value => value.jointAt.getTime());
        const seperatedData = groupBy(sortedData, value => Date.UTC(value.jointAt.getUTCFullYear(), value.jointAt.getUTCMonth(), value.jointAt.getUTCDate()));
        const seperatedArray = values(seperatedData);
        const firstEntry = seperatedArray[0];

        const resultData: { key: string, date: number, count: number, unverified: number }[] = [];

        const firstJointAt = firstEntry[0].jointAt
        const today = new Date();

        const startDate = Date.UTC(firstJointAt.getUTCFullYear(), firstJointAt.getUTCMonth(), firstJointAt.getUTCDate());
        const endDate = Date.UTC(today.getUTCFullYear(), today.getUTCMonth(), today.getUTCDate());

        let currentUserCount = 0;
        let unverifiedUserCount = 0;

        for (let date = startDate; date < endDate; date += 24 * 60 * 60 * 1000) {
            const seperatedDataEntry = seperatedData[date];
            const key = new Date(date).toLocaleDateString();
            if (!seperatedDataEntry || seperatedDataEntry.length === 0) {
                resultData.push({
                    key: key,
                    date: date,
                    count: currentUserCount,
                    unverified: unverifiedUserCount
                });
            } else {
                currentUserCount += seperatedDataEntry.length;
                unverifiedUserCount += seperatedDataEntry.filter(value => !value.verified).length;
                resultData.push({
                    key: key,
                    date: date,
                    count: currentUserCount,
                    unverified: unverifiedUserCount
                });
            }
        }

        return resultData.filter(({date}) => {
            let passed = true;
            if (selectedStartDate) {
                passed = date >= selectedStartDate.getTime();
            }

            if (passed && selecredEndDate) {
                passed = date <= selecredEndDate.getTime();
            }

            return passed;
        });
    }, [data, selectedStartDate]);

    return (
        <Row justify={"center"}>
            <Col flex={"1"}>
                <Card
                    styles={{
                        body: {
                            textAlign: "center",
                            paddingLeft: 0,
                            paddingRight: 0
                        }
                    }}
                >
                    <Text style={{fontSize: token.fontSizeHeading3}}>Total Users</Text>
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
