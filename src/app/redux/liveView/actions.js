import axios from 'axios';
import initialState from './initialState';
import * as types from './actionTypes';

function readLiveViewsSuccess(liveViews) {
  return {
    type: types.READ_LIVE_VIEWS_SUCCESS,
    liveViews: liveViews
  }
}

export function readLiveViews() {
  return (dispatch) => {
    let url = `${process.env.REACT_APP_ROG_API_URL}/read_url_status`;
    let config = {headers: {Authorization: 'Bearer '+sessionStorage.getItem('jwt')}};

    axios.get(url, config)
    .then(response => {
      console.log(response);
      dispatch(readLiveViewsSuccess(response.data));
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
      throw(errMessage);
    })
  }
}
