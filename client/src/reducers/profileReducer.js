import { PROFILE_LOADING, GET_PROFILE } from "../actions/types";

import isEmpty from "../validation/is-empty";

const initialState = {
  profile: null,
  profiles: null,
  loading: false
};

export default function(state = initialState, action) {
  switch (action.type) {
    case PROFILE_LOADING:
      return { ...state, loading: true };
    case GET_PROFILE:
      return { ...state, profile: action.payload, loading: false };
    default:
      return state;
  }
}
