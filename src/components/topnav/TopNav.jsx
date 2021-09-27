import React from 'react'
import { useDispatch } from 'react-redux'

import LoginAction from "../../redux/actions/LoginAction"
import { setAuthorized } from '../../utils/local-storage/auth'

import './topnav.css'

const Topnav = () => {
    const dispatch = useDispatch();

    const onLogout = (e) => {
        setAuthorized(false);
        dispatch(LoginAction.setLogin(false));
    }

    return (
        <div className='topnav'>
            <div className="topnav__right">
                <div className="topnav__right-item">
                    <i className="bx bx-log-out-circle bx-rotate-180" onClick={onLogout}></i>
                </div>
            </div>
        </div>
    )
}

export default Topnav
