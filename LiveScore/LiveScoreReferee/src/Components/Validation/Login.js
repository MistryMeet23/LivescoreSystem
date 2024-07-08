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

export const UpdateProfile = yup.object({
    name: yup.string().required('Name is required'),
    contact: yup.string().required('Phone number is required').matches(/^[0-9]{10}$/, 'Phone number must be exactly 10 digits'),
    dateOfBirth: yup.date().required('Date of Birth is required').max(new Date(), 'Date of birth cannot be in the future')
        .min(new Date('1900-01-01'), 'Date of birth must be after 1900-01-01'),
    gender: yup.string().required('Gender is required'),
    state: yup.string().required('State is required'),
    city: yup.string().required('City is required'),
});