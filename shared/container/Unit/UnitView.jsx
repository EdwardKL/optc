import React, { PropTypes } from 'react';
import * as Actions from '../../redux/actions/actions';
import { Grid, Row } from 'react-bootstrap';
import { connect } from 'react-redux';

export class UnitView extends React.Component {
  constructor(props, context) {
    super(props, context);
    this.state = {};
    this.state.unit = props.unit;
    this.state.has_unit = props.unit._id ? true : false;
  }

  render() {
    if (!this.state.has_unit) {
      return (
        <Grid id="content">
            <Row>
              <h2>Unit not found.</h2>
              <hr/>
            </Row>
        </Grid>
      );
    }
    return (
      <Grid id="content">
          <Row>
            <h2>{this.state.unit.name}</h2>
            <hr/>
          </Row>
      </Grid>
    );
  }
}

function mapStateToProps(store) {
  return {
    unit: store.unit.data,
  };
}

UnitView.need = [(params) => {
  return Actions.fetchUnit(params.id);
}];

UnitView.propTypes = {
  unit: PropTypes.object.isRequired,
  // This comes by default with connect below.
  dispatch: PropTypes.func.isRequired,
};

export default connect(mapStateToProps)(UnitView);
