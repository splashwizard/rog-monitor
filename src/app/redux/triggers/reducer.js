import initialState from './initialState';
import * as types from './actionTypes';

const triggers = (state = initialState, action) => {
  if (typeof action !== 'undefined') {
    switch (action.type) {
      case types.FETCH_TRIGGERS_SUCCESS:
        return {
          ...state,
          triggers: action.triggers
        }

      case types.FETCH_TRIGGERS_IN_PROCESS:
        return {
          ...state,
          fetchInProcess: action.bool
        }

      case types.FETCH_TRIGGERS_ERROR:
        return {
          ...state,
          fetchError: action.fetchError
        }

      case types.NEW_TRIGGER:
        if (state.newTriggers.filter(trigger => trigger.uuid).includes(action.trigger.uuid)) {
          return state;
        }
        else {
          return {
            ...state,
            newTriggers: [action.trigger, ...state.newTriggers]
          }
        }

      case types.MERGE_NEW_TRIGGERS:
        return {
          ...state,
          triggers: [...state.newTriggers, ...state.triggers],
          newTriggers: []
        }

      case types.CLEAR_TRIGGER_DATA:
        return {
          ...state,
          triggers: action.triggers,
          newTriggers: action.newTriggers,
          channels: action.channels
        }

      case types.CHANNEL_CONNECTED:
        return {
          ...state,
          channels: [...state.channels, action.channel]
        }

      case types.DELETE_TRIGGER_IN_PROCESS:
        return {
          ...state,
          deleteInProcess: action.bool
        }

      case types.DELETE_TRIGGER_ERROR:
        return {
          ...state,
          deleteError: action.deleteError
        }

      case types.DELETE_TRIGGER_SUCCESS:
        return {
          ...state,
          triggers: state.triggers.filter(trigger => trigger.uuid != action.triggerUuid)
        }

      case types.CREATE_TRIGGER_TIME_WINDOW_IN_PROCESS:
        return {
          ...state,
          createTriggerTimeWindowInProcess: action.bool
        }

      case types.CREATE_TRIGGER_TIME_WINDOW_SUCCESS:
        return {
          ...state,
          createTriggerTimeWindowSuccess: action.bool
        }

      case types.CREATE_TRIGGER_TIME_WINDOW_ERROR:
        return {
          ...state,
          createTriggerTimeWindowError: action.bool
        }

      case types.UPDATE_TRIGGER_TIME_WINDOW_IN_PROCESS:
        return {
          ...state,
          updateTriggerTimeWindowInProcess: action.bool
        }

      case types.UPDATE_TRIGGER_TIME_WINDOW_SUCCESS:
        return {
          ...state,
          updateTriggerTimeWindowSuccess: action.bool
        }

      case types.DELETE_TRIGGER_TIME_WINDOW_IN_PROCESS:
        return {
          ...state,
          deleteTriggerTimeWindowInProcess: action.bool
        }

      case types.DELETE_TRIGGER_TIME_WINDOW_SUCCESS:
        return {
          ...state,
          deleteTriggerTimeWindowSuccess: action.bool
        }

      case types.CLEAR_ALL_TRIGGERS:
        return {
          ...state,
          triggers: []
        }

      case types.CREATE_TRIGGER_ERROR:
        return {
          ...state,
          createTriggerError:action.createTriggerError
        }

      case types.CREATE_TRIGGER_SUCCESS:
        return {
          ...state,
          createTriggerSuccess:action.createTriggerSuccess
        }
      case types.CREATE_TRIGGER_IN_PROCESS:
        return {
          ...state,
          createTriggerInProcess: action.bool
        }
      case types.FETCH_POLYGON_TRIGGER_SUCCESS:
        return {
          ...state,
          polygonData: action.polygonData
        }
      case types.FETCH_POLYGON_TRIGGER_SUCCESS_ADMIN:
        return {
          ...state,
          polygonDataAdmin: action.polygonDataAdmin
        }
      case types.FETCH_POLYGON_TRIGGER_ERROR_ADMIN:
        return {
          ...state,
          fetchTriggerErrorAdmin: action.fetchTriggerErrorAdmin
        }
      case types.FETCH_POLYGON_TRIGGER_IN_SUCCESS:
        return {
          ...state,
          fetchTriggerSuccess: action.bool
        }
      case types.DELETE_POLYGON_TRIGGER_SUCCESS:
        return {
          ...state,
          deleteTriggerSuccess: action.bool
        }
      case types.DELETE_POLYGON_TRIGGER_IN_PROCESS:
        return {
          ...state,
          deleteTriggerInProcess: action.bool
        }
      case types.FETCH_POLYGON_TRIGGER_IN_PROCESS:
        return {
          ...state,
          fetchPolygonTriggerInProcess: action.bool
        }
      case types.UPDATE_TRIGGER_TIME_WINDOWS_DATA:
        return {
          ...state,
          triggerTimeWindows: action.triggerTimeWindows
        }
      default:
        return state;
    }
  } else {
    return state
  }
}

export default triggers;
