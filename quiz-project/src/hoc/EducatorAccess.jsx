import React, {useContext} from "react";
import {Navigate, useLocation} from "react-router-dom";
import {AppContext} from "../appState/app.context.js";

export default function EducatorAccess({children}) {

    const {userData} = useContext(AppContext);
    const location = useLocation();

    if (userData && userData.role === 'Admin') {
        return (<>
            {children}
        </>)
    }

    if (!userData || userData.role !== 'Educator') {
        return <Navigate replace to="/not-authorised" state={{from: location}}/>
    }

    return (
        <>
            {children}
        </>
    )

}
