export const INITIAL_STATE = {
  displayName: "",
  error: false,
};

export const AccountUpdateReducer = (state, action) => {
  switch (action.type) {
    case "UPDATE_ACCOUNT":
      return {
        ...state,
        displayName : action.payload.displayName,
        error: false,
      };
    case "UPDATE_FAILED":
      return {
        ...state,
        error: true,
      };
    case "INPUT_CHANGE":
      return {
        ...state,
        [action.payload.name]: action.payload.value,
      };
    case "RESET":
      return INITIAL_STATE;
    default:
      return state;
  }
};
