const initialState = {
    login: false
}

const LoginReducer = (state = initialState, action) => {
    switch (action.type) {
        case 'SET_LOGIN':
            return {
                ...state,
                login: action.payload,
            };
        default:
            return state;
    }
}

export default LoginReducer;