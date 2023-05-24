import Hero2x2Grid from "@/app/Hero2x2Grid";
import {
    ArrowPathIcon,
    CloudArrowUpIcon,
    EyeSlashIcon,
    LockClosedIcon, UserGroupIcon
} from "@heroicons/react/24/outline";

export default function Home() {
    return (
        <>
            <Hero2x2Grid
                noteText={"Play better with"}
                title={"CloudSettings"}
                description={"A simple mod with synchronizes your Minecraft options with all of your Modpacks no matter where you are."}
                items={[
                    {
                        name: 'Stored in Cloud',
                        description: 'Your settings will be stored in a cloud storage hosted by BisectHosting.',
                        icon: CloudArrowUpIcon,
                    },
                    {
                        name: 'Secure Communication',
                        description: 'The communication with the cloud storage is fully ssl encrypted.',
                        icon: LockClosedIcon,
                    },
                    {
                        name: 'Open Source',
                        description: 'This Web App as well as the actual mod are open source projects supported by BisectHosting.',
                        icon: UserGroupIcon,
                    },
                    {
                        name: 'Privacy Respecting',
                        description: "We're only interested in making your live easier therefor we just use your Minecraft UUID, Minecraft Name and the single line of impacted option. No more Data is stored.",
                        icon: EyeSlashIcon,
                    }
                ]}
            />
        </>
    )
}
