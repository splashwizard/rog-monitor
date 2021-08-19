import axios from 'axios';
require('promise.prototype.finally').shim();

import initialState from './initialState';

import * as types from './actionTypes';

import { fetchCameraGroups, selectCameraGroup } from '../cameraGroups/actions';
import {isEmpty} from '../helperFunctions';

function fetchReceivedInProcess(bool) {
  return {
    type: types.FETCH_RECEIVED_IN_PROCESS,
    fetchReceivedInProcess: bool
  }
}

function fetchReceivedError(error) {
  return {
    type: types.FETCH_RECEIVED_ERROR,
    fetchReceivedError: error
  }
}

function updateInvitationError(error) {
  return {
    type: types.UPDATE_INVITATION_ERROR,
    updateInvitationError: error
  }
}

function deleteInvitationError(error) {
  return {
    type: types.DELETE_INVITATION_ERROR,
    deleteInvitationError: error
  }
}

function fetchSentCameraGroupInvitesSuccess(sentInvites) {
  return {
    type: types.FETCH_SENT_SUCCESS,
    sentInvites
  }
}

function fetchUserCameraGroupInvitesSuccess(cameraGroupInvites) {
  return {
    type: types.FETCH_RECEIVED_SUCCESS,
    cameraGroupInvites
  }
}

function acceptInviteInProcess(bool) {
  return {
    type: types.ACCEPT_INVITE_IN_PROCESS,
    acceptInviteInProcess: bool
  }
}

function acceptInviteSuccess(invite) {
  return {
    type: types.ACCEPT_INVITE_SUCCESS,
    invite
  }
}

function acceptInviteError(error) {
  return {
    type: types.ACCEPT_INVITE_ERROR,
    acceptInviteError: error
  }
}

function rejectInviteInProcess(bool) {
  return {
    type: types.REJECT_INVITE_IN_PROCESS,
    rejectInviteInProcess: bool
  }
}

function rejectInviteSuccess(invite) {
  return {
    type: types.REJECT_INVITE_SUCCESS,
    invite
  }
}

function rejectInviteError(error) {
  return {
    type: types.REJECT_INVITE_ERROR,
    rejectInviteError: error
  }
}

function rescindInviteInProcess(bool) {
  return {
    type: types.RESCIND_INVITE_IN_PROCESS,
    rescindInviteInProcess: bool
  }
}

function rescindInviteError(error) {
  return {
    type: types.RESCIND_INVITE_ERROR,
    rescindInviteError: error
  }
}

function fetchInvitesSuccess(invites) {
  return {
    type: types.FETCH_INVITES_SUCCESS,
    invites
  }
}

export function clearInvitesData() {
  return {
      type: types.CLEAR_INVITES_DATA,
      cameraGroupInvites: [],
      sentInvites: []
  }
}

export function fetchUserInvites(values) {
  return (dispatch) => {
    let config = {headers: {Authorization: 'Bearer '+sessionStorage.getItem('jwt')}};
    let url = `${process.env.REACT_APP_ROG_API_URL}/invitations?`;
    for (var property in values) {
      if (url.endsWith(`?`) && values[property] !== undefined){
        url += property + `=` + values[property];
      } else if (values[property] !== undefined){
        url += `&` + property + `=` + values[property];
      }
    }

    if (url !== `${process.env.REACT_APP_ROG_API_URL}/invitations?`) {
      axios.get(url, config)
      .then(response => {
        if (!isEmpty(response.data)) {
          dispatch(fetchInvitesSuccess(response.data));
        } else {
          dispatch(fetchReceivedError('No records found.'));
        }
      })
      .catch((error) => {
        let errMessage = 'Error fetching invitations';
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
        dispatch(fetchReceivedError(errMessage));
      })
      .finally(() => {
        dispatch(fetchReceivedError(''));
        dispatch(fetchReceivedInProcess(false));
      });
    } else {
      dispatch(fetchReceivedError('Please fill in at least one field.'));
    }
  }
}

export function updateInvitation(invitation) {
  return (dispatch) => {
    var data = JSON.parse(JSON.stringify(invitation));
    delete data.key;
    delete data.uuid;
    let config = {headers: {Authorization: 'Bearer '+sessionStorage.getItem('jwt')}};
    let url = `${process.env.REACT_APP_ROG_API_URL}/invitations/${invitation.uuid}`;

    axios.patch(url, data, config)
      .catch((error) => {
        let errMessage = 'Error updating invitation';
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
        dispatch(updateInvitationError(errMessage));
      })
  }
}

export function deleteInvitation(invitation_uuid) {
  return (dispatch) => {
    let config = {headers: {Authorization: 'Bearer '+sessionStorage.getItem('jwt')}};
    let url = `${process.env.REACT_APP_ROG_API_URL}/invitations/${invitation_uuid}`;

    axios.delete(url, config)
    .catch((error) => {
      let errMessage = 'Error deleting invitation';
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
      dispatch(deleteInvitationError(errMessage));
    })
  }
}

export function fetchSentCameraGroupInvites(user, camera_groups_uuid) {
  return (dispatch) => {
    dispatch(fetchSentCameraGroupInvitesSuccess(''));
    dispatch(fetchReceivedInProcess(true));
    dispatch(fetchReceivedError(''));

    let url = `${process.env.REACT_APP_ROG_API_URL}/invitations?type=share_group&action=${camera_groups_uuid}`;
    let config = {headers: {Authorization: 'Bearer '+sessionStorage.getItem('jwt')}};

    axios.get(url, config)
    .then(response => {
      dispatch(fetchSentCameraGroupInvitesSuccess(response.data));
    })
    .catch((error) => {
      let errMessage = 'Error fetching recieved invites';
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
      dispatch(fetchReceivedError(errMessage));
    })
    .finally(() => {
      dispatch(fetchReceivedError(''));
      dispatch(fetchReceivedInProcess(false));
    });
  }
}

export function fetchUserCameraGroupInvites(user) {
  return (dispatch) => {
    dispatch(fetchUserCameraGroupInvitesSuccess(''));
    dispatch(fetchReceivedInProcess(true));
    dispatch(fetchReceivedError(''));

    let url = `${process.env.REACT_APP_ROG_API_URL}/invitations?type=share_group&email=${user.email}`;
    let config = {headers: {Authorization: 'Bearer '+sessionStorage.getItem('jwt')}};

    axios.get(url, config)
    .then(response => {
      dispatch(fetchUserCameraGroupInvitesSuccess(response.data));
    })
    .catch((error) => {
      let errMessage = 'Error fetching recieved invites';
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
      dispatch(fetchReceivedError(errMessage));
    })
    .finally(() => {
      dispatch(fetchReceivedError(''));
      dispatch(fetchReceivedInProcess(false));
    });
  }
}

export function acceptInvite(user, invite) {
  return (dispatch) => {
    dispatch(acceptInviteInProcess(true));
    dispatch(acceptInviteError(''));

    let url = `${process.env.REACT_APP_ROG_API_URL}/users/${user.uuid}/camera-groups/${invite.action}/privileges`;
    let config = {headers: {Authorization: 'Bearer '+sessionStorage.getItem('jwt')}};

    axios.post(url, config)
    .then(response => {
      dispatch(acceptInviteSuccess(invite));
      dispatch(fetchCameraGroups(user));
      let cameraGroup = {uuid: invite.action};
      dispatch(selectCameraGroup(user, cameraGroup));
    })
    .catch((error) => {
      let errMessage = 'Error accepting invitation';
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
      dispatch(acceptInviteError(errMessage));
    })
    .finally(() => {
      dispatch(acceptInviteError(''));
      dispatch(acceptInviteInProcess(false));
      dispatch(fetchUserCameraGroupInvites(user));
    });
  }
}

export function rejectInvite(user, invite) {
  return (dispatch) => {
    dispatch(rejectInviteError(''));
    dispatch(rejectInviteInProcess(true));

    let url = `${process.env.REACT_APP_ROG_API_URL}/invitations/${invite.uuid}`;
    let config = {headers: {Authorization: 'Bearer '+sessionStorage.getItem('jwt')}};

    axios.delete(url, config)
    .then(response => {
      dispatch(rejectInviteSuccess(invite));
    })
    .catch((error) => {
      let errMessage = 'Error rejecting invitation';
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
      dispatch(rejectInviteError(errMessage));
    })
    .finally(() => {
      dispatch(rejectInviteError(''));
      dispatch(rejectInviteInProcess(false));
    });
  }
}

export function rescindInvite(user, invite) {
  return (dispatch) => {
    dispatch(rescindInviteError(''));
    dispatch(rescindInviteInProcess(true));

    let url = `${process.env.REACT_APP_ROG_API_URL}/invitations/${invite.uuid}`;
    let config = {headers: {Authorization: 'Bearer '+sessionStorage.getItem('jwt')}};

    axios.delete(url, config)
    .then(response => {
      dispatch(fetchSentCameraGroupInvites(user, invite.action));
    })
    .catch((error) => {
      let errMessage = 'Error rescinding invitation';
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
      dispatch(rescindInviteError(errMessage));
    })
    .finally(() => {
      dispatch(rescindInviteError(''));
      dispatch(rescindInviteInProcess(false));
    });
  }
}
