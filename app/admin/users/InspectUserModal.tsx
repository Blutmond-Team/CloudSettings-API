import {Fragment} from 'react'
import {Dialog, Transition} from '@headlessui/react'
import {XMarkIcon} from '@heroicons/react/24/outline'
import {Option} from "@prisma/client";
import SettingsTable from "@/app/profile/SettingsTable";

type Props = {
    userName: string
    options: Option[]
    open: boolean
    setOpen: (value: boolean) => void
    revalidate: VoidFunction
}
export const InspectUserModal = ({userName, options, open, setOpen, revalidate}: Props) => {

    return (
        <Transition.Root show={open} as={Fragment}>
            <Dialog as="div" className="relative z-10" onClose={setOpen}>
                <Transition.Child
                    as={Fragment}
                    enter="ease-out duration-300"
                    enterFrom="opacity-0"
                    enterTo="opacity-100"
                    leave="ease-in duration-200"
                    leaveFrom="opacity-100"
                    leaveTo="opacity-0"
                >
                    <div className="fixed inset-0 bg-pale-500 dark:bg-pale-900 bg-opacity-75 dark:bg-opacity-50 transition-opacity"/>
                </Transition.Child>

                <div className="fixed inset-0 z-10 overflow-y-auto">
                    <div
                        className="flex min-h-full items-end justify-center p-4 text-center sm:items-center sm:p-0">
                        <Transition.Child
                            as={Fragment}
                            enter="ease-out duration-300"
                            enterFrom="opacity-0 translate-y-4 sm:translate-y-0 sm:scale-95"
                            enterTo="opacity-100 translate-y-0 sm:scale-100"
                            leave="ease-in duration-200"
                            leaveFrom="opacity-100 translate-y-0 sm:scale-100"
                            leaveTo="opacity-0 translate-y-4 sm:translate-y-0 sm:scale-95"
                        >
                            <Dialog.Panel
                                className="relative transform overflow-hidden rounded-lg bg-white dark:bg-pale-700 px-4 pb-4 pt-5 text-left shadow-xl transition-all sm:my-8 sm:p-6">
                                <div className="absolute right-0 top-0 hidden pr-4 pt-4 sm:block">
                                    <button
                                        type="button"
                                        className="rounded-md bg-white dark:bg-pale-700 text-pale-400 hover:text-pale-500 dark:hover:text-red-600 focus:outline-none transition-colors"
                                        onClick={() => setOpen(false)}
                                    >
                                        <span className="sr-only">Close</span>
                                        <XMarkIcon className="h-6 w-6" aria-hidden="true"/>
                                    </button>
                                </div>
                                <div className="sm:flex sm:items-start">
                                    <div className="mt-3 text-center sm:ml-4 sm:mt-0 sm:text-left">
                                        <Dialog.Title as="h3"
                                                      className="text-base font-semibold leading-6 text-pale-900 dark:text-white">
                                             {`Options of ${userName}`}
                                        </Dialog.Title>
                                        <div className="mt-2">
                                            <SettingsTable
                                                items={options.map(value => ({
                                                    key: value.key,
                                                    value: value.raw,
                                                }))}
                                                showLastEdited={false}
                                                revalidateFunction={revalidate}
                                            />
                                        </div>
                                    </div>
                                </div>
                            </Dialog.Panel>
                        </Transition.Child>
                    </div>
                </div>
            </Dialog>
        </Transition.Root>
    );
};