import initialState from './initialState';
import * as types from './actionTypes';

const recoConnectivityLogs = (state = initialState, action) => {
  if (typeof action !== 'undefined') {
    switch (action.type) {
      case types.FETCH_RECO_CONNECTIVITY_LOGS_ADMIN:
        return {
          ...state,
          recoConnectivityLogsAdmin: action.recoConnectivityLogsAdmin
        }

      case types.FETCH_RECO_CONNECTIVITY_LOGS_ERROR:
        return {
          ...state,
          fetchRecoConnectivityLogsError: action.fetchRecoConnectivityLogsError
        }

      default:
        return state;
    }
  } else {
    return state
  }
}

export default recoConnectivityLogs;
