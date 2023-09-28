import './cg_bus.css';
import {init} from '../../ts/main';
import React, { Component } from 'react'

class CG_BUS extends Component 
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
export default CG_BUS;