import globalRoute from "../../Redux/GlobalRoute"


export const GetCategory = async () => {
  try {
    const data = await globalRoute.get(`/Categories/GetCategories`, {
      headers: {
        "Content-Type": "application/json"
      }
    })
    return data
  } catch (error) {
    return error
  }
}
export const GetCategoryById = async (id) => {
  try {
    const data = await globalRoute.get(`/Categories/GetCategoriesById/${id}`, {
      headers: {
        "Content-Type": "application/json"
      }
    })
    return data
  } catch (error) {
    return error
  }
}
export const GetTournament = async () => {
  try {
    const data = await globalRoute.get(`/Tournaments/GetTournaments`)
    return data
  } catch (error) {
    return error
  }
}

export const GetTournamentById = async (id) => {
  try {
    const data = await globalRoute.get(`/Tournaments/GetTournamentById/${id}`, {
      headers: {
        "Content-Type": "application/json"
      }
    })
    return data
  } catch (error) {
    return error
  }
}
export const GetCoordinator = async () => {
  try {
    const data = await globalRoute.get(`/ACR/Coordinator`, {
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
