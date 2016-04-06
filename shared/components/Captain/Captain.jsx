import React, {Component, PropTypes} from 'react';
import {Panel, Row, Col, Button} from 'react-bootstrap';
import CaptainEditor from '../../components/Captain/CaptainEditor';
import { connect } from 'react-redux';

class Captain extends Component {
  constructor(props, context){
    super(props, context);
    this.state = {};
    this.state.captain_data = props.captain_data;
    this.state.account_id = props.account_id;
    this.state.socket_selections = props.socket_selections;
    this.state.thumb_url = 'http://onepiece-treasurecruise.com/wp-content/uploads/f' + String("0000" + this.state.captain_data._unit).slice(-4) + '.png';
    this.state.backgroundStyle = {
      backgroundImage: 'url(' + this.state.thumb_url + ')',
    };
    if (this.state.captain_data.current_hp_ccs > 0) {
      this.state.hp_ccs = '+' + this.state.captain_data.current_hp_ccs;
    }
    if (this.state.captain_data.current_atk_ccs > 0) {
      this.state.atk_ccs = '+' + this.state.captain_data.current_atk_ccs;
    }
    if (this.state.captain_data.current_rcv_ccs > 0) {
      this.state.rcv_ccs = '+' + this.state.captain_data.current_rcv_ccs;
    }
    this.getSocketDivs = this.getSocketDivs.bind(this);
  }

  getSocketDivs() {
    return this.state.captain_data.current_sockets.map(function(socket) {
      var style = {
        backgroundImage: 'url(/img/socket' + socket._socket + '.png)',
      };
      return <div className="socket" key={socket._socket}>
               <div className="socketImage" style={style}></div>
               <div className="socketLevel">{socket.socket_level}</div>
             </div>;
    }.bind(this));
  }

  render() {
    return (
      <CaptainEditor
        edit={true}
        account_id={this.state.account_id}
        captain_id={this.state.captain_data._id}
        unit_id={this.state.captain_data._unit}
        default_level={this.state.captain_data.current_level}
        default_special={this.state.captain_data.current_special_level}
        default_sockets={this.state.captain_data.current_sockets}>
        <div className="captain">
          <div className="captainImage" style={this.state.backgroundStyle}>
            <span className="captainLevel captainStat">Lv{this.state.captain_data.current_level}</span>
            <span className="specialLevel captainStat">Sp{this.state.captain_data.current_special_level}</span>          
            <span className="hpCC cc">{this.state.hp_ccs}</span>
            <span className="atkCC cc">{this.state.atk_ccs}</span>
            <span className="rcvCC cc">{this.state.rcv_ccs}</span>
          </div>
          <div className="captainSocketsContainer">
            <div className="captainSockets">
              {this.getSocketDivs()}
            </div>
          </div>
        </div>
      </CaptainEditor>
    )
  }
}

Captain.propTypes = {
  account_id: PropTypes.number.isRequired,
  captain_data: PropTypes.object.isRequired,
  socket_selections: PropTypes.arrayOf(PropTypes.object).isRequired,
};

function mapStateToProps(store) {
  return {
    socket_selections: store.socket_selections,
  };
}

export default connect(mapStateToProps)(Captain);
