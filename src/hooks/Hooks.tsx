"use client"
import {Modal, theme} from "antd";
import {useState} from "react";
import {ModalProps} from "antd/es/modal/interface";

export const useTheme = () => {
    const {token} = theme.useToken();

    return token;
}

export const useModal = (
    {children, initialOpen = false, onOk, onCancel, footer, okText, cancelText, title, okType, width}: {
            initialOpen?: boolean
            onOk?: VoidFunction
            okText?: React.ReactNode
            cancelText?: React.ReactNode
            title?: React.ReactNode
            onCancel?: VoidFunction
            footer?: ModalProps["footer"]
            okType?: ModalProps["okType"]
            width?: ModalProps["width"]
        }
        & React.PropsWithChildren
) => {
    const [isOpen, setOpen] = useState<boolean>(initialOpen);
    const toggle = () => setOpen(prevState => !prevState);
    const close = () => setOpen(false);
    const open = () => setOpen(true);


    const modal = (
        <Modal
            okType={okType}
            title={title}
            open={isOpen}
            onOk={() => {
                if (onOk) onOk();
                close();
            }}
            onCancel={() => {
                if (onCancel) onCancel();
                close();
            }}
            footer={footer}
            okText={okText}
            cancelText={cancelText}
            width={width}
        >
            {children}
        </Modal>
    );

    return {modal, toggle, close, open}
}