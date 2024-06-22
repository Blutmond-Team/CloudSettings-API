"use client"
import {SessionProvider} from "next-auth/react";
import {ToastContainer} from "react-toastify";
import 'react-toastify/dist/ReactToastify.css';
import {ConfigProvider, theme as AntDTheme} from "antd";
import {theme} from "@/theme";
import {QueryClient, QueryClientProvider} from "@tanstack/react-query";
import axios from "axios";
import {ReactQueryDevtools} from "@tanstack/react-query-devtools";

const {darkAlgorithm} = AntDTheme;

const queryClient = new QueryClient({
    defaultOptions: {
        queries: {
            queryFn: async ({queryKey}) => {
                const {data} = await axios.get(queryKey.join('/'));
                return data;
            }
        }
    }
});

type Props = {
    children: React.ReactNode
}
export const AppProvider = ({children}: Props) => {
    return (
        <QueryClientProvider client={queryClient}>
            <ConfigProvider theme={{...theme, algorithm: darkAlgorithm}}>
                <SessionProvider>
                    {children}
                    <ToastContainer closeButton={false} closeOnClick={false}/>
                </SessionProvider>
            </ConfigProvider>
            <ReactQueryDevtools initialIsOpen={false}/>
        </QueryClientProvider>
    );
};