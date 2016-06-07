import expect from 'expect';
import expectJSX from 'expect-jsx';
import { FriendFinderView } from '../../../container/FriendFinder/FriendFinderView';
import React from 'react';
import TestUtils from 'react-addons-test-utils';
import { Grid, Row, Col, Button, Well, Label, Input } from 'react-bootstrap';

expect.extend(expectJSX);

describe('FriendFinderView ', () => {
  it('should display search bar', () => {
    const renderer = TestUtils.createRenderer();
    renderer.render(<FriendFinderView friend_search_results={[]} params={{captain_id: '-150'}}/>);
    const output = renderer.getRenderOutput();
    expect(output).toIncludeJSX(<Input
      placeholder="Captain ID"
      label="Captain ID"
      name="captain_id"
      type="text"
      onChange={() => {}}/>);
  });
});
