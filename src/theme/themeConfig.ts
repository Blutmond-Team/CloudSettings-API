import type {ThemeConfig} from "antd";
import {theme as t} from "antd"

export const theme: ThemeConfig = {
    algorithm: t.darkAlgorithm,
    token: {
        "colorPrimary": "#87ceeb",
        "colorInfo": "#87ceeb",
        "colorBgBase": "#0a0a0a",
        "colorBgContainer": "#1e2024",
        "colorBgSpotlight": "#383c43",
        "colorBgElevated": "#515761",
        "fontSize": 16,
        "colorBorderSecondary": "#1e2024",
        "colorBorder": "#383c43",
        "colorSuccess": "#1bd96a",
        "colorWarning": "#f16436",
        "colorError": "#dc2626"
    },
    components: {
        Divider: {
            colorSplit: "rgba(56,60,67,0.45)"
        },
    }
}

