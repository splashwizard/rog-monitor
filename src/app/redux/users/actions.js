import axios from 'axios';
require('promise.prototype.finally').shim();

import initialState from './initialState';

import * as types from './actionTypes';

import { fetchUserCameraGroupInvites } from '../invites/actions';
import {loginInProcess, loginError, loginSuccess, trackEventAnalytics, login, toggleMute} from '../auth/actions';
import {listenForNewAlerts} from '../alerts/actions';
import {isEmpty} from '../helperFunctions';
import { message } from 'antd';

export function addUserError(error) {
  return {
    type: types.ADD_USER_ERROR,
    addUserError: error
  }
}

export function addUserInProcess(bool) {
  return {
    type: types.ADD_USER_IN_PROCESS,
    addUserInProcess: bool
  }
}

export function updateUserData(userData) {
  return{
    type: types.UPDATE_USER_DATA,
    userData: userData
  }
}

function updateUserError(error) {
  return {
    type: types.UPDATE_USER_ERROR,
    updateUserError: error
  }
}

function updateUserInProgress(bool) {
  return {
    type: types.UPDATE_USER_IN_PROGRESS,
    updateUserInProgress: bool
  }
}

function updateUserSuccess(bool, user) {
  return {
    type: types.UPDATE_USER_SUCCESS,
    updateUserSuccess: bool
  }
}

function updateUserCameraLicenseData(data) {
  return {
    type: types.UPDATE_USER_CAMERA_LICENSE_DATA,
    cameraLicenseData: data
  }
}

export function fetchUserCameraLicenses(user) {
  return (dispatch) => {
    let url = `${process.env.REACT_APP_ROG_API_URL}/users/${user.uuid}/licenses`;
    let config = {headers: {Authorization: 'Bearer '+sessionStorage.getItem('jwt')}};
    axios.get(url, config)
      .then((response) => {
        if (isEmpty(response.data) === false) {
          user.cameraLicenses = response.data;
        } else {
          user.cameraLicenses = [];
        }
        dispatch(setupFirebaseCloudMessaging(user));
        dispatch(fetchUserCameraGroupInvites(user));
      })
      .catch((error) => {
        let errMessage = 'Error fetching user data. Please try again later.';
        if (error.response !== undefined) {
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
        dispatch(loginError(errMessage));
        dispatch(loginInProcess(false));
      })
  }
}

export function readUser(jwt, jwtTokenRefresh, email, password) {
  return(dispatch) => {
    let url = `${process.env.REACT_APP_ROG_API_URL}/users`;
    let config = {headers: {Authorization: 'Bearer '+jwt}};
    axios.get(url, config)
      .then((response) => {
        const user = {
          ...response.data,
          jwt: jwt
        }
        if (user.time_zone === 'UTC') {
          message.warning("ROG works best when you define your default time zone. Default is UTC.", 10);
        }
        sessionStorage.setItem('jwt', jwt);
        sessionStorage.setItem('email', email);
        sessionStorage.setItem('password', password);

        if (window.jwtTokenRefresh === null) {
          window.jwtTokenRefresh = window.setInterval(
            function(){
              dispatch(login(email, password));
            }, (10 * 60 * 1000), [email, password]
          );
        }
        dispatch(fetchUserCameraLicenses(user));
      })
      .catch(error => {
        let errMessage = 'Error fetching user data. Please try again later.';
        if (error.response !== undefined) {
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
        dispatch(loginError(errMessage));
        dispatch(loginInProcess(false));
      });
  }
}

export function updateUser(user, values) {
  return (dispatch) => {
    dispatch(updateUserError(''));
    dispatch(updateUserSuccess(false));
    dispatch(updateUserInProgress(true));
    let config = {headers: {Authorization: 'Bearer '+sessionStorage.getItem('jwt')}};
    let url = `${process.env.REACT_APP_ROG_API_URL}/users/${user.uuid}`;
    const data = {
      first_name: values.firstName,
      last_name: values.lastName,
      time_zone: values.time_zone
    };

    axios.patch(url, data, config)
      .then((response) => {
        dispatch(updateUserData(response.data.user));
        dispatch(updateUserSuccess(true));
        dispatch(updateUserInProgress(false));
      })
      .catch(error => {
        let errMessage = 'Error updating user';
        if (error.response !== undefined) {
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
        dispatch(updateUserError(errMessage));
        dispatch(updateUserInProgress(false));
      });
  }
}

export function muteSound(user, mute) {
  return (dispatch) => {
    let url = `${process.env.REACT_APP_ROG_API_URL}/users/${user.uuid}`;
    let config = {headers: {Authorization: 'Bearer '+sessionStorage.getItem('jwt')}};
    let data = {
      mute: mute
    }
    axios.patch(url, data, config)
      .then((response) => {
        user.mute = response.data.user.mute;
        dispatch(updateUserData(user));
        dispatch(toggleMute(response.data.user.mute));
      })
      .catch((error) => {
        let errMessage = 'Error fetching user device data. Please try again later.';
        if (error.response !== undefined) {
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
        throw(errMessage);
      })
  }
}

function setupFirebaseCloudMessaging(user){
  return (dispatch, getState, {getFirebase}) => {
    Notification.requestPermission().then((permission) => {
      if (permission === 'granted') {
        // console.log('Notification permission granted.');
        const firebase = getFirebase();
        const messaging = firebase.messaging();
        messaging
          .requestPermission()
          .then(() => {
            return messaging.getToken("153344187169", "FCM");
           })
          .then(currentToken => {
            // console.log("FCM Token:", currentToken);
            dispatch(checkForStoredUserDeviceToken(user, currentToken, messaging));
          })
          .catch(error => {
            let errMessage = 'Error setting up FCM notifications.';
            if (error.code === "messaging/permission-blocked") {
              errMessage = "It looks like your web browser blocked our notifications. Please Unblock Notifications Manually through your browser's settings.";
            } else {
              console.log(error);
            }
            alert(errMessage);
            dispatch(loginSuccess(user));
            dispatch(loginInProcess(false));
          });
      } else {
        let errMessage = 'Unable to get permission to notify.';
        console.log(errMessage);
        alert(errMessage);
        dispatch(loginSuccess(user));
        dispatch(loginInProcess(false));
      }
    });
  }
}

function checkForStoredUserDeviceToken(user, token, messaging) {
  return (dispatch) => {
    let url = `${process.env.REACT_APP_ROG_API_URL}/users/${user.uuid}/devices`;
    let config = {headers: {Authorization: 'Bearer '+sessionStorage.getItem('jwt')}};
    axios.get(url, config)
      .then((response) => {
        user.devices = response.data;
        let device_token_exists = false;
        for (var i = 0; i < user.devices.length; i++) {
          let stored_device_token = user.devices[i].device_token;
          if (token === stored_device_token) {
            if (isEmpty(localStorage.getItem('fcm_token'))) {
              localStorage.setItem('fcm_token_id', user.devices[i].uuid)
              localStorage.setItem('fcm_token', token)
            }
            if (localStorage.getItem('fcm_token') !== token) {
              dispatch(deleteUserDevice(user.uuid, localStorage.getItem('fcm_token_id'), localStorage.getItem('fcm_token')));
            }
            device_token_exists = true;
            sessionStorage.setItem('fcm_token_id', user.devices[i].uuid)
            sessionStorage.setItem('fcm_token', token)
            dispatch(listenForNewAlerts(user, messaging));
            dispatch(loginSuccess(user));
            dispatch(loginInProcess(false));
          }
        }
        if (device_token_exists === false) {
          if (isEmpty(localStorage.getItem('fcm_token'))) {
            dispatch(storeUserDevice(user, token, messaging));
          } else {
            dispatch(deleteUserDevice(user.uuid, localStorage.getItem('fcm_token_id'), localStorage.getItem('fcm_token')));
            dispatch(storeUserDevice(user, token, messaging));
          }
        }
      })
      .catch(error => {
        let errMessage = 'Error fetching user device data. Please try again later.';
        if (error.response !== undefined) {
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
        dispatch(loginError(errMessage));
        dispatch(loginInProcess(false));
      });
  }
}

export function storeUserDevice(user, token, messaging) {
  return (dispatch) => {
    let url = `${process.env.REACT_APP_ROG_API_URL}/users/${user.uuid}/devices`;
    let config = {headers: {Authorization: 'Bearer '+sessionStorage.getItem('jwt')}};

    // Opera 8.0+
    var isOpera = (!!window.opr && !!opr.addons) || !!window.opera || navigator.userAgent.indexOf(' OPR/') >= 0;
    // Firefox 1.0+
    var isFirefox = typeof InstallTrigger !== 'undefined';
    // Safari 3.0+ "[object HTMLElementConstructor]"
    var isSafari = /constructor/i.test(window.HTMLElement) || (function (p) { return p.toString() === "[object SafariRemoteNotification]"; })(!window['safari'] || (typeof safari !== 'undefined' && safari.pushNotification));
    // Internet Explorer 6-11
    var isIE = /*@cc_on!@*/false || !!document.documentMode;
    // Edge 20+
    var isEdge = !isIE && !!window.StyleMedia;
    // Chrome 1 - 79
    var isChrome = !!window.chrome && (!!window.chrome.webstore || !!window.chrome.runtime);
    // Edge (based on chromium) detection
    var isEdgeChromium = isChrome && (navigator.userAgent.indexOf("Edg") != -1);
    // Blink engine detection
    var isBlink = (isChrome || isOpera) && !!window.CSS;

    var webBrowserDevice = '';
    if (isOpera) {
      webBrowserDevice = 'Opera Version: '+ navigator.appVersion;
    } else if (isFirefox) {
      webBrowserDevice = 'Firefox Version: '+ navigator.appVersion;
    } else if (isSafari) {
      webBrowserDevice = 'Safari Version: '+ navigator.appVersion;
    } else if (isIE) {
      webBrowserDevice = 'IE Version: '+ navigator.appVersion;
    } else if (isEdge) {
      webBrowserDevice = 'Edge Version: '+ navigator.appVersion;
    } else if (isChrome) {
      webBrowserDevice = 'Chrome Version: '+ navigator.appVersion;
    } else if (isEdgeChromium) {
      webBrowserDevice = 'EdgeChromium Version: '+ navigator.appVersion;
    } else if (isBlink) {
      webBrowserDevice = 'Blink Version: '+ navigator.appVersion;
    }

    let data ={
      device_token: token,
      device_name: webBrowserDevice
    }
    axios.post(url, data, config)
      .then((response) => {
        user.devices.push(response.data.user_device);
        sessionStorage.setItem('fcm_token_id', response.data.user_device.uuid);
        sessionStorage.setItem('fcm_token', token);
        localStorage.setItem('fcm_token_id', response.data.user_device.uuid);
        localStorage.setItem('fcm_token', token);
        dispatch(listenForNewAlerts(user, messaging));
        dispatch(loginSuccess(user));
        dispatch(loginInProcess(false));
      })
      .catch(error => {
        console.log(error);
        let errMessage = 'Error storing user device token.';
        if (error.response !== undefined) {
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
        dispatch(loginError(errMessage));
        dispatch(loginInProcess(false));
      });
  }
}

export function updateUserDevice(userUuid, deviceUuid, name) {
  return (dispatch) => {
    let url = `${process.env.REACT_APP_ROG_API_URL}/users/${userUuid}/devices/${deviceUuid}`;
    let config = {headers: {Authorization: 'Bearer '+sessionStorage.getItem('jwt')}};
    let data ={
      device_name: name
    }
    axios.patch(url, data, config)
      .then((response) => {
        // console.log(response);
      })
      .catch(error => {
        let errMessage = 'Error updating user device data. Please try again later.';
        if (error.response !== undefined) {
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
        throw(errMessage);
      });
  }
}

export function deleteUserDevice(userUuid, deviceUuid, token) {
  return (dispatch, getState, {getFirebase}) => {
    let url = `${process.env.REACT_APP_ROG_API_URL}/users/${userUuid}/devices/${deviceUuid}`;
    let config = {headers: {Authorization: 'Bearer '+sessionStorage.getItem('jwt')}};
    axios.delete(url, config)
      .then((response) => {
        const firebase = getFirebase();
        const messaging = firebase.messaging();
        messaging
          .deleteToken(token)
            .then((response) => {
              // console.log(response);
            })
            .catch(error => {
              throw(error);
            });
      })
      .catch(error => {
        let errMessage = 'Error deleting user device data. Please try again later.';
        if (error.response !== undefined) {
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
        throw(errMessage);
      });
  }
}

export function createUserAdmin(values) {
  return (dispatch) => {
    dispatch(addUserInProcess(true));
    dispatch(addUserError(''));
    let url = `${process.env.REACT_APP_ROG_API_URL}/users-admin`;
    let config = {headers: {Authorization: 'Bearer '+sessionStorage.getItem('jwt')}};
    axios.post(url, values, config)
      .then((response) => {
        if (response.hasOwnProperty('data')) {
          dispatch(readUserByUuidAdmin(response.data));
        }
      })
      .catch((error) => {
        let errMessage = 'Error creating user';
        if (error.response !== undefined) {
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
        dispatch(addUserError(errMessage));
      })
      .finally(() => {
        dispatch(addUserInProcess(false));
        dispatch(addUserError(''));
      })
  }
}

export function readUserByUuidAdmin(values) {
  return (dispatch) => {
    dispatch(updateUserData({}));
    let url = `${process.env.REACT_APP_ROG_API_URL}/users/${values.user_uuid}`;
    let config = {headers: {Authorization: 'Bearer '+sessionStorage.getItem('jwt')}};
    axios.get(url, config)
      .then((response) => {
        if (response.hasOwnProperty('data')) {
          dispatch(updateUserData(response.data));
        }
      })
      .catch((error) => {
        let errMessage = 'Error fetching user';
        if (error.response !== undefined) {
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
        throw(errMessage);
      });
  }
}

export function readUserByEmailAdmin(values) {
  return (dispatch) => {
    dispatch(updateUserData({}));
    let url = `${process.env.REACT_APP_ROG_API_URL}/users?email=${values.email}`;
    let config = {headers: {Authorization: 'Bearer '+sessionStorage.getItem('jwt')}};
    axios.get(url, config)
      .then((response) => {
        if (response.hasOwnProperty('data')) {
          dispatch(updateUserData(response.data));
        }
      })
      .catch((error) => {
        let errMessage = 'Error fetching user';
        if (error.response !== undefined) {
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
        throw(errMessage);
      });
  }
}

export function updateUserAdmin(user, values) {
  return (dispatch) => {
    dispatch(updateUserError(''));
    dispatch(updateUserSuccess(false));
    dispatch(updateUserInProgress(true));
    let config = {headers: {Authorization: 'Bearer '+sessionStorage.getItem('jwt')}};
    let url = `${process.env.REACT_APP_ROG_API_URL}/users/${user.uuid}`;
    values.user_privileges_id = parseInt(values.user_privileges_id);
    values.mute = (values.mute == "true");
    values.enabled = (values.enabled == "true");
    const data = JSON.parse(JSON.stringify(values));
    delete data.key;

    axios.patch(url, data, config)
      .then((response) => {
        dispatch(updateUserData(response));
        dispatch(updateUserSuccess(true));
        dispatch(updateUserInProgress(false));
        values.user_uuid = values.uuid;
        dispatch(readUserByUuidAdmin(values));
      })
      .catch(error => {
        let errMessage = 'Error updating user';
        if (error.response !== undefined) {
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
        dispatch(updateUserError(errMessage));
        dispatch(updateUserInProgress(false));
      });
  }
}

export function deleteUserAdmin(user_uuid) {
  return (dispatch) => {
    let config = {headers: {Authorization: 'Bearer '+sessionStorage.getItem('jwt')}};
    let url = `${process.env.REACT_APP_ROG_API_URL}/users/${user_uuid}`;

    axios.delete(url, config)
      .then((response) => {
        console.log(response);
      })
      .catch(error => {
        let errMessage = 'Error updating user';
        if (error.response !== undefined) {
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
        dispatch(updateUserError(errMessage));
      });
  }
}

export function createUserLicense(user, numberToAdd) {
  return (dispatch) => {
    let url = `${process.env.REACT_APP_ROG_API_URL}/users/${user.user_uuid}/licenses`;
    let config = {headers: {Authorization: 'Bearer '+sessionStorage.getItem('jwt')}};
    let data = {
      number_to_add: numberToAdd
    };
    axios.post(url, data, config)
      .then((response) => {
        dispatch(readUserCameraLicensesAdmin(user));
      })
      .catch((error) => {
        let errMessage = 'Error fetching user licnese data. Please try again later.';
        if (error.response !== undefined) {
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
        dispatch(updateUserError(errMessage));
      })
  }
}

export function readUserCameraLicensesAdmin(user) {
  return (dispatch) => {
    dispatch(updateUserData({}));
    dispatch(updateUserCameraLicenseData({}));
    let url = `${process.env.REACT_APP_ROG_API_URL}/users/${user.user_uuid}/licenses`;
    let config = {headers: {Authorization: 'Bearer '+sessionStorage.getItem('jwt')}};
    axios.get(url, config)
      .then((response) => {
        if (!isEmpty(response.data)) {
          dispatch(updateUserCameraLicenseData(response.data));
        }
        dispatch(updateUserData(user));
      })
      .catch((error) => {
        let errMessage = 'Error fetching user licnese data. Please try again later.';
        if (error.response !== undefined) {
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
        dispatch(updateUserError(errMessage));
      })
  }
}

export function updateUserLicense(user, license) {
  return (dispatch) => {
    let url = `${process.env.REACT_APP_ROG_API_URL}/users/${user.user_uuid}/licenses/${license.uuid}`;
    let config = {headers: {Authorization: 'Bearer '+sessionStorage.getItem('jwt')}};
    let data = {
      tier_0: license.tier_0,
      tier_1: license.tier_1,
      tier_2: license.tier_2
    };
    axios.patch(url, data, config)
      .then((response) => {
        dispatch(readUserCameraLicensesAdmin(user));
      })
      .catch((error) => {
        let errMessage = 'Error fetching user licnese data. Please try again later.';
        if (error.response !== undefined) {
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
        dispatch(updateUserError(errMessage));
      })
  }
}

export function deleteUserLicenseAdmin(user, license) {
  return (dispatch) => {
    let url = `${process.env.REACT_APP_ROG_API_URL}/users/${user.user_uuid}/licenses/${license['uuid']}`;
    let config = {headers: {Authorization: 'Bearer '+sessionStorage.getItem('jwt')}};
    axios.delete(url, config)
      .then((response) => {
        dispatch(readUserCameraLicensesAdmin(user));
      })
      .catch((error) => {
        let errMessage = 'Error fetching user licnese data. Please try again later.';
        if (error.response !== undefined) {
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
        dispatch(updateUserError(errMessage));
      })
  }
}
