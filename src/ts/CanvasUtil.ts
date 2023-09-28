import CanvasImage from "./CanvasImage.ts"

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
 * ロードが完了した時に画面を描画するようにします
 * @param images 
 * @param canvasImages 
 */
export function SetLoadEvent(canvasImages:CanvasImage[],upsetImages:(canvas,context)=> void,canvas,context,loadCounter:number)
{
	const imgLen = canvasImages.length;

	for(let i=0;i<imgLen;i++)
	{
		canvasImages[i].img.onload = function() {
			loadCounter++;
			if(imgLen==loadCounter)
			{
				upsetImages(canvas,context);
			}
		}
	}
}
