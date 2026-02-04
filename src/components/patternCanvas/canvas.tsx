import { useRef, useEffect, MutableRefObject, useState } from "react";

const Canvas = (props: any) => {
  const { draw, className, onClick,  ...rest } = props;
  const canvasRef: MutableRefObject<HTMLCanvasElement | undefined> = useRef();
  const [drawing, setDrawing] = useState<boolean>(false)

  useEffect(() => {
    if (!drawing && canvasRef.current) {
      setDrawing(true)
      const canvas = canvasRef.current;
      const context = canvas.getContext("2d");
      draw(canvas, context);
      setDrawing(false)
    }
  }, [draw, drawing]);

  return <canvas className={className} ref={canvasRef} 
    onClick={(e) => {onClick(e, canvasRef.current)}} 
    // onMouseDown={(e) => {onMouseDown(e, canvasRef.current)}} 
    // onMouseUp={(e) => {onMouseUp(e, canvasRef.current)}} 
    // onTouchStart={(e) => {onTouchStart(e, canvasRef.current)}} 
    // onTouchEnd={(e) => {onTouchEnd(e, canvasRef.current)}}
   {...rest} />;
};

export default Canvas;