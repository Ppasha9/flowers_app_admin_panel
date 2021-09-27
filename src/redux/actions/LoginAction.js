const setLogin = login => {
    return {
        type: 'SET_LOGIN',
        payload: login,
    };
}

const getLogin = () => {
    return {
        type: 'GET_LOGIN',
    };
}

const exportDefault = {
    setLogin,
    getLogin,
}

export default exportDefault;