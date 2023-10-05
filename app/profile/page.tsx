import {PrismaClient} from "@prisma/client";
import {getServerSession} from "next-auth";
import {CloudSettingsSession} from "@/src/types/AuthTypes";
import {authOptions} from "@/app/api/auth/[...nextauth]/route";
import {redirect} from "next/navigation";
import {revalidatePath} from "next/cache";
import {OptionsTable} from "@/components/profile/OptionsTable";
import {Col, Row} from "antd";
import {ProfileActions} from "@/components/profile/ProfileActions";

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
                        <ProfileActions user={data.user}/>
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
    const session = await getServerSession(authOptions);
    if (!session) {
        redirect('/');
        return {
            options: []
        }
    }

    const cloudSettingsSession = session as CloudSettingsSession;
    if (!cloudSettingsSession.postLogin) {
        redirect('/');
        return {
            options: []
        }
    }

    const prisma = new PrismaClient();
    const options = await prisma.option.findMany({
        where: {
            userId: cloudSettingsSession.minecraft.uuid
        }
    });
    const user = await prisma.user.findFirst({
        where: {
            id: cloudSettingsSession.minecraft.uuid
        }
    });

    return {
        options: options,
        user: user
    }
}