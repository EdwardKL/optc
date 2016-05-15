import expect from 'expect';
import TestUtils from 'react-addons-test-utils';
import { UnitView } from '../../../container/Unit/UnitView';
import React from 'react';
import expectJSX from 'expect-jsx';
import { Grid, Row } from 'react-bootstrap';

expect.extend(expectJSX);

describe('UnitView ', () => {
  it('should render the unit when found', () => {
    const unit = { _id: 5, name: 'test unit' };
    const renderer = TestUtils.createRenderer();
    renderer.render(<UnitView unit={unit} />);
    const output = renderer.getRenderOutput();
    expect(output).toEqualJSX(<Grid id="content"><Row><h2>test unit</h2><hr/></Row></Grid>);
  });

  it('should render an error message when unit is not found', () => {
    const renderer = TestUtils.createRenderer();
    // No unit.
    renderer.render(<UnitView unit={{}} />);
    const output = renderer.getRenderOutput();
    expect(output).toEqualJSX(<Grid id="content"><Row><h2>Unit not found.</h2><hr/></Row></Grid>);
  });
});
