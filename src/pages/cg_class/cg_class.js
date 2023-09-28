import {init} from './main';
import React, { Component } from 'react'

export class CG_CLASS extends Component 
{
  canvas =  React.createRef();

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