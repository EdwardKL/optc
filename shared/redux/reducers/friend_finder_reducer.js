import * as ActionTypes from '../constants/constants';
import fetch from 'isomorphic-fetch';

const baseURL = typeof window === 'undefined' ? process.env.BASE_URL || (`http://localhost:${(process.env.PORT || 8000)}`) : '';


const friendFinderReducer = (state, action) => {
  switch (action.type) {
    case ActionTypes.FIND_FRIENDS :
      if (action.query) {
        var friend_search_results = [];
        console.log('finding friends!!');
        console.log(state);
        console.log(action);
        fetch(
          `${baseURL}/friend_finder/${action.query}`, {
            method: 'get',
            headers: new Headers({
              'Content-Type': 'application/json'
            })
          }).then((response) => response.json())
          .then(function(response){
              for (var i = 0; i < response.length; i++) {
                friend_search_results.push({
                  current_level: response[i].current_level,
                  current_special_level: response[i].current_special_level
                });
              }
              console.log('fs results: ', friend_search_results);
            });
        
        return { ...state, friend_search_results: friend_search_results };

      } else {
        return state;
      }
    default:
      return state;
  }
};

export default friendFinderReducer;
