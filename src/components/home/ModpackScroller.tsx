"use client"

import {Card, Col, Row} from "antd";
import {Text} from "@/components/antd/Text";
import {useTheme} from "@/hooks";
import {InfiniteLooper} from "@/components/global/InfiniteLooper";
import {ModpackCard} from "@/components/home/ModpackCard";

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
                        <ModpackCard
                            href={"https://www.curseforge.com/minecraft/modpacks/blutmond"}
                            img={"https://media.forgecdn.net/attachments/363/785/header.png"}
                            title={"Blutmond"}
                            desc={"A Modpack made for the Blutmond Community"}
                        />
                    </InfiniteLooper>
                </Col>
            </Row>
        </Card>
    );
};