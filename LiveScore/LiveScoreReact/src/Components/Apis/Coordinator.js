import globalRoute from "../../Redux/GlobalRoute"


export const GetAthleteByCategoryAndGender = async (id, gender) => {
  try {
    const data = await globalRoute.get(`/Athletes/GetAthleteByCatAndGen/${id}/${gender}`, {
      headers: {
        "Content-Type": "application/json"
      }
    })
    return data
  } catch (error) {
    return error
  }
}

export const GetAthlete = async () => {
  try {
    const data = await globalRoute.get(`/Athletes/getAthelete`, {
      headers: {
        "Content-Type": "application/json"
      }
    })
    return data
  } catch (error) {
    return error
  }
}
export const GetAthleteById = async (id) => {
  try {
    const data = await globalRoute.get(`/Athletes/GetAthelete/${id}`, {
      headers: {
        "Content-Type": "application/json"
      }
    })
    return data
  } catch (error) {
    return error
  }
}

export const GetReferee = async () => {
  try {
    const data = await globalRoute.get(`/ACR/Referee`, {
      headers: {
        "Content-Type": "application/json"
      }
    })
    return data
  } catch (error) {
    return error
  }
}

export const GetCoach = async () => {
  try {
    const data = await globalRoute.get(`/Coaches/GetCoaches`, {
      headers: {
        "Content-Type": "application/json"
      }
    })
    return data
  } catch (error) {
    return error
  }

}
export const GetCoachById = async (id) => {
  try {
    const data = await globalRoute.get(`/Coaches/GetCoachesById/${id}`, {
      headers: {
        "Content-Type": "application/json"
      }
    })
    return data
  } catch (error) {
    return error
  }
}

export const GetMatch = async () => {
  try {
    const data = await globalRoute.get(`/Matchs/GetMatchs`, {
      headers: {
        "Content-Type": "application/json"
      }
    })
    return data
  } catch (error) {
    return error
  }
}


export const GetMatchById = async (id) => {
  try {
    const data = await globalRoute.get(`/Matchs/GetMatchById/${id}`, {
      headers: {
        "Content-Type": "application/json"
      }
    })
    return data;
  } catch (error) {
    return error
  }
}
export const GetMatchByMatchGroup = async (matchGroup) => {
  try {
    const data = await globalRoute.get(`/Matchs/GetMatchByMatchGroup/${matchGroup}`, {
      headers: {
        "Content-Type": "application/json"
      }
    })
    return data;
  } catch (error) {
    return error
  }
}


export const GetCoordinatorProfile = async (id) => {
  try {
    const data = await globalRoute.get(`/ACR/${id}`, {
      headers: {
        "Content-Type": "application/json"
      }
    })
    return data
  } catch (error) {
    return error
  }

}

export const OtpGenerateApi = async ({ matchGroup }) => {
  try {
    const { data } = await globalRoute.get(`/Matchs/GenerateOtp/${matchGroup}`, {
      headers: {
        "Content-Type": "application/json"
      }
    })
    return data
  } catch (error) {
    return error
  }
}

export const StoreOtpApi = async () => {
  try {
    const data = await globalRoute.get(`/Matchs/GetStoredOtps`, {
      headers: {
        "Content-Type": "application/json"
      }
    })
    return data
  } catch (error) {
    return error
  }
}


// this api is used to get match if coordinator and referee are assigned in match
export const GetAssignMatch = async (id) => {
  try {
    const { data } = await globalRoute.get(`/Matchs/GetAssignMatch/${id}`, {
      headers: {
        "Content-Type": "application/json"
      }
    })
    return data
  } catch (error) {
    return error
  }

}

export const GetTotalScore = async () => {
  try {
    const { data } = await globalRoute.get(`/Scores/getTotalScore`, {
      headers: {
        "Content-Type": "application/json"
      }
    })
    return data
  } catch (error) {
    return error
  }
}
export const ScoreTransfer = async (mid) => {
  try {
    const { data } = await globalRoute.post(`/Scores/transfer/${mid}`, {
      headers: {
        "Content-Type": "application/json"
      }
    })
    return data
  } catch (error) {
    return error
  }
}

export const GetTemporaryScores = async () => {
  try {
    const data = await globalRoute.get(`/Scores/GetTemporaryScores`, {
      headers: {
        "Content-Type": "application/json"
      }
    })
    return data
  } catch (error) {
    return error
  }
}


export const GetTemporaryScoreById = async (id) => {
  try {
    const data = await globalRoute.get(`/Scores/getTemporaryScoreById/${id}`, {
      headers: {
        "Content-Type": "application/json"
      }
    })
    return data;
  } catch (error) {
    return error
  }
}
