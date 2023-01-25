import React from 'react'
import Page404 from "./views/pages/page404/Page404";
import Page500 from "./views/pages/page500/Page500";
import {Navigate} from "react-router-dom";

const AuthPage = React.lazy(() => import('./views/pages/authenticationPage/authPage'))
const Dashboard = React.lazy(() => import('./views/dashboard/Dashboard'))
const Layout = React.lazy(() => import('./layout/Layout'))
const CompanyEmployees = React.lazy(() => import('./views/employees'))
const AddCompanyEmployees = React.lazy(() => import('./views/employees/create'))
const EditCompanyEmployees = React.lazy(() => import('./views/employees/edit'))
const ForgetPassword = React.lazy(() => import('./views/forgetPassword'))
const Moving = React.lazy(() => import('./views/moving'))

const Routes = (isAuthenticated: boolean) => {

    if (window.location.href.split("/").includes("token")) {
        isAuthenticated = true
    }

    if (isAuthenticated) {
        return [
            {path: '/token/:tokenId', name: 'token', element: <AuthPage/>},
            {path: '/404', name: '404', element: <Page404/>},
            {path: '/500', name: '500', element: <Page500/>},
            {
                path: "/company/",
                element: <Layout/>,
                children: [
                    {path: 'dashboard', name: 'داشبورد', element: <Dashboard/>},
                    {path: 'changepassword', name: 'تغییر رمز عبور', element: <ForgetPassword/>},
                    {path: 'employees/list', name: 'لیست کارمندان', element: <CompanyEmployees/>},
                    {path: 'employees/edit/:id', name: 'ویرایش کارمند', element: <EditCompanyEmployees/>},
                    {path: 'employees/create', name: 'افزودن کارمند', element: <AddCompanyEmployees/>},
                    {path: 'employees/moving/:id', name: 'جا به جایی کارمند', element: <Moving/>},
                ]
            },
            {path: "*", element: <Navigate to={"/company"}/>}
        ];
    } else {
        // @ts-ignore
        window.location.href = `${AUTH_URL}`
        return []
    }
}

export default Routes
