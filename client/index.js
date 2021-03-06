import React from 'react';
import routes from '../shared/routes';
import { render } from 'react-dom';
import { Provider } from 'react-redux';
import { Router, browserHistory } from 'react-router';
import { configureStore } from '../shared/redux/store/configureStore';
import Header from '../shared/components/Header/Header';
import Footer from '../shared/components/Footer/Footer';

const store = configureStore(window.__INITIAL_STATE__);
const history = browserHistory;
const dest = document.getElementById('root');

render((
  <Provider store={store}>
    <div>
      <Header />
      <Router history={history} routes={routes} />
      <Footer />
    </div>
  </Provider>
), dest);

// if (process.env.NODE_ENV !== 'production') {
//   window.React = React; // enable debugger
//
//   if (!dest || !dest.firstChild || !dest.firstChild.attributes || !dest.firstChild.attributes['data-react-checksum']) {
//     console.error('Server-side React render was discarded. Make sure that your initial render does not contain any client-side code.'); // eslint-disable-line
//   }
// }

// if (process.env.CLIENT) {
//   render(
//     <Provider store={store} key="provider">
//       <div>
//         <Router history={history} routes={routes} />
//         <DevTools />
//       </div>
//     </Provider>,
//     dest
//   );
// }
