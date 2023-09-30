import { SyntheticEvent } from "react";
import CanvasImage from "./CanvasImage.ts"

/**
 * Canvas上の座標を保持するクラス
 */
export class CanvasPoint
{
	public x:number = 0;
	public y:number = 0;

	/**
	 * 座標間の距離を取得する
	 * @param x 
	 * @param y 
	 */
	public getDistance(x,y):number
	{
		return 0;
	}
}

/**
 * URLからパラメータを取得する
 */
export function getUrlParamSet()
{
	// URLを取得
	var url = new URL(window.location.href);

	// URLSearchParamsオブジェクトを取得
	return url.searchParams;
}

/**
 * Canvasを画像として保存する
 */
function saveImage()
{
	let myCanvas  = document.getElementById("canvas") as HTMLCanvasElement;
	
	//グラフの長さを取得
	let graphLength = Math.min(myCanvas.width,myCanvas.height);
	
	let canvas2 = document.createElement("canvas") as HTMLCanvasElement;
	canvas2.width  = graphLength;
	canvas2.height = graphLength;
	var context2 = canvas2.getContext('2d') as CanvasRenderingContext2D;
	context2.fillStyle = 'rgb(255,255,255)';

	//TODO:canvasの情報をcontext2に描画する

	var base64 = canvas2.toDataURL("image/jpeg");
	(document.getElementById("download") as HTMLAnchorElement).href = base64;
	
}

/**
 * 座標情報を保存する
 * @param images 
 */
export function SaveOffSet(key:string,images:CanvasImage[])
{
	for(let i=0;i<images.length;i++)
	{
		localStorage.setItem(key+"@"+images[i].img.src,images[i].drawOffsetX+','+images[i].drawOffsetY);
	}
}

/**
 * CanvasImage型の画像を描画する
 * @param {CanvasRenderingContext2D} context 
 * @param {CanvasImage} canvasImg
 */
export function DrawImage(context:CanvasRenderingContext2D,canvasImg:CanvasImage)
{
    context.drawImage(canvasImg.img,canvasImg.drawOffsetX,canvasImg.drawOffsetY, canvasImg.drawWidth, canvasImg.drawHeight);
}

/**
 * CanvasImage配列に画像を追加します
 * @param images 
 * @param canvasImages 
 */
export function PutImgToAry(images:any[],canvasImages:CanvasImage[])
{
	for(var i in images)
	{
		const idx = Number(canvasImages.length);
		canvasImages[idx] = new CanvasImage();
        canvasImages[idx].img = new Image();
        canvasImages[idx].index = idx; 
		canvasImages[idx].img.src = images[i];
	}
}

/**
 * マウスイベントからキャンバス上の座標を取得する処理
 * @param canvas 
 * @param event 
 */
export function GetCanvasPointFromMouseEvent(canvas:HTMLCanvasElement,event:MouseEvent):CanvasPoint
{
	return GetCanvasPointFromClientXY(canvas,event.clientX,event.clientY);
}

/**
 * タッチからキャンバス上の座標を取得する処理
 * @param canvas 
 * @param event 
 */
export function GetCanvasPointFromTouchEvent(canvas:HTMLCanvasElement,event:TouchEvent):CanvasPoint
{
	return GetCanvasPointFromClientXY(canvas,event.touches[0].clientX,event.touches[0].clientY);
}

/**
 * マウスの座標からキャンバス上の座標を取得する処理
 * @param canvas 
 * @param event 
 */
export function GetCanvasPointFromClientXY(canvas:HTMLCanvasElement,clientX:number,clientY:number):CanvasPoint
{
	let cp = new CanvasPoint();
	cp.x = (clientX - canvas.offsetLeft) * (canvas.width /canvas.clientWidth);
	cp.y = (clientY - canvas.offsetTop) * (canvas.height/canvas.clientHeight);
	return cp;
}

/**
 * 文字を黒字に白枠で描画する
 * @param {HTMLCanvasElement} canvas 
 * @param str 
 * @param x 
 * @param y 
 */
export function drawFrameText(canvas:HTMLCanvasElement,str:string,x:number,y:number)
{
	var ctx = canvas.getContext('2d');
	ctx.font = "16px serif";
	//ctx.fillText(str, x,y);
	ctx.strokeStyle = "#fff";
	ctx.lineWidth = 4;
	ctx.lineJoin = "miter";
	ctx.miterLimit = 5
	ctx.strokeText(str, x,y);
	
	ctx.strokeStyle = "#000";
	ctx.lineWidth = 1;
	ctx.lineJoin = "miter";
	ctx.miterLimit = 3
	ctx.strokeText(str, x,y);
}