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
  }
  
  render() {
    return (
      <Panel>
        <Col xs={4}>
          <h3>{this.state.captain_data._unit}</h3>
        </Col>
        <Col xs={7}>
          <Row><b>Level:</b>{this.state.captain_data.current_level}</Row>
          <Row><b>Special Level:</b>{this.state.captain_data.current_special_level}</Row>
          {this.state.captain_data.current_sockets.map(function(socket) {
            return <Row>{this.state.socket_selections[socket._socket - 1].name}, Level {socket.socket_level}</Row>;
          }.bind(this))}
        </Col>
        <Col xs={1}>
          <Row>
            <CaptainEditor
              edit={true}
              account_id={this.state.account_id}
              unit_id={this.state.captain_data._unit}
              default_level={this.state.captain_data.current_level}
              default_special={this.state.captain_data.current_special_level}
              default_sockets={this.state.captain_data.current_sockets}
              />
          </Row>
          <Row><a href={"/captains/delete/id".replace("id",this.state.captain_data._id)}>Delete</a></Row>
        </Col>
      </Panel>
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
