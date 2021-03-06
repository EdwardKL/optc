import expect from 'expect';
import expectJSX from 'expect-jsx';
import { FriendFinderView } from '../../../container/FriendFinder/FriendFinderView';
import React from 'react';
import TestUtils from 'react-addons-test-utils';
import { Grid, Row, Col, Button, Well, Label, Input } from 'react-bootstrap';
import unit_selections from '../../../../data/unit_selections.json';

expect.extend(expectJSX);

describe('FriendFinderView ', () => {


  it('basic friend finder view header test', () => {
    const renderer = TestUtils.createRenderer();
    renderer.render(<FriendFinderView friend_search_results={[]} params={{}} unit_selections={unit_selections}/>);
    const resultOutput = renderer.getRenderOutput();
    expect(resultOutput).toIncludeJSX(
      <h2>
        Find Friends
      </h2>
    )
  });
});
