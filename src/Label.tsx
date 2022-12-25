import React from "react";
import { Label, Tag, Text } from "react-konva";

export const LogicLabel: React.FC<{
  x?: number;
  y?: number;
  pointerDirection?: "left" | "right" | "down" | "up";
  pointerWidth?: number;
  pointerHeight?: number;
  fontSize?: number;
  text: string;
  backgroundColor?: string;
  textColor?: string;
  width?: number;
  height?: number;
  onClick?: () => void;
  textStroke?: string;
  labelStroke?: string;
}> = ({
  x = 0,
  y = 0,
  pointerDirection,
  pointerWidth,
  pointerHeight,
  fontSize = 8,
  text,
  backgroundColor = "black",
  textColor = "white",
  width,
  height,
  onClick,
  textStroke,
  labelStroke,
}) => {
  return (
    <Label x={x} y={y} opacity={0.75} onClick={onClick}>
      <Tag
        fill={backgroundColor}
        pointerDirection={pointerDirection}
        pointerWidth={pointerWidth}
        pointerHeight={pointerHeight}
        lineJoin="round"
        stroke={labelStroke}
      />
      <Text stroke={textStroke} fontSize={fontSize} fill={textColor} text={` ${text} `} align="center" width={width} height={height} />
    </Label>
  );
};
