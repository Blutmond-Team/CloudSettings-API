type Props = {
    enabled: boolean
} & React.PropsWithChildren
export const ConditionalElement = ({enabled, children}: Props) => {
    if (enabled) {
        return children;
    }

    return (
        <></>
    );
};