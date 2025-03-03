"use client";
import { MouseEvent } from "react";

import { useEffect, useRef, useState } from "react";

type CustomMouse<T = HTMLElement> = MouseEvent<T>;
type iDrag = 
[
  (e: CustomMouse) => void,
  (e: CustomMouse) => void,
  () => void,
  {[T in "start" | "end" ]: {x: number, y: number}}
];
export function useDrag(): iDrag {
    const refClicked = useRef(false);
    const [position, setPosition] = useState({
        start: {x: -500, y : -500},
        end: {x: -500, y: -500},
    });

    const onDragStart = (e: CustomMouse) => {
        refClicked.current = true;

        const {offsetX, offsetY} = e.nativeEvent;
        setPosition((prev) => ({
            ...prev, 
            start: {x: offsetX, y: offsetY}
        }));
    }

    const onDragDuration = (e: CustomMouse) => {
        if (!refClicked.current) {
            return ;
        }

        const {offsetX, offsetY} = e.nativeEvent;
        setPosition((prev) => ({
            ...prev, 
            end: {x: offsetX, y: offsetY}
        }));
    }

    const onDragEnd = () => {
        refClicked.current = false;
        setPosition({
            start: {x: -500, y : -500},
            end: {x: -500, y: -500},
        });
    }

    return [onDragStart, onDragDuration, onDragEnd, position]
}