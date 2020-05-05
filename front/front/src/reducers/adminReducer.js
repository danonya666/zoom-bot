import {
    USERS_FETCHED
} from "../actions/admin";

const initialState = {
  batch: null,
  batchList: [],
  userList: [],
  willbangLength: 0,
  hideEmptyBatches: (localStorage.getItem('hideEmptyLessons') || 'show') === 'hide',
};

export default function (state = initialState, action) {
  switch (action.type) {
    case USERS_FETCHED:
      return {
        ...state,
        userList: action.data,
      };

    default:
      return state;
  }
}