import expect from 'expect';
import TestUtils from 'react-addons-test-utils';
import { UnitView } from '../../../container/Unit/UnitView';
import React from 'react';
import expectJSX from 'expect-jsx';
import { Grid, Row, Col, Table } from 'react-bootstrap';

expect.extend(expectJSX);

describe('UnitView ', () => {
  it('should render the unit when found', () => {
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
    };
    const renderer = TestUtils.createRenderer();
    renderer.render(<UnitView unit={unit} />);
    const output = renderer.getRenderOutput();
    expect(output).toEqualJSX(<Grid id="content">
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
      </Grid>);
  });

  it('should render an error message when unit is not found', () => {
    const renderer = TestUtils.createRenderer();
    // No unit.
    renderer.render(<UnitView unit={{}} />);
    const output = renderer.getRenderOutput();
    expect(output).toEqualJSX(<Grid id="content"><Row><h2>Unit not found.</h2><hr/></Row></Grid>);
  });
});
