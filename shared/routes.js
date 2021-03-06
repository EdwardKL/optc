// Router for ReactJs views.

import { Route, IndexRoute } from 'react-router';
import React from 'react';
import App from './container/App';
import OAuthSignupView from './container/Signup/OAuthSignupView';
import SignupView from './container/Signup/SignupView';
import ForgotPasswordView from './container/Signup/ForgotPasswordView';
import ResetPasswordView from './container/Signup/ResetPasswordView';
import SetEmailView from './container/Signup/SetEmailView';
import FriendFinderView from './container/FriendFinder/FriendFinderView';
import HomeView from './container/Home/HomeView.jsx';
import AccountView from './container/Account/AccountView';
import UnitView from './container/Unit/UnitView';
import UnitsView from './container/Unit/UnitsView';

const routes = (
  <Route path="/" component={App} >
    <IndexRoute component={HomeView} />
    <Route path="/account/:username" component={AccountView} />
    <Route path="/unit/:id(/:flavortext)" component={UnitView} />
    <Route path="/signup" component={SignupView} />
    <Route path="/forgot_password" component={ForgotPasswordView} />
    <Route path="/reset_password" component={ResetPasswordView} />
    <Route path="/auth/set-email" component={SetEmailView} />
    <Route path="/auth/oauth-signup" component={OAuthSignupView} />
    <Route path="/friend_finder(/:captain_id)" component={FriendFinderView} />
    <Route path="/units" component={UnitsView} />
  </Route>
);

export default routes;
