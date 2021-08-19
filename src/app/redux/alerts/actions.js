import axios from 'axios';
require('promise.prototype.finally').shim();

import initialState from './initialState';
import newAlertSound from '../../../assets/audio/newAlert.mp3';
import { updateUserData, storeUserDevice } from '../users/actions';
import * as types from './actionTypes';
import {isEmpty} from '../helperFunctions';
import moment from 'moment';

function fetchInProcess(bool) {
  return {
    type: types.FETCH_ALERTS_IN_PROCESS,
    fetchInProcess: bool
  }
}

function fetchError(error) {
  return {
    type: types.FETCH_ALERTS_ERROR,
    fetchError: error
  }
}

function fetchSuccess(alerts) {
  return {
    type: types.FETCH_ALERTS_SUCCESS,
    alerts
  }
}

function fetchSuccessWithPagination(alerts, pagination) {
  return {
    type: types.FETCH_ALERTS_SUCCESS_WITH_PAGINATION,
    alerts,
    pagination: pagination,
  }
}

function deleteInProcess(bool) {
  return {
    type: types.DELETE_ALERT_IN_PROCESS,
    deleteInProcess: bool
  }
}

function deleteError(error) {
  return {
    type: types.DELETE_ALERT_ERROR,
    deleteError: error
  }
}

function deleteSuccess(alertUuid) {
  return {
    type: types.DELETE_ALERT_SUCCESS,
    alertUuid
  }
}

function clearAllAlerts() {
  return {
    type: types.CLEAR_ALL_NEW_ALERTS
  }
}

function updateNewAlertCount(count) {
  return {
    type: types.UPDATE_NEW_ALERT_COUNT,
    newAlertCount: count
  }
}

function shareAlertError(message, alertUuid) {
  return {
    type: types.SHARE_ALERT_ERROR,
    shareAlertError: message,
    shareAlertErrorUuid: alertUuid
  }
}

function shareAlertSuccess(bool, alertUuid) {
  return {
    type: types.SHARE_ALERT_SUCCESS,
    shareAlertSuccess: bool,
    shareAlertSuccessUuid: alertUuid
  }
}

function shareAlertInProcess(bool, alertUuid) {
  return {
    type: types.SHARE_ALERT_IN_PROCESS,
    shareAlertInProcess: bool,
    shareAlertInProcessUuid: alertUuid
  }
}

function newAlert(alert, mute) {
  if (mute === false) {
    var audio = new Audio(newAlertSound);
    audio.play();
  }
  return {
    type: types.NEW_ALERT,
    alert
  }
}

function updateAlertTagsInProcess(alertUuid, bool) {
  return {
    type: types.UPDATE_ALERT_TAGS_IN_PROCESS,
    updateAlertTagsInProcessUuid: alertUuid,
    updateAlertTagsInProcess: bool
  }
}

function updateAlertTagsError(alertUuid, errMessage) {
  return {
    type: types.UPDATE_ALERT_TAGS_ERROR,
    updateAlertTagsError: errMessage,
    updateAlertTagsErrorUuid: alertUuid
  }
}

function updateAlertTagsSuccess(alertUuid, tags) {
  return {
    type: types.UPDATE_ALERT_TAGS_SUCCESS,
    tags: tags,
    updateAlertTagsSuccessUuid: alertUuid
  }
}

export function updateSelectedFilterType(int) {
  return {
    type: types.UPDATE_SELECTED_FILTER_TYPE,
    selectedFilterType: int
  }
}

export function mergeNewAlerts() {
  return {
    type: types.MERGE_NEW_ALERTS
  }
}

export function clearAlertData() {
  return {
    type: types.CLEAR_ALERT_DATA,
    alerts: initialState.alerts,
    newAlerts: initialState.newAlerts
  }
}

export function handleNewAlert(user, payload) {
  if (payload.data.trigger_type == 'RA') {
    payload.data.trigger_type = 'Restricted Area';
  } else if (payload.data.trigger_type == 'VW') {
    payload.data.trigger_type = 'Virtual Wall';
  } else if (payload.data.trigger_type == 'LD'){
    payload.data.trigger_type = 'Loitering Detected';
  }
  let alert = {
    uuid: payload.data.uuid,
    type: payload.data.trigger_type,
    camera: {
      name: payload.data.camera_name,
      cameraGroup: {
        name: payload.data.camera_groups_name
      }
    }
  }
  return (dispatch) => {
    navigator.serviceWorker.ready.then(registration => {
      const title = (payload.data.trigger_type + ' by ' + payload.data.camera_name);
      const options = {
        body: payload.data.camera_groups_name,
        data: payload.data,
        icon: '/logo192x192.png',
        image: payload.data.alert_image_url_with_token
      }
      registration.showNotification(title, options);
    })
    if (typeof user.mute == 'undefined') {
      user.mute = false;
    }
    dispatch(newAlert(alert, user.mute));
  }
}

var previousAlert = null;

export function listenForNewAlerts(user, messaging) {
  return (dispatch) => {
    // messaging.onMessage((payload) => {
    //   console.log("Notification Received", payload);
    //   if (previousAlert !== payload.data.uuid) {
    //     previousAlert = payload.data.uuid;
    //     dispatch(handleNewAlert(user, payload));
    //     dispatch(fetchAlerts(user));
    //   }
    // } else {
    //   dispatch(fetchAlerts(user));
    // }
    // });

    navigator.serviceWorker.addEventListener("message", (payload) => {
      // console.log("Notification Received", payload);
      if (payload.data.hasOwnProperty('firebaseMessagingData')) {
        payload = payload.data.firebaseMessagingData;
        if (previousAlert !== payload.data.uuid) {
          previousAlert = payload.data.uuid;
          dispatch(handleNewAlert(user, payload));
          dispatch(countNewAlerts(user));
        }
      } else {
        if (typeof user.mute == 'undefined') {
          user.mute = false;
        }
        if (user.mute === false) {
          var audio = new Audio(newAlertSound);
          audio.play();
        }
        dispatch(countNewAlerts(user));
      }
    });

    messaging.onTokenRefresh(function(user, messaging) {
      messaging.getToken("153344187169", "FCM").then(function(refreshedToken) {
        // console.log('Token refreshed: ' + refreshedToken);
        dispatch(storeUserDevice(user, refreshedToken, messaging));
      }).catch(function(err) {
        console.log('Unable to retrieve refreshed token ', err);
      });
    });
  }
}

export function fetchAlerts(user) {
  return (dispatch) => {
    dispatch(fetchError(''));
    dispatch(fetchInProcess(true));

    let itemsPerPage = 20;
    let currentPage = 1;

    let url = `${process.env.REACT_APP_ROG_API_URL}/users/${user.uuid}/alerts-new`;
    let config = {headers: {Authorization: 'Bearer '+sessionStorage.getItem('jwt')}}
    axios.get(url, config)
      .then((response) => {
        if (!isEmpty(response.data)) {
          let pagination = {
            total: response.data[0]['total_alerts'],
            per_page: itemsPerPage,
            current_page: currentPage,
            last_page: Math.ceil(response.data[0]['total_alerts'] / itemsPerPage),
            from: ((currentPage - 1) * itemsPerPage) + 1,
            to: currentPage  * itemsPerPage
          };
          dispatch(fetchSuccessWithPagination(response.data, pagination));
          dispatch(updateSelectedFilterType(4));
        } else {
          dispatch(fetchError('No Alerts Found'));
        }
      })
      .catch((error) => {
        let errMessage = 'Error fecthing alerts';
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
        dispatch(fetchError(errMessage));
      })
      .finally(() => {
        dispatch(fetchError(''));
        dispatch(fetchInProcess(false));
      });
  }
}

export function fetchAlertsWithPagination(user, nextPage, page, pageSize) {
  return (dispatch) => {
    dispatch(fetchError(''));
    dispatch(fetchInProcess(true));

    let url = `${process.env.REACT_APP_ROG_API_URL}/users/${user.uuid}/alerts-new?page=${nextPage}&per_page=${pageSize}`;
    let config = {headers: {Authorization: 'Bearer '+user.jwt}}
    axios.get(url, config)
      .then((response) => {
        if (!isEmpty(response.data)) {
          let pagination = {
            total: response.data[0]['total_alerts'],
            per_page: pageSize,
            current_page: page,
            last_page: Math.ceil(response.data[0]['total_alerts'] / pageSize),
            from: ((page - 1) * pageSize) + 1,
            to: page  * pageSize
          };
          dispatch(fetchSuccessWithPagination(response.data, pagination));
        }
      })
      .catch((error) => {
        let errMessage = 'Error fecthing alerts';
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
        dispatch(fetchError(errMessage));
      })
      .finally(() => {
        dispatch(fetchError(''));
        dispatch(fetchInProcess(false));
      });
  }
}

export function fetchAlertsWithPaginationAndFilters(user, nextPage, page=1, pageSize=20, filter_type=4, filter_parameter=null) {
  return (dispatch) => {
    dispatch(fetchError(''));
    dispatch(fetchInProcess(true));

    let url = `${process.env.REACT_APP_ROG_API_URL}/users/${user.uuid}/alerts-new?page=${nextPage}&per_page=${pageSize}&filter_type=${filter_type}&filter_parameter=${encodeURIComponent(filter_parameter)}`;
    let config = {headers: {Authorization: 'Bearer '+user.jwt}}
    axios.get(url, config)
      .then((response) => {
        if (!isEmpty(response.data)) {
          let pagination = {
            total: response.data[0]['total_alerts'],
            per_page: pageSize,
            current_page: page,
            last_page: Math.ceil(response.data[0]['total_alerts'] / pageSize),
            from: ((page - 1) * pageSize) + 1,
            to: page  * pageSize
          };
          dispatch(fetchSuccessWithPagination(response.data, pagination));
        } else {
          dispatch(fetchSuccessWithPagination({}, {}));
        }
      })
      .catch((error) => {
        let errMessage = 'Error fecthing alerts';
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
        dispatch(fetchError(errMessage));
      })
      .finally(() => {
        dispatch(fetchError(''));
        dispatch(fetchInProcess(false));
      });
  }
}

export function markUserAlertsViewed(user) {
  return(dispatch) => {
    let url = `${process.env.REACT_APP_ROG_API_URL}/users/${user.uuid}/alerts`;
    let config = {headers: {Authorization: 'Bearer '+user.jwt}}
    let data = '';
    axios.patch(url, data, config)
      .then((response) => {
        dispatch(countNewAlerts(user));
      });
  }
}

export function countNewAlerts(user) {
  return(dispatch) => {
    let url = `${process.env.REACT_APP_ROG_API_URL}/users/${user.uuid}/alerts-count`;
    let config = {headers: {Authorization: 'Bearer '+user.jwt}}
    axios.get(url, config)
      .then((response) => {
        // call action-reducer function to push new count data to the components
        if (!isEmpty(response.data)) {
          dispatch(updateNewAlertCount(response.data['Count']));
        }
      });
  }
}

export function deleteAlert(user, alertUuid) {
  return (dispatch) => {
    dispatch(deleteInProcess(true));
    dispatch(deleteError(''));

    let url = `${process.env.REACT_APP_ROG_API_URL}/users/${user.uuid}/alerts/${alertUuid}`;
    let config = {headers: {Authorization: 'Bearer '+user.jwt}};
    axios.delete(url, config)
      .then(response => {
        dispatch(deleteSuccess(alertUuid));
      })
      .catch(error => {
        let errMessage = 'Error deleting alert';
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
        dispatch(deleteError(errMessage));
      })
      .finally(() => {
        dispatch(deleteInProcess(false));
      })
  }
}

export function shareUserAlert(user, alertUuid, data) {
  return (dispatch) => {
    if (isEmpty(data)) {
      dispatch(shareAlertError('Please enter an email or phone number', alertUuid));
    } else {
      dispatch(shareAlertInProcess(true, alertUuid));
      let url = `${process.env.REACT_APP_ROG_API_URL}/users/${user.uuid}/alerts/${alertUuid}/share`;
      let config = {headers: {Authorization: 'Bearer '+user.jwt}};
      axios.post(url, data, config)
      .then(response => {
        dispatch(shareAlertSuccess(true, alertUuid));
      })
      .catch(error => {
        let errMessage = 'Error sharing alert';
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
        dispatch(shareAlertError(errMessage, alertUuid));
      })
      .finally(() => {
        dispatch(shareAlertInProcess(false, null));
        dispatch(shareAlertSuccess(false, null));
        dispatch(shareAlertError('', null));
      })
    }
  }
}

export function clearNewAlerts() {
  return (dispatch) => {
    dispatch(clearAllAlerts());
  }
}

export function updateAlertTags(user, alertUuid, tags, tag_options = ["Clear", "Contacted Police", "Contacted Fire Dept", "Contacted Ambulance"]) {
  return (dispatch) => {
    dispatch(updateAlertTagsInProcess(user, alertUuid, true));
    let url = `${process.env.REACT_APP_ROG_API_URL}/users/${user.uuid}/alerts/${alertUuid}`;
    let config = {headers: {Authorization: 'Bearer '+user.jwt}};
    let dict = {};
    for (var i = 0; i < tags.length; i++) {
      if (tag_options.indexOf(tags[i]) > -1) {
        dict[tags[i]] = 1;
      } else {
        dict[tags[i]] = 0;
      }
    }
    let data = {
      tags: dict
    }
    axios.patch(url, data, config)
    .then(response => {
      dispatch(updateAlertTagsSuccess(alertUuid, response.data.tags));
    })
    .catch(error => {
      let errMessage = 'Error updating tags';
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
      dispatch(updateAlertTagsError(alertUuid, errMessage));
    })
    .finally(() => {
      dispatch(updateAlertTagsInProcess(user, alertUuid, false));
      dispatch(updateAlertTagsError(alertUuid, ''));
    })
  }
}
