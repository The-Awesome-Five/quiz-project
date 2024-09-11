import {useContext} from "react";
import {Navigate, useLocation} from "react-router-dom";
import {AppContext} from "../appState/app.context.js";
import React from "react";

export default function Authenticated ({children}) {

    const { user } = useContext(AppContext);
    const location = useLocation();

    if (!user) {
        return <Navigate replace to="/signin" state={{ from: location }} />
    }

    return (
        <>
            {children}
        </>
    )

}
