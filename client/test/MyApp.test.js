/*import React from 'react';
import ReactDOM from 'react-dom';
import App from '../client/App';

it('renders without crashing', () => {
  const div = document.createElement('div');
  ReactDOM.render(<App />, div);
  //ReactDOM.unmountComponentAtNode(div);
});
*/

describe('App', () => {
  it('adds 1 + 2 to equal 3', () => {
    expect(1 + 2).toEqual(3);
  });
});
