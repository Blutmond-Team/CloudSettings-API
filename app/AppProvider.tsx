"use client"
import {SessionProvider} from "next-auth/react";
import {ToastContainer} from "react-toastify";
import 'react-toastify/dist/ReactToastify.css';
import {ConfigProvider, theme as AntDTheme} from "antd";
import {theme} from "@/theme";
import {useEffect, useState} from "react";

const {defaultAlgorithm, darkAlgorithm} = AntDTheme;

type Props = {
    children: React.ReactNode
}
export const AppProvider = ({children}: Props) => {
    const [isDarkMode, setDarkMode] = useState<boolean>(false);
    useEffect(() => {
        const isDarkMode = window.matchMedia("(prefers-color-scheme: dark)").matches;
        (window as any).toggleDarkMode = function () {
            setDarkMode(prevState => {
                const darkMode = !prevState;
                console.log(`Changed Theme into ${darkMode ? 'dark' : 'light'} mode`)
                return darkMode
            });
        }
        setDarkMode(isDarkMode);
    }, []);


    return (
        <ConfigProvider theme={{...theme, algorithm: isDarkMode ? darkAlgorithm : defaultAlgorithm}}>
            <SessionProvider>
                {children}
                <ToastContainer closeButton={false} closeOnClick={false}/>
            </SessionProvider>
        </ConfigProvider>
    );
};