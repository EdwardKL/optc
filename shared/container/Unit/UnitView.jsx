import _ from 'lodash';
import React, { PropTypes } from 'react';
import * as Actions from '../../redux/actions/actions';
import { Grid, Row, Col, Table, Button, Panel } from 'react-bootstrap';
import { connect } from 'react-redux';
import { formatNumber } from '../../utils';
import RECOMMENDATION from '../../../constants/recommendation';

export class UnitView extends React.Component {
  constructor(props, context) {
    super(props, context);
    this.state = {};
    this.state.unit = props.unit;
    this.state.has_unit = props.unit._id ? true : false;
    this.state.global_recommendations = props.global_recommendations;
    this.state.recommendation = props.recommendation;
    this.state.total_recommendations =
      props.global_recommendations.not_recommended + props.global_recommendations.recommended;

    this.getSpecialJSXRows = () => {
      if (!this.state.unit.special_ability) return [];
      const result = [];
      const notes = this.state.unit.special_ability.notes;
      for (let i = 0; i < this.state.unit.special_ability.subspecials.length; i++) {
        const subspecial = this.state.unit.special_ability.subspecials[i];
        let region_disclaimer = '';
        if (subspecial.region !== 'all') {
          region_disclaimer = `(${subspecial.region} only)`;
        }
        result.push(<tr>
              <td className="abilityCell">Special {region_disclaimer}</td>
              <td>
                <span className="specialName">{subspecial.name}</span><br/>
                {subspecial.stages.map((stage, index) => {
                  return (<div className="stage">
                        <span className="stageLabel">
                          {subspecial.stages.length > 1 ? `Stage ${index + 1}: ` : ''}
                        </span>
                        <span className="stageDescription">
                          {stage.description}
                        </span><br/>
                        <span className="stageCooldown">
                          {stage.base_cd === stage.max_cd ? `Cooldown: ${stage.base_cd} turns` : `Cooldown: ${stage.base_cd} => ${stage.max_cd} turns`}
                        </span>
                      </div>);
                })}
                <span className="specialNotes">
                  {notes ? `Notes: ${notes}` : ''}
                </span>
              </td>
            </tr>);
      }
      return result;
    };
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
    const style = {
      backgroundImage: 'url(http://onepiece-treasurecruise.com/wp-content/uploads/c' + String('0000' + this.state.unit._id).slice(-4) + '.png)',
    };
    const unit_stars = [];
    const other_stars = [];
    let unit_stars_left = this.state.unit.stars;
    _.times(6, (i) => {
      if (unit_stars_left > 0) {
        unit_stars.push(<i className="fa fa-star" aria-hidden="true" key={i}></i>);
        unit_stars_left -= 1;
      } else {
        other_stars.push(<i className="fa fa-star-o" aria-hidden="true" key={i}></i>);
      }
    });
    let recommend_buttons;
    if (this.state.recommendation !== RECOMMENDATION.UNABLE) {
      recommend_buttons = (<div id ="recommend">
        <Button
          bsStyle={this.state.recommendation === RECOMMENDATION.POSITIVE ? 'info' : 'default'}
          bsSize="xsmall"
          href={`/units/api/recommend/${this.state.unit._id}/1`}
        >
          Useful!
        </Button> &nbsp;
        <Button
          bsStyle={this.state.recommendation === RECOMMENDATION.NEGATIVE ? 'danger' : 'default'}
          bsSize="xsmall"
          href={`/units/api/recommend/${this.state.unit._id}/0`}
        >
          Not useful!
        </Button>
      </div>);
    }
    return (
      <Grid id="content">
          <Row>
            <h2>
              {this.state.unit.name}
              <span className="unitStars">
                <span className={`stars-${this.state.unit.stars}`}>{unit_stars}</span>
                <span className={'stars'}>{other_stars}</span>
              </span>
            </h2>
            <div id="recommendation">
              {`${this.state.global_recommendations.recommended} users out of ${this.state.total_recommendations} think this unit is useful.`}
              {recommend_buttons}
            </div>
            <hr/>
          </Row>
          <Row>
            <Col xs={7} sm={6} md={5} lg={4}>
              <div className="unitImage" style={style}></div>
            </Col>
            <Col xs={5} sm={6} className="unitDescription">
              <Row><Col xs={4} md={3}><b>Class</b></Col> <Col>{this.state.unit.classes.join(', ')}</Col></Row>
              <Row><Col xs={4} md={3}><b>Type</b></Col> <Col>{this.state.unit.type}</Col></Row>
              <Row><Col xs={4} md={3}><b>Cost</b></Col> <Col>{this.state.unit.cost}</Col></Row>
              <Row><Col xs={4} md={3}><b>Combo</b></Col> <Col>{this.state.unit.combo}</Col></Row>
              <Row><Col xs={4} md={3}><b>Slots</b></Col> <Col>{this.state.unit.slots}</Col></Row>
              <Row><Col xs={4} md={3}><b>Max Level</b></Col> <Col>{this.state.unit.max_level}</Col></Row>
              <Row><Col xs={4} md={3}><b>Exp to Max</b></Col> <Col>{formatNumber(this.state.unit.max_exp)}</Col></Row>
            </Col>
          </Row>
          <Row>
            <Col xs={12}>
              <Table striped bordered hover responsive className="unitStats">
                <thead>
                  <tr>
                    <th>Level</th>
                    <th>HP</th>
                    <th>ATK</th>
                    <th>RCV</th>
                  </tr>
                </thead>
                <tbody>
                  <tr>
                    <td>1</td>
                    <td>{this.state.unit.base_hp}</td>
                    <td>{this.state.unit.base_atk}</td>
                    <td>{this.state.unit.base_rcv}</td>
                  </tr>
                    <tr>
                      <td>{this.state.unit.max_level} (max)</td>
                      <td>{this.state.unit.max_hp}</td>
                      <td>{this.state.unit.max_atk}</td>
                      <td>{this.state.unit.max_rcv}</td>
                    </tr>
                </tbody>
              </Table>
            </Col>
          </Row>
          <Row>
            <Col xs={12}>
              <Table bordered hover responsive className="unitAbilities">
                <tbody>
                  {this.getSpecialJSXRows()}
                </tbody>
              </Table>
            </Col>
          </Row>
      </Grid>
    );
  }
}

function mapStateToProps(store) {
  return {
    unit: store.unit.data,
    global_recommendations: store.unit.global_recommendations,
    recommendation: store.unit.recommendation,
  };
}

UnitView.need = [(params) => {
  return Actions.fetchUnit(params.id);
}, (params) => {
  return Actions.fetchGlobalRecommendations(params.id);
}, (params, user_id) => {
  return Actions.fetchRecommendation(params.id, user_id);
}];

UnitView.propTypes = {
  unit: PropTypes.object.isRequired,
  global_recommendations: PropTypes.object.isRequired,
  recommendation: PropTypes.number.isRequired,
  // This comes by default with connect below.
  dispatch: PropTypes.func.isRequired,
};

export default connect(mapStateToProps)(UnitView);
