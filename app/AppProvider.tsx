"use client"
import {SessionProvider} from "next-auth/react";
import {ToastContainer} from "react-toastify";
import 'react-toastify/dist/ReactToastify.css';
import {ConfigProvider, theme as AntDTheme} from "antd";
import {theme} from "@/theme";

const {darkAlgorithm} = AntDTheme;

type Props = {
    children: React.ReactNode
}
export const AppProvider = ({children}: Props) => {
    return (
        <ConfigProvider theme={{...theme, algorithm: darkAlgorithm}}>
            <SessionProvider>
                {children}
                <ToastContainer closeButton={false} closeOnClick={false}/>
            </SessionProvider>
        </ConfigProvider>
    );
};