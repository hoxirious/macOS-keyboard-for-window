import { ReactNode, useEffect, useState } from "react";
import reactLogo from "./assets/react.svg";
import { invoke } from "@tauri-apps/api/tauri";
import "./App.css";
import { ButtonShortcut } from "./ButtonShortcut";
import { MapperShortcut } from "./MapperShortcut";
import { useStoreActions, useStoreState } from "./store/hook.store";
import db from "../src-tauri/maplist.json"

export type DbInstanceType = {
    key: string[];
    value: ({ KeyPress: string; KeyRelease?: undefined; }
        | { KeyRelease: string; KeyPress?: undefined; })[];
}[]

function App() {
    const [keyBindHolder, setKeyBindHolder] = useState<ReactNode>()

    const { dbInstance, dbCopyInstance, dbHasChange, dbIsValid } = useStoreState((store) => {
        return store.dbModel;
    });
    const { loadDbInstance } = useStoreActions((actions) => actions.dbModel)

    useEffect(() => {
        const dbInstance: DbInstanceType = db;
        loadDbInstance(dbInstance);
    }, [db])

    const parseMapFrom = (key: string[]) => {
        return key.join(" + ");
    }

    const parseMapTo = (value: ({ KeyPress: string; KeyRelease?: undefined; } | { KeyRelease: string; KeyPress?: undefined; })[]) => {
        let rt = value.map((item) => {
            if (item.KeyPress) {
                return item.KeyPress;
            }
        })
        return rt.join(" + ").slice(0, -6);
    }

    function addNewHolder() {
        setKeyBindHolder(
            <MapperShortcut mapfrom="" mapto="" />
        )
    }

    function saveChanges(): void {
        if (dbIsValid) {
            setKeyBindHolder(null);
        } else {
            alert("Invalid database!");
        }
    }

    return (
        <div className="container">

            <h1 className="text-3xl font-bold underline text-black">
                Keyboard Mapper
            </h1>
            {
                dbInstance.map((item) => {
                    return (
                        <div className="row">
                            <MapperShortcut mapfrom={parseMapFrom(item.key)} mapto={parseMapTo(item.value)} />
                        </div>
                    )
                })}
            <div className="row">
                {keyBindHolder}
            </div>
            {!keyBindHolder && (
                <div className="row">
                    <button onClick={() => addNewHolder()}>New Keybind</button>
                </div>
            )}
            {keyBindHolder && (
                <div className="row">
                    <button id="save-button" onClick={() => saveChanges()}>Save Changes</button>
                </div>
            )}
        </div>
    );
}

export default App;
