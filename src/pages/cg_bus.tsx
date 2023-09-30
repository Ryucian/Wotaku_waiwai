import React, { Component } from 'react'
import {CanvasPageBase} from '../ts/CanvasPageBaseClass'
import { srcs } from '../ts/ImportCGImage';
import { SC_SRCS } from '../ts/ImportSCImage';
import BUS_IMAGE from "../img/other/bus.jpg"
import CanvasImage from '../ts/CanvasImage';
import { DrawImage } from '../ts/CanvasUtil';

class CanvasPage extends CanvasPageBase
{
  /** バスの座席表 */
  private busImg = new CanvasImage();

  constructor()
  {
    super();
    this.busImg.img = new Image();
    this.busImg.index = 0;
    this.busImg.img.src = BUS_IMAGE;
    this.busImg.drawOffsetX = 0;
    this.busImg.drawOffsetY = 0;
    this.busImg.drawHeight = 767;
    this.busImg.drawWidth = 482;
  }

  drawBackground(canvas: any, context: any) 
  {
    DrawImage(context,this.busImg);
  }
  
}

export class CG_BUS extends Component 
{
  canvasPage = new CanvasPage();
  canvas =  React.createRef();

  constructor(props) 
  {
    super(props);

    //デレマスアイドルの追加
    this.canvasPage.addImage(srcs);

	  //シャニマスアイドルの追加
    this.canvasPage.addImage(SC_SRCS);

  }

  render() 
  {
    return (
      <div className="App">
        <canvas id="canvas" width="1920" height="1080"/>
      </div>
    );
  }

  componentDidMount(): void {
      this.canvasPage.init(document.getElementById("canvas") as HTMLCanvasElement);
  }

}