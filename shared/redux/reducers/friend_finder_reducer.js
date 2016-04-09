import * as ActionTypes from '../constants/constants';
import fetch from 'isomorphic-fetch';

const baseURL = typeof window === 'undefined' ? process.env.BASE_URL || (`http://localhost:${(process.env.PORT || 8000)}`) : '';


const friendFinderReducer = (state, action) => {
  switch (action.type) {
    case ActionTypes.FIND_FRIENDS :
      var results = [];
      for (var i = 0; i < action.friend_search_results.length; i++) {
        results.push({
          current_level: action.friend_search_results[i].current_level,
          current_special_level: action.friend_search_results[i].current_special_level
        });
      }
      console.log('returning this to store?: ', {
        ...state,
        friend_search_results: results
      });
      return {
        ...state,
        friend_search_results: results
      };
    default:
      return state;
  }
};

export default friendFinderReducer;
