import axios from 'axios';
require('promise.prototype.finally').shim();

import initialState from './initialState';

import * as types from './actionTypes';

import {isEmpty} from '../helperFunctions';

function fetchSuccessAdmin(recoConnectivityLogsAdmin) {
  return {
    type: types.FETCH_RECO_CONNECTIVITY_LOGS_ADMIN,
    recoConnectivityLogsAdmin
  }
}

function fetchRecoConnectivityLogsError(error) {
  return {
    type: types.FETCH_RECO_CONNECTIVITY_LOGS_ERROR,
    fetchRecoConnectivityLogsError: error
  }
}

export function readAllRecoConnectivityLogs(values) {
  return (dispatch) => {
    dispatch(fetchSuccessAdmin([]));
    dispatch(fetchRecoConnectivityLogsError(""));
    let url = `${process.env.REACT_APP_ROG_API_URL}/get-reco-connectivity-logs`;
    let config = {headers: {Authorization: 'Bearer '+sessionStorage.getItem('jwt')}};

    axios.post(url, values, config)
    .then((response) => {
      if (!isEmpty(response.data)) {
        dispatch(fetchSuccessAdmin(response.data));
      } else if (isEmpty(response.data)) {
        dispatch(fetchRecoConnectivityLogsError("No records found."));
      }
    })
    .catch((error) => {
      let errMessage = 'Error fetching reco connectivity logs. Please try again later.';
      if (error.response != undefined) {
        errMessage = error.response;
        if (typeof error === 'object') {
          if (error.hasOwnProperty('response') && error.response.hasOwnProperty('data')) {
            if (typeof error.response.data === 'object') {
              if ('Error' in error.response.data) {
                errMessage = error.response.data['Error'];
              }
            } else {
              errMessage = error.response.data;
            }
          }
        }
      }
      dispatch(fetchRecoConnectivityLogsError(errMessage));
    })
  }
}
