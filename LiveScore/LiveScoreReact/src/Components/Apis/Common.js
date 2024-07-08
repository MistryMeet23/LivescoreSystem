import globalRoute from "../../Redux/GlobalRoute"

export const GetMatchHistory = async () => {
    try {
        const data = await globalRoute.get(`/Matchs/GetMatchHistory`, {
            headers: {
                "Content-Type": "application/json"
            }
        })
        return data
    } catch (error) {
        return error
    }
}

export const GetTodayMatch = async () => {
    try {
        const { data } = await globalRoute.get(`/Matchs/today`, {
            headers: {
                "Content-Type": "application/json"
            }
        });
        return data
    } catch (error) {
        return error;
    }
}

export const GetRoundsByMatchId = async (id) => {
    try {
        const data = await globalRoute.get(`/Rounds/GetRoundsByMatchId/${id}`, {
            headers: {
                "Content-Type": "application/json"
            }
        })
        return data
    } catch (error) {
        return error
    }
}

export const GetScoresandRounds = async (id, rounds) => {
    try {
        const data = await globalRoute.get(`/Rounds/GetScoresandRounds/${id}/${rounds}`, {
            headers: {
                "Content-Type": "application/json"
            }
        })
        return data
    } catch (error) {
        return error
    }
}

export const GetTotal = async () => {
    try {
        const { data } = await globalRoute.get(`/Common/totalcount`, {
            headers: {
                "Content-Type": "application/json"
            }
        });
        return data
    } catch (error) {
        return error;
    }
}
export const GetCategoryViseAthlete = async () => {
    try {
        const { data } = await globalRoute.get(`/Common/categoryViseAthlete`, {
            headers: {
                "Content-Type": "application/json"
            }
        });
        return data
    } catch (error) {
        return error;
    }
}