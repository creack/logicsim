import Konva from "konva";
import { KonvaEventObject } from "konva/lib/Node";
import { useControls } from "leva";
import React from "react";
import { Circle, Group, Rect, Text, Transformer } from "react-konva";
import type { IO } from "./entityInstance";
import { PaneCtx, ScreenCtx } from "./UI";

const TextTransformer: React.FC<{
  text: string;
  isSelected?: boolean;
  onSelect: () => void;
  x: number;
  y: number;
}> = ({ text, isSelected = false, onSelect, x, y }) => {
  const { fontSize, color } = useControls("Title Props", {
    fontSize: { value: 26, min: 6, max: 72, step: 1 },
    color: "#000000",
  });
  const [pos, setPos] = React.useState({ x: 0, y: 0 });

  const shapeRef = React.useRef<Konva.Text>(null);
  const trRef = React.useRef<Konva.Transformer>(null);

  React.useEffect(() => {
    if (!trRef.current || !shapeRef.current) return;
    if (isSelected) {
      // We need to attach transformer manually.
      trRef.current.nodes([shapeRef.current]);
      trRef.current.getLayer()?.batchDraw();
    }
  }, [isSelected]);

  return (
    <React.Fragment>
      <Text
        ref={shapeRef}
        text={` ${text} `}
        fill={color}
        fontSize={fontSize}
        x={x + (pos.x ?? 0)}
        y={y + (pos.y ?? 0)}
        draggable={isSelected}
        onClick={onSelect}
        onDragEnd={(e) => {
          setPos({
            x: e.target.x() - x,
            y: e.target.y() - y,
          });
        }}
        onTransform={() => {
          const node = shapeRef.current;
          if (!node) return;
          const scaleX = node.scaleX();
          const scaleY = node.scaleY();
        }}
      />
      {isSelected && <Transformer ref={trRef} rotateEnabled={false} />}
    </React.Fragment>
  );
};

const RectTransformer: React.FC<{
  shapeProps: Konva.RectConfig;
  isSelected: boolean;
  onSelect: () => void;
  onChange: (newProps: Konva.RectConfig) => void;
}> = ({ shapeProps, isSelected, onChange, onSelect }) => {
  const { transparent, color } = useControls("Shape Props", {
    transparent: true,
    color: {
      value: "#ffffff",
      render: (getValue) => !getValue("Shape Props.transparent"),
    },
  });
  const { centerPaneWidth, sidePaneHeight, innerBorderWidth } =
    React.useContext(PaneCtx);

  const shapeRef = React.useRef<Konva.Rect>(null);
  const trRef = React.useRef<Konva.Transformer>(null);

  React.useEffect(() => {
    if (!trRef.current || !shapeRef.current) return;
    if (isSelected) {
      // We need to attach transformer manually.
      trRef.current.nodes([shapeRef.current]);
      trRef.current.getLayer()?.batchDraw();
    }
  }, [isSelected]);

  const handleOnDragMove = React.useCallback(
    (e: KonvaEventObject<DragEvent>) => {
      let x = e.currentTarget.x();
      let y = e.currentTarget.y();
      const width = e.currentTarget.width();
      const height = e.currentTarget.height();

      if (x < 0) {
        x = 0;
        e.currentTarget.x(0);
      }
      if (y < 0) {
        y = 0;
        e.currentTarget.y(0);
      }

      if (x + width > centerPaneWidth - 4 * innerBorderWidth) {
        x = centerPaneWidth - 4 * innerBorderWidth - width;
        e.currentTarget.x(x);
      }
      if (y + height > sidePaneHeight - 4 * innerBorderWidth) {
        y = sidePaneHeight - 4 * innerBorderWidth - height;
        e.currentTarget.y(y);
      }

      onChange({
        ...shapeProps,
        x,
        y,
      });
    },
    [onChange, shapeProps]
  );

  const handleOnTransform = React.useCallback(() => {
    const node = shapeRef.current;
    if (!node) return;
    const scaleX = node.scaleX();
    const scaleY = node.scaleY();

    // We will reset it back.
    node.scaleX(1);
    node.scaleY(1);

    let x = node.x();
    let y = node.y();
    let width = node.width();
    let height = node.height();

    if (x < 0) {
      x = 0;
      node.x(0);
    } else {
      width *= scaleX;
    }
    if (y < 0) {
      y = 0;
      node.y(0);
    } else {
      height *= scaleY;
    }

    if (x + width > centerPaneWidth - innerBorderWidth * 4) {
      width = centerPaneWidth - x - innerBorderWidth * 4;
    }
    if (y + height > sidePaneHeight - innerBorderWidth * 4) {
      height = sidePaneHeight - y - innerBorderWidth * 4;
    }

    onChange({
      ...shapeProps,
      x,
      y,
      width,
      height,
    });
  }, []);

  return (
    <React.Fragment>
      <Rect
        ref={shapeRef}
        {...shapeProps}
        fill={transparent ? undefined : color}
        stroke="black"
        strokeEnabled={transparent}
        onClick={onSelect}
        draggable={isSelected}
        onDragMove={handleOnDragMove}
        onTransform={handleOnTransform}
      />
      {isSelected && (
        <Transformer
          ref={trRef}
          rotateEnabled={false}
          keepRatio={false}
          boundBoxFunc={(oldBox, newBox) => {
            // limit resize
            if (newBox.width < 35 || newBox.height < 35) {
              return oldBox;
            }
            return newBox;
          }}
        />
      )}
    </React.Fragment>
  );
};

export const ThumbnailEditor: React.FC<{
  title: string;
  inputs: IO[];
  outputs: IO[];
}> = ({ title: baseTitle, inputs, outputs }) => {
  const [{ title }, set] = useControls(() => ({
    title: baseTitle,
  }));
  const { screenWidth, screenHeight } = React.useContext(ScreenCtx);
  const { centerPaneX, innerBorderWidth, sidePaneHeight } =
    React.useContext(PaneCtx);
  const [shapeProps, setShapeProps] = React.useState<Konva.RectConfig>({
    fill: "orange",
    width: 800,
    height: 400,
    rotation: 0,
    x: 0,
    y: 0,
  });
  const [selected, setSelected] = React.useState<"" | "shape" | "title">("");

  const handleOnShapeChange = React.useCallback(
    (e: Konva.RectConfig) => {
      setShapeProps(e);
      console.log("change:", e);
    },
    [setShapeProps]
  );

  return (
    <>
      <Group x={centerPaneX + innerBorderWidth * 2} y={innerBorderWidth * 2}>
        <RectTransformer
          shapeProps={shapeProps}
          isSelected={selected === "shape"}
          onSelect={() => {
            setSelected("shape");
          }}
          onChange={handleOnShapeChange}
        />
        {inputs.map((elem, i) => (
          <Circle
            key={i}
            fill="blue"
            radius={10}
            x={shapeProps.x}
            y={
              (shapeProps.y ?? 0) +
              (shapeProps.height ?? 0) * ((elem.y ?? 0) / sidePaneHeight)
            }
          />
        ))}
        {outputs.map((elem, i) => (
          <Circle
            key={i}
            fill="blue"
            radius={10}
            x={(shapeProps.x ?? 0) + (shapeProps.width ?? 0)}
            y={
              (shapeProps.y ?? 0) +
              (shapeProps.height ?? 0) * ((elem.y ?? 0) / sidePaneHeight)
            }
          />
        ))}
        <Text
          x={0}
          y={0}
          width={780}
          text={[
            ...inputs.map((i) => `input ${i.title}: ${i.y}`),
            ...outputs.map((i) => `output ${i.title}: ${i.y}`),
          ].join("\n")}
        />
        <TextTransformer
          x={shapeProps.x ?? 0}
          y={shapeProps.y ?? 0}
          text={title}
          isSelected={selected === "title"}
          onSelect={() => {
            setSelected("title");
          }}
        />
      </Group>
    </>
  );
};