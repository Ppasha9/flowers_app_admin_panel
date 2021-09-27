import { combineReducers } from "redux"

import ThemeReducer from "./ThemeReducer"
import LoginReducer from "./LoginReducer"

const rootReducer = combineReducers({ ThemeReducer, LoginReducer })

export default rootReducer