import React, {Fragment, Suspense, useState} from 'react'
import {useRoutes} from 'react-router-dom'
import Routes from "./Routes";
import '@progress/kendo-theme-default/dist/all.css';
import 'react-toastify/dist/ReactToastify.css';
import "./scss/style.scss"
import {useAppSelector} from "../store";
import {ToastContainer} from "react-toastify";
import {CSpinner} from "@coreui/react";

const LoadingOverlay = (
    <div className="pt-3 min-vh-100 d-flex flex-column justify-content-center align-items-center text-center">
        <div><CSpinner color="danger"/></div>
    </div>
)

const App = () => {
    const token = useAppSelector(store => store.auth.token);
    const RoutesRendered = useRoutes(Routes(!!token))
    const [loading] = useState<boolean>(false);

    if (loading)
        return LoadingOverlay
    return (
        <Fragment>
            <ToastContainer/>
            <Suspense fallback={LoadingOverlay}>
                {RoutesRendered}
            </Suspense>
        </Fragment>
    )
}

export default App
