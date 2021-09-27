export const setAuthorized = (flag) => {
    localStorage.setItem('isAuthorized', flag === true ? 'true' : 'false');
}

export const isAuthorized = () => {
    let item = localStorage.getItem('isAuthorized');
    if (!item) {
        return false;
    }
    return item === 'true';
}

export const setAuthToken = (token) => {
    localStorage.setItem('authToken', token);
}

export const getAuthToken = () => {
    return localStorage.getItem('authToken');
}