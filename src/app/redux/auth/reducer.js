import initialState from './initialState';
import * as types from './actionTypes';

const auth = (state = initialState, action) => {
  if (typeof action !== 'undefined') {
    switch (action.type) {
      case types.LOGIN_MISSING:
        return {
          ...state,
          user: action.user
        }
      case types.LOGIN_SUCCESS:
        return {
          ...state,
          user: action.user
        }
      case types.REGISTER_IN_PROCESS:
        return {
          ...state,
          registerInProcess: action.registerInProcess
        }
      case types.REGISTER_ERROR:
        return {
          ...state,
          registerError: action.registerError
        }
      case types.REGISTER_SUCCESS:
        return {
          ...state,
          registerSuccess: true
        }
      case types.RESET_REGISTER_SUCCESS:
        return {
          ...state,
          registerSuccess: false
        }
      case types.RESET_PASSWORD_IN_PROCESS:
        return {
          ...state,
          resetPasswordInProcess: action.resetPasswordInProcess
        }
      case types.RESET_PASSWORD_ERROR:
        return {
          ...state,
          resetPasswordError: action.resetPasswordError
        }
      case types.RESET_PASSWORD_SUCCESS:
        return {
          ...state,
          resetPasswordSuccess: true
        }
      case types.RESET_RESET_PASSWORD_SUCCESS:
        return {
          ...state,
          resetPasswordSuccess: false
        }
      case types.LOGIN_IN_PROCESS:
        return {
          ...state,
          loginInProcess: action.loginInProcess
        }
      case types.LOGIN_ERROR:
        return {
          ...state,
          loginError: action.loginError
        }
      case types.LOGOUT_SUCCESS:
        return {
          ...state,
          user: action.user
        }
      case types.SEND_INVITATION_IN_PROCESS:
        return {
          ...state,
          sendInvitationInProcess: action.sendInvitationInProcess
        }
      case types.SEND_INVITATION_SUCCESS:
        return {
          ...state,
          sendInvitationSuccess: action.sendInvitationSuccess
        }
      case types.SEND_INVITATION_ERROR:
        return {
          ...state,
          sendInvitationError: action.sendInvitationError
        }
      case types.GET_INVITATION_IN_PROCESS:
        return {
          ...state,
          getInvitationInProcess: action.getInvitationInProcess
        }
      case types.GET_INVITATION_SUCCESS:
        return {
          ...state,
          invitation: action.invitation
        }
      case types.GET_INVITATION_ERROR:
        return {
          ...state,
          getInvitationError: action.getInvitationError
        }
      case types.SEND_PASSWORD_RESET_REQUEST_IN_PROCESS:
        return {
          ...state,
          sendPasswordResetRequestInProcess: action.sendPasswordResetRequestInProcess
        }
      case types.SEND_PASSWORD_RESET_REQUEST_SUCCESS:
        return {
          ...state,
          sendPasswordResetRequestSuccess: action.sendPasswordResetRequestSuccess
        }
      case types.SEND_PASSWORD_RESET_REQUEST_ERROR:
        return {
          ...state,
          sendPasswordResetRequestError: action.sendPasswordResetRequestError
        }
      case types.GET_PASSWORD_RESET_REQUEST_IN_PROCESS:
        return {
          ...state,
          getPasswordResetRequestInProcess: action.getPasswordResetRequestInProcess
        }
      case types.GET_PASSWORD_RESET_REQUEST_SUCCESS:
        return {
          ...state,
          request: action.request
        }
      case types.GET_PASSWORD_RESET_REQUEST_ERROR:
        return {
          ...state,
          getPasswordResetRequestError: action.getPasswordResetRequestError
        }

      case types.TOGGLE_MUTE:
        const newState = {...state}
        newState.user.mute = action.mute
        return newState

      case types.GENERATE_OTP_SUCCESS:
        return {
          ...state,
          generateOTPSuccess: action.generateOTPSuccess,
          generatedOTP: action.generatedOTP
        }

      case types.GENERATE_OTP_ERROR:
        return {
          ...state,
          generateOTPError: action.generateOTPError
        }

      default:
        return state
    }
  } else {
    return state
  }
}

export default auth;
