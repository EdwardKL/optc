import * as ActionTypes from '../constants/constants';
import fetch from 'isomorphic-fetch';
import { combineReducers } from 'redux';

const baseURL = typeof window === 'undefined' ? process.env.BASE_URL || (`http://localhost:${(process.env.PORT || 8000)}`) : '';

const friendFinder = (state = {}, action) => {
  switch (action.type) {
    case ActionTypes.FIND_FRIENDS :
      var results = [];
      for (var i = 0; i < action.friend_search_results.length; i++) {
        results.push({
          current_level: action.friend_search_results[i].current_level,
          current_special_level: action.friend_search_results[i].current_special_level,
          user: action.friend_search_results[i]._user
        });
      }
      return {
        ...state,
        friend_search_results: results
      };
    default:
      return state;
  }
};

const account = (state = {}, action) => {
  switch (action.type) {
    case ActionTypes.FIND_ACCOUNTS:
      return {
        ...state,
        user: action.results,
      };
    default:
      return state;
  }
};

const identity = (state = {}, action) => {
  return state;
};

const reducers = combineReducers({ friendFinder, account, identity });
export default reducers;