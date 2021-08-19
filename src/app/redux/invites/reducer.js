import initialState from './initialState';
import * as types from './actionTypes';

const invites = (state = initialState, action) => {
  if (typeof action !== 'undefined') {
    switch (action.type) {
      case types.FETCH_RECEIVED_SUCCESS:
        return {
          ...state,
          cameraGroupInvites: action.cameraGroupInvites
        }

      case types.FETCH_RECEIVED_IN_PROCESS:
        return {
          ...state,
          fetchReceivedInProcess: action.bool
        }

      case types.FETCH_RECEIVED_ERROR:
        return {
          ...state,
          fetchReceivedError: action.fetchReceivedError
        }

      case types.UPDATE_INVITATION_ERROR:
        return {
          ...state,
          updateInvitationError: action.updateInvitationError
        }

      case types.DELETE_INVITATION_ERROR:
        return {
          ...state,
          deleteInvitationError: action.deleteInvitationdError
        }

      case types.FETCH_SENT_SUCCESS:
        return {
          ...state,
          sentInvites: action.sentInvites
        }

      case types.FETCH_SENT_IN_PROCESS:
        return {
          ...state,
          fetchSentInProcess: action.bool
        }

      case types.FETCH_SENT_ERROR:
        return {
          ...state,
          fetchSentError: action.fetchSentError
        }

      case types.ACCEPT_INVITE_IN_PROCESS:
        return {
          ...state,
          acceptInviteInProcess: action.acceptInviteInProcess
        }

      case types.ACCEPT_INVITE_SUCCESS:
        return {
          ...state,
          cameraGroupInvites: state.cameraGroupInvites.filter(invite => invite.uuid !== action.invite.uuid)
        }

      case types.ACCEPT_INVITE_ERROR:
        return {
          ...state,
          acceptInviteError: action.acceptInviteError
        }

      case types.REJECT_INVITE_IN_PROCESS:
        return {
          ...state,
          rejectInviteInProcess: action.rejectInviteInProcess
        }

      case types.REJECT_INVITE_SUCCESS:
        return {
          ...state,
          cameraGroupInvites: state.cameraGroupInvites.filter(invite => invite.uuid !== action.invite.uuid)
        }

      case types.REJECT_INVITE_ERROR:
        return {
          ...state,
          rejectInviteError: action.rejectInviteError
        }

      case types.RESCIND_INVITE_IN_PROCESS:
        return {
          ...state,
          rescindInviteInProcess: action.rescindInviteInProcess
        }

      case types.RESCIND_INVITE_ERROR:
        return {
          ...state,
          rescindInviteError: action.rescindInviteError
        }

      case types.CLEAR_INVITES_DATA:
        return {
          ...state,
          cameraGroupInvites: action.cameraGroupInvites,
          sentInvites: action.sentInvites
        }

      case types.FETCH_INVITES_SUCCESS:
        return {
          ...state,
          invites: action.invites
        }

      default:
        return state;
    }
  } else {
    return state
  }
}

export default invites;
