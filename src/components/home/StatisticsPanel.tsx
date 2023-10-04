"use client"
import {Card, Col, Row} from "antd";
import {useTheme} from "@/hooks";
import {PageData} from "@/app/page";
import {use} from "react";
import {TeamOutlined} from "@ant-design/icons";
import {Text} from "@/components/antd/Text";

const {Meta} = Card;

type Props = {
    dataPromise: Promise<PageData>
}

export const StatisticsPanel = ({dataPromise}: Props) => {
    const token = useTheme();
    const data = use(dataPromise);

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
                        <Card className={"!w-full"}>
                            <Meta
                                avatar={<Text style={{
                                    fontSize: token.fontSizeHeading2 ,
                                    color: token.colorPrimary,
                                    alignItems: "center",
                                    height: "100%"
                                }}><TeamOutlined/></Text>}
                                title={<Text style={{color: token.colorTextSecondary, fontSize: token.fontSizeSM}}>Total Users</Text>}
                                description={<Text style={{fontSize: token.fontSizeHeading3, fontWeight: token.fontWeightStrong}}>{data.userCount}</Text>}
                            />
                        </Card>
                    </Col>
                    <Col flex={"0 0 360px"}>
                        <Card className={"!w-full"}>
                            <Meta
                                avatar={<Text style={{
                                    fontSize: token.fontSizeHeading2 ,
                                    color: token.colorPrimary,
                                    alignItems: "center",
                                    height: "100%"
                                }}><TeamOutlined/></Text>}
                                title={<Text style={{color: token.colorTextSecondary, fontSize: token.fontSizeSM}}>Total Users</Text>}
                                description={<Text style={{fontSize: token.fontSizeHeading3, fontWeight: token.fontWeightStrong}}>{data.userCount}</Text>}
                            />
                        </Card>
                    </Col>
                    <Col flex={"0 0 360px"}>
                        <Card className={"!w-full"}>
                            <Meta
                                avatar={<Text style={{
                                    fontSize: token.fontSizeHeading2 ,
                                    color: token.colorPrimary,
                                    alignItems: "center",
                                    height: "100%"
                                }}><TeamOutlined/></Text>}
                                title={<Text style={{color: token.colorTextSecondary, fontSize: token.fontSizeSM}}>Total Users</Text>}
                                description={<Text style={{fontSize: token.fontSizeHeading3, fontWeight: token.fontWeightStrong}}>{data.userCount}</Text>}
                            />
                        </Card>
                    </Col>
                </Row>
            </Col>
        </Row>

    );
};