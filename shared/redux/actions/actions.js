import * as ActionTypes from '../constants/constants';
import fetch from 'isomorphic-fetch';

const baseURL = typeof window === 'undefined' ? process.env.BASE_URL || (`http://localhost:${(process.env.PORT || 8000)}`) : '';

export function addFriendFinderResults(friend_search_results) {
  return {
    type: ActionTypes.FIND_FRIENDS,
    friend_search_results,
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

export function addAccountResults(results) {
  return {
    type: ActionTypes.FIND_ACCOUNTS,
    results,
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

export function addUnitResults(results) {
  return {
    type: ActionTypes.FIND_UNIT,
    results,
  };
}

export function addUnitIdAndNames(results) {
  return {
    type: ActionTypes.GET_UNIT_ID_AND_NAMES,
    results,
  };
}

export function addGlobalRecommendations(results) {
  return {
    type: ActionTypes.GET_GLOBAL_RECOMMENDATIONS,
    results,
  };
}

export function addRecommendation(results) {
  return {
    type: ActionTypes.GET_RECOMMENDATION,
    results,
  };
}

export function fetchUnit(id) {
  return (dispatch) => {
    return fetch(`${baseURL}/units/api/id/${id}`, {
      method: 'get',
      headers: new Headers({
        'Content-Type': 'application/json',
      }),
    }).then((response) => response.json())
      .then(results => dispatch(addUnitResults(results)));
  };
}

export function fetchUnitIdAndNames() {
  return (dispatch) => {
    return fetch(`${baseURL}/units/api/id_and_names`, {
      method: 'get',
      headers: new Headers({
        'Content-Type': 'application/json',
      }),
    }).then((response) => response.json())
      .then(results => dispatch(addUnitIdAndNames(results)));
  };
}

export function fetchGlobalRecommendations(id) {
  return (dispatch) => {
    return fetch(`${baseURL}/units/api/recommendations/${id}`, {
      method: 'get',
      headers: new Headers({
        'Content-Type': 'application/json',
      }),
    }).then((response) => response.json())
      .then(results => dispatch(addGlobalRecommendations(results)));
  };
}

export function fetchRecommendation(id, user_id) {
  return (dispatch) => {
    return fetch(`${baseURL}/units/api/recommendation/${id}/${user_id}`, {
      method: 'get',
      headers: new Headers({
        'Content-Type': 'application/json',
      }),
    }).then((response) => response.json())
      .then(results => dispatch(addRecommendation(results)));
  };
}
