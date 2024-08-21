import { useRef, useEffect, MutableRefObject, useState } from "react";

const Canvas = (props: any) => {
  const { draw, className, ...rest } = props;
  const canvasRef: MutableRefObject<HTMLCanvasElement|undefined> = useRef();
  const [drawing, setDrawing] = useState<boolean>(false)

  useEffect(() => {
    if (!drawing && canvasRef.current){ 
      setDrawing(true)
      const canvas = canvasRef.current;
      const context = canvas.getContext("2d");
      draw(canvas, context);
      setDrawing(false)
    } 
  }, [draw]);

  return <canvas className={className} ref={canvasRef} {...rest} />;
};

export default Canvas;