"use client"
import {Form, Modal, theme} from "antd";
import {useState} from "react";
import {ModalProps} from "antd/es/modal/interface";

/**
 * Easier to use AntD Token Hook
 */
export const useTheme = () => {
    const {token} = theme.useToken();

    return token;
}

/**
 * Easy to use Modal Hook.
 * Can only provide static modals.
 */
export const useModal = (
    {children, initialOpen = false, onOk, onCancel, footer, okText, cancelText, title, okType, width}: {
            initialOpen?: boolean
            onOk?: () => Promise<boolean> | boolean | void
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
            onOk={async () => {
                if (onOk) {
                    const exit = onOk();
                    if (typeof exit === "boolean" && !exit) return;
                    if (exit) {
                        const close = await exit;
                        if (!close) return;
                    }
                }
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

/**
 * Easier to use AntD Form Hook
 */
export const useForm = <T, >() => {
    const [form] = Form.useForm<T>();
    return form;
}