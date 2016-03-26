import React from 'react';
import Header from '../../components/Header/Header';
import Footer from '../../components/Footer/Footer';
import AccountView from '../../components/AccountView/AccountView.jsx';

class Home extends React.Component {
  constructor(props, context){
    super(props, context);
  }

  render() {
    return (
      <div>
        <Header />
        <AccountView />
        <Footer />
      </div>
    );
  }
}

export default Home;
