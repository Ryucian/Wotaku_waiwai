import React, { Component, SyntheticEvent } from 'react'
import {CanvasPageBase} from '../ts/CanvasPageBaseClass'
import { srcs } from '../ts/ImportCGImage';
import { SC_SRCS } from '../ts/ImportSCImage';
import CLASS_IMAGE from "../img/other/class.jpg"
import CanvasImage from '../ts/CanvasImage';
import { DrawImage } from '../ts/CanvasUtil';
import { render } from 'react-dom';

class CanvasPage extends CanvasPageBase
{
  /** バスの座席表 */
  private classImg = new CanvasImage();

  constructor()
  {
    super();
    this.classImg.img = new Image();
    this.classImg.index = 0;
    this.classImg.img.src = CLASS_IMAGE;
    this.classImg.drawOffsetX = 0;
    this.classImg.drawOffsetY = 0;
    this.classImg.drawHeight = 767;
    this.classImg.drawWidth = 800;
  }

  drawBackground(canvas: any, context: any) {
    DrawImage(context,this.classImg);
  }
  
}

export class CG_CLASS extends Component 
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