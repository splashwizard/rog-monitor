import axios from 'axios';
require('promise.prototype.finally').shim();

import initialState from './initialState';

import * as types from './actionTypes';

import { trackEventAnalytics } from "../auth/actions";
import {updatePreviewImage, fetchCameraGroupCameras, fetchSelectedCameraGroupCameras, cameraArmed, cameraConnectionEnabled} from "../cameras/actions";
import { updateUserData } from "../users/actions";
import { locale } from 'moment';
import {isEmpty} from '../helperFunctions';

function fetchInProcess(bool) {
  return {
    type: types.FETCH_CAMERA_GROUPS_IN_PROCESS,
    fetchInProcess: bool
  }
}

function fetchError(error) {
  return {
    type: types.FETCH_CAMERA_GROUPS_ERROR,
    fetchError: error
  }
}

function fetchSuccess(cameraGroups) {
  return {
    type: types.FETCH_CAMERA_GROUPS_SUCCESS,
    cameraGroups
  }
}

function fetchSuccessAdmin(cameraGroupsAdmin) {
  return {
    type: types.FETCH_CAMERA_GROUPS_ADMIN,
    cameraGroupsAdmin
  }
}

function addCameraGroupInProcess(bool) {
  return {
    type: types.ADD_CAMERA_GROUP_IN_PROCESS,
    addCameraGroupInProcess: bool
  }
}

function addCameraGroupError(error) {
  return {
    type: types.ADD_CAMERA_GROUP_ERROR,
    addCameraGroupError: error
  }
}

function addCameraGroupSuccess(bool) {
  return {
    type: types.ADD_CAMERA_GROUP_SUCCESS,
    addCameraGroupSuccess: bool
  }
}

function removeCameraGroupInProcess(bool) {
  return {
    type: types.REMOVE_CAMERA_GROUP_IN_PROCESS,
    removeCameraGroupInProcess: bool
  }
}

function removeCameraGroupError(error) {
  return {
    type: types.REMOVE_CAMERA_GROUP_ERROR,
    removeCameraGroupError: error
  }
}

function removeCameraGroupSuccess(bool) {
  return {
    type: types.REMOVE_CAMERA_GROUP_SUCCESS,
    removeCameraGroupSuccess: bool
  }
}

function addedCameraData(cameraData) {
  return {
    type: types.ADD_CAMERA_DATA,
    cameraData
  }
}

function shareCameraGroupInProcess(bool) {
  return {
    type: types.SHARE_CAMERA_GROUP_IN_PROCESS,
    shareCameraGroupInProcess: bool
  }
}

function shareCameraGroupError(error) {
  return {
    type: types.SHARE_CAMERA_GROUP_ERROR,
    shareCameraGroupError: error
  }
}

function shareCameraGroupSuccess(bool) {
  return {
    type: types.SHARE_CAMERA_GROUP_SUCCESS,
    shareCameraGroupSuccess: bool
  }
}

function editCameraGroupInProcess(bool) {
  return {
    type: types.EDIT_CAMERA_GROUP_IN_PROCESS,
    editCameraGroupInProcess: bool
  }
}

function editCameraGroupSuccess(bool) {
  return {
    type: types.EDIT_CAMERA_GROUP_SUCCESS,
    editCameraGroupSuccess: bool
  }
}

function editCameraGroupError(error) {
  return {
    type: types.EDIT_CAMERA_GROUP_ERROR,
    editCameraGroupError: error
  }
}

function enableCameraGroupInProcess(bool) {
  return {
    type: types.ENABLE_CAMERA_GROUP_IN_PROGRESS,
    enableCameraGroupInProcess: bool
  }
}

function disableCameraGroupInProcess(bool) {
  return {
    type: types.DISABLE_CAMERA_GROUP_IN_PROGRESS,
    disableCameraGroupInProcess: bool
  }
}

function removeGuardInProcess(bool) {
  return {
    type: types.REMOVE_GUARD_IN_PROCESS,
    removeGuardInProcess: bool
  }
}

function removeGuardError(error) {
  return {
    type: types.REMOVE_GUARD_ERROR,
    removeGuardError: error
  }
}

export function cameraGroupSelected(selectedCameraGroup) {
  return {
    type: types.CAMERA_GROUP_SELECTED,
    selectedCameraGroup
  }
}

export function clearCameraGroupData() {
  return {
      type: types.CLEAR_CAMERA_GROUP_DATA,
      cameraGroups: initialState.cameraGroups,
      selectedCameraGroup: initialState.selectedCameraGroup
  }
}

// TODO: change the two functions below to work with the new recos in the API
export function CameraConnection(bool) {
  return {
    type: types.CAMERA_CONNECTION,
    CameraConnection: bool
  }
}

export function CameraConnectionFail(bool, uuid) {
  return {
    type: types.CAMERA_CONNECTION_FAIL,
    CameraConnectionFail: bool,
    CameraConnectionFailUuid: uuid
  }
}

export function selectCameraGroup(user, cameraGroup) {
  return (dispatch) => {
    if (cameraGroup !== undefined){
      dispatch(fetchSelectedCameraGroupCameras(user, cameraGroup));
    }
  }
}

function fetchCameraGroup(user, cameraGroup) {
  return (dispatch) => {
    if (cameraGroup !== undefined){
      dispatch(fetchCameraGroupCameras(user, cameraGroup));
    }
  }
}

export function getUserCameraGroupPrivileges(user, cameraGroup) {
  return (dispatch) => {
    let url = `${process.env.REACT_APP_ROG_API_URL}/users/${user.uuid}/camera-groups/${cameraGroup.uuid}/privileges`;
    let config = {headers: {Authorization: 'Bearer '+sessionStorage.getItem('jwt')}};
    axios.get(url, config)
      .then(response => {
        if (isEmpty(response.data) === false) {
          cameraGroup.userCameraGroupPrivileges = response.data;
        } else {
          cameraGroup.userCameraGroupPrivileges = [];
        }
      })
      .catch(error => {
        console.log(error);
        cameraGroup.userCameraGroupPrivileges = [];
      })
      .finally(() => {
        dispatch(cameraGroupSelected(cameraGroup));
      });
  }
}

export function fetchCameraGroups(user) {
  return (dispatch) => {
    dispatch(fetchInProcess(true));
    dispatch(fetchError(''));
    dispatch(fetchSuccess([]));

    let url = `${process.env.REACT_APP_ROG_API_URL}/users/${user.uuid}/camera-groups`;
    let config = {headers: {Authorization: 'Bearer '+sessionStorage.getItem('jwt')}};

    axios.get(url, config)
      .then(response => {
        if (isEmpty(response.data) === false) {
          dispatch(fetchSuccess(response.data));
          if (!isEmpty(sessionStorage.getItem('selectedCameraGroupUuid'))) {
            for (var i = 0; i < response.data.length; i++) {
              if (sessionStorage.getItem('selectedCameraGroupUuid') === response.data[i].uuid) {
                dispatch(selectCameraGroup(user, response.data[i]));
              } else {
                dispatch(fetchCameraGroup(user, response.data[i]));
              }
            }
          } else {
            dispatch(selectCameraGroup(user, response.data[0]));
            for (var i = 1; i < response.data.length; i++) {
              dispatch(fetchCameraGroup(user, response.data[i]));
            }
          }
        }
      })
      .catch(error => {
        dispatch(fetchError(true));
      })
      .finally(() => {
        dispatch(fetchInProcess(false));
      });
  }
}

export function addNewCameraGroup(user, cameraGroup) {
  return (dispatch) => {
    dispatch(addCameraGroupError(''));
    dispatch(addCameraGroupInProcess(true));

    let url = `${process.env.REACT_APP_ROG_API_URL}/users/${user.uuid}/camera-groups`;
    let config = {headers: {Authorization: 'Bearer '+sessionStorage.getItem('jwt')}};

    let data = {
      camera_group_name: cameraGroup.name.trim()
    };

    axios.post(url, data, config)
      .then((response) => {
        sessionStorage.setItem('selectedCameraGroupUuid', response.data.camera_groups_uuid);
        dispatch(fetchCameraGroups(user));
        dispatch(addCameraGroupSuccess(true));
        response.data.uuid = response.data.camera_groups_uuid;
        delete response.data.camera_groups_uuid;
        dispatch(selectCameraGroup(user, response.data));
      })
      .catch((error) => {
        let errMessage = 'Error creating camera. Please try again later.';
        if (error.response != undefined) {
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
        dispatch(addCameraGroupError(errMessage));
      })
      .finally(() => {
        dispatch(addCameraGroupError(''));
        dispatch(addCameraGroupInProcess(false));
        dispatch(addCameraGroupSuccess(false));
      });
  }
}

export function removeCameraGroup(user, cameraGroup) {
  return (dispatch) => {
    dispatch(removeCameraGroupError(''));
    dispatch(removeCameraGroupInProcess(true));

    let url = `${process.env.REACT_APP_ROG_API_URL}/users/${user.uuid}/camera-groups/${cameraGroup.uuid}`;
    let config = {headers: {Authorization: 'Bearer '+sessionStorage.getItem('jwt')}};

    axios.delete(url, config)
      .then((response) => {
        dispatch(clearCameraGroupData());
        dispatch(removeCameraGroupSuccess(true));
        dispatch(removeCameraGroupSuccess(false));
        dispatch(fetchCameraGroups(user));

      })
      .catch((error) => {
        let errMessage = 'Error removing cameraGroup. Please try again later.';
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
        dispatch(removeCameraGroupError(errMessage));
      })
      .finally(() => {
        dispatch(removeCameraGroupError(''));
        dispatch(removeCameraGroupInProcess(false));
      });
  }
}

export function shareCameraGroup(user, cameraGroupUuid, inviteeEmail) {
  return (dispatch) => {
    let cameraGroup = {uuid: cameraGroupUuid};
    dispatch(shareCameraGroupError(''));
    dispatch(shareCameraGroupInProcess(true));

    let url = `${process.env.REACT_APP_ROG_API_URL}/users/${user.uuid}/camera-groups/${cameraGroupUuid}/invitations`;
    let config = {headers: {Authorization: 'Bearer '+sessionStorage.getItem('jwt')}};

    let data = {
      email: inviteeEmail
    };

    axios.post(url, data, config)
      .then((response) => {
        dispatch(shareCameraGroupSuccess(true));
      })
      .catch((error) => {
        let errMessage = 'Error sharing cameraGroup. Please try again later.';
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
        dispatch(shareCameraGroupError(errMessage));
      })
      .finally(() => {
        dispatch(shareCameraGroupError(''));
        dispatch(shareCameraGroupInProcess(false));
        dispatch(shareCameraGroupSuccess(false));
      });
  }
}

export function enableCameraGroup(user, cameraGroup) {
  return (dispatch) => {
    dispatch(enableCameraGroupInProcess(true));
    let url = `${process.env.REACT_APP_ROG_API_URL}/users/${user.uuid}/camera-groups/${cameraGroup.uuid}/enable`;
    let config = {headers: {Authorization: 'Bearer '+sessionStorage.getItem('jwt')}};
    axios.get(url, config)
    .then(response => {
      for (var i = 0; i < cameraGroup.cameras.length; i++) {
        dispatch(cameraConnectionEnabled(true, cameraGroup.cameras[i].uuid));

      }
    })
    .catch(error => {
      let errMessage = 'Error connecting camera group';
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
      console.log(errMessage);
    })
    .finally(()=>{
      dispatch(enableCameraGroupInProcess(false));
      dispatch(fetchCameraGroups(user));
      dispatch(selectCameraGroup(user, cameraGroup));
    })
  }
}

export function disableCameraGroup(user, cameraGroup) {
  return (dispatch) => {
    dispatch(disableCameraGroupInProcess(true));
    let url = `${process.env.REACT_APP_ROG_API_URL}/users/${user.uuid}/camera-groups/${cameraGroup.uuid}/disable`;
    let config = {headers: {Authorization: 'Bearer '+sessionStorage.getItem('jwt')}};
    axios.get(url, config)
    .then(response => {
      for (var i = 0; i < cameraGroup.cameras.length; i++) {
        dispatch(cameraConnectionEnabled(false, cameraGroup.cameras[i].uuid));
      }
    })
    .catch(error => {
      let errMessage = 'Error disconnecting camera group';
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
      console.log(errMessage);
    })
    .finally(()=>{
      dispatch(disableCameraGroupInProcess(false));
      dispatch(fetchCameraGroups(user));
      dispatch(selectCameraGroup(user, cameraGroup));
    })
  }
}

export function removeUserCameraGroupPrivilege(user, cameraGroupUuid, cameraGroupPrivilegeUuid, cameraGroupPrivilege=null) {
  return (dispatch) => {
    let user_uuid = null;
    if (cameraGroupPrivilege !== null) {
      user_uuid = cameraGroupPrivilege.users_uuid;
    } else {
      user_uuid = user.uuid;
    }
    let cameraGroup = {uuid: cameraGroupUuid};
    dispatch(removeGuardError(''));
    dispatch(removeGuardInProcess(true));

    let url = `${process.env.REACT_APP_ROG_API_URL}/users/${user_uuid}/camera-groups/${cameraGroupUuid}/privileges/${cameraGroupPrivilegeUuid}`;
    let config = {headers: {Authorization: 'Bearer '+sessionStorage.getItem('jwt')}};

    axios.delete(url, config)
    .then(response => {
      dispatch(fetchCameraGroups(user));
      dispatch(selectCameraGroup(user, cameraGroup));
    })
    .catch((error) => {
      let errMessage = 'Error removing user';
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
      dispatch(removeGuardError(errMessage));
    })
    .finally(() => {
      dispatch(removeGuardError(''));
      dispatch(removeGuardInProcess(false));
    });
  }
}

export function editCameraGroup(user, cameraGroup, cameraGroupData) {
  return (dispatch) => {
    dispatch(editCameraGroupError(''));
    dispatch(editCameraGroupInProcess(true));

    let url = `${process.env.REACT_APP_ROG_API_URL}/users/${user.uuid}/camera-groups/${cameraGroup.uuid}`;
    let config = {headers: {Authorization: 'Bearer '+sessionStorage.getItem('jwt')}};

    axios.patch(url, cameraGroupData, config)
      .then((response) => {
        cameraGroup.name = cameraGroupData.name;
        cameraGroup.away_mode = cameraGroupData.away_mode;
        cameraGroup.armed = cameraGroupData.armed;
        cameraGroup.tag_options = cameraGroupData.tag_options;
        dispatch(fetchCameraGroups(user));
        dispatch(selectCameraGroup(user, cameraGroup));
        dispatch(editCameraGroupSuccess(true));
        dispatch(editCameraGroupSuccess(false));
      })
      .catch((error) => {
        let errMessage = 'Error editing camera group. Please try again later.';
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
        dispatch(editCameraGroupError(errMessage));
      })
      .finally(() => {
        dispatch(editCameraGroupError(''));
        dispatch(editCameraGroupInProcess(false));
      });
  }
}

export function createCameraGroupAdmin(user) {
  return (dispatch) => {
    let url = `${process.env.REACT_APP_ROG_API_URL}/users/${user.user_uuid}/camera-groups`;
    let config = {headers: {Authorization: 'Bearer '+sessionStorage.getItem('jwt')}};
    let data = {};

    axios.post(url, data, config)
    .then((response) => {
      dispatch(readAllCameraGroupsForUser(user));
    })
    .catch((error) => {
      let errMessage = 'Error creating camera group. Please try again later.';
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
      dispatch(editCameraGroupError(errMessage));
      dispatch(readAllCameraGroupsForUser(user));
    })
  }
}

export function readAllCameraGroupsForUser(user) {
  return (dispatch) => {
    dispatch(fetchSuccessAdmin([]));
    dispatch(editCameraGroupError(""));
    let url = `${process.env.REACT_APP_ROG_API_URL}/users/${user.user_uuid}/camera-groups`;
    let config = {headers: {Authorization: 'Bearer '+sessionStorage.getItem('jwt')}};

    axios.get(url, config)
    .then((response) => {
      if (!isEmpty(response.data)) {
        dispatch(fetchSuccessAdmin(response.data));
        dispatch(updateUserData(user));
      } else if (isEmpty(response.data)) {
        dispatch(editCameraGroupError("No camera groups found."));
      }
    })
    .catch((error) => {
      let errMessage = 'Error fetching camera groups. Please try again later.';
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
      dispatch(editCameraGroupError(errMessage));
    })
  }
}

export function updateCameraGroup(user, values) {
  return (dispatch) => {
    let url = `${process.env.REACT_APP_ROG_API_URL}/users/${user.user_uuid}/camera-groups/${values.uuid}`;
    let config = {headers: {Authorization: 'Bearer '+sessionStorage.getItem('jwt')}};
    let away_mode = 0;
    if (values.away_mode == "true" || values.away_mode == true) {
      away_mode = 1;
    }
    let data = {
      name: values.name,
      away_mode: away_mode
    };

    axios.patch(url, data, config)
    .then((response) => {
      dispatch(readAllCameraGroupsForUser(user));
    })
    .catch((error) => {
      let errMessage = 'Error updating camera group. Please try again later.';
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
      dispatch(editCameraGroupError(errMessage));
      dispatch(readAllCameraGroupsForUser(user));
    })
  }
}

export function deleteCameraGroup(user, values) {
  return (dispatch) => {
    let url = `${process.env.REACT_APP_ROG_API_URL}/users/${user.user_uuid}/camera-groups/${values.uuid}`;
    let config = {headers: {Authorization: 'Bearer '+sessionStorage.getItem('jwt')}};

    axios.delete(url, config)
    .then((response) => {
      dispatch(readAllCameraGroupsForUser(user));
    })
    .catch((error) => {
      let errMessage = 'Error deleting camera group. Please try again later.';
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
      dispatch(editCameraGroupError(errMessage));
      dispatch(readAllCameraGroupsForUser(user));
    })
  }
}
