
import { MouseEventHandler, SyntheticEvent } from "react";
import CanvasImage from "./CanvasImage.ts"
import { CanvasPoint, DrawImage, GetCanvasPointFromMouseEvent, GetCanvasPointFromTouchEvent, PutImgToAry } from "./CanvasUtil.ts";

/**
 * Canvasだけのページを作るときのなんかいい感じのイベント
 */
export abstract class CanvasPageBase
{
    /** 人物のアイコンを保持する配列 */
    private images = [] as Array<CanvasImage>;
        
    public imgSize=50;
    
    /** ドラッグ中かどうか */
    public isDragging = false;
    
    /** ドラッグ対象の画像の添字 */
    public dragTarget = -1;

    /** アイコンの初期描画位置の左端の座標 */
    protected iconDrawMarginLeft = 800;
    
    //座標情報をリセットする
    private ResetOffSet(canvas,images)
    {
        //グラフの長さを取得
        var graphLength = Math.min(canvas.width,canvas.height);
        
        
        //ウィンドウが縦長の場合はめんどくさいので処理しない
        if(canvas.width<canvas.height) return;
        
        //グラフの右側のスペースにウマ娘が何人並べられるか
        var imgWidth =  Math.floor((canvas.width - graphLength)/this.imgSize);
        
        for(let i=0;i<images.length;i++)
        {
            images[i].drawOffsetX = graphLength+((i%imgWidth)*this.imgSize);
            images[i].drawOffsetY = 0+Math.floor(i/imgWidth)*this.imgSize;
            localStorage.setItem(images[i].src,images[i].drawOffsetX+','+images[i].drawOffsetY);
        }
        window.location.reload();
    }
    
    
    /**
     * マウスが動いているときの処理
     * @param {MouseEvent} e 
     */
    private mouseMove(e:MouseEvent) 
    {
        const canvas = e.target as HTMLCanvasElement;
        const pos = GetCanvasPointFromMouseEvent(canvas,e);
        this.onMove(canvas,pos);
    }
    
    /**
     * マウスが動いているときの処理
     * @param {TouchEvent} e 
     */
    private touchMove(e:TouchEvent) 
    {
        const canvas = e.target as HTMLCanvasElement;
        const pos = GetCanvasPointFromTouchEvent(canvas,e);
        this.onMove(canvas,pos);
    }

    /**
     * マウス移動・タッチ移動共通の処理
     * @param canvas 
     * @param pos 
     */
    private onMove(canvas,pos)
    {

        const context = canvas.getContext("2d") as CanvasRenderingContext2D;

        //ドラッグしていなければ処理を終了
        if(!this.isDragging) return;
    
        // canvas内を一旦クリア
        context.clearRect(0, 0, canvas.width, canvas.height);
    
        for (let i in this.images) 
        {
            if (parseInt(i) == this.dragTarget) 
            {
                // ドラッグが終了した時の情報を記憶
                this.images[i].drawOffsetX = pos.x - this.images[i].drawWidth / 2;
                this.images[i].drawOffsetY = pos.y - this.images[i].drawHeight / 2;
            }
            DrawImage(context,this.images[i]);
        }
    
        this.upsetImages(canvas,context);
    }

    /**
     * マウスが話されたときの処理
     * @param {MouseEvent} e 
     */
    private mouseUp(e)
    {
        this.isDragging = false;
    }

    /**
     * マウスがCanvasの枠から外れた場合
     * @param {MouseEvent} e 
     */
    private mouseOut(e) 
    {
        this.mouseUp(e);
    }

    /**
     * マウスが押下されたときの処理
     * @param {MouseEvent} e 
     */
    public mouseDown(e:MouseEvent) 
    {
        const canvas = e.target as HTMLCanvasElement;
        const pos = GetCanvasPointFromMouseEvent(canvas,e);
        this.onDown(canvas,pos);
    }

    /**
     * タッチ開始時の処理
     * @param e 
     */
    public touchStart(e:TouchEvent)
    {      
        const canvas = e.target as HTMLCanvasElement;
        const pos = GetCanvasPointFromTouchEvent(canvas,e);
        this.onDown(canvas,pos);
    }

    /**
     * マウスクリック・タッチの共通処理
     * @param canvas 
     * @param pos 
     */
    public onDown(canvas:HTMLCanvasElement,pos:CanvasPoint)
    {
        for (var i = this.images.length - 1; i >= 0; i--) 
        {
            // 当たり判定（ドラッグした位置が画像の範囲内に収まっているか）
            if (pos.x >= this.images[i].drawOffsetX &&
                pos.x <= (Number(this.images[i].drawOffsetX) + Number(this.images[i].drawWidth)) &&
                pos.y >= this.images[i].drawOffsetY &&
                pos.y <= (Number(this.images[i].drawOffsetY) + Number(this.images[i].drawHeight))
            ) {            
                this.dragTarget = i;
                this.isDragging = true;
                break;
            }       
        }
    }

    /** 背景描画関数 */
    abstract drawBackground(canvas,context);
    
    /**
     * 画像をキャンバス上に表示する
     */
    private upsetImages(canvas,context) 
    {
        this.drawBackground(canvas,context);
    
        for (var j in this.images) 
        {
            DrawImage(context,this.images[j]);
        }
    }
    
    /**
     * 人物画像の初期位置を決める
     * @param context 
     */
    private initCharImg(context)
    {
        var x = 50;
        var y = 50;
    
        for (var j in this.images) 
        {
            //localストレージに座標情報があるときはそれを読み込む
            if(localStorage.getItem(this.images[j].img.src) != null)
            {
                const imgSrc = this.images[j].img.src;
                if(this.images[j].img.src!=null)
                {
                    var joinedRect = localStorage.getItem(imgSrc) as string;
                    var rect = joinedRect.split(',');
                    
                    x=Number(rect[0]);
                    y=Number(rect[1]);
                }
            }
            
            // 画像を描画した時の情報を記憶（Imageのプロパティに突っ込むのはちょっと反則かもだけど）
            const lineNum = 14;
            this.images[j].drawOffsetX = x + ( (this.images[j].index%lineNum) * 50) + this.iconDrawMarginLeft;
            this.images[j].drawOffsetY = y + ( Math.floor(this.images[j].index/lineNum) * 50);
            this.images[j].drawWidth   = this.imgSize;
            this.images[j].drawHeight  = this.imgSize;
    
            // 画像を描画
            //context.drawImage(images[j],(j%10)*50,(j/10)*50, w, h);
            DrawImage(context,this.images[j]);
        }
    }

    private loadCounter = 0;

    /**
     * 画像読み込み時のイベント
     * @param this 
     * @param e 
     */
    private onLoadImg(this:CanvasPageBase,e:Event)
    {
        this.loadCounter++;
        if(this.images.length==this.loadCounter)
        {
            const canvas = document.getElementById("canvas") as HTMLCanvasElement;
            const context = canvas.getContext("2d");
            this.upsetImages(canvas,context);
        }
    }
    
    /**
     * ロードが完了した時に画面を描画するようにします
     * @param images 
     * @param canvasImages 
     */
    private SetLoadEvent()
    {
        const imgLen = this.images.length;

        for(let i=0;i<imgLen;i++)
        {
            this.images[i].img.onload = this.onLoadImg.bind(this);
        }
    }    
    
    /**
     * 初期表示処理
     * Window.loadで呼び出される
     * @param {HTMLCanvasElement} canvas
     */
    public init(canvas:HTMLCanvasElement) 
    {
        //var canvas  = document.getElementById('canvas') as HTMLCanvasElement;
        var context = canvas.getContext('2d') as CanvasRenderingContext2D;
            
        this.initCharImg(context);
    
        // canvasにイベント登録
        canvas.addEventListener('mousedown', this.mouseDown.bind(this), false);
        canvas.addEventListener('mousemove', this.mouseMove.bind(this), false);
        canvas.addEventListener('mouseup',   this.mouseUp.bind(this),   false);
        canvas.addEventListener('mouseout',  this.mouseOut.bind(this),  false);

        //スマホ対応
        if('ontouchend' in canvas)
        {
            canvas.addEventListener('touchstart',  this.touchStart.bind(this), false);
            canvas.addEventListener('touchmove',   this.touchMove.bind(this), false);
            canvas.addEventListener('touchend',    this.mouseUp.bind(this),   false);
            canvas.addEventListener('touchcancel', this.mouseOut.bind(this),  false);
        }

        //this.upsetImages(canvas,context);
        this.SetLoadEvent();
        window.resizeCanvas();
    }

    /**
     * アイコンを追加
     * @param imgAry 
     */
    public addImage(imgAry:any[])
    {
        PutImgToAry(imgAry,this.images);
    }
}