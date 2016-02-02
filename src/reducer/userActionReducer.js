import { USER_REQUEST,USER_SUCCESS,USER_FAILURE } from '../actions/userAction';


const defaultState = {
  user:{},
  loading: false,
};

export default function userReducer(state=defaultState, action) {
  switch (action.type) {
    case USER_REQUEST:
      return Object.assign({}, state, {
        loading: true
      });
    case USER_SUCCESS:
    console.log(action.user);
      return Object.assign({}, state, {
        loading: false,
        status:'success',
        user:action.user.member,
        rentCount:action.user.rentCount,
      });
    case USER_FAILURE:
      return Object.assign({}, state, {
        loading: false,
        status:action.err,
      });
    default:
      return state;
  }
};