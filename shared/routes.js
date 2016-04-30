// Router for ReactJs views.

import { Route, IndexRoute } from 'react-router';
import React from 'react';
import App from './container/App';
import OAuthSignupView from './container/Signup/OAuthSignupView';
import SignupView from './container/Signup/SignupView';
import FriendFinderView from './container/FriendFinder/FriendFinderView';
import HomeView from './container/Home/HomeView.jsx';
import AccountView from './container/Account/AccountView';

const routes = (
  <Route path="/" component={App} >
    <IndexRoute component={HomeView} />
    <Route path="/account/:username" component={AccountView} />
    <Route path="/signup" component={SignupView} />
    <Route path="/auth/oauth-signup" component={OAuthSignupView} />
    <Route path="/friend_finder(/:captain_id)" component={FriendFinderView} />
  </Route>
);

export default routes;
