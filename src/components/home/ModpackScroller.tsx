"use client"

import {Card, Col, Row} from "antd";
import {Text} from "@/components/antd/Text";
import {useTheme} from "@/hooks";
import {InfiniteLooper} from "@/components/global/InfiniteLooper";
import {ModpackCard} from "@/components/home/ModpackCard";

const modpacks: {
    url: string
    imageUrl: string
    name: string
    desc: string
}[] = [
    {
        url: "https://www.curseforge.com/minecraft/modpacks/blutmond",
        imageUrl: "https://media.forgecdn.net/attachments/363/785/header.png",
        name: "Blutmond",
        desc: "A Modpack made for the Blutmond Community"
    }
]

export const ModpackScroller = () => {
    const theme = useTheme();

    return (
        <Card
            style={{borderRadius: 0}}
            styles={{
                body: {
                    padding: `${theme.paddingLG}px 0`
                }
            }}
        >
            <Row gutter={[0, 16]}>
                <Col span={24}>
                    <Row justify={"center"}>
                        <Col className={"!text-center"}>
                            <Text style={{fontSize: theme.fontSizeHeading3, fontWeight: theme.fontWeightStrong, display: "inline-block"}}>
                                Modpacks using CloudSettings
                            </Text>
                        </Col>
                    </Row>
                </Col>
                <Col span={24}>
                    <InfiniteLooper>
                        {
                            modpacks.map((value, index) => (
                                <ModpackCard
                                    key={index}
                                    href={value.url}
                                    img={value.imageUrl}
                                    title={value.name}
                                    desc={value.desc}
                                />
                            ))
                        }
                    </InfiniteLooper>
                </Col>
            </Row>
        </Card>
    );
};