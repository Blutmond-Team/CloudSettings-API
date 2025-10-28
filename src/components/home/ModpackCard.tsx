"use client"

import {Card, Col, Row} from "antd";
import Image from "next/image";
import {Text} from "@/components/antd/Text";
import Link from "next/link";
import {useTheme} from "@/hooks";
import {UrlObject} from "node:url";

type Props = {
    href: UrlObject
    img: string
    title: string
    desc: string
}
export const ModpackCard = ({href, img, title, desc}: Props) => {
    const theme = useTheme();

    return (
        <Link href={href} style={{margin: `0 ${theme.marginSM}px`}} target={"_blank"}>
            <Card
                style={{width: 280, height: 210, backgroundColor: theme.colorBgBase}}
                cover={
                    <Image
                        src={img}
                        alt={"Modpack Logo"}
                        width={280}
                        height={88}
                    />
                }
                styles={{
                    body: {
                        padding: `4px ${theme.paddingMD}px`,
                        height: "60%"
                    }
                }}
            >
                <Row justify={"center"} className={"h-full"}>
                    <Col span={24} className={"!flex !justify-center"}>
                        <Text style={{fontSize: theme.fontSizeHeading3}}>{title}</Text>
                    </Col>
                    <Col span={24} style={{textAlign: "center"}}>
                        <Text style={{color: theme.colorTextSecondary}}>{desc}</Text>
                    </Col>
                </Row>
            </Card>
        </Link>
    );
};
