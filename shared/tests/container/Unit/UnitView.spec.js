import expect from 'expect';
import TestUtils from 'react-addons-test-utils';
import { UnitView } from '../../../container/Unit/UnitView';
import React from 'react';
import expectJSX from 'expect-jsx';
import { Grid, Row, Col, Table, Button } from 'react-bootstrap';
import RECOMMENDATION from '../../../../constants/recommendation';

expect.extend(expectJSX);

const global_recommendations = { recommended: 4, not_recommended: 8 };
const getExpectedJSX = function (recommendation) {
  return (<Grid id="content">
        <Row>
          <h2>
            test unit
            <span className="unitStars">
              <span className="stars-5">
                <i className="fa fa-star" aria-hidden="true"></i>
                <i className="fa fa-star" aria-hidden="true"></i>
                <i className="fa fa-star" aria-hidden="true"></i>
                <i className="fa fa-star" aria-hidden="true"></i>
                <i className="fa fa-star" aria-hidden="true"></i>
              </span>
              <span className="stars">
                <i className="fa fa-star-o" aria-hidden="true"></i>
              </span>
            </span>
          </h2>
          <div id="recommendation">
            {`4 users out of 12 think this unit is useful.`}
            {recommendation}
          </div>
          <hr/>
        </Row>
        <Row>
          <Col xs={7} sm={6} md={5} lg={4}>
            <div className="unitImage" style={{
              backgroundImage: 'url(http://onepiece-treasurecruise.com/wp-content/uploads/c0005.png)',
            }}></div>
          </Col>
          <Col xs={5} sm={6} className="unitDescription">
            <Row><Col xs={4} md={3}><b>Class</b></Col> <Col>Tough, Ambition</Col></Row>
            <Row><Col xs={4} md={3}><b>Type</b></Col> <Col>PSY</Col></Row>
            <Row><Col xs={4} md={3}><b>Cost</b></Col> <Col>10</Col></Row>
            <Row><Col xs={4} md={3}><b>Combo</b></Col> <Col>4</Col></Row>
            <Row><Col xs={4} md={3}><b>Slots</b></Col> <Col>2</Col></Row>
            <Row><Col xs={4} md={3}><b>Max Level</b></Col> <Col>89</Col></Row>
            <Row><Col xs={4} md={3}><b>Exp to Max</b></Col> <Col>123,456,789</Col></Row>
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
                  <td>10</td>
                  <td>23</td>
                  <td>50</td>
                </tr>
                  <tr>
                    <td>89 (max)</td>
                    <td>100</td>
                    <td>234</td>
                    <td>5555</td>
                  </tr>
              </tbody>
            </Table>
          </Col>
        </Row>
        <Row>
          <Col xs={12}>
            <Table bordered hover responsive className="unitAbilities">
              <tbody>
                <tr>
                  <td className="abilityCell">Special (global only)</td>
                  <td>
                    <span className="specialName">subspecial1</span><br/>
                    <div className="stage">
                      <span className="stageLabel">Stage 1: </span>
                      <span className="stageDescription">subspecial1, stage1 descript</span><br/>
                      <span className="stageCooldown">Cooldown: 10 => 15 turns</span>
                    </div>
                    <div className="stage">
                      <span className="stageLabel">Stage 2: </span>
                      <span className="stageDescription">subspecial1, stage2 descript</span><br/>
                      <span className="stageCooldown">Cooldown: 20 => 25 turns</span>
                    </div>
                    <span className="specialNotes">Notes: test note</span>
                  </td>
                </tr>
                  <tr>
                    <td className="abilityCell">Special (japan only)</td>
                    <td>
                      <span className="specialName">subspecial2</span><br/>
                      <div className="stage">
                        <span className="stageLabel"></span>
                        <span className="stageDescription">subspecial2 descript</span><br/>
                        <span className="stageCooldown">Cooldown: 10 turns</span>
                      </div>
                      <span className="specialNotes">Notes: test note</span>
                    </td>
                  </tr>
              </tbody>
            </Table>
          </Col>
        </Row>
    </Grid>);
};

describe('UnitView ', () => {
  const unit = {
    _id: 5,
    name: 'test unit',
    stars: 5,
    classes: ['Tough', 'Ambition'],
    type: 'PSY',
    cost: 10,
    combo: 4,
    slots: 2,
    max_level: 89,
    max_exp: 123456789,
    base_hp: 10,
    base_atk: 23,
    base_rcv: 50,
    max_hp: 100,
    max_atk: 234,
    max_rcv: 5555,
    special_ability: {
      _id: 77,
      subspecials: [
        {
          name: 'subspecial1',
          stages: [{
            description: 'subspecial1, stage1 descript',
            base_cd: 10,
            max_cd: 15,
          }, {
            description: 'subspecial1, stage2 descript',
            base_cd: 20,
            max_cd: 25,
          }],
          region: 'global',
        },
        {
          name: 'subspecial2',
          stages: [{
            description: 'subspecial2 descript',
            base_cd: 10,
            max_cd: 10,
          }],
          region: 'japan',
        },
      ],
      notes: 'test note',
    },
  };

  it('should render the unit when found with no recommend buttons', () => {
    const renderer = TestUtils.createRenderer();
    renderer.render(<UnitView unit={unit} global_recommendations={global_recommendations} recommendation={RECOMMENDATION.UNABLE} />);
    const output = renderer.getRenderOutput();
    expect(output).toEqualJSX(getExpectedJSX());
  });

  it('should render the unit when found with default recommend buttons', () => {
    const renderer = TestUtils.createRenderer();
    renderer.render(<UnitView unit={unit} global_recommendations={global_recommendations} recommendation={RECOMMENDATION.NONE} />);
    const output = renderer.getRenderOutput();
    expect(output).toEqualJSX(getExpectedJSX(<div id ="recommend">
      <Button
        bsStyle="default"
        bsSize="xsmall"
        href={`/units/api/recommend/5/1`}
      >
        Useful!
      </Button> &nbsp;
      <Button
        bsStyle="default"
        bsSize="xsmall"
        href={`/units/api/recommend/5/0`}
      >
        Not useful!
      </Button>
    </div>));
  });

  it('should render the unit when found with positive recommend buttons', () => {
    const renderer = TestUtils.createRenderer();
    renderer.render(<UnitView unit={unit} global_recommendations={global_recommendations} recommendation={RECOMMENDATION.POSITIVE} />);
    const output = renderer.getRenderOutput();
    expect(output).toEqualJSX(getExpectedJSX(<div id ="recommend">
      <Button
        bsStyle="info"
        bsSize="xsmall"
        href={`/units/api/recommend/5/1`}
      >
        Useful!
      </Button> &nbsp;
      <Button
        bsStyle="default"
        bsSize="xsmall"
        href={`/units/api/recommend/5/0`}
      >
        Not useful!
      </Button>
    </div>));
  });

  it('should render the unit when found with negative recommend buttons', () => {
    const renderer = TestUtils.createRenderer();
    renderer.render(<UnitView unit={unit} global_recommendations={global_recommendations} recommendation={RECOMMENDATION.NEGATIVE} />);
    const output = renderer.getRenderOutput();
    expect(output).toEqualJSX(getExpectedJSX(<div id ="recommend">
      <Button
        bsStyle="default"
        bsSize="xsmall"
        href={`/units/api/recommend/5/1`}
      >
        Useful!
      </Button> &nbsp;
      <Button
        bsStyle="danger"
        bsSize="xsmall"
        href={`/units/api/recommend/5/0`}
      >
        Not useful!
      </Button>
    </div>));
  });

  it('should render an error message when unit is not found', () => {
    const renderer = TestUtils.createRenderer();
    // No unit.
    renderer.render(<UnitView unit={{}} global_recommendations={{}} />);
    const output = renderer.getRenderOutput();
    expect(output).toEqualJSX(<Grid id="content"><Row><h2>Unit not found.</h2><hr/></Row></Grid>);
  });
});
