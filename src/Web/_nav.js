import React from 'react'
import CIcon from '@coreui/icons-react'
import {cilSpeedometer} from '@coreui/icons'
import {CNavGroup, CNavItem, CNavTitle} from '@coreui/react'
import {cilUser} from "@coreui/icons/js/free";

const _nav = [
    {
        component: CNavItem,
        name: 'داشبورد',
        to: '/company/dashboard',
        icon: <CIcon icon={cilSpeedometer} customClassName="nav-icon"/>
    },
    {
        component: CNavTitle,
        name: 'ساختار پروژه',
    },
    {
        component: CNavGroup,
        name: 'مدیریت اعضای سازمان',
        to: '/company/employees/list',
        icon: <CIcon icon={cilUser} customClassName="nav-icon"/>,
        items: [
            {
                component: CNavItem,
                name: 'لیست کارمندان',
                to: '/company/employees/list',
            },
            {
                component: CNavItem,
                name: 'افزودن عضو',
                to: '/company/employees/create',
            }
        ],
    }
]

export default _nav
