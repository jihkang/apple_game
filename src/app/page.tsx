"use client";

import { pixelWidth, screenHeight, screenWidth } from "@/constant/constant";
import { useDrag } from "@/hooks/Drag";
import { useCallback, useEffect, useMemo, useRef, useState } from "react";

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

export default function Home() {
  const [onDragStart, onDragDuration, onDragEnd, position] = useDrag()
  const ref = useRef<HTMLCanvasElement>(null);
  const line = useMemo(() => randomGenerate(), []);
  const [numLines, setLines] = useState(line);
  const [value, setValue] = useState(0);


  const draw = useCallback((ctx: CanvasRenderingContext2D, line: number[][]) => {
    for (let i = 0; i < 10; i++) {
      for (let j = 0; j < 17; j++) {
        if (line[i][j] === 0)
          continue ;
        
        ctx.fillStyle = "black";
        ctx.font = "40px Arial";
        ctx.fillText(line[i][j].toString(), pixelWidth + j * pixelWidth, pixelWidth + i * pixelWidth); 
      }
    }
  }, []);
  const updateLine = (row: [number, number], col: [number, number]) => {
    const newLines = [...numLines];
    
    for (let i = 0; i <= col[1]; i++) {
      for (let j = 0; j <= row[1]; j++) {
        newLines[col[0] + i][row[0] + j] = 0;
      }
    }

    return newLines;
  }

  const countWithoutZero = (row: [number, number], col: [number, number]) : number => {
    let cnt = 0;
    for (let i = 0; i <= col[1]; i++) {
      for (let j = 0; j <= row[1]; j++) {
        if (numLines[col[0] + i][row[0] + j] !== 0) {
          cnt++;
        }
      }
    }

    return cnt;
  }

  const calculateRectValue = (position: {start: {x: number, y: number}, end : {x: number, y:number}}): [number, [number, number], [number, number]] => {
    let sum = 0;
    let rs = position.start.x;
    let re = position.end.x;
    if (position.start.x > position.end.x) {
      let tmp = re;
      re = rs;
      rs = tmp;
    }

    re = Math.floor((re - rs) / pixelWidth);
    rs = Math.floor(rs / pixelWidth);

    let cs = position.start.y;
    let ce = position.end.y;
    if (position.start.y > position.end.y) {
      let tmp = ce;
      ce = cs;
      cs = tmp;
    }
    
    ce = Math.floor((ce - cs) / pixelWidth);
    cs = Math.floor(cs / pixelWidth);

    for (let i = 0; i <= re && rs + i >= 0 && rs + i < 17; i++) {
      for (let j = 0; j <= ce && cs + j >= 0 && cs + j < 10; j++) {
        sum += numLines[cs + j][rs + i];
      }
    }

    return [sum, [rs, re], [cs, ce]];
  }

  useEffect(() => {
    if (ref.current === null) {
      return ;
    }

    const ctx = ref.current.getContext("2d");
    if (!ctx)
      return ;

    ctx.scale(1, 1);
    ref.current.width = screenWidth;
    ref.current.height = screenHeight;
    ctx.font =  "60px Arial";
   
    draw(ctx, numLines);
  }, []);

  useEffect(() => {
    if (ref.current === null)
      return ;
    
    const ctx = ref.current?.getContext("2d");
    
    if (ctx === null)
      return ;
    
    ctx.clearRect(0, 0, ref.current.width, ref.current.height);
    draw(ctx, numLines);
    if (position.start.x === -500 || position.end.x === -500)
      return ; 
    
    ctx.strokeStyle = "blue";
    ctx.strokeRect(position.start.x, position.start.y, position.end.x - position.start.x, position.end.y - position.start.y);
    const [val] = calculateRectValue(position);
    ctx.fillStyle= val === 10 ? "rgba(0, 0, 0, 0.5)": "rgba(0, 0, 0, 0.2)"
    ctx.fillRect(position.start.x, position.start.y, position.end.x - position.start.x, position.end.y - position.start.y);
    ctx.closePath();

  }, [position]);
  
  return (
    <div className = "flex mx-auto w-7/8 mt-10 bg-blue-200 flex-col" onMouseLeave={onDragEnd} onMouseUp={() => {
      const [val, row, col] = calculateRectValue(position);
      if (val === 10) {
        const count = countWithoutZero(row, col);
        setLines(() => updateLine(row, col));
        setValue((prev) => prev + count);
      }

      onDragEnd();
    }}>
      <div className=" relative mx-auto bg-slate-500">
        <canvas className="w-[px] h-[1000px] bg-red-500 text-4xl" ref={ref}>
        </canvas>
        <div onMouseDown={onDragStart}
          onMouseMove={onDragDuration}
          className = "w-[1700px] h-[1000px] top-0 left-0 absolute"
          >
        </div>
      </div>
      value: {value}
    </div>
  );
}
