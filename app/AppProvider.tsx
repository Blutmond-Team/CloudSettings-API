"use client"
import {SessionProvider} from "next-auth/react";
import {ToastContainer} from "react-toastify";
import 'react-toastify/dist/ReactToastify.css';

type Props = {
    children: React.ReactNode
}
export const AppProvider = ({children}: Props) => {
    return (
        <SessionProvider>
            {children}
            <ToastContainer closeButton={false} closeOnClick={false}/>
        </SessionProvider>
    );
};