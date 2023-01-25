import React from 'react'
import {AppSidebar, AppFooter, AppHeader} from '../components/index'
import {Outlet} from "react-router-dom";

const Layout = () => {
    return (
        <div>
            <AppSidebar/>
            <div className="wrapper d-flex flex-column min-vh-100 bg-light">
                <AppHeader/>
                <div className="body flex-grow-1 px-3">
                    <Outlet/>
                </div>
                <AppFooter/>
            </div>
        </div>
    )
}

export default Layout
