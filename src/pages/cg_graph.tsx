import React, { Component, SyntheticEvent } from 'react'
import {CanvasPageBase} from '../ts/CanvasPageBaseClass'
import { srcs } from '../ts/ImportCGImage';
import { SC_SRCS } from '../ts/ImportSCImage';
import CanvasImage from '../ts/CanvasImage';
import { DrawImage, drawFrameText, getUrlParamSet } from '../ts/CanvasUtil';

class CanvasPage extends CanvasPageBase
{

  /** 背景（グラフ）の幅 */
  private bgWidth = 1080;
  iconDrawMarginLeft = 1080;

  drawBackground(canvas: any, context: any) {
    this.drawText(canvas);
    this.drawArrow(canvas);
  }

  /**
   * 文字を描画する
   * @param canvas 
   */
  private drawText(canvas)
  {
    var urlParamSet = getUrlParamSet();
    
    //グラフの長さを取得s
    var length = Math.min(canvas.width,canvas.height);
    
    if(urlParamSet.get("caption"))
    {
      drawFrameText(canvas,urlParamSet.get("caption"),10,20);
    }
    if(urlParamSet.get("y"))
    {
      drawFrameText(canvas,urlParamSet.get("y"),length/2+10, 50);
    }
    if(urlParamSet.get("x"))
    {
      let ctx= canvas.getContext('2d');
      ctx.font = "16px serif";
      let urlStr = urlParamSet.get("x");
      drawFrameText(canvas,urlStr,length-ctx.measureText(urlStr).width-10, length/2+30);
    }
    if(urlParamSet.get("yminus"))
    {
      let ctx= canvas.getContext('2d');
      ctx.font = "16px serif";
      let urlStr = urlParamSet.get("yminus");
      let txtHeight = ctx.measureText(urlStr).actualBoundingBoxAscent 
                        + ctx.measureText(urlStr).actualBoundingBoxDescent;
      drawFrameText(canvas,urlStr,length/2+10, length-txtHeight-10);
    }
    if(urlParamSet.get("xminus"))
    {
      let ctx= canvas.getContext('2d');
      ctx.font = "16px serif";
      let urlStr = urlParamSet.get("xminus");
      drawFrameText(canvas,urlStr,10, length/2+30);
    }
  }

  /**
   * 矢印を描画する
   * @param {HTMLCanvasElement} canvas
   */
  private drawArrow(canvas)
  {
    var ctx = canvas.getContext('2d');
    
    //矢印の傘のサイズ
    var arrowheadSize = 15;

    //グラフの長さを取得
    var graphLength = Math.min(this.bgWidth,canvas.height);
    
    //枠線
    ctx.beginPath();
    ctx.moveTo(0, 0);
    ctx.lineTo(graphLength, 0);
    ctx.lineTo(graphLength, graphLength);
    ctx.lineTo(0, graphLength);
    ctx.lineTo(0, 0);
    ctx.closePath();
    ctx.stroke();

    //縦矢印
    ctx.beginPath();
    ctx.moveTo(graphLength/2, graphLength);
    ctx.lineTo(graphLength/2, 0);
    ctx.lineTo(graphLength/2-arrowheadSize, arrowheadSize);
    ctx.lineTo(graphLength/2+arrowheadSize, arrowheadSize);
    ctx.lineTo(graphLength/2, 0);
    ctx.closePath();
    ctx.stroke();
    ctx.fill();
    
    //横矢印
    ctx.beginPath();
    ctx.moveTo(0, graphLength/2);
    ctx.lineTo(graphLength,graphLength/2);
    ctx.lineTo(graphLength-arrowheadSize,graphLength/2-arrowheadSize);
    ctx.lineTo(graphLength-arrowheadSize,graphLength/2+arrowheadSize);
    ctx.lineTo(graphLength,graphLength/2);
    ctx.closePath();
    ctx.stroke();
    ctx.fill();
  }
  
}

export class CG_GRAPH extends Component 
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