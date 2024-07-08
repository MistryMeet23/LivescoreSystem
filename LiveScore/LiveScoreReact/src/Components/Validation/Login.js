import * as yup from "yup";

export const login = yup.object({
    email: yup.string().email().matches(/^(?!.@[^,],)/).required("Please Enter Email.."),
    password: yup.string().min(8, "Password is too short - Minimum 8 Character Required.").required("Please Enter Your Password")
})

export const findEmail = yup.object({
    email: yup.string().email().matches(/^(?!.@[^,],)/).required("Please Enter Email..")
})
export const forgetPassword = yup.object({
    password: yup.string().min(8, "Password is too short - Minimum 8 Character Required.").required("Please Enter Your Password")
})