"use client";

import { useDrag } from "@/hooks/Drag";

import Image from "next/image";
import { useEffect, useMemo, useRef } from "react";

export const randomGenerate = (): number[][] =>{
  const arr: number[][] = [];
  for (let i = 0; i < 10; i++) {
    const line:number[] = [];
    for (let j = 0; j < 17; j++) {
      line.push(Math.floor(Math.random() * 9) + 1);
    }

    arr.push(line);
  }

  return arr;
}

function draw(ctx: any, line: number[][])
{
  for (let i = 0; i < 10; i++)
    {
      for (let j = 0; j < 17; j++)
      {
        ctx.fillStyle = "black";
        ctx.fillText(line[i][j].toString(), j * 100, i * 100); 
      }
    }
}


export default function Home() {
  const [onDragStart, onDragDuration, onDragEnd, position] = useDrag()
  const ref = useRef<HTMLCanvasElement>(null);
  const line = useMemo(() => randomGenerate(), []);
  console.log(line);
  useEffect(() => {
    if (ref.current === null)
    {
      return ;
    }

    const ctx = ref.current.getContext("2d");
    ctx?.scale(1, 1);
    ref.current.width = 1700;
    ref.current.height = 1000;
    draw(ctx, line);
  }, []);

  useEffect(() => {
    if (ref.current === null)
      return ;
    
    const ctx = ref.current?.getContext("2d");
    
    if (ctx === null)
      return ;
    
    ctx.clearRect(0, 0, ref.current.width, ref.current.height);
    draw(ctx, line);
    if (position.start.x === -500 || position.end.x === -500)
      return ;
    
    
    ctx.strokeStyle = "blue";
    
    ctx.strokeRect(position.start.x, position.start.y, position.end.x - position.start.x, position.end.y - position.start.y);
    ctx.fillStyle = "rgba(0, 0, 0, 0.3)";
    ctx.fillRect(position.start.x, position.start.y, position.end.x - position.start.x, position.end.y - position.start.y);

    ctx.closePath();
  }, [position]);

  return (
    <div className = "flex mx-auto w-7/8 mt-10 bg-blue-200 flex-col" onMouseLeave={onDragEnd} onMouseUp={onDragEnd}>
      <div className=" relative mx-auto bg-slate-500">
        <canvas className="w-[1700px] h-[1000px] bg-red-500" ref={ref}>
        </canvas>
        <div onMouseDown={onDragStart}
          onMouseMove={onDragDuration}
          onMouseUp={onDragEnd}
          className = "w-[1700px] h-[1000px] top-0 left-0 absolute"
          >
        </div>
      </div>
      x: {position.start.x}
      y: {position.start.y}
      w: {position.end.x}
      h: {position.end.y}
    </div>
  );
}
