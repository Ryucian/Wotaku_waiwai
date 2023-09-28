import CanvasImage from "../../ts/CanvasImage.ts"
import {srcs} from "../../ts/ImportCGImage.ts"
import { DrawImage, SaveOffSet, getUrlParamSet } from "../../ts/CanvasUtil.ts";

var images = [] as Array<CanvasImage>;

var imgSize=50;

/** 背景（グラフ）の幅 */
const bgWidth = 800;

/** ドラッグ中かどうか */
let isDragging = false;

/** ドラッグ対象の画像の添字 */
let dragTarget = -1;

/**
 * 矢印を描画する
 * @param {HTMLCanvasElement} canvas
 */
function drawArrow(canvas)
{
	var ctx = canvas.getContext('2d');
	
	//矢印の傘のサイズ
	var arrowheadSize = 15;

	//グラフの長さを取得
	var graphLength = Math.min(bgWidth,canvas.height);
	
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

/**
 * 文字を黒字に白枠で描画する
 * @param {HTMLCanvasElement} canvas 
 * @param str 
 * @param x 
 * @param y 
 */
function drawFrameText(canvas,str,x,y)
{
	var ctx = canvas.getContext('2d');
	ctx.font = "16px serif";
	//ctx.fillText(str, x,y);
	ctx.strokeStyle = "#fff";
	ctx.lineWidth = "4";
	ctx.lineJoin = "miter";
	ctx.miterLimit = "5"
	ctx.strokeText(str, x,y);
	
	ctx.strokeStyle = "#000";
	ctx.lineWidth = "1";
	ctx.lineJoin = "miter";
	ctx.miterLimit = "3"
	ctx.strokeText(str, x,y);
}


/**
 * 文字を描画する
 * @param canvas 
 */
function drawText(canvas)
{
	var urlParamSet = getUrlParamSet();
	
	//グラフの長さを取得
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
 * マウスが動いているときの処理
 * @param {MouseEvent} e 
 */
function mouseMove(e,canvas,context) 
{
    // ドラッグ終了位置
    var posX = (e.clientX - canvas.offsetLeft);
    var posY = (e.clientY - canvas.offsetTop);

    //ドラッグしていなければ処理を終了
    if(!isDragging) return;

    // canvas内を一旦クリア
    context.clearRect(0, 0, canvas.width, canvas.height);

    for (let i in images) 
    {
        if (parseInt(i) == dragTarget) 
        {
            // ドラッグが終了した時の情報を記憶
            images[i].drawOffsetX = posX - images[i].drawWidth / 2;
            images[i].drawOffsetY = posY - images[i].drawHeight / 2;
        }
        DrawImage(context,images[i]);
    }

	upsetImages(canvas,context);
    SaveOffSet("CG_GRAPH",images);
}

/**
 * マウスが押下されたときの処理
 * @param {MouseEvent} e 
 * @param {HTMLCanvasElement} canvas
 */
function mouseDown(e,canvas) 
{
    //console.log("mouse down");
    // ドラッグ開始位置
    var posX = (e.clientX - canvas.offsetLeft);
    var posY = (e.clientY - canvas.offsetTop);

    //console.log("mouse:("+posX+","+posY+")");

    //console.log(images[0].drawOffsetX);
    //console.log(images[0].drawOffsetY);

    for (var i = images.length - 1; i >= 0; i--) {
        // 当たり判定（ドラッグした位置が画像の範囲内に収まっているか）
        if (posX >= images[i].drawOffsetX &&
            posX <= (Number(images[i].drawOffsetX) + Number(images[i].drawWidth)) &&
            posY >= images[i].drawOffsetY &&
            posY <= (Number(images[i].drawOffsetY) + Number(images[i].drawHeight))
        ) {            
            dragTarget = i;
            isDragging = true;
            //console.log("posX="+posX+";posY="+posY+";imgX="+images[i].drawOffsetX+";imgY="+images[i].drawOffsetY+";width="+images[i].drawWidth+";height="+images[i].drawHeight);
            //console.log("imgBottom="+(images[i].drawOffsetY + images[i].drawHeight)); 
            break;
        }       
    }
}

/**
 * 画像をキャンバス上に表示する
 */
function upsetImages(canvas,context) 
{
	context.beginPath();
	context.fillStyle = 'rgb(250,250,250)';
	context.fillRect(0, 0, canvas.width, canvas.height);

    for (var j in images) 
    {
        DrawImage(context,images[j]);
    }
	
    drawText(canvas);
    drawArrow(canvas);
}

/**
 * 人物画像の初期位置を決める
 * @param context 
 */
function initCharImg(context)
{
    var x = 50;
    var y = 50;

	for (var j in images) 
    {
        //localストレージに座標情報があるときはそれを読み込む
        if(localStorage.getItem(images[j].img.src) != null)
        {
            const imgSrc = images[j].img.src;
            if(images[j].img.src!=null)
            {
                var joinedRect = localStorage.getItem(imgSrc) as string;
                var rect = joinedRect.split(',');
                
                x=Number(rect[0]);
                y=Number(rect[1]);
            }
        }
        
        // 画像を描画した時の情報を記憶
        const lineNum = 14;
        images[j].drawOffsetX = x + bgWidth + ( (images[j].index%lineNum) * 50);
        images[j].drawOffsetY = y + ( Math.floor(images[j].index/lineNum) * 50);
        images[j].drawWidth   = imgSize;
        images[j].drawHeight  = imgSize;

        // 画像を描画
        DrawImage(context,images[j]);
    }
}


/**
 * 初期表示処理
 * Window.loadで呼び出される
 * @param {HTMLCanvasElement} canvas
 */
export function init(canvas) 
{
	//var canvas  = document.getElementById('canvas') as HTMLCanvasElement;
	var context = canvas.getContext('2d') as CanvasRenderingContext2D;

	for (var i in srcs) 
    {
		images[i] = new CanvasImage();
        images[i].img = new Image();
        images[i].index = Number(i);
		images[i].img.src = srcs[i];
	}

	initCharImg(context);

	// ドラッグ終了
	var mouseUp = function(e) {
		isDragging = false;
	};

	// canvasの枠から外れた
	var mouseOut = function(e) {
		// canvas外にマウスカーソルが移動した場合に、ドラッグ終了としたい場合はコメントインする
		 mouseUp(e);
	}


	// canvasにイベント登録
	canvas.addEventListener('mousedown', function(e){mouseDown(e,canvas);}, false);
	canvas.addEventListener('mousemove', function(e){mouseMove(e,canvas,context);}, false);
	canvas.addEventListener('mouseup',   function(e){mouseUp(e);},   false);
	canvas.addEventListener('mouseout',  function(e){mouseOut(e);},  false);

    upsetImages(canvas,context);
}