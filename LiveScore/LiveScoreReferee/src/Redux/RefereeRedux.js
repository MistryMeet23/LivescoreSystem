import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import globalRoute from "../Components/GlobalRoute";

const initialState = {
    data: [],
    loading: false,
    error: null,
}


export const validateOtpApi = createAsyncThunk('referee/validateOtp',
    async (values, { rejectWithValue }) => {
        try {
            console.log("from api")
            const { data } = await globalRoute.post(`/Matchs/ValidateOtp`, values, {
                headers: {
                    "Content-Type": "application/json"
                }
            })
            console.log("from after api")
            return data
        } catch (error) {
            return rejectWithValue(error.response.data)
        }
    })

export const UpdateProfileApi = createAsyncThunk(
    'coordinator/updateProfile',
    async ({ id, values }, { rejectWithValue }) => {
        try {
            const { data } = await globalRoute.put(`/ACR/updateCoordinator/${id}`, values, {
                headers: {
                    "Content-Type": "application/json"
                }
            });
            return data;
        } catch (error) {
            return rejectWithValue(error.response.data);
        }
    }
);

export const UpdateProfilePicApi = createAsyncThunk(
    'coordinator/updateProfilePic',
    async ({ values, id }, { rejectWithValue }) => {
        try {
            const { data } = await globalRoute.put(`/ACR/UpdateCoordinatorImage/${id}`, values, {
                headers: {
                    "Content-Type": "multipart/form-data"
                }
            });
            return data;
        } catch (error) {
            return rejectWithValue(error.response.data);
        }
    }
);

const RefereeSlice = createSlice({
    name: "referee",
    initialState,
    reducers: {
        clearMessage: (state) => {
            state.error = null;
            state.data = null

        },
    },
    extraReducers: (builder) => {
        builder
            .addCase(validateOtpApi.pending, (state) => {
                state.loading = false;
                state.error = null;
            })
            .addCase(validateOtpApi.fulfilled, (state, action) => {
                state.data = action.payload;
                state.loading = false;
            })
            .addCase(validateOtpApi.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload;
            })
    }
})

export const { clearMessage } = RefereeSlice.actions;
export default RefereeSlice.reducer;