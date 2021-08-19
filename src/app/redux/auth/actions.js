import ReactGA from 'react-ga';
import axios from 'axios';
require('promise.prototype.finally').shim();

import { clearCameraGroupData } from '../cameraGroups/actions';
import { clearCameraData } from '../cameras/actions';
import { clearInvitesData } from '../invites/actions';
import { clearAlertData } from '../alerts/actions';
import { fetchShareGroupInvites } from '../invites/actions';
import { readUser, deleteUserDevice } from '../users/actions';

import * as types from './actionTypes';

function registerInProcess(bool) {
  return {
    type: types.REGISTER_IN_PROCESS,
    registerInProcess: bool
  }
}

function registerError(error) {
  return {
    type: types.REGISTER_ERROR,
    registerError: error
  }
}

function registerSuccess() {
  return {
    type: types.REGISTER_SUCCESS
  }
}

function resetPasswordInProcess(bool) {
  return {
    type: types.RESET_PASSWORD_IN_PROCESS,
    resetPasswordInProcess: bool
  }
}

function resetPasswordError(error) {
  return {
    type: types.RESET_PASSWORD_ERROR,
    resetPasswordError: error
  }
}

function resetPasswordSuccess() {
  return {
    type: types.RESET_PASSWORD_SUCCESS
  }
}

export function toggleMute(mute) {
  return {
    type: types.TOGGLE_MUTE,
    mute: mute
  }
}

export function loginInProcess(bool) {
  return {
    type: types.LOGIN_IN_PROCESS,
    loginInProcess: bool
  }
}

export function loginError(error) {
  return {
    type: types.LOGIN_ERROR,
    loginError: error
  }
}

export function loginSuccess(user) {
  return {
    type: types.LOGIN_SUCCESS,
    user
  }
}

function sendInvitationInProcess(bool) {
  return {
    type: types.SEND_INVITATION_IN_PROCESS,
    sendInvitationInProcess: bool
  }
}

function sendInvitationSuccess(bool) {
  return {
    type: types.SEND_INVITATION_SUCCESS,
    sendInvitationSuccess: bool
  }
}

function sendInvitationError(error) {
  return {
    type: types.SEND_INVITATION_ERROR,
    sendInvitationError: error
  }
}

function getInvitationInProcess(bool) {
  return {
    type: types.GET_INVITATION_IN_PROCESS,
    getInvitationInProcess: bool
  }
}

function getInvitationSuccess(invitation) {
  return {
    type: types.GET_INVITATION_SUCCESS,
    invitation
  }
}

function getInvitationError(error) {
  return {
    type: types.GET_INVITATION_ERROR,
    getInvitationError: error
  }
}

function sendPasswordResetRequestInProcess(bool) {
  return {
    type: types.SEND_PASSWORD_RESET_REQUEST_IN_PROCESS,
    sendPasswordResetRequestInProcess: bool
  }
}

function sendPasswordResetRequestSuccess(bool) {
  return {
    type: types.SEND_PASSWORD_RESET_REQUEST_SUCCESS,
    sendPasswordResetRequestSuccess: bool
  }
}

function sendPasswordResetRequestError(error) {
  return {
    type: types.SEND_PASSWORD_RESET_REQUEST_ERROR,
    sendPasswordResetRequestError: error
  }
}

function getPasswordResetRequestInProcess(bool) {
  return {
    type: types.GET_PASSWORD_RESET_REQUEST_IN_PROCESS,
    getPasswordResetRequestInProcess: bool
  }
}

function getPasswordResetRequestSuccess(request) {
  return {
    type: types.GET_PASSWORD_RESET_REQUEST_SUCCESS,
    request
  }
}

function getPasswordResetRequestError(error) {
  return {
    type: types.GET_PASSWORD_RESET_REQUEST_ERROR,
    getPasswordResetRequestError: error
  }
}

export function loginMissing() {
  return {
    type: types.LOGIN_MISSING,
    user: null
  }
}

export function logoutSuccess() {
  return {
    type: types.LOGOUT_SUCCESS,
    user: null
  }
}

export function resetRegisterSuccess() {
  return {
    type: types.RESET_REGISTER_SUCCESS
  }
}

export function resetResetPasswordSuccess() {
  return {
    type: types.RESET_RESET_PASSWORD_SUCCESS
  }
}

export function generateOTPSuccess(generateOTPSuccess, generatedOTP) {
  return {
    type: types.GENERATE_OTP_SUCCESS,
    generateOTPSuccess: generateOTPSuccess,
    generatedOTP: generatedOTP
  }
};

export function generateOTPError(generateOTPError) {
  return {
    type: types.GENERATE_OTP_ERROR,
    generateOTPError: generateOTPError
  }
}

export function generateOTP(user) {
  return (dispatch) => {
    const jwt = sessionStorage.getItem('jwt');
    if (jwt) {
      let url = `${process.env.REACT_APP_ROG_API_URL}/generate-otp`;
      axios.get(url, {headers: {Authorization: 'Bearer'+' '+jwt}})
        .then(response => {
          dispatch(generateOTPSuccess(true, response.data.otp));
        })
        .catch(error => {
          let errMessage = 'Error generating OTP. Please try again later';
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
          dispatch(generateOTPError(errMessage));
        })
        .finally(() => {
          dispatch(generateOTPSuccess(false, ''));
          dispatch(generateOTPError(''));
        });
    } else {
      dispatch(loginMissing());
    }

  }
}

export function checkLogin() {
  return (dispatch) => {
    const jwt = sessionStorage.getItem('jwt');
    if (jwt) {
      let url = `${process.env.REACT_APP_ROG_API_URL}/users`;
      axios.get(url, {headers: {Authorization: 'Bearer'+' '+jwt}})
        .then(resp => {
          const user = {
            ...resp.data,
            jwt: jwt
          };

          if (window.jwtTokenRefresh === null) {
            dispatch(loginSuccess(user));
            dispatch(login(sessionStorage.getItem('email'), sessionStorage.getItem('password')));
          } else {
            dispatch(loginSuccess(user));
          }
        })
        .catch(error => {
          sessionStorage.removeItem('jwt');
          sessionStorage.removeItem('email');
          sessionStorage.removeItem('password');
          sessionStorage.removeItem('fcm_token_id');
          sessionStorage.removeItem('fcm_token');
          if(window.jwtTokenRefresh !== null){
            window.clearInterval(window.jwtTokenRefresh);
            window.jwtTokenRefresh = null;
          };
          dispatch(loginMissing());
        });
    } else {
      dispatch(loginMissing());
    }
  }
}

export function register(email, firstName, lastName, time_zone, password, confirmPassword, token) {
  return (dispatch) => {
    dispatch(registerError(''));
    dispatch(registerInProcess(true));

    const url = `${process.env.REACT_APP_ROG_API_URL}/users`;
    const data = {
      auth_token: token,
      email,
      first_name: firstName,
      last_name: lastName,
      time_zone,
      password
    };

    axios.post(url, data)
      .then((response) => {
        dispatch(registerSuccess());

        const registrationEvent = {
          email: email,
          name: firstName + ' ' + lastName,
          registration_status: 'Registration Successful',
          registration_date: new Date().toString().split(' ').splice(1, 4).join(' ')
        };

        dispatch(trackEventAnalytics('registration', registrationEvent));
      })
      .catch((error) => {
        let errMessage = 'Error registering. Please try again later';
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
        dispatch(registerError(errMessage));
      })
      .finally(() => {
        dispatch(registerError(''));
        dispatch(registerInProcess(false));
      });
  }
}

export function resetPassword(new_password, confirmPassword, token) {
  return (dispatch) => {
    dispatch(resetPasswordError(''));
    dispatch(resetPasswordInProcess(true));

    const url = `${process.env.REACT_APP_ROG_API_URL}/reset-password/${token}`;
    const data = {new_password};

    axios.patch(url, data)
      .then((response) => {
        dispatch(resetPasswordSuccess());
      })
      .catch((error) => {
        let errMessage = 'Error resetting your password. Please try again later';
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
        dispatch(resetPasswordError(errMessage));
      })
      .finally(() => {
        dispatch(resetPasswordError(''));
        dispatch(resetPasswordInProcess(false));
      });
  }
}

// set timout variable to call login function to refresh token
window.jwtTokenRefresh = null;

export function login(email, password) {
  return (dispatch) => {
    dispatch(loginInProcess(true));
    dispatch(loginError(''));

    const cleanEmail = email.trim().toLowerCase();
    const cleanPassword = password.trim();

    if (!cleanEmail) {
      dispatch(loginInProcess(false));
      dispatch(loginError('Please enter an email'));
    }
    else if (!cleanPassword) {
      dispatch(loginInProcess(false));
      dispatch(loginError('Please enter a password'));
    } else {
      let url = `${process.env.REACT_APP_ROG_API_URL}/authenticate`;
      axios.post(url, {email: cleanEmail, password: cleanPassword})
        .then((response) => {
          dispatch(readUser(response.data.jwt, window.jwtTokenRefresh, cleanEmail, cleanPassword));
        })
        .catch((error) => {
          let errMessage = 'Error logging in';
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
}

export function logout(user) {
  return (dispatch) => {
    dispatch(deleteUserDevice(user.uuid, sessionStorage.getItem('fcm_token_id'), sessionStorage.getItem('fcm_token')));
    sessionStorage.removeItem('jwt');
    sessionStorage.removeItem('email');
    sessionStorage.removeItem('password');
    sessionStorage.removeItem('fcm_token_id');
    sessionStorage.removeItem('fcm_token');
    localStorage.removeItem('fcm_token_id');
    localStorage.removeItem('fcm_token');
    window.clearInterval(window.jwtTokenRefresh);
    window.jwtTokenRefresh = null;
    dispatch(clearAssociatedData());
    dispatch(logoutSuccess());
  }
}

export function clearAssociatedData() {
  return (dispatch) => {
    dispatch(clearCameraGroupData());
    dispatch(clearCameraData());
    dispatch(clearInvitesData());
    dispatch(clearAlertData());
  }
}

export function sendInvitationEmail(email) {
  return (dispatch) => {
    dispatch(sendInvitationError(''));
    dispatch(sendInvitationInProcess(true));

    const invitationEmail = email.trim();
    let url = `${process.env.REACT_APP_ROG_API_URL}/invitations/join-rog`;
    let data = {email: invitationEmail};

    const invitationEvent = {
      email: invitationEmail,
      invite_status: 'Invitation Sent',
      invitation_date: new Date().toString().split(' ').splice(1, 4).join(' ')
    };

    dispatch(trackEventAnalytics('invitation', invitationEvent));


    /*-- Needed for Woopra Trigger event --*/
    // invitationEvent.invite_status = 'Invitation Received';
    // setInterval(dispatch(trackEventAnalytics('invitation', invitationEvent)), 1000);

    axios.post(url, data)
      .then(resp => {
        dispatch(sendInvitationSuccess(true));
        dispatch(sendInvitationSuccess(false));
      })
      .catch(error => {
        let errMessage = 'Error sending invitation. Please try again later.';
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
        dispatch(sendInvitationError(errMessage));
      })
      .finally(() => {
        dispatch(sendInvitationError(''));
        dispatch(sendInvitationInProcess(false));
      })
  }
}

export function getInvitation(token) {
  return (dispatch) => {
    dispatch(getInvitationError(''));
    dispatch(getInvitationInProcess(true));

    let url = `${process.env.REACT_APP_ROG_API_URL}/invitations/${token}`;
    axios.get(url)
      .then(resp => {
        dispatch(getInvitationSuccess(resp.data));
      })
      .catch(error => {
        let errMessage = 'Error getting invitation. Please try again later.';
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
        dispatch(getInvitationError(errMessage));
      })
      .finally(() => {
        dispatch(getInvitationError(''));
        dispatch(getInvitationInProcess(false));
      });
  }
}

export function sendPasswordResetRequestEmail(email) {
  return (dispatch) => {
    dispatch(sendPasswordResetRequestError(''));
    dispatch(sendPasswordResetRequestInProcess(true));

    const passwordResetRequestEmail = email.trim()
    let url = `${process.env.REACT_APP_ROG_API_URL}/forgot-password`;
    let data = {email: passwordResetRequestEmail};

    axios.post(url, data)
      .then(resp => {
        dispatch(sendPasswordResetRequestSuccess(true));
        dispatch(sendPasswordResetRequestSuccess(false));
      })
      .catch(error => {
        let errMessage = 'Sorry, we can\'t find that email.';
        if (typeof error.response !== 'undefined') {
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
        dispatch(sendPasswordResetRequestError(errMessage));
      })
      .finally(() => {
        dispatch(sendPasswordResetRequestError(''));
        dispatch(sendPasswordResetRequestInProcess(false));
      })
  }
}

export function getPasswordResetRequest(token) {
  return (dispatch) => {
    dispatch(getPasswordResetRequestError(''));
    dispatch(getPasswordResetRequestInProcess(true));

    let url = `${process.env.REACT_APP_ROG_API_URL}/invitations/${token}`;
    axios.get(url)
      .then(response => {
        dispatch(getPasswordResetRequestSuccess(response.data));
      })
      .catch(error => {
        let errMessage = 'Error getting Valid Password Reset Request.';
        if (typeof error.response !== 'undefined') {
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
        dispatch(getPasswordResetRequestError(errMessage));
      })
      .finally(() => {
        dispatch(getPasswordResetRequestError(''));
        dispatch(getPasswordResetRequestInProcess(false));
      })
  }
}

export function initialiseAnalyticsEngine() {
  return (dispatch) => {
    // initialiseGoogleAnalytics();
    // initialiseWoopraAnalytics();
  }
}

export function trackEventAnalytics(event, data) {

  return (dispatch) => {

    // woopra.identify(data);
    //
    // if ((event === 'registration') || (event === 'invitation')) {
    //   woopra.track(event, data);
    // }
    // else {
    //   woopra.track(data);
    // }
  }
}

function initialiseGoogleAnalytics() {
  ReactGA.initialize(process.env.REACT_APP_ROG_GA_ID);
}

function initialiseWoopraAnalytics() {
  (function () {
    var t, i, e, n = window, o = document, a = arguments, s = "script",
      r = ["config", "track", "identify", "visit", "push", "call", "trackForm", "trackClick"], c = function () {
        var t, i = this;
        for (i._e = [], t = 0; r.length > t; t++)(function (t) {
          i[t] = function () {
            return i._e.push([t].concat(Array.prototype.slice.call(arguments, 0))), i
          }
        })(r[t])
      };
    for (n._w = n._w || {}, t = 0; a.length > t; t++)n._w[a[t]] = n[a[t]] = n[a[t]] || new c;
    i = o.createElement(s), i.async = 1, i.src = "//static.woopra.com/js/w.js", e = o.getElementsByTagName(s)[0], e.parentNode.insertBefore(i, e)
  })("woopra");

  woopra.config({
    domain: 'gorog.co'
  });
  woopra.track();
}
