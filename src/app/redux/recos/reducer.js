import initialState from './initialState';
import * as types from './actionTypes';

const recos = (state = initialState, action) => {
  if (typeof action !== 'undefined') {
    switch (action.type) {
      case types.READ_RECOS_SUCCESS:
        return {
          ...state,
          data: action.recos
        }
      case types.READ_RECOS_ERROR:
        return {
          ...state,
          getRecosError: action.message
        }

      default:
        return state;
    }
  } else {
    return state
  }
}

export default recos;
