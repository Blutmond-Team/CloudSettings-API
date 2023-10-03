"use client"
import {HTMLAttributeAnchorTarget, useMemo, useRef} from "react";
import {signIn, signOut, useSession} from "next-auth/react";
import CloudSettingsLogo from '@/public/cloudsettings_logo_transparent.png';
import {CloudSettingsSession} from "@/src/types/AuthTypes";
import {Col, Divider, Dropdown, Layout, Menu, MenuProps, Row, Space} from "antd";
import Image from "next/image";
import Link from "next/link";
import {Text} from "@/components/antd/Text";
import {ConditionalElement} from "@/components/global/ConditionalElement";
import {UserAvatar} from "@/components/menu/UserAvatar";
import {useTheme} from "@/hooks";

type Props = {
    children: React.ReactNode
}

function classNames(...classes: string[]) {
    return classes.filter(Boolean).join(' ');
}

type NavigationItem = {
    name: string,
    href: string,
    current: (path: string) => boolean
    target?: HTMLAttributeAnchorTarget
}

const navigation: NavigationItem[] = [
    {
        name: 'Home',
        href: '/',
        current: path => path === "" || path === "/"
    },
    {
        name: 'GitHub (Mod)',
        href: 'https://github.com/Blutmond-Team/CloudSettings-Mod',
        current: () => false,
        target: "_blank"
    },
    {
        name: 'GitHub (Web App)',
        href: 'https://github.com/Blutmond-Team/CloudSettings-API',
        current: () => false,
        target: "_blank"
    }
];

type UserNavigationItem = {
    key: string,
    name: string,
    href: string
}

const {Header, Content, Footer, Sider} = Layout;


export function AppShell({children}: Props) {
    const token = useTheme();
    const session = useSession();
    const user = useMemo(() => {
        switch (session.status) {
            default:
                return undefined;
            case "authenticated":
                return session.data as CloudSettingsSession;
        }
    }, [session]);

    const userDropdownItems: MenuProps['items'] = useMemo(() => {
        const entries: MenuProps['items'] = [
            {
                key: "profile",
                label: <Link href={"/profile"}><Text>Your Profile</Text></Link>,
            }
        ];

        if (user?.postLogin) {
            if (user.role === "ADMIN") {
                entries.push(
                    {
                        key: "Admin Tools Divider",
                        type: "divider"
                    },
                    {
                        key: "User Management",
                        label: <Link href={"/admin/users"}><Text>User Management</Text></Link>,
                    }
                )
            }
        }

        entries.push({
                key: "Accout Settings Divider",
                type: "divider"
            },
            {
                key: "Sign Out",
                label: <Text>Sign Out</Text>,
                onClick: () => signOut()
            })


        return entries;
    }, [user]);

    const headerRef = useRef<HTMLElement>(null);
    const footerRef = useRef<HTMLElement>(null);

    return (
        <Layout>
            <Sider
                className={"sm:!hidden !fixed h-[100vh] !top-0 !left-0 !z-20"}
                collapsedWidth={0}
                breakpoint={"md"}
                style={{backgroundColor: token.colorPrimaryActive}}
                zeroWidthTriggerStyle={{
                    backgroundColor: token.colorPrimaryActive
                }}
                defaultCollapsed={true}
            >

            </Sider>
            <Layout>
                <Header className={"sm:!flex !items-center !hidden !fixed !top-0 !left-0 !right-0 !z-10"}
                        style={{backgroundColor: token.colorBgLayout}}>
                    <Row gutter={[16, 0]} className={"!w-full"}>
                        <Col className={"!flex !mr-3 !items-center"}>
                            <Image
                                src={CloudSettingsLogo.src}
                                alt={"CloudSettings"}
                                width={42}
                                height={42}
                            />
                        </Col>
                        <Col flex={"1 0"}>
                            <Menu
                                selectedKeys={[]}
                                mode={"horizontal"}
                                style={{backgroundColor: token.colorBgLayout, border: "0"}}
                                items={[
                                    {
                                        key: "home",
                                        label: <Link href={"/"}>
                                            <Text>Home</Text>
                                        </Link>,

                                    },
                                    {
                                        key: 'source_code',
                                        label: "Source Code",
                                        children: [
                                            {
                                                key: 'github_mod',
                                                label: <Link
                                                    href={"https://github.com/Blutmond-Team/CloudSettings-Mod"}
                                                    target={"_blank"}
                                                >
                                                    <Text>Minecraft Mod</Text>
                                                </Link>,
                                            },
                                            {
                                                key: 'github_web_app',
                                                label: <Link
                                                    href={"https://github.com/Blutmond-Team/CloudSettings-API"}
                                                    target={"_blank"}
                                                >
                                                    <Text>Web App</Text>
                                                </Link>
                                            },
                                        ]
                                    },
                                    {
                                        key: 'bisect',
                                        label: <Link
                                            href={"https://www.bisecthosting.com/bloodmoon"}
                                            target={"_blank"}
                                        >
                                            <Text>BisectHosting</Text>
                                        </Link>
                                    },
                                ]}
                            />
                        </Col>
                        <Col>
                            <ConditionalElement enabled={user !== undefined}>
                                <Space direction={"vertical"}>
                                    <Space wrap>
                                        <Dropdown
                                            menu={{
                                                items: userDropdownItems
                                            }}
                                            dropdownRender={menu => (
                                                <div style={{
                                                    backgroundColor: token.colorBgElevated,
                                                    borderRadius: token.borderRadiusLG,
                                                    boxShadow: token.boxShadowSecondary
                                                }}>
                                                    <Space
                                                        style={{padding: 8, width: "100%", justifyContent: "center"}}>
                                                        <Text className={"!text-xl !font-bold"}>
                                                            {user?.postLogin ? user.minecraft.username : user?.user?.name}
                                                        </Text>
                                                    </Space>
                                                    <Divider style={{margin: 0}}/>
                                                    {menu}
                                                </div>
                                            )}
                                        >
                                            <div>
                                                <UserAvatar user={user}/>
                                            </div>
                                        </Dropdown>
                                    </Space>
                                </Space>
                            </ConditionalElement>
                            <ConditionalElement enabled={user === undefined}>
                                <Menu
                                    selectedKeys={[]}
                                    mode={"horizontal"}
                                    items={[
                                        {
                                            key: "login",
                                            label: "Log In",
                                            onClick: () => signIn('azure-ad')
                                        }
                                    ]}
                                />
                            </ConditionalElement>
                        </Col>
                    </Row>
                </Header>
                <Content className={"sm:!pt-[64px] !pb-[78px]"}>
                    {children}
                </Content>
                <Footer className={"!fixed !bottom-0 !left-0 !right-0 !z-10"}>
                    <Row className={"w-full"} gutter={[16, 0]}>
                        <Col flex={"1 1"}>
                            <Text style={{color: token.colorTextTertiary}}>
                                &copy; {new Date().getFullYear()} Blutmond Development Team
                            </Text>
                        </Col>
                        <Col>
                            <Link
                                href={"https://github.com/Blutmond-Team"}
                                target={"_blank"}
                            >
                                <Text style={{color: token.colorTextTertiary}}>
                                    <svg fill="currentColor" viewBox="0 0 24 24" className={"h-6 w-6"}>
                                        <path
                                            fillRule="evenodd"
                                            d="M12 2C6.477 2 2 6.484 2 12.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.531 1.032 1.531 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0112 6.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.202 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.943.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.019 10.019 0 0022 12.017C22 6.484 17.522 2 12 2z"
                                            clipRule="evenodd"
                                        />
                                    </svg>
                                </Text>
                            </Link>
                        </Col>
                        <Col>
                            <Link
                                href={"https://github.com/Blutmond-Team"}
                                target={"_blank"}
                            >
                                <Text style={{color: token.colorTextTertiary}}>
                                    <svg
                                        xmlns="http://www.w3.org/2000/svg" viewBox="0 0 72.54 78.82"
                                        className={"h-6 w-6"}
                                    >
                                        <defs>
                                            <style>
                                                {
                                                    `.cls-1{fill:#0d1129;} .cls-3{fill:currentColor;}`
                                                }
                                            </style>
                                        </defs>
                                        <g id="Layer_2" data-name="Layer 2">
                                            <g id="Layer_1-2" data-name="Layer 1">
                                                <path className="cls-1"
                                                      d="M35.72,78.32a4.63,4.63,0,0,1-2.2-.57L3,62A4.6,4.6,0,0,1,.5,57.82V21.53A4.6,4.6,0,0,1,3,17.37L33.46,1.05A4.77,4.77,0,0,1,35.65.5a4.83,4.83,0,0,1,2.22.55L69.49,17.42A4.56,4.56,0,0,1,72,21.59V57.76A4.64,4.64,0,0,1,69.43,62L37.81,77.82A4.82,4.82,0,0,1,35.72,78.32Z"/>
                                                <polygon className="cls-3"
                                                         points="51.63 20.51 58.83 17.45 59.01 17.57 59.01 32.63 51.63 32.15 51.63 20.51"/>
                                                <polygon className="cls-3"
                                                         points="51.63 59.74 58.83 61.9 59.01 61.36 59.01 44.74 51.63 45.28 51.63 59.74"/>
                                                <path className="cls-3"
                                                      d="M30.33,68.74l1.56-2.34.66.6-1.62,2.34Zm1.86-2-.3-.29a.4.4,0,0,1,.6-.06c.18.12.18.42.06.66Zm-.36,0,.6-28.24h.84l-.66,28.24Zm1-28.24h-.42a.42.42,0,1,1,.84,0Zm-.42,0L31.71,9.11h.84l.72,29.34Zm-.3-29.34h-.42a.46.46,0,0,1,.42-.48.43.43,0,0,1,.42.48Zm-.3-.36a5.11,5.11,0,0,1,3.24-1.62l.06,1a4.15,4.15,0,0,0-2.7,1.32Zm3.24-1.62a7.43,7.43,0,0,1,4,.72l-.3.84a7.15,7.15,0,0,0-3.6-.6Zm4,.72,3.54,1.68-.3.9L38.73,8.69Zm3.54,1.68L51.81,14l-.36.9-9.18-4.44Zm9.06,4.86.18-.42a.47.47,0,0,1,.18.6.43.43,0,0,1-.54.3Zm.42,0V32.2h-.84V14.39ZM51.63,32.2h.42a.42.42,0,1,1-.84,0Zm0-.48,7.31.48v1l-7.31-.49Zm7.31,1V32.2a.49.49,0,0,1,0,1Zm-.41,0V17.87h.84V32.68Zm.41-14.81h-.41a.42.42,0,1,1,.84,0Zm.19-.42,8,3.9-.3.9-8.09-4ZM67,21.83l.18-.48a.67.67,0,0,1,.24.66c-.12.24-.36.36-.54.24Zm.42,0V57.7h-.84V21.83ZM67,57.7h.42a.42.42,0,1,1-.84,0Zm.3.36h0l-.6-.72h0ZM67,57.7l.3.36a.4.4,0,0,1-.6,0,.76.76,0,0,1,0-.72Zm.18.42-8.09,3.66-.3-.84,8.09-3.66Zm-8.22,3.24.13.42a.33.33,0,0,1-.48-.24.45.45,0,0,1,.18-.6Zm-.41,0V44.68h.84V61.36Zm.41-16.68h-.41a.42.42,0,1,1,.84,0Zm0,.48-7.31.54v-1l7.31-.54Zm-7.31.06v.48a.48.48,0,0,1,0-1Zm.42,0V64.66h-.84V45.22Zm-.42,19.44h.42a.42.42,0,1,1-.84,0Zm.18.42L39,71l-.3-.84,12.72-5.93ZM38.91,70.6,39,71c-.18.12-.42,0-.54-.24a.54.54,0,0,1,.24-.6ZM39,71a7.47,7.47,0,0,1-4.62.49l.12-1a6.82,6.82,0,0,0,4.2-.36Zm-4.62.49a7.23,7.23,0,0,1-4.08-2.1l.6-.73a6.19,6.19,0,0,0,3.6,1.86ZM30.63,69l-.3.36a.56.56,0,0,1,0-.73.42.42,0,0,1,.6,0Z"/>
                                                <path className="cls-3"
                                                      d="M6.1,57,27.87,68.67c6.54,3.48,13.32,4.68,13.32-5V48.64a11.07,11.07,0,0,0-1.74-6.12,8.68,8.68,0,0,0-3.36-3.12,9.16,9.16,0,0,0,3.36-3.12,10.55,10.55,0,0,0,1.68-6.11V15.71c0-9.6-6.06-9.42-11.76-6.48L6.1,21.35Z"/>
                                                <path className="cls-3"
                                                      d="M6.28,56.62,28.05,68.2l-.3.9L5.92,57.46ZM28.05,68.2c2.76,1.5,5.52,2.52,7.8,2.52v1c-2.4,0-5.28-1.07-8.1-2.57Zm7.8,2.52a4.27,4.27,0,0,0,2.34-.55l.36.91a5.75,5.75,0,0,1-2.7.59Zm2.34-.55a4.09,4.09,0,0,0,1.68-1.67l.72.48a5.36,5.36,0,0,1-2,2.1Zm1.68-1.67a10.35,10.35,0,0,0,.9-4.8h.84a11.28,11.28,0,0,1-1,5.28Zm.9-4.8V48.64h.84V63.7Zm0-15.06a10.6,10.6,0,0,0-.42-3.12l.78-.3a12.73,12.73,0,0,1,.48,3.42Zm-.42-3.12a11.49,11.49,0,0,0-1.26-2.76l.66-.54a10.52,10.52,0,0,1,1.38,3Zm-1.26-2.76A8.24,8.24,0,0,0,37.65,41l.48-.72a10.16,10.16,0,0,1,1.62,1.92ZM37.65,41a8.59,8.59,0,0,0-1.74-1.2l.3-.9a6.27,6.27,0,0,1,1.92,1.38ZM36.09,39.4l-.18.42a.67.67,0,0,1-.24-.66.44.44,0,0,1,.54-.24Zm-.18-.48a6.47,6.47,0,0,0,1.74-1.2l.48.78a7,7,0,0,1-1.92,1.32Zm2-.78-.24-.42a.42.42,0,0,1,.6.12.56.56,0,0,1-.12.66Zm-.24-.42A6.91,6.91,0,0,0,39.09,36l.66.6a10.41,10.41,0,0,1-1.62,1.91ZM39.09,36a11.08,11.08,0,0,0,1.26-2.7l.78.3a11.47,11.47,0,0,1-1.38,3Zm1.26-2.7a13.12,13.12,0,0,0,.42-3.12h.78a12.72,12.72,0,0,1-.42,3.42Zm.42-3.12-.06-14.46h.84V30.17Zm-.06-14.46a12.19,12.19,0,0,0-1-5.28l.66-.48a12.37,12.37,0,0,1,1.14,5.76Zm-1-5.28A4.67,4.67,0,0,0,38,8.51l.36-.84A5.21,5.21,0,0,1,40.41,10ZM38,8.51a5.21,5.21,0,0,0-2.52-.6V7a6,6,0,0,1,2.88.66Zm-2.52-.6a13.65,13.65,0,0,0-5.88,1.74l-.36-.84A14.38,14.38,0,0,1,35.43,7ZM29.55,9.65,6.28,21.83l-.36-.9L29.19,8.81ZM6.1,21.35l.18.48c-.24.06-.48,0-.54-.24a.55.55,0,0,1,.18-.66Zm.42,0V57H5.68V21.35ZM6.1,57h.42a.46.46,0,0,1-.42.48A.46.46,0,0,1,5.68,57Z"/>
                                                <path className="cls-1"
                                                      d="M30.57,24.23c0-.84-.48-1.14-1.38-.9l-18.35,5v7l18.53-2.09a1.33,1.33,0,0,0,1.2-1.5V24.23Z"/>
                                                <polygon className="cls-3"
                                                         points="11.74 29.81 29.31 25.61 29.31 30.77 11.74 33.47 11.74 29.81"/>
                                                <polygon className="cls-1"
                                                         points="25.65 27.83 27.69 27.47 27.69 29.51 25.65 29.86 25.65 27.83"/>
                                                <polygon className="cls-1"
                                                         points="13.96 30.59 22.59 28.73 22.59 30.23 21.28 30.46 13.96 31.91 13.96 30.59"/>
                                                <path className="cls-1"
                                                      d="M30.57,54.64c0,.9-.48,1.2-1.38,1L10.84,51.1v-7l18.53,1.56c.78.06,1.2.54,1.2,1.44v7.56Z"/>
                                                <polygon className="cls-3"
                                                         points="11.74 49.66 29.31 53.26 29.31 48.16 11.74 46 11.74 49.66"/>
                                                <polygon className="cls-1"
                                                         points="25.65 51.16 27.69 51.52 27.69 49.42 25.65 49.18 25.65 51.16"/>
                                                <polygon className="cls-1"
                                                         points="13.96 48.82 22.59 50.38 22.59 48.88 21.28 48.64 13.96 47.5 13.96 48.82"/>
                                            </g>
                                        </g>
                                    </svg>
                                </Text>
                            </Link>
                        </Col>
                    </Row>
                </Footer>
            </Layout>
        </Layout>
    );
}