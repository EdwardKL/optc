import React, { PropTypes } from 'react';
import * as Actions from '../../redux/actions/actions';
import { Grid, Row } from 'react-bootstrap';
import { connect } from 'react-redux';
import Unit from '../../components/Unit/Unit';

export class UnitsView extends React.Component {
  constructor(props, context) {
    super(props, context);
    this.state = {};
    this.state.ids = props.ids;
  }

  render() {
    return (
      <Grid id="content">
        <Row>
          <h2>Units</h2>
          <hr/>
        </Row>
        {this.state.ids.map((id) => {
          return (<Unit id={id} />);
        })}
      </Grid>
    );
  }
}

function mapStateToProps(store) {
  return {
    ids: store.unit.ids,
  };
}

// For some reason if you don't supply params here this gets called and responds before mongoose has a chance to do anything...
// ... ?!
UnitsView.need = [(params) => {
  return Actions.fetchUnitIds();
}];

UnitsView.propTypes = {
  ids: PropTypes.arrayOf(PropTypes.number).isRequired,
  // This comes by default with connect below.
  dispatch: PropTypes.func.isRequired,
};

export default connect(mapStateToProps)(UnitsView);
