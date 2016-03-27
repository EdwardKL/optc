// Router for ReactJs views.

import { Route, IndexRoute } from 'react-router';
import React from 'react';
import App from './container/App';
import SignupView from './container/Signup/SignupView';
import FriendFinderView from './container/FriendFinder/FriendFinderView';
import HomeView from './container/Home/HomeView.jsx';

const routes = (
  <Route path="/" component={App} >
    <IndexRoute component={HomeView} />
    <Route path="/signup" component={SignupView} />
    <Route path="/friend_finder" component={FriendFinderView} />
  </Route>

);

export default routes;
