const INITIAL_STATE = {
  user: [],
  socialMediaAccount: [],
  businessProfile: {},
  personalProfile: {},
  formFields: {},
  Profile: {},
};

const ReduxFunc = (state = INITIAL_STATE, action) => {
  // console.log(state,action);
  switch (action.type) {
    case "SETUSER":
      return {
        ...state,
        user: action.payload,
      };
    case "SIGNOUT":
      // console.log('signout');
      return {
        user: [],
  socialMediaAccount: [],
  businessProfile: {},
  personalProfile: {},
  formFields: {},
  Profile: {},
      };
    case "ADDSOCIAL":
      return {
        ...state,
        socialMediaAccount: [...state.socialMediaAccount, action.payload],
      };
    case "DELETESOCIAL":
      return {
        ...state,
        socialMediaAccount: [
          ...state.socialMediaAccount.splice(0, action.payload),
          ...state.socialMediaAccount.splice(1),
        ],
      };
    case "FORMFIELDS":
      return {
        ...state,
        formFields: action.payload,
      };
    case "UPDATEPROFILE":
      return {
        ...state,
        formFields: { ...state.formFields, profile: "" },
      };
    case "PROFILE":
      return {
        ...state,
        Profile: action.payload,
      };
    default:
      return state;
  }

  // return state
};

export default ReduxFunc;
