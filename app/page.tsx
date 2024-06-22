import {HeroCard} from "@/components/home/HeroCard";
import {StatisticsPanel} from "@/components/home/StatisticsPanel";
import {ModpackScroller} from "@/components/home/ModpackScroller";

export type PageData = {
    userCount: number
    optionsCount: number
    totalDownloads: number
}

export default async function Home() {
    return (
        <>
            <HeroCard/>
            <StatisticsPanel/>
            <ModpackScroller/>
        </>
    )
};

export const revalidate = 60;