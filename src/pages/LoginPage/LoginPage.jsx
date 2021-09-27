import React, { useState } from "react"
import { useDispatch } from 'react-redux'

import LoginPageRequestsHandler from "./LoginPageRequestsHandler"

import LoginAction from "../../redux/actions/LoginAction"
import { setAuthorized, setAuthToken } from "../../utils/local-storage/auth"

import './loginPage.css'

const LoginPage = () => {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");

    const dispatch = useDispatch();

    const onEmailChange = (e) => {
        setEmail(e.target.value);
    }

    const onPasswordChange = (e) => {
        setPassword(e.target.value);
    }

    const onSubmit = (e) => {
        e.preventDefault();

        if (email === "") {
            alert("Пожалуйста, введите почту");
            return;
        }
        if (password === "") {
            alert("Пожалуйста, введите пароль");
            return;
        }

        try {
            LoginPageRequestsHandler.login(email, password).then((res) => {
                setAuthorized(true);
                setAuthToken(res.token);
                dispatch(LoginAction.setLogin(true));
            });
        } catch (e) {
            alert(`${e}`);
            return;
        }
    }

    return (
        <div className="auth-wrapper">
            <div className="auth-inner">
                <form>
                    <h3>Войти</h3>

                    <div className="form-group">
                        <label>Почта</label>
                        <input type="email" className="form-control" placeholder="Введите почту" onChange={onEmailChange} />
                    </div>

                    <div className="form-group">
                        <label>Пароль</label>
                        <input type="password" className="form-control" placeholder="Введите пароль" onChange={onPasswordChange} />
                    </div>

                    <button type="submit" className="btn btn-primary btn-block" style={{ marginTop: '10px' }} onClick={onSubmit}>Войти</button>
                </form>
            </div>
        </div>
    );
}

export default LoginPage;