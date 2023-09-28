import {init} from './cg_graph.ts';
import React, { Component } from 'react'

export class CG_GRAPH extends Component 
{
  canvas =  React.createRef();

  render() {

    return (
      <div className="App">
        <canvas id="canvas" width="1600" height="800" ref={this.canvas} ></canvas>
      </div>
    );
  }

  componentDidMount()
  {
    init(this.canvas.current);
  }
}