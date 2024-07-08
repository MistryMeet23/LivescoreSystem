import axios from "axios"

import { LoginFail, LoginStart, LoginSuccess } from "../Reducer/loginReducer"

const url = "http://localhost:5032/api"

export const loginApi = (values) => async (dispatch) => {
    try {
        dispatch(LoginStart())
         console.log(values)
        const { data } = await axios.post(`${url}/Login/Login`, values, {
            headers: {
                'Content-Type': 'application/json',
            },
        })
        dispatch(LoginSuccess(data))
    } catch (error) {
        dispatch(LoginFail(error.response.data))
        // console.log(e.response.data.msg)
    }
}