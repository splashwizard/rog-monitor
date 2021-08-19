import initialState from './initialState';
import * as types from './actionTypes';

const cameras = (state = initialState, action) => {
  if (typeof action !== 'undefined') {
    switch (action.type) {
      case types.FETCH_CAMERA_AUTH_RTSP_URL_SUCCESS:
        return {
          ...state,
          authRtspUrl: action.authRtspUrl
        }

      case types.FETCH_CAMERA_AUTH_RTSP_URL_IN_PROCESS:
        return {
          ...state,
          fetchInProcess: action.fetchInProcess
        }

      case types.FETCH_CAMERA_AUTH_RTSP_URL_ERROR:
        return {
          ...state,
          fetchError: action.fetchError
        }

      case types.CLEAR_CAMERA_DATA:
          return {
            ...state,
            authRtspUrl: action.authRtspUrl,
          }

      case types.ADD_CAMERA_ERROR:
        return {
          ...state,
          addCameraError: action.addCameraError
        }

      case types.ADD_CAMERA_IN_PROCESS:
        return {
          ...state,
          addCameraInProcess: action.addCameraInProcess
        }

      case types.ADD_CAMERA_SUCCESS:
        return {
          ...state,
          addCameraSuccess: action.addCameraSuccess
        }

      case types.DELETE_CAMERA_ERROR:
          return {
            ...state,
            deleteCameraError: action.deleteCameraError
          }

      case types.DELETE_CAMERA_IN_PROCESS:
          return {
            ...state,
            deleteCameraInProcess: action.deleteCameraInProcess
          }

      case types.DELETE_CAMERA_SUCCESS:
          return {
            ...state,
            deleteCameraSuccess: action.deleteCameraSuccess
          }

      case types.REFRESH_CAMERA_IMAGE:
        return {
          ...state,
          refreshCameraUuid: action.refreshCameraUuid,
          refreshCameraImage: action.refreshCameraImage
        }

      case types.IMAGE_UPDATE_IN_PROGRESS:
        return{
          ...state,
          imageUpdateInProgress: action.imageUpdateInProgress,
          imageUpdateInProgressUuid: action.imageUpdateInProgressUuid
        }

      case types.REFRESH_CAMERA_ERROR:
        return{
          ...state,
          refreshCameraError: action.refreshCameraError,
          refreshCameraErrorUuid: action.refreshCameraErrorUuid
        }

      case types.IMAGE_UPDATE_SUCCESS:
        return{
          ...state,
          imageUpdateSuccess: action.imageUpdateSuccess,
          imageUpdateSuccessUuid: action.imageUpdateSuccessUuid
        }

      case types.EDIT_CAMERA_IN_PROCESS:
        return{
          ...state,
          editCameraInProcess: action.editCameraInProcess
        }

      case types.EDIT_CAMERA_SUCCESS:
        return {
          ...state,
          editCameraSuccess: action.editCameraSuccess
        }

      case types.EDIT_CAMERA_ERROR:
        return {
          ...state,
          editCameraError: action.editCameraError
        }

      case types.EDIT_URL_IN_PROCESS:
        return{
          ...state,
          editUrlInProcess: action.editUrlInProcess
        }

      case types.EDIT_URL_SUCCESS:
        return {
          ...state,
          editUrlSuccess: action.editUrlSuccess
        }

      case types.EDIT_URL_ERROR:
        return {
          ...state,
          editUrlError: action.editUrlError
        }

      case types.READ_URLS_SUCCESS_ADMIN:
        return {
          ...state,
          urlsAdmin: action.urlsAdmin
        }

      case types.UPDATE_CAMERA:
        return {
          ...state,
          name: action.name,
          rtspUrl: action.rtspUrl,
          username: action.username
        }

      case types.CAMERA_CONNECTION_ENABLED:
        return {
          ...state,
          cameraConnectionEnabled: action.cameraConnectionEnabled,
          cameraConnectionUuid: action.cameraConnectionUuid
        }

      case types.CAMERA_ARMED:
        return {
          ...state,
          cameraArmed: action.cameraArmed,
          cameraArmedUuid: action.cameraArmedUuid
        }

      case types.CAMERA_CONNECTION_VERIFIED:
        return {
          ...state,
          cameraConnectionVerified: action.cameraConnectionVerified,
          cameraConnectionVerifiedUuid: action.cameraConnectionVerifiedUuid
        }

      case types.UPDATE_ALERT_TIME_WINDOWS_DATA:
        return {
          ...state,
          alert_windows: action.alert_windows
        }

      case types.FETCH_SUCCESS_ADMIN:
        return {
          ...state,
          camerasAdmin: action.camerasAdmin
        }

      case types.READ_ALL_INTEGRATION_TEMPLATES_SUCCESS:
        return {
          ...state,
          integrationList: action.integrationList
        }

      case types.READ_ALL_INTEGRATION_TEMPLATES_ERROR:
        return {
          ...state,
          readAllIntegrationTemplatesError: action.readAllIntegrationTemplatesError
        }

      default:
        return state;
    }
  } else {
    return state
  }
}

export default cameras;
