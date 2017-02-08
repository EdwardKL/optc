import expect from 'expect';
import expectJSX from 'expect-jsx';
import { PostsView } from '../../../container/Posts/PostsView';
import { Post } from '../../../components/Post/Post';
import React from 'react';
import TestUtils from 'react-addons-test-utils';
import { Grid, Row, Col, Button, Well, Label, Input } from 'react-bootstrap';
import unit_selections from '../../../../data/unit_selections.json';
import { mount } from 'enzyme';

expect.extend(expectJSX);

describe('PostsView ', () => {

  const testPost1 =
    { post: {
      _user: {
        username: 'testusername'
        },
      location: 'goldcreek',
      content: 'blah',
      score: 25,
      date_added: Date.now
      },
      children: []
    };

  const testPost2 =
    { post: {
      _user: {
        username: 'testusername'
      },
      location: 'goldcreek',
      content: 'monstercat',
      score: 25,
      date_added: Date.now
    },
      children: []
    };

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

  it('test displaying comment box', () => {
    const renderer = TestUtils.createRenderer();
    renderer.render(<PostsView location='goldcreek' dispatch={() => {}} posts={[]}/>);
    const resultOutput = renderer.getRenderOutput();
    console.log(resultOutput);

    expect(resultOutput).toIncludeJSX(
      <Row>
        <form action="/posts/api/post" method="POST">
          <Input type="textarea"
                 placeholder="Post a comment here!"
                 value=""
                 onChange={() => {}}
                 name="post_content"/>
          <Input type="hidden"
                 value="goldcreek"
                 name="location"/>
          <Button type="submit"
                  className="postButton"
                  disabled>
            Post Comment
          </Button>
        </form>
      </Row>
    )
  });

  // it('test displaying multiple posts', () => {
  //   const posts = [testPost1, testPost2];
  //   const renderer = TestUtils.createRenderer();
  //   renderer.render(<PostsView location='goldcreek' dispatch={() => {}} posts={posts}/>);
  //   const resultOutput = renderer.getRenderOutput();
  //   console.log(resultOutput);
  //
  //   expect(resultOutput).toIncludeJSX(
  //     <Row>
  //       <Post post_data={testPost1.post}/>
  //       <Post post_data={testPost2.post}/>
  //     </Row>
  //   )
  // });
});
