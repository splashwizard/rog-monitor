import initialState from './initialState';
import * as types from './actionTypes';

const cameraGroups = (state = initialState, action) => {
  if (typeof action !== 'undefined') {
    switch (action.type) {
      case types.FETCH_CAMERA_GROUPS_SUCCESS:
        return {
          ...state,
          cameraGroups: action.cameraGroups,
          selectedCameraGroup: action.cameraGroups.find(cameraGroup => cameraGroup.uuid === state.selectedCameraGroup.uuid) || state.selectedCameraGroup
        }

      case types.FETCH_CAMERA_GROUPS_ADMIN:
        return {
          ...state,
          cameraGroupsAdmin: action.cameraGroupsAdmin
        }

      case types.FETCH_CAMERA_GROUPS_IN_PROCESS:
        return {
          ...state,
          fetchInProcess: action.bool
        }

      case types.FETCH_CAMERA_GROUPS_ERROR:
        return {
          ...state,
          fetchError: action.bool
        }

      case types.CAMERA_GROUP_SELECTED:
        return {
          ...state,
          selectedCameraGroup: action.selectedCameraGroup
        }

      case types.CLEAR_CAMERA_GROUP_DATA:
        return {
          ...state,
          cameraGroups: action.cameraGroups,
          selectedCameraGroup: action.selectedCameraGroup
        }

      case types.ADD_CAMERA_GROUP_ERROR:
        return {
          ...state,
          addCameraGroupError: action.addCameraGroupError
        }

      case types.ADD_CAMERA_GROUP_IN_PROCESS:
        return {
          ...state,
          addCameraGroupInProcess: action.addCameraGroupInProcess
        }

      case types.ADD_CAMERA_GROUP_SUCCESS:
        return {
          ...state,
          addCameraGroupSuccess: action.addCameraGroupSuccess
        }

        case types.REMOVE_CAMERA_GROUP_ERROR:
          return {
            ...state,
            removeCameraGroupError: action.removeCameraGroupError
          }

        case types.REMOVE_CAMERA_GROUP_IN_PROCESS:
          return {
            ...state,
            removeCameraGroupInProcess: action.removeCameraGroupInProcess
          }

        case types.REMOVE_CAMERA_GROUP_SUCCESS:
          return {
            ...state,
            removeCameraGroupSuccess: action.removeCameraGroupSuccess
          }

      case types.SHARE_CAMERA_GROUP_IN_PROCESS:
        return {
          ...state,
          shareCameraGroupInProcess: action.shareCameraGroupInProcess
        }

      case types.SHARE_CAMERA_GROUP_ERROR:
        return {
          ...state,
          shareCameraGroupError: action.shareCameraGroupError
        }

      case types.SHARE_CAMERA_GROUP_SUCCESS:
        return {
          ...state,
          shareCameraGroupSuccess: action.shareCameraGroupSuccess
        }

      case types.EDIT_CAMERA_GROUP_IN_PROCESS:
        return {
          ...state,
          editCameraGroupInProcess: action.editCameraGroupInProcess
        }

      case types.EDIT_CAMERA_GROUP_SUCCESS:
        return {
          ...state,
          editCameraGroupSuccess: action.editCameraGroupSuccess
        }

      case types.EDIT_CAMERA_GROUP_ERROR:
        return {
          ...state,
          editCameraGroupError: action.editCameraGroupError
        }

      case types.ENABLE_CAMERA_GROUP_IN_PROGRESS:
        return {
          ...state,
          enableCameraGroupInProcess: action.enableCameraGroupInProcess
        }

      case types.DISABLE_CAMERA_GROUP_IN_PROGRESS:
        return {
          ...state,
          disableCameraGroupInProcess: action.disableCameraGroupInProcess
        }

      case types.REMOVE_GUARD_IN_PROCESS:
        return {
          ...state,
          removeGuardInProcess: action.removeGuardInProcess
        }

      case types.REMOVE_GUARD_ERROR:
        return {
          ...state,
          removeGuardError: action.removeGuardError
        }

      case types.ADD_CAMERA_DATA:
        return {
          ...state,
          addedCameraData: action.cameraData
        }

      case types.CAMERA_CONNECTION:
        return {
          ...state,
          cameraConnection: action.cameraConnection
        }

        case types.CAMERA_CONNECTION_FAIL:
          return {
            ...state,
            cameraConnectionFail: action.cameraConnectionFail,
            cameraConnectionFailUuid: action.cameraConnectionFailUuid
          }

      default:
        return state;
    }
  } else {
    return state
  }
}

export default cameraGroups;
