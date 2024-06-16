import {PrismaClient} from "@prisma/client";
import {CloudSettingsSession} from "@/src/types/AuthTypes";
import {redirect} from "next/navigation";
import {revalidatePath} from "next/cache";
import {OptionsTable} from "@/components/profile/OptionsTable";
import {Col, Row} from "antd";
import {ProfileActions} from "@/components/profile/ProfileActions";
import {auth} from "@/auth";

export default async function Home() {
    async function revalidatePage() {
        "use server";
        revalidatePath('/profile');
    }

    const data = await getData();

    return (
        <Row justify={"center"}>
            <Col style={{width: "100%", maxWidth: 1280, padding: "4px 8px"}}>
                <Row gutter={[16, 8]}>
                    <Col span={24}>
                        <ProfileActions
                            user={data.user}
                            options={data.options}
                        />
                    </Col>
                    <Col span={24}>
                        <OptionsTable
                            options={data.options}
                            revalidateFunction={revalidatePage}
                        />
                    </Col>
                </Row>
            </Col>
        </Row>
    )
}

async function getData() {
    const session = await auth() as CloudSettingsSession | null;
    if (!session) {
        redirect('/');
        return {
            options: []
        }
    }

    if (!session.postLogin) {
        redirect('/');
        return {
            options: []
        }
    }

    const prisma = new PrismaClient();
    const options = await prisma.option.findMany({
        where: {
            userId: session.minecraft.uuid
        }
    });
    const user = await prisma.user.findFirst({
        where: {
            id: session.minecraft.uuid
        }
    });

    return {
        options: options,
        user: user
    }
}
