import React from 'react'
import {CFooter} from '@coreui/react'

const AppFooter = () => {
    return (
        <CFooter>
            <div className={'mx-auto'}>
                <span className="ms-1">&copy; طراحی و توسعه در </span>
                <a href="https://sooran.co" target="_blank" rel="noopener noreferrer">
                    Sooran.co
                </a>
            </div>
        </CFooter>
    )
}

export default React.memo(AppFooter)
