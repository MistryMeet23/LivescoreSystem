import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import globalRoute from "./GlobalRoute";


export const AthletePostApi = createAsyncThunk(
    'coordinator/athletePost',
    async (values, { rejectWithValue }) => {
        try {
            const { data } = await globalRoute.post(`/Athletes/PostAthlete`, values, {
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

export const AthletePutApi = createAsyncThunk(
    'coordinator/athletePut',
    async ({ values, id }, { rejectWithValue }) => {
        try {
            const response = await globalRoute.put(`/Athletes/UpdateAthlete/${id}`, values, {
                headers: {
                    "Content-Type": "application/json",
                },
            });
            return response.data;
        } catch (error) {
            return rejectWithValue(error.response?.data || error.message);
        }
    }
);

export const AthletePutPicApi = createAsyncThunk(
    'coordinator/athletePutPic',
    async ({ values, id }, { rejectWithValue }) => {
        try {
            console.log(id)
            const { data } = await globalRoute.put(`/Athletes/UpdateAthleteImage/${id}`, values, {
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

export const BlockAthleteApi = createAsyncThunk(
    'coordinator/athleteBlock',
    async (id, { rejectWithValue }) => {
        try {
            const { data } = await globalRoute.post(`/Athletes/BlockAthlete/${id}`, {}, {
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

export const CoordinatorPostApi = createAsyncThunk(
    'coordinator/coordinatorPost',
    async (values, { rejectWithValue }) => {
        try {
            const { data } = await globalRoute.post(`/ACR/AddCoordinator`, values, {
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


export const CoordinatorUpdateProfileApi = createAsyncThunk(
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

export const CoordinatorUpdateProfilePicApi = createAsyncThunk(
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

export const RefereePostApi = createAsyncThunk(
    'coordinator/refereePost',
    async (values, { rejectWithValue }) => {
        try {
            const { data } = await globalRoute.post(`/ACR/AddReferee`, values, {
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


export const BlockRefereeApi = createAsyncThunk(
    'coordinator/refereeBlock',
    async (id, { rejectWithValue }) => {
        try {
            const { data } = await globalRoute.post(`/ACR/BlockReferee/${id}`, {}, {
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


export const CoachPostApi = createAsyncThunk(
    'coordinator/coachPost',
    async (values, { rejectWithValue }) => {
        try {
            const { data } = await globalRoute.post(`/Coaches/PostCoach`, values, {
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

export const CoachPutApi = createAsyncThunk(
    'coordinator/coachPut',
    async ({ values, id }, { rejectWithValue }) => {
        try {
            const { data } = await globalRoute.put(`/Coaches/UpdateCoach/${id}`, values, {
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

export const BlockCoachApi = createAsyncThunk(
    'coordinator/coachBlock',
    async (id, { rejectWithValue }) => {
        try {
            const { data } = await globalRoute.post(`/Coaches/BlockCoach/${id}`, {}, {
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

export const CoachPutPicApi = createAsyncThunk(
    'coordinator/coachPutPic',
    async ({ id, values }, { rejectWithValue }) => {
        try {
            const { data } = await globalRoute.put(`/Coaches/UpdateCoachImage/${id}`, values, {
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

export const AddMatchApi = createAsyncThunk(
    'coordinator/matchPost',
    async (values, { rejectWithValue }) => {
        try {
            const { data } = await globalRoute.post(`/Matchs/PostMatch`, values, {
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

export const AssignMatchApi = createAsyncThunk(
    'coordinator/assignMatch',
    async ({ values, id }, { rejectWithValue }) => {
        try {
            const { data } = await globalRoute.put(`/Matchs/AssignMatch/${id}`, values, {
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

export const RoundPostApi = createAsyncThunk(
    'coordinator/roundPost',
    async ({ values, mid }, { rejectWithValue }) => {
        try {
            const { data } = await globalRoute.post(`/Rounds/insertRound/${mid}`, values, {
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

export const MatchPutApi = createAsyncThunk(
    'coordinator/matchPut',
    async ({ values, mid }, { rejectWithValue }) => {
        try {
            const { data } = await globalRoute.put(`/Matchs/UpdateMatch/${mid}`, values, {
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
export const updateRound = createAsyncThunk(
    'coordinator/updateRound',
    async ({ values, mid, rounds }, { rejectWithValue }) => {
        try {
            const { data } = await globalRoute.post(`/Rounds/updateRound/${mid}/${rounds}`, values, {
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

export const updateNextMatchIdApi = createAsyncThunk(
    'coordinator/updateNextMatchId',
    async ({ mid, values }, { rejectWithValue }) => {
        try {
            const { data } = await globalRoute.put(`/Matchs/UpdateNextMatchId/${mid}`, values, {
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
export const ScorePutApi = createAsyncThunk(
    'coordinator/editScore',
    async ({ id, values ,mid }, { rejectWithValue }) => {
        try {
            const { data } = await globalRoute.put(`/Scores/EditTemporaryScore/${id}/${mid}`, values, {
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
export const ReviewMatchApi = createAsyncThunk(
    'coordinator/reviewMatch', // action type prefix
    async (_, { rejectWithValue }) => { // destructure correctly
        try {
            const { data } = await globalRoute.get(`/Scores/GetTemporaryScores`, {
                headers: {
                    "Content-Type": "application/json"
                }
            });
            return data;
        } catch (error) {
            // Use rejectWithValue to provide additional information on failure
            return rejectWithValue(error.response.data);
        }
    }
);

const initialState = {
    data: [],
    loading: false,
    error: null,
    blockData: null,
    verifyData: null,
    reviewMatch: []
}

const CoordinatorSlice = createSlice({
    name: "coordinator",
    initialState,
    reducers: {
        // for Clear All Message
        clearMessage: (state) => {
            state.error = null,
                state.data = null
        },
    },
    extraReducers: (builder) => {
        builder
            .addCase(AthletePostApi.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(AthletePostApi.fulfilled, (state, action) => {
                state.data = action.payload;
                state.loading = false;
            })
            .addCase(AthletePostApi.rejected, (state, action) => {
                state.error = action.payload;
                state.loading = false;
            })
            .addCase(AthletePutApi.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(AthletePutApi.fulfilled, (state, action) => {
                state.data = action.payload;
                state.loading = false;
            })
            .addCase(AthletePutApi.rejected, (state, action) => {
                state.error = action.payload;
                state.loading = false;
            })
            .addCase(AthletePutPicApi.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(AthletePutPicApi.fulfilled, (state, action) => {
                state.data = action.payload;
                state.loading = false;
            })
            .addCase(AthletePutPicApi.rejected, (state, action) => {
                state.error = action.payload;
                state.loading = false;
            })
            .addCase(BlockAthleteApi.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(BlockAthleteApi.fulfilled, (state, action) => {
                state.data = action.payload;
                state.loading = false;
            })
            .addCase(BlockAthleteApi.rejected, (state, action) => {
                state.error = action.payload;
                state.loading = false;
            })
            .addCase(CoordinatorPostApi.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(CoordinatorPostApi.fulfilled, (state, action) => {
                state.data = action.payload;
                state.loading = false;
            })
            .addCase(CoordinatorPostApi.rejected, (state, action) => {
                state.error = action.payload;
                state.loading = false;
            })
            .addCase(CoordinatorUpdateProfileApi.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(CoordinatorUpdateProfileApi.fulfilled, (state, action) => {
                state.data = action.payload;
                state.loading = false;
            })
            .addCase(CoordinatorUpdateProfileApi.rejected, (state, action) => {
                state.error = action.payload;
                state.loading = false;
            })
            .addCase(CoordinatorUpdateProfilePicApi.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(CoordinatorUpdateProfilePicApi.fulfilled, (state, action) => {
                state.data = action.payload;
                state.loading = false;
            })
            .addCase(CoordinatorUpdateProfilePicApi.rejected, (state, action) => {
                state.error = action.payload;
                state.loading = false;
            })
            .addCase(RefereePostApi.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(RefereePostApi.fulfilled, (state, action) => {
                state.data = action.payload;
                state.loading = false;
            })
            .addCase(RefereePostApi.rejected, (state, action) => {
                state.error = action.payload;
                state.loading = false;
            })
            .addCase(BlockRefereeApi.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(BlockRefereeApi.fulfilled, (state, action) => {
                state.data = action.payload;
                state.loading = false;
            })
            .addCase(BlockRefereeApi.rejected, (state, action) => {
                state.error = action.payload;
                state.loading = false;
            })
            .addCase(CoachPostApi.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(CoachPostApi.fulfilled, (state, action) => {
                state.data = action.payload;
                state.loading = false;
            })
            .addCase(CoachPostApi.rejected, (state, action) => {
                state.error = action.payload;
                state.loading = false;
            })
            .addCase(CoachPutApi.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(CoachPutApi.fulfilled, (state, action) => {
                state.data = action.payload;
                state.loading = false;
            })
            .addCase(CoachPutApi.rejected, (state, action) => {
                state.error = action.payload;
                state.loading = false;
            })
            .addCase(BlockCoachApi.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(BlockCoachApi.fulfilled, (state, action) => {
                state.data = action.payload;
                state.loading = false;
            })
            .addCase(BlockCoachApi.rejected, (state, action) => {
                state.error = action.payload;
                state.loading = false;
            })
            .addCase(CoachPutPicApi.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(CoachPutPicApi.fulfilled, (state, action) => {
                state.data = action.payload;
                state.loading = false;
            })
            .addCase(CoachPutPicApi.rejected, (state, action) => {
                state.error = action.payload;
                state.loading = false;
            })
            .addCase(AddMatchApi.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(AddMatchApi.fulfilled, (state, action) => {
                state.data = action.payload;
                state.loading = false;
            })
            .addCase(AddMatchApi.rejected, (state, action) => {
                state.error = action.payload;
                state.loading = false;
            })
            .addCase(AssignMatchApi.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(AssignMatchApi.fulfilled, (state, action) => {
                state.data = action.payload;
                state.loading = false;
            })
            .addCase(AssignMatchApi.rejected, (state, action) => {
                state.error = action.payload;
                state.loading = false;
            })
            .addCase(RoundPostApi.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(RoundPostApi.fulfilled, (state, action) => {
                state.data = action.payload;
                state.loading = false;
            })
            .addCase(RoundPostApi.rejected, (state, action) => {
                state.error = action.payload;
                state.loading = false;
            }).addCase(MatchPutApi.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(MatchPutApi.fulfilled, (state, action) => {
                state.data = action.payload;
                state.loading = false;
            })
            .addCase(MatchPutApi.rejected, (state, action) => {
                state.error = action.payload;
                state.loading = false;
            }).addCase(updateRound.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(updateRound.fulfilled, (state, action) => {
                state.data = action.payload;
                state.loading = false;
            })
            .addCase(updateRound.rejected, (state, action) => {
                state.error = action.payload;
                state.loading = false;
            }).addCase(updateNextMatchIdApi.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(updateNextMatchIdApi.fulfilled, (state, action) => {
                state.data = action.payload;
                state.loading = false;
            })
            .addCase(updateNextMatchIdApi.rejected, (state, action) => {
                state.error = action.payload;
                state.loading = false;
            }).addCase(ScorePutApi.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(ScorePutApi.fulfilled, (state, action) => {
                state.data = action.payload;
                state.loading = false;
            })
            .addCase(ScorePutApi.rejected, (state, action) => {
                state.error = action.payload;
                state.loading = false;
            }).addCase(ReviewMatchApi.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(ReviewMatchApi.fulfilled, (state, action) => {
                state.reviewMatch = action.payload;
                state.loading = false;
            })
            .addCase(ReviewMatchApi.rejected, (state, action) => {
                state.error = action.payload;
                state.loading = false;
            })
    }

})


export const { clearMessage } = CoordinatorSlice.actions;
export default CoordinatorSlice.reducer; 