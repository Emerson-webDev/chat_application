export const INITIAL_STATE = {
    email : "",
    password : "",
    error: false
}

export const logInReducer = (state, action) => {
    switch(action.type){
        case "INPUT_CHANGE" :
            return {
                ...state,
                [action.payload.name] : action.payload.value
            }
        case "LOGIN_FAILED" :
            return {

            }
        
        default :
        return state
    }
}