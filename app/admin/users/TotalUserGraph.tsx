"use client"
import {UserData} from "@/app/admin/users/page";
import {Area, AreaChart, CartesianGrid, ResponsiveContainer, Tooltip, XAxis, YAxis} from "recharts";
import * as _ from "lodash"
import {useMemo} from "react";

type Props = {
    data: UserData[]
}
export const TotalUserGraph = ({data}: Props) => {
    const chartData = useMemo(() => {
        const sortedData = _.sortBy(data, value => value.jointAt.getTime());
        const seperatedData = _.groupBy(sortedData, value => value.jointAt.setHours(0, 0, 0, 0));
        const seperatedArray = _.values(seperatedData);
        const firstEntry = seperatedArray[0];
        const lastEntry = seperatedArray[seperatedArray.length - 1];

        const resultData: { key: string, count: number }[] = [];
        let currentUserCount = 0;
        for (let date = firstEntry[0].jointAt.setHours(0, 0, 0, 0); date < lastEntry[0].jointAt.setHours(0, 0, 0, 0); date += 24 * 60 * 60 * 1000) {
            const seperatedDataEntry = seperatedData[date];
            const key = new Date(date).toLocaleDateString();
            if (!seperatedDataEntry || seperatedDataEntry.length === 0) {
                resultData.push({
                    key: key,
                    count: currentUserCount
                });
            } else {
                currentUserCount += seperatedDataEntry.length;
                resultData.push({
                    key: key,
                    count: currentUserCount
                });
            }
        }

        return resultData;
    }, [data]);

    return (
        <div className={"w-fit"}>
            <h3 className={"text-center"}>Total Users</h3>
            <AreaChart
                data={chartData}
                width={512}
                height={384}
            >
                <CartesianGrid strokeDasharray={"3 3"}/>
                <YAxis dataKey={"count"}/>
                <XAxis dataKey={"key"}/>
                <Area
                    dataKey={"count"}
                    type={"monotone"}
                    stroke={"#8884d8"}
                    fill={"#8884d8"}
                />
                <Tooltip/>
            </AreaChart>
        </div>
    )
};