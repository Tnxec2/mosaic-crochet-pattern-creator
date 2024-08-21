import { useRef, useEffect, MutableRefObject } from "react";

const Canvas = (props: any) => {
  const { draw, className, ...rest } = props;
  const canvasRef: MutableRefObject<HTMLCanvasElement|undefined> = useRef();

  useEffect(() => {
    
    if (canvasRef.current){ 
      const canvas = canvasRef.current;
      const context = canvas.getContext("2d");

      const render = () => {
        draw(canvas, context);
      };
      render();
    } 
  }, [draw]);

  return <canvas className={className} ref={canvasRef} {...rest} />;
};

export default Canvas;