"use client"
import {Card, Col, Row} from "antd";
import {useTheme} from "@/hooks";
import ArrowDownOutlined from "@ant-design/icons/ArrowDownOutlined";
import CloudSyncOutlined from "@ant-design/icons/CloudSyncOutlined";
import TeamOutlined from "@ant-design/icons/TeamOutlined";
import {Text} from "@/components/antd/Text";
import {useQuery} from "@tanstack/react-query";
import CountUp from "react-countup";
import {UsageStats} from "@/src/types/ApiTypes";

const {Meta} = Card;

type Props = {}

export const StatisticsPanel = ({}: Props) => {
    const token = useTheme();
    const {data} = useQuery<UsageStats>({
        queryKey: ["api", "usageStats"],
        staleTime: 1000 * 60
    });


    return (
        <Row>
            <Col span={24}>
                <Row
                    justify={"center"}
                    gutter={[36, 16]}
                    style={{
                        margin: token.marginXL,
                    }}
                >
                    <Col flex={"0 0 360px"}>
                        <Card
                            className={"!w-full"}
                            styles={{
                                body: {
                                    padding: `${token.paddingSM}px ${token.paddingMD}px`
                                }
                            }}
                        >
                            <Meta
                                avatar={
                                    <Row justify={"center"} align={"middle"} className={"!h-full"}>
                                        <Col>
                                            <Text
                                                style={{
                                                    fontSize: token.fontSizeHeading2,
                                                    color: token.colorPrimary,
                                                    alignSelf: "center"
                                                }}
                                            >
                                                <TeamOutlined/>
                                            </Text>
                                        </Col>
                                    </Row>
                                }
                                title={<Text style={{color: token.colorTextSecondary, fontSize: token.fontSizeSM}}>Total
                                    Users</Text>}
                                description={
                                    <Text style={{
                                        fontSize: token.fontSizeHeading3,
                                        fontWeight: token.fontWeightStrong
                                    }}>
                                        <CountUp
                                            end={data?.userCount ?? 0}
                                            separator={" "}
                                        />
                                    </Text>
                                }
                            />
                        </Card>
                    </Col>
                    <Col flex={"0 0 360px"}>
                        <Card
                            className={"!w-full"}
                            styles={{
                                body: {
                                    padding: `${token.paddingSM}px ${token.paddingMD}px`
                                }
                            }}
                        >
                            <Meta
                                avatar={
                                    <Row justify={"center"} align={"middle"} className={"!h-full"}>
                                        <Col>
                                            <Text
                                                style={{
                                                    fontSize: token.fontSizeHeading2,
                                                    color: token.colorPrimary,
                                                    alignSelf: "center"
                                                }}
                                            >
                                                <CloudSyncOutlined/>
                                            </Text>
                                        </Col>
                                    </Row>
                                }
                                title={<Text style={{color: token.colorTextSecondary, fontSize: token.fontSizeSM}}>Stored
                                    Options</Text>}
                                description={<Text style={{
                                    fontSize: token.fontSizeHeading3,
                                    fontWeight: token.fontWeightStrong
                                }}>
                                    <CountUp
                                        end={data?.optionsCount ?? 0}
                                        separator={" "}
                                    />
                                </Text>}
                            />
                        </Card>
                    </Col>
                    <Col flex={"0 0 360px"}>
                        <Card
                            className={"!w-full"}
                            styles={{
                                body: {
                                    padding: `${token.paddingSM}px ${token.paddingMD}px`
                                }
                            }}
                        >
                            <Meta
                                avatar={
                                    <Row justify={"center"} align={"middle"} className={"!h-full"}>
                                        <Col>
                                            <Text
                                                style={{
                                                    fontSize: token.fontSizeHeading2,
                                                    color: token.colorPrimary,
                                                    alignSelf: "center"
                                                }}
                                            >
                                                <ArrowDownOutlined/>
                                            </Text>
                                        </Col>
                                    </Row>
                                }
                                title={
                                    <Text
                                        style={{color: token.colorTextSecondary, fontSize: token.fontSizeSM}}>
                                        Total Downloads
                                    </Text>
                                }
                                description={<Text style={{
                                    fontSize: token.fontSizeHeading3,
                                    fontWeight: token.fontWeightStrong
                                }}>
                                    <CountUp
                                        end={data?.totalDownloads ?? 0}
                                        separator={" "}
                                    />
                                </Text>}
                            />
                        </Card>
                    </Col>
                </Row>
            </Col>
        </Row>

    );
};