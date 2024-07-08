import globalRoute from "./GlobalRoute";

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

export const GetProfile = async (id) => {
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

