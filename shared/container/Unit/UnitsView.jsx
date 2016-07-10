import React, { PropTypes } from 'react';
import * as Actions from '../../redux/actions/actions';
import { Grid, Row } from 'react-bootstrap';
import { connect } from 'react-redux';
import Unit from '../../components/Unit/Unit';

export class UnitsView extends React.Component {
  constructor(props, context) {
    super(props, context);
    this.state = {};
    this.state.id_and_names = props.id_and_names;
  }

  render() {
    return (
      <Grid id="content">
        <Row>
          <h2>Units</h2>
          <hr/>
        </Row>
        {this.state.id_and_names.map((id_and_name) => {
          return (<Unit id={id_and_name.id} name={id_and_name.name} key={id_and_name.id}/>);
        })}
      </Grid>
    );
  }
}

function mapStateToProps(store) {
  return {
    id_and_names: store.unit.id_and_names,
  };
}

// For some reason if you don't supply params here this gets called and responds before mongoose has a chance to do anything...
// ... ?!
UnitsView.need = [(params) => {
  return Actions.fetchUnitIdAndNames();
}];

UnitsView.propTypes = {
  id_and_names: PropTypes.arrayOf(PropTypes.object).isRequired,
  // This comes by default with connect below.
  dispatch: PropTypes.func.isRequired,
};

export default connect(mapStateToProps)(UnitsView);
