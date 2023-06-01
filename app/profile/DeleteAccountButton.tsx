"use client"
import {toast} from "react-toastify";
import {signOut} from "next-auth/react";

type Props = {
    userId: string
}
export const DeleteAccountButton = ({userId}: Props) => {
    return (
        <button
            type="button"
            className="relative inline-flex items-center rounded-md bg-red-700 px-3 py-2 text-sm font-semibold text-pale-900 dark:text-white ring-1 ring-inset ring-red-300 dark:ring-red-700 hover:bg-red-600 focus:z-10 transition-colors"
            onClick={() => {
                toast(<div>
                    <p className={"pb-4"}>Are you sure you want to delete your account?</p>
                    <p className={"pb-4"}>This can not be undone. You can only create a new Account.</p>
                    <button
                        type="button"
                        className="relative inline-flex items-center rounded-md bg-red-700 px-3 py-2 text-sm font-semibold text-pale-900 dark:text-white ring-1 ring-inset ring-red-300 dark:ring-red-700 hover:bg-red-600 focus:z-10 transition-colors"
                        onClick={() => {
                            fetch(`/api/user/${userId}`, {
                                method: "DELETE",
                                headers: {
                                    "Content-Type": "application/json",
                                    "Accept": "application/json"
                                }
                            }).then(value => {
                                if (value.ok) {
                                    signOut().then(() => toast(`Your Account was successfully deleted.`, {
                                        position: "bottom-right",
                                        autoClose: 5000,
                                        hideProgressBar: false,
                                        theme: window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light',
                                        type: "success"
                                    }))
                                }
                            })
                        }}
                    >
                        Yes, delete my account
                    </button>
                </div>, {
                    position: "bottom-right",
                    autoClose: 15000,
                    hideProgressBar: false,
                    theme: window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light',
                    type: "error"
                })
            }}
        >Delete Account</button>
    );
};