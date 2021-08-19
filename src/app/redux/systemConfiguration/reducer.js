import initialState from './initialState';
import * as types from './actionTypes';

const systemConfigurations = (state = initialState, action) => {
  if (typeof action !== 'undefined') {
    switch (action.type) {
      case types.READ_SYSTEM_CONFIGURATIONS_SUCCESS:
        return {
          ...state,
          data: action.systemConfigurations
        }

      default:
        return state;
    }
  } else {
    return state
  }
}

export default systemConfigurations;
