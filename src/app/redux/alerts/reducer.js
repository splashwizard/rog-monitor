import initialState from './initialState';
import * as types from './actionTypes';

const alerts = (state = initialState, action) => {
  if (typeof action !== 'undefined') {
    switch (action.type) {
      case types.FETCH_ALERTS_SUCCESS:
        return {
          ...state,
          alerts: action.alerts
        }

      case types.FETCH_ALERTS_SUCCESS_WITH_PAGINATION:
        return {
          ...state,
          alerts: action.alerts,
          pagination: action.pagination
        }

      case types.UPDATE_SELECTED_FILTER_TYPE:
        return {
          ...state,
          selectedFilterType: action.selectedFilterType
        }

      case types.FETCH_ALERTS_IN_PROCESS:
        return {
          ...state,
          fetchInProcess: action.fetchInProcess
        }

      case types.FETCH_ALERTS_ERROR:
        return {
          ...state,
          fetchError: action.fetchError
        }

      case types.NEW_ALERT:
        if (state.newAlerts.filter(alert => alert.uuid).includes(action.alert.uuid)) {
          return state;
        }
        else {
          return {
            ...state,
            newAlerts: [action.alert, ...state.newAlerts]
          }
        }

      case types.MERGE_NEW_ALERTS:
        return {
          ...state,
          alerts: [...state.newAlerts, ...state.alerts],
          newAlerts: []
        }

      case types.CLEAR_ALERT_DATA:
        return {
          ...state,
          alerts: action.alerts,
          newAlerts: action.newAlerts,
          channels: action.channels
        }

      case types.CHANNEL_CONNECTED:
        return {
          ...state,
          channels: [...state.channels, action.channel]
        }

      case types.DELETE_ALERT_IN_PROCESS:
        return {
          ...state,
          deleteInProcess: action.bool
        }

      case types.DELETE_ALERT_ERROR:
        return {
          ...state,
          deleteError: action.deleteError
        }

      case types.DELETE_ALERT_SUCCESS:
        return {
          ...state,
          alerts: state.alerts.filter(alert => alert.uuid != action.alertUuid)
        }

      case types.CLEAR_ALL_NEW_ALERTS:
        return {
          ...state,
          newAlerts: []
        }

      case types.UPDATE_NEW_ALERT_COUNT:
        return {
          ...state,
          newAlertCount: action.newAlertCount
        }

      case types.CREATE_ALERT_ERROR:
        return {
          ...state,
          createAlertError:action.createAlertError
        }

      case types.CREATE_ALERT_SUCCESS:
        return {
          ...state,
          createAlertSuccess:action.createAlertSuccess
        }
      case types.CREATE_ALERT_IN_PROCESS:
        return {
          ...state,
          createAlertInProcess: action.bool
        }
      case types.FETCH_POLYGON_ALERT_SUCCESS:
        return {
          ...state,
          polygonData: action.polygonData
        }
      case types.FETCH_POLYGON_ALERT_IN_SUCCESS:
        return {
          ...state,
          fetchAlertSuccess: action.bool
        }
      case types.DELETE_POLYGON_ALERT_SUCCESS:
        return {
          ...state,
          deleteAlertSuccess: action.bool
        }
      case types.DELETE_POLYGON_ALERT_IN_PROCESS:
        return {
          ...state,
          deleteAlertInProcess: action.bool
        }
      case types.FETCH_POLYGON_ALERT_IN_PROCESS:
        return {
          ...state,
          fetchPolygonAlertInProcess: action.bool
        }
      case types.SHARE_ALERT_ERROR:
        return {
          ...state,
          shareAlertError: action.shareAlertError,
          shareAlertErrorUuid: action.shareAlertErrorUuid
        }
      case types.SHARE_ALERT_SUCCESS:
        return {
          ...state,
          shareAlertSuccess: action.shareAlertSuccess,
          shareAlertSuccessUuid: action.shareAlertSuccessUuid
        }
      case types.SHARE_ALERT_IN_PROCESS:
        return {
          ...state,
          shareAlertInProcess: action.shareAlertInProcess,
          shareAlertInProcessUuid: action.shareAlertInProcessUuid
        }
      case types.UPDATE_ALERT_TAGS_IN_PROCESS:
        return {
          ...state,
          updateAlertTagsInProcess: action.updateAlertTagsInProcess,
          updateAlertTagsInProcessUuid: action.updateAlertTagsInProcessUuid
        }
      case types.UPDATE_ALERT_TAGS_ERROR:
        return {
          ...state,
          updateAlertTagsError: action.updateAlertTagsError,
          updateAlertTagsErrorUuid: action.updateAlertTagsErrorUuid
        }
      case types.UPDATE_ALERT_TAGS_SUCCESS:
        return {
          ...state,
          tags: action.tags,
          updateAlertTagsSuccessUuid: action.updateAlertTagsSuccessUuid
        }
      default:
        return state;
    }
  } else {
    return state
  }
}

export default alerts;
