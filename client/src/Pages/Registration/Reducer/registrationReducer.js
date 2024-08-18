export const INITIAL_STATE = {
  first_name: "",
  last_name: "",
  email: "",
  password: "",
  confirm_password: "",
  error: {
    first_name: false,
    last_name: false,
    email: false,
    password: false,
    confirm_password: false
  },
};

export const registrationReducer = (state, action) => {
  switch (action.type) {
    case "REGISTRATION_USER":
      return {
        ...state,
        error: false,
      };
    case "REGISTRATION_ERROR":
      return {
        ...state,
        [action.payload.name]: action.payload.value,
        error: {
          ...state.error,
          [action.payload.name]: action.payload.error,
        },
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
