export const PASSWORD_INITIAL_STATE = {
  email: "",
  current_password: "",
  new_password: "",
  confirm_password: "",
  error: false,
};

export const AccountPasswordReducer = (state, action) => {
  switch (action.type) {
    case "UPDATE_PASSWORD":
      return {
        ...state,
        new_password: action.payload,
        error: action.payload,
      };
    case "UPDATE_FAILED":
      return {
        ...state,
        error: action.payload,
      };
    case "UPDATE_RETRY":
      return {
        ...state,
        error: false,
      };
    case "INPUT_CHANGE":
      return {
        ...state,
        [action.payload.name]: action.payload.value,
      };
    case "RESET":
      return PASSWORD_INITIAL_STATE;

    default:
      return state;
  }
};
