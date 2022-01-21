import React from 'react'
import { BrowserRouter, Route } from 'react-router-dom'
import { useSelector } from 'react-redux'

import LoginPage from '../../pages/LoginPage/LoginPage'
import Sidebar from '../sidebar/Sidebar'
import TopNav from '../topnav/TopNav'
import Routes from '../Routes'

import './layout.css'

import {isAuthorized} from "../../utils/local-storage/auth";

const Layout = () => {
    const isLogin = isAuthorized()

    console.log("Is logged", isLogin);

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
