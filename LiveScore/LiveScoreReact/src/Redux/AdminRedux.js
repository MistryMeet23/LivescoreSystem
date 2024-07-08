import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import globalRoute from "./GlobalRoute";

const initialState = {
    data: [],
    loading: false,
    error: null,
    verifyData: null,
}


export const CategoryPostApi = createAsyncThunk(
    'admin/categoryPost',
    async (values, { rejectWithValue }) => {
        try {
            const { data } = await globalRoute.post(`/Categories/PostCategory`, values, {
                headers: {
                    "Content-Type": "application/json"
                }
            })
            return data
        } catch (error) {
            return rejectWithValue(error.response.data)
        }
    }
)

export const CategoryPutApi = createAsyncThunk(
    'admin/categoryPut',
    async ({ values, id }, { rejectWithValue }) => {
        try {
            const { data } = await globalRoute.put(`/Categories/PutCategory/${id}`, values, {
                headers: {
                    "Content-Type": "application/json"
                }
            })
            return data;
        } catch (error) {
            return rejectWithValue(error.response.data);
        }
    }
);

export const TournamentPostApi = createAsyncThunk(
    'admin/tournamentPost',
    async (values, { rejectWithValue }) => {
        try {
            const { data } = await globalRoute.post(`/Tournaments/PostTournament`, values, {
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

export const TournamentPutApi = createAsyncThunk(
    'admin/tournamentPut',
    async ({ values, id }, { rejectWithValue }) => {
        try {
            const { data } = await globalRoute.put(`/Tournaments/PutTournament/${id}`, values, {
                headers: {
                    "Content-Type": "application/json"
                }
            })
            return data;
        } catch (error) {
            return rejectWithValue(error.response.data);
        }
    }
);

export const VerifyCoordinatorApi = createAsyncThunk(
    'admin/coordinatorVerify',
    async (id, { rejectWithValue }) => {
        try {
            const { data } = await globalRoute.post(`/ACR/VerifyCoordinator/${id}`, null, {
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



const AdminSlice = createSlice({
    name: "admin",
    initialState,
    reducers: {
        clearMessageAdmin: (state) => {
            state.data = null;
            state.error = null;
            state.verifyData = null;
        },
    },
    extraReducers: (builder) => {
        builder
            .addCase(CategoryPostApi.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(CategoryPostApi.fulfilled, (state, action) => {
                state.loading = false;
                state.data = action.payload;
            })
            .addCase(CategoryPostApi.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload;
            })
            .addCase(CategoryPutApi.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(CategoryPutApi.fulfilled, (state, action) => {
                state.loading = false;
                state.data = action.payload;
            })
            .addCase(CategoryPutApi.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload;
            })
            .addCase(TournamentPostApi.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(TournamentPostApi.fulfilled, (state, action) => {
                state.loading = false;
                state.data = action.payload;
            })
            .addCase(TournamentPostApi.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload;
            }).addCase(TournamentPutApi.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(TournamentPutApi.fulfilled, (state, action) => {
                state.loading = false;
                state.data = action.payload;
            })
            .addCase(TournamentPutApi.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload;
            })
            .addCase(VerifyCoordinatorApi.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(VerifyCoordinatorApi.fulfilled, (state, action) => {
                state.loading = false;
                state.verifyData = action.payload;
            })
            .addCase(VerifyCoordinatorApi.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload;
            })


    },
})

export const { clearMessageAdmin } = AdminSlice.actions;
export default AdminSlice.reducer;