import {
    FluentProvider,
    webDarkTheme,
    webLightTheme,
    type Theme,
} from "@fluentui/react-components";
import { useEffect, useState } from "react";
import { Header } from "./Header";
import { Sidebar } from "./Sidebar";

const shouldUseDarkColors = (): boolean =>
    window.matchMedia && window.matchMedia("(prefers-color-scheme: dark)").matches;

const getTheme = () => (shouldUseDarkColors() ? webDarkTheme : webLightTheme);

export const App = () => {
    const [theme, setTheme] = useState<Theme>(getTheme());
    const [isLoading, setIsLoading] = useState<boolean>(true);

    useEffect(() => {
        setTimeout(() => {
            setIsLoading(false);
        }, 2500);

        window.ContextBridge.onNativeThemeChanged(() => setTheme(getTheme()));
    }, []);

    return (
        <FluentProvider theme={theme} style={{ height: "100vh", background: "transparent" }}>
            <div
                style={{
                    height: "100%",
                    display: "flex",
                    flexDirection: "row",
                    boxSizing: "border-box",
                }}
            >
                <Sidebar theme={theme} />
                <div
                    style={{
                        display: "flex",
                        flexDirection: "column",
                        width: "100%",
                        gap: 20,
                        padding: 20,
                        boxSizing: "border-box",
                    }}
                >
                    <Header />
                </div>
            </div>
        </FluentProvider>
    );
};
