import expect from 'expect';
import expectJSX from 'expect-jsx';
import { PostsView } from '../../../container/Posts/PostsView';
import React from 'react';
import TestUtils from 'react-addons-test-utils';
import { Grid, Row, Col, Button, Well, Label, Input } from 'react-bootstrap';
import unit_selections from '../../../../data/unit_selections.json';

expect.extend(expectJSX);

describe('PostsView ', () => {

  it('basic PostsView header test', () => {
    const renderer = TestUtils.createRenderer();
    renderer.render(<PostsView location='test_location' dispatch={() => {}}/>);
    const resultOutput = renderer.getRenderOutput();
    expect(resultOutput).toIncludeJSX(
      <Row>
        <h4>Comments</h4>
      </Row>
    )
  });
});
