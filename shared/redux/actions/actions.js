import * as ActionTypes from '../constants/constants';
import fetch from 'isomorphic-fetch';

const baseURL = typeof window === 'undefined' ? process.env.BASE_URL || (`http://localhost:${(process.env.PORT || 8000)}`) : '';

export function addFriendFinderResults(friend_search_results) {
  return {
    type: ActionTypes.FIND_FRIENDS,
    friend_search_results,
  };
}

export function addAccountResults(results) {
  return {
    type: ActionTypes.FIND_ACCOUNTS,
    results,
  };
}

export function fetchQuery(query) {
  return (dispatch) => {
    return fetch(`${baseURL}/friend_finder/api/${query}`, {
      method: 'get',
      headers: new Headers({
        'Content-Type': 'application/json',
      }),
    }).then((response) => response.json())
      .then(results => dispatch(addFriendFinderResults(results)));
  };
}

export function fetchAccounts(query) {
  return (dispatch) => {
    return fetch(`${baseURL}/accounts/${query}`, {
      method: 'get',
      headers: new Headers({
        'Content-Type': 'application/json',
      }),
    }).then((response) => response.json())
      .then(results => dispatch(addAccountResults(results)));
  };
}
