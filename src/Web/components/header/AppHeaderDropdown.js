import React from 'react'
import {
    CAvatar,
    CBadge,
    CDropdown,
    CDropdownDivider,
    CDropdownHeader,
    CDropdownItem,
    CDropdownMenu,
    CDropdownToggle,
} from '@coreui/react'
import {
    cilBell,
    cilCreditCard,
    cilCommentSquare,
    cilEnvelopeOpen,
    cilFile,
    cilLockLocked,
    cilSettings,
    cilTask,
    cilUser,
} from '@coreui/icons'
import CIcon from '@coreui/icons-react'

import avatar8 from './../../assets/images/avatars/8.svg'
import {cilBarcode, cilCode, cilExitToApp, cilKeyboard} from "@coreui/icons/js/free";
import {useDispatch} from "react-redux";
import {logout} from "../../../store/slice/auth.slice";
import {Link} from "react-router-dom";

const AppHeaderDropdown = () => {
    const dispatch = useDispatch()

    function handleLogout() {
        dispatch(logout())
    }

    return (
        <CDropdown variant="nav-item">
            <CDropdownToggle placement="bottom-end" className="py-0" caret={false}>
                <CAvatar src={avatar8} size="sm"/>
            </CDropdownToggle>
            <CDropdownMenu className="pt-0" placement="bottom-end">
                <CDropdownHeader className="bg-light fw-semibold py-2">پروفایل سازمان</CDropdownHeader>
                <Link className="dropdown-item" to="/company/changepassword">
                    <CIcon icon={cilBarcode} className="me-2"/>
                    تغییر رمز عبور
                </Link>
                <CDropdownItem onClick={handleLogout}>
                    <CIcon icon={cilExitToApp} className="text-danger me-2"/>
                    خروج
                </CDropdownItem>
            </CDropdownMenu>
        </CDropdown>
    )
}

export default AppHeaderDropdown
