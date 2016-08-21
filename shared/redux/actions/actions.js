import * as ActionTypes from '../constants/constants';
import fetch from 'isomorphic-fetch';

const baseURL = typeof window === 'undefined' ? process.env.BASE_URL || (`http://localhost:${(process.env.PORT || 8000)}`) : '';

export function addFriendFinderResults(friend_search_results) {
  return {
    type: ActionTypes.FIND_FRIENDS,
    friend_search_results,
  };
}

export function fetchFriendFinderResults(captain_id, region) {
  return (dispatch) => {
    return fetch(`${baseURL}/friend_finder/api/${captain_id}?region=${region}`, {
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

export function addUnits(results) {
  return {
    type: ActionTypes.ADD_UNITS,
    results,
  };
}

export function addNumUnitPages(results) {
  return {
    type: ActionTypes.ADD_NUM_UNIT_PAGES,
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
    return fetch(`${baseURL}/units/api/fetch/${id}`, {
      method: 'get',
      headers: new Headers({
        'Content-Type': 'application/json',
      }),
    }).then((response) => response.json())
      .then(results => dispatch(addUnitResults(results)));
  };
}

export function fetchNumUnitPages() {
  return (dispatch) => {
    return fetch(`${baseURL}/units/api/num_unit_pages`, {
      method: 'get',
      headers: new Headers({
        'Content-Type': 'application/json',
      }),
    }).then((response) => response.json())
      .then(results => dispatch(addNumUnitPages(results)));
  };
}

export function fetchUnits(page) {
  return (dispatch) => {
    return fetch(`${baseURL}/units/api/units/${page}`, {
      method: 'get',
      headers: new Headers({
        'Content-Type': 'application/json',
      }),
    }).then((response) => response.json())
      .then(results => dispatch(addUnits(results)));
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
