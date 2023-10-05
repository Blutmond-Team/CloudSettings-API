"use client"
import {Button, Card, Col, Row} from "antd";
import {Text} from "@/components/antd/Text";
import {useTheme} from "@/hooks";
import Icon, {CloudServerOutlined, EyeInvisibleOutlined, LockOutlined, TeamOutlined} from "@ant-design/icons";
import {ModrinthIcon} from "@/components/icons/ModrinthIcon";
import {CurseForgeIcon} from "@/components/icons/CurseForgeIcon";

const {Meta} = Card;

export const HeroCard = () => {
    const token = useTheme();

    return (
        <Card style={{borderBottomLeftRadius: 0, borderBottomRightRadius: 0}}>
            <Row justify={"center"}>
                <Col flex={"0 0 1280px"}>
                    <Row>
                        <Col span={24}>
                            <Row gutter={[16, 8]} justify={"center"}>
                                <Col span={24}>
                                    <Row justify={"center"}>
                                        <Col>
                                            <Text
                                                style={{color: token.colorPrimary, fontWeight: token.fontWeightStrong}}
                                            >
                                                Play better with
                                            </Text>
                                        </Col>
                                    </Row>
                                </Col>
                                <Col span={24}>
                                    <Row justify={"center"}>
                                        <Col>
                                            <Text
                                                style={{
                                                    fontWeight: token.fontWeightStrong,
                                                    fontSize: token.fontSizeHeading2,
                                                    color: "white"
                                                }}>
                                                CloudSettings
                                            </Text>
                                        </Col>
                                    </Row>
                                </Col>
                                <Col span={24} style={{marginBottom: token.marginLG}}>
                                    <Row justify={"center"}>
                                        <Col flex={"0 0 638px"}>
                                            <Text style={{
                                                textAlign: "center",
                                                fontSize: token.fontSizeXL,
                                                color: token.colorTextSecondary,
                                                width: "100%",
                                                display: "block"
                                            }}>
                                                A simple mod with synchronizes your Minecraft options with all of your
                                                Modpacks no matter where you are.
                                            </Text>
                                        </Col>
                                    </Row>
                                </Col>
                                <Col span={24}>
                                    <Row gutter={[16, 8]} justify={"center"}>
                                        <Col>
                                            <Button
                                                type={"primary"}
                                                className={"!bg-malachite-600 hover:!bg-malachite-700"}
                                                icon={<Icon component={ModrinthIcon}/>}
                                                href={"https://modrinth.com/mod/cloudsettings"}
                                            >
                                                Download on Modrinth
                                            </Button>
                                        </Col>
                                        <Col>
                                            <Button
                                                type={"primary"}
                                                className={"!bg-flamingo hover:!bg-flamingo-600"}
                                                icon={<Icon component={CurseForgeIcon}/>}
                                                href={"https://curseforge.com/minecraft/mc-mods/cloudsettings"}
                                            >
                                                Download on CurseForge
                                            </Button>
                                        </Col>
                                    </Row>
                                </Col>
                                <Col flex={"0 0 900px"} style={{marginTop: token.marginXL, marginBottom: token.marginXL}}>
                                    <Row justify={"center"} gutter={[32,16]}>
                                        <Col xs={24} sm={12}>
                                            <Card>
                                                <Meta
                                                    avatar={<Text style={{fontSize: token.fontSizeHeading2, color: token.colorPrimary}}><CloudServerOutlined/></Text>}
                                                    title={"Stored in Cloud"}
                                                    description={"Your settings will be stored in a cloud storage hosted by BisectHosting."}
                                                />
                                            </Card>
                                        </Col>
                                        <Col xs={24} sm={12}>
                                            <Card>
                                                <Meta
                                                    avatar={<Text style={{fontSize: token.fontSizeHeading2, color: token.colorPrimary}}><LockOutlined /></Text>}
                                                    title={"Secure Communication"}
                                                    description={"The communication with the cloud storage is fully ssl encrypted."}
                                                />
                                            </Card>
                                        </Col>
                                        <Col xs={24} sm={12}>
                                            <Card>
                                                <Meta
                                                    avatar={<Text style={{fontSize: token.fontSizeHeading2, color: token.colorPrimary}}><TeamOutlined /></Text>}
                                                    title={"Open Source"}
                                                    description={"This Web App as well as the actual mod are open source projects supported by BisectHosting."}
                                                />
                                            </Card>
                                        </Col>
                                        <Col xs={24} sm={12}>
                                            <Card>
                                                <Meta
                                                    avatar={<Text style={{fontSize: token.fontSizeHeading2, color: token.colorPrimary}}><EyeInvisibleOutlined /></Text>}
                                                    title={"Privacy Respecting"}
                                                    description={"We're only interested in making your live easier therefore we just use your Minecraft UUID, Minecraft Name and the single line of impacted option. No more Data is stored."}
                                                />
                                            </Card>
                                        </Col>
                                    </Row>
                                </Col>
                            </Row>
                        </Col>
                    </Row>
                </Col>
            </Row>
        </Card>
    );
};