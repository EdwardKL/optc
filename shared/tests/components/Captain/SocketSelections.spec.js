import '../../../../test/fake_dom';
import { Button } from 'react-bootstrap';
import chai from 'chai';
import expect from 'expect';
import expectJSX from 'expect-jsx';
import { mount } from 'enzyme';
import React from 'react';
import { SocketSelections } from '../../../components/Captain/SocketSelections';
import SocketSelector from '../../../components/Captain/SocketSelector';
import TestUtils from 'react-addons-test-utils';

expect.extend(expectJSX);

describe('SocketSelections', () => {
  const socket_selections = [
    { _id: 1, name: 'A' },
    { _id: 2, name: 'B' },
    { _id: 3, name: 'C' },
    { _id: 4, name: 'D' },
    { _id: 5, name: 'E' }];
  const dummy = () => {};

  it('should disable socket removal with empty default sockets', () => {
    const renderer = TestUtils.createRenderer();
    renderer.render(
      <SocketSelections
        socket_selections={socket_selections}
        default_sockets={[]}
        max_sockets={2}
      />);
    const output = renderer.getRenderOutput();
    expect(output).toEqualJSX(<div className="socketSelections">
        <Button className="addSocket" onClick={dummy}>Add Socket</Button>&nbsp;
        <Button className="removeSocket" onClick={dummy} disabled>Remove Socket</Button>
      </div>);
  });

  it('should render a default socket', () => {
    const renderer = TestUtils.createRenderer();
    renderer.render(
      <SocketSelections
        socket_selections={socket_selections}
        default_sockets={[{ _socket: 4, socket_level: 3 }]}
        max_sockets={2}
      />);
    const output = renderer.getRenderOutput();
    expect(output).toEqualJSX(<div className="socketSelections">
        <SocketSelector
          key={0}
          key_prop={0}
          default_level={3}
          default_value={4}
          socket_selections={socket_selections}
          onChange={dummy}
        />
        <Button className="addSocket" onClick={dummy}>Add Socket</Button>&nbsp;
        <Button className="removeSocket" onClick={dummy}>Remove Socket</Button>
      </div>);
  });

  it('should render multiple default sockets', () => {
    const renderer = TestUtils.createRenderer();
    renderer.render(
      <SocketSelections
        socket_selections={socket_selections}
        default_sockets={[{ _socket: 4, socket_level: 3 }, { _socket: 2, socket_level: 5 }]}
        max_sockets={3}
      />);
    const output = renderer.getRenderOutput();
    expect(output).toEqualJSX(<div className="socketSelections">
        <SocketSelector
          key={0}
          key_prop={0}
          default_level={3}
          default_value={4}
          socket_selections={[
            { _id: 1, name: 'A' },
            { _id: 3, name: 'C' },
            { _id: 4, name: 'D' },
            { _id: 5, name: 'E' }]}
          onChange={dummy}
        />
        <SocketSelector
          key={1}
          key_prop={1}
          default_level={5}
          default_value={2}
          socket_selections={[
            { _id: 1, name: 'A' },
            { _id: 2, name: 'B' },
            { _id: 3, name: 'C' },
            { _id: 5, name: 'E' }]}
          onChange={dummy}
        />
        <Button className="addSocket" onClick={dummy}>Add Socket</Button>&nbsp;
        <Button className="removeSocket" onClick={dummy}>Remove Socket</Button>
      </div>);
  });

  it('should disable add sockets when we have max sockets', () => {
    const renderer = TestUtils.createRenderer();
    renderer.render(
      <SocketSelections
        socket_selections={socket_selections}
        default_sockets={[{ _socket: 4, socket_level: 3 }, { _socket: 2, socket_level: 5 }]}
        max_sockets={2}
      />);
    const output = renderer.getRenderOutput();
    expect(output).toEqualJSX(<div className="socketSelections">
        <SocketSelector
          key={0}
          key_prop={0}
          default_level={3}
          default_value={4}
          socket_selections={[
            { _id: 1, name: 'A' },
            { _id: 3, name: 'C' },
            { _id: 4, name: 'D' },
            { _id: 5, name: 'E' }]}
          onChange={dummy}
        />
        <SocketSelector
          key={1}
          key_prop={1}
          default_level={5}
          default_value={2}
          socket_selections={[
            { _id: 1, name: 'A' },
            { _id: 2, name: 'B' },
            { _id: 3, name: 'C' },
            { _id: 5, name: 'E' }]}
          onChange={dummy}
        />
        <Button className="addSocket" onClick={dummy} disabled>Add Socket</Button>&nbsp;
        <Button className="removeSocket" onClick={dummy}>Remove Socket</Button>
      </div>);
  });

  function shouldHaveOption(option_key, selected, type_input) {
    const option = type_input.find('option[value=' + option_key + ']');
    chai.expect(option.html()).to.equal(
      `<option value="${option_key}">${socket_selections[option_key - 1].name}</option>`);
  }

  function shouldHaveOptions(expected_option_keys, selected_option, type_input) {
    expected_option_keys.map((option_key) => {
      shouldHaveOption(option_key, option_key === selected_option, type_input);
    });
    const unexpected_option_keys = [1, 2, 3, 4, 5].filter((option_key) => {
      return expected_option_keys.indexOf(option_key) === -1;
    });
    unexpected_option_keys.map((option_key) => {
      chai.expect(type_input.find('option[value=' + option_key + ']')).to.have.length(0);
    });
  }

  it('should properly add 1 socket with no defaults', () => {
    const selections = mount(
      <SocketSelections
        socket_selections={socket_selections}
        default_sockets={[]}
        max_sockets={2}
      />);
    selections.find('.addSocket').simulate('click');
    const selectors = selections.find('.socketSelector');
    chai.expect(selectors).to.have.length(1);

    // The socket's type should refer to the first socket.
    const type_input = selectors.find('select');
    chai.expect(type_input).to.have.length(1);
    chai.expect(type_input.prop('defaultValue')).to.equal(1);

    console.log('type input', type_input);
    // All options from socket_selections should be available.
    shouldHaveOptions([1, 2, 3, 4, 5], 1, type_input);

    // All socket levels should be 1 when newly added.
    const level_input = selectors.find('input');
    chai.expect(level_input).to.have.length(1);
    chai.expect(level_input.prop('defaultValue')).to.equal(1);

    // Both buttons should be active.
    chai.expect(selections.find('.addSocket').prop('disabled')).to.be.false;
    chai.expect(selections.find('.removeSocket').prop('disabled')).to.be.false;
  });

  it('should properly add 2 sockets with no defaults', () => {
    const selections = mount(
      <SocketSelections
        socket_selections={socket_selections}
        default_sockets={[]}
        max_sockets={2}
      />);
    selections.find('.addSocket').simulate('click');
    selections.find('.addSocket').simulate('click');
    const selectors = selections.find('.socketSelector');
    chai.expect(selectors).to.have.length(2);

    let index = 1;
    selectors.forEach((selector) => {
      const type_input = selector.find('select');
      chai.expect(type_input).to.have.length(1);
      if (index === 1) {
        shouldHaveOptions([1, 3, 4, 5], 1, type_input);
      } else {
        shouldHaveOptions([2, 3, 4, 5], 2, type_input);
      }

      const level_input = selector.find('input');
      chai.expect(level_input).to.have.length(1);
      // All socket levels should be when newly added.
      chai.expect(level_input.prop('defaultValue')).to.equal(1);

      index += 1;
    });

    // Add socket should be inactive.
    chai.expect(selections.find('.addSocket').prop('disabled')).to.be.true;
    chai.expect(selections.find('.removeSocket').prop('disabled')).to.be.false;
  });

  it('should properly delete a socket with no defaults', () => {
    const selections = mount(
      <SocketSelections
        socket_selections={socket_selections}
        default_sockets={[]}
        max_sockets={2}
      />);
    selections.find('.addSocket').simulate('click');
    selections.find('.addSocket').simulate('click');
    selections.find('.removeSocket').simulate('click');
    const selectors = selections.find('.socketSelector');
    chai.expect(selectors).to.have.length(1);

    // The socket's type should refer to the first socket.
    const type_input = selectors.find('select');
    chai.expect(type_input).to.have.length(1);
    chai.expect(type_input.prop('defaultValue')).to.equal(1);

    // All options from socket_selections should be available.
    shouldHaveOptions([1, 2, 3, 4, 5], 1, type_input);

    // All socket levels should be 1 when newly added.
    const level_input = selectors.find('input');
    chai.expect(level_input).to.have.length(1);
    chai.expect(level_input.prop('defaultValue')).to.equal(1);

    // Both buttons should be active.
    chai.expect(selections.find('.addSocket').prop('disabled')).to.be.false;
    chai.expect(selections.find('.removeSocket').prop('disabled')).to.be.false;
  });

  it('should properly toggle sockets with no defaults', () => {
    const selections = mount(
      <SocketSelections
        socket_selections={socket_selections}
        default_sockets={[]}
        max_sockets={2}
      />);
    selections.find('.addSocket').simulate('click');
    selections.find('.removeSocket').simulate('click');
    selections.find('.addSocket').simulate('click');
    const selectors = selections.find('.socketSelector');
    chai.expect(selectors).to.have.length(1);

    // The socket's type should refer to the first socket.
    const type_input = selectors.find('select');
    chai.expect(type_input).to.have.length(1);
    chai.expect(type_input.prop('defaultValue')).to.equal(1);

    // All options from socket_selections should be available.
    shouldHaveOptions([1, 2, 3, 4, 5], 1, type_input);

    // All socket levels should be 1 when newly added.
    const level_input = selectors.find('input');
    chai.expect(level_input).to.have.length(1);
    chai.expect(level_input.prop('defaultValue')).to.equal(1);

    // Both buttons should be active.
    chai.expect(selections.find('.addSocket').prop('disabled')).to.be.false;
    chai.expect(selections.find('.removeSocket').prop('disabled')).to.be.false;
  });

  it('should properly toggle sockets with defaults', () => {
    const selections = mount(
      <SocketSelections
        socket_selections={socket_selections}
        default_sockets={[{ _socket: 4, socket_level: 3 }, { _socket: 2, socket_level: 5 }]}
        max_sockets={3}
      />);
    selections.find('.addSocket').simulate('click');
    selections.find('.removeSocket').simulate('click');
    selections.find('.addSocket').simulate('click');
    const selectors = selections.find('.socketSelector');
    chai.expect(selectors).to.have.length(3);

    let index = 1;
    selectors.forEach((selector) => {
      const type_input = selector.find('select');
      chai.expect(type_input).to.have.length(1);

      const level_input = selector.find('input');
      chai.expect(level_input).to.have.length(1);

      if (index === 1) {
        shouldHaveOptions([3, 4, 5], 4, type_input);
        chai.expect(level_input.prop('defaultValue')).to.equal(3);
      } else if (index === 2) {
        shouldHaveOptions([2, 3, 5], 2, type_input);
        chai.expect(level_input.prop('defaultValue')).to.equal(5);
      } else {
        shouldHaveOptions([1, 3, 5], 1, type_input);
        chai.expect(level_input.prop('defaultValue')).to.equal(1);
      }

      index += 1;
    });

    // Add socket button should be inactive.
    chai.expect(selections.find('.addSocket').prop('disabled')).to.be.true;
    chai.expect(selections.find('.removeSocket').prop('disabled')).to.be.false;
  });

  it('should update socket selections when socket types change', () => {
    const selections = mount(
      <SocketSelections
        socket_selections={socket_selections}
        default_sockets={[{ _socket: 4, socket_level: 3 }, { _socket: 2, socket_level: 5 }]}
        max_sockets={3}
      />);
    // Instead of socket 4 in the default sockets above, select 5.
    selections.find('.socketSelector').first().find('select').simulate('change', { target: { value: 5 } });
    const selectors = selections.find('.socketSelector');
    chai.expect(selectors).to.have.length(2);

    let index = 1;
    selectors.forEach((selector) => {
      const type_input = selector.find('select');
      chai.expect(type_input).to.have.length(1);

      const level_input = selector.find('input');
      chai.expect(level_input).to.have.length(1);

      if (index === 1) {
        shouldHaveOptions([1, 3, 4, 5], 5, type_input);
        chai.expect(level_input.prop('defaultValue')).to.equal(3);
      } else {
        shouldHaveOptions([1, 2, 3, 4], 2, type_input);
        chai.expect(level_input.prop('defaultValue')).to.equal(5);
      }

      index += 1;
    });

    // Add socket button should be inactive.
    chai.expect(selections.find('.addSocket').prop('disabled')).to.be.false;
    chai.expect(selections.find('.removeSocket').prop('disabled')).to.be.false;
  });
});
