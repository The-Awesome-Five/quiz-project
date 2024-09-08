
import {useContext} from "react";
import {Navigate, useLocation} from "react-router-dom";
import {AppContext} from "../appState/app.context.js";

export default function AdminAccess ({children}) {

    const { userData } = useContext(AppContext);
    const location = useLocation();

    if (!userData || userData.role !== 'Admin') {
        return <Navigate replace to="/not-authorised" state={{ from: location }} />
    }

    return (
        <>
            {children}
        </>
    )

}
