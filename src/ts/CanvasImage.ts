/**
 * HTMLImageElementを拡張してCanvasで扱いやすくしたもの
 */
export default class CanvasImage
{
    public img:HTMLImageElement;
    public drawOffsetX : number = 0;
    public drawOffsetY : number = 0;
    public drawWidth:number = 0 ;
    public drawHeight:number = 0;
    public index:number = 0;
}