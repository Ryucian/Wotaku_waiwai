function resizeCanvas()
{
    const root = document.getElementById("root");

    /** @type {HTMLCanvasElement} */
    const canvas = document.getElementById("canvas");

    if(!canvas) return;

    const heightRatio = root.clientHeight / canvas.height;
    const widthRatio = root.clientWidth / canvas.width;
    
    const minRatio = Math.min(heightRatio,widthRatio);

    canvas.style.height = canvas.height * minRatio + "px";
    canvas.style.width  = canvas.width  * minRatio + "px";
}

window.resizeCanvas = resizeCanvas;
window.addEventListener("resize",resizeCanvas);