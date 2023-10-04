"use client"

import {Card, Col, Row} from "antd";
import {Text} from "@/components/antd/Text";
import {useTheme} from "@/hooks";
import {InfiniteLooper} from "@/components/global/InfiniteLooper";
import Image from "next/image";
import Link from "next/link";

export const ModpackScroller = () => {
    const theme = useTheme();

    return (
        <Card style={{borderRadius: 0}} bodyStyle={{padding: `${theme.marginLG}px 0`}}>
            <Row gutter={[0, 16]}>
                <Col span={24}>
                    <Row justify={"center"}>
                        <Col>
                            <Text style={{fontSize: theme.fontSizeHeading3, fontWeight: theme.fontWeightStrong}}>Modpacks
                                using CloudSettings</Text>
                        </Col>
                    </Row>
                </Col>
                <Col span={24}>
                    <InfiniteLooper>
                        <Link href={"https://www.curseforge.com/minecraft/modpacks/blutmond"} style={{margin: `0 ${theme.marginLG}px`}} target={"_blank"}>
                            <Card
                                style={{width: 280, height: 210, backgroundColor: theme.colorBgBase}}
                                cover={
                                    <Image
                                        src={"https://media.forgecdn.net/attachments/363/785/header.png"}
                                        alt={"Modpack Logo"}
                                        width={280}
                                        height={88}
                                    />
                                }
                                bodyStyle={{padding: `4px ${theme.paddingMD}px`, height: "60%"}}

                            >
                                <Row justify={"center"} className={"h-full"}>
                                    <Col span={24} className={"!flex !justify-center"}>
                                        <Text style={{fontSize: theme.fontSizeHeading3}}>Blutmond</Text>
                                    </Col>
                                    <Col span={24} style={{textAlign: "center"}}>
                                        <Text style={{color: theme.colorTextSecondary}}>A Modpack made for the Blutmond
                                            Community</Text>
                                    </Col>
                                </Row>
                            </Card>
                        </Link>
                    </InfiniteLooper>
                </Col>
            </Row>
        </Card>
    );
};