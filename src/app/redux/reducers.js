import { combineReducers } from 'redux';

import auth from './auth/reducer';
import alerts from './alerts/reducer';
import cameraGroups from './cameraGroups/reducer';
import cameras from './cameras/reducer';
import invites from './invites/reducer';
import users from './users/reducer';
import triggers from './triggers/reducer';
import systemConfigurations from './systemConfiguration/reducer';
import liveView from './liveView/reducer';
import recos from './recos/reducer';
import recoConnectivityLogs from './recoConnectivityLogs/reducer';

export default combineReducers({
  auth,
  alerts,
  cameraGroups,
  cameras,
  invites,
  users,
  triggers,
  systemConfigurations,
  liveView,
  recos,
  recoConnectivityLogs
});
