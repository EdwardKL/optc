// Router for ReactJs views.

import { Route, IndexRoute } from 'react-router';
import React from 'react';
import App from './container/App';
import PostContainer from './container/PostContainer/PostContainer';
import PostDetailView from './container/PostDetailView/PostDetailView';
import SignupView from './container/Signup/SignupView';
import FriendFinderView from './container/FriendFinder/FriendFinderView';

const routes = (
  <Route path="/" component={App} >
    <IndexRoute component={PostContainer} />
    <Route path="/post/:slug" component={PostDetailView}/>
    <Route path="/signup" component={SignupView}/>
    <Route path="/friend_finder" component={FriendFinderView}/>
  </Route>

);

export default routes;
