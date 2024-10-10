import { Button, Input, makeStyles } from "@fluentui/react-components";
import { useState } from "react";
import {electron_store} from '../store'

const useStyles = makeStyles({
    root: {
        width: "100%",
        display: "flex",
        flexDirection: "row",
        justifyContent: "space-between",
        alignItems: "center",
        gap: "20px",
    },
    input: {
        flex: 1
    }
});

export const Header = () => {
    const styles = useStyles();
    const [path, setPath] = useState(() => electron_store)

    function selectPathFolder() {
        window.ContextBridge.onSelectPathFolder().then(setPath)
    }

    return (
        <div className={styles.root}>
            <Input
                className={styles.input}
                placeholder="Path folder"
                appearance="filled-darker"
                value={path}
            />
            <Button onClick={selectPathFolder}>
                Choose path folder
            </Button>
        </div>
    );
};
