import initialState from './initialState';
import * as types from './actionTypes';

const liveViews = (state = initialState, action) => {
  if (typeof action !== 'undefined') {
    switch (action.type) {
      case types.READ_LIVE_VIEWS_SUCCESS:
        return {
          ...state,
          data: action.liveViews
        }

      default:
        return state;
    }
  } else {
    return state
  }
}

export default liveViews;
