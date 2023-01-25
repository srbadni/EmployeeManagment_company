import React from 'react'
import {useDispatch} from 'react-redux'
import {
    CContainer,
    CHeader,
    CHeaderBrand,
    CHeaderNav,
    CHeaderToggler,
} from '@coreui/react'
import CIcon from '@coreui/icons-react'
import {cilMenu} from '@coreui/icons'
import {AppHeaderDropdown} from './header/index'
import {toggleSidebar} from "../../store/slice/layout.slice";
import {useAppSelector} from "../../store";

const AppHeader = () => {
    const dispatch = useDispatch()
    const Name = useAppSelector(store => store.auth.name);

    return (
        <CHeader position="sticky" className="mb-4">
            <CContainer fluid>
                <CHeaderToggler
                    className="ps-1"
                    onClick={() => dispatch(toggleSidebar())}
                >
                    <CIcon icon={cilMenu} size="lg"/>
                </CHeaderToggler>
                <div className={"d-flex"}>
                    <span>شرکت {Name}</span>
                    <CHeaderBrand className="mx-auto d-md-none" to="/">
                    </CHeaderBrand>
                    <CHeaderNav className="ms-3">
                        <AppHeaderDropdown/>
                    </CHeaderNav>
                </div>
            </CContainer>
        </CHeader>
    )
}

export default AppHeader
