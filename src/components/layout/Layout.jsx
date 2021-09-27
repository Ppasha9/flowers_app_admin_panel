import React from 'react'
import { BrowserRouter, Route } from 'react-router-dom'
import { useSelector } from 'react-redux'

import LoginPage from '../../pages/LoginPage/LoginPage'
import Sidebar from '../sidebar/Sidebar'
import TopNav from '../topnav/TopNav'
import Routes from '../Routes'

import './layout.css'

const Layout = () => {
    const isLogin = useSelector((state) => state.LoginReducer.login);

    return (
        <BrowserRouter>
            <Route render={(props) => (
                <div className="layout">
                    {!isLogin && <LoginPage />}

                    {isLogin &&
                        <>
                            <Sidebar {...props} />
                            <div className="layout__content">
                                <TopNav />
                                <div className="layout__content-main">
                                    <Routes />
                                </div>
                            </div>
                        </>
                    }
                </div>
            )} />
        </BrowserRouter>
    )
}

export default Layout
