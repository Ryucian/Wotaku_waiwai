import './App.css';
import {init} from './ts/main.ts';
import React, { Component } from 'react'

class App extends Component 
{
  canvas =  React.createRef();

    onClick() {
        // DOM要素から値を抽出する.
        let emailAddress = this.emailInput.value
        console.log(emailAddress)
    }

    render() {

      return (
        <div className="App">
          <canvas id="canvas" width="1600" height="1200" ref={this.canvas} ></canvas>
        </div>
      );
    }

    componentDidMount()
    {
      init(this.canvas.current);
    }
}
export default App;