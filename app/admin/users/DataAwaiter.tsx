
type Props<T = any> = {
    data: Promise<T>
    children: ((data: T) => React.ReactNode)
}
export const DataAwaiter = async <T, >({children, data}: Props<T>) => {
    const loadedData = await data;
    return (<>{children(loadedData)}</>);
};