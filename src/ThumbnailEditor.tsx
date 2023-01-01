import Konva from "konva";
import { KonvaEventObject } from "konva/lib/Node";
import { Box } from "konva/lib/shapes/Transformer";
import { useControls } from "leva";
import React from "react";
import { Circle, Group, Rect, Text, Transformer } from "react-konva";
import type { EntityUI, IO } from "./entityInstance";
import { useLibraryDispatch } from "./reducer";
import { PaneCtx } from "./UI";

const TextTransformer: React.FC<{
  text: string;
  isSelected?: boolean;
  setSelected: React.Dispatch<React.SetStateAction<"" | "title" | "shape">>;
  x: number;
  y: number;
  ui: EntityUI;
  parentType: string;
}> = ({ text, isSelected = false, setSelected, x, y, ui }) => {
  const [{ fontSize, color }, setMenu] = useControls(
    "Title Props",
    () => ({
      fontSize: { value: 26, min: 6, max: 72, step: 1 },
      color: "#000000",
    }),
    [ui.title],
  );
  React.useEffect(() => {
    setMenu({ fontSize: ui.title.fontSize, color: ui.title.color });
  }, [setMenu, ui.title]);
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

  const toggleSelect = React.useCallback(() => {
    setSelected((prev) => (prev === "title" ? "" : "title"));
  }, [setSelected]);

  const enableSelect = React.useCallback(() => {
    setSelected("title");
  }, [setSelected]);

  const handleOnDragEnd = React.useCallback(
    (e: KonvaEventObject<DragEvent>) => {
      setPos(({ x, y }) => ({
        x: e.target.x() - x,
        y: e.target.y() - y,
      }));
    },
    [setPos],
  );

  const handleOnTransform = React.useCallback(() => {
    const node = shapeRef.current;
    if (!node) return;
    const scaleX = node.scaleX();
    const scaleY = node.scaleY();
    console.log("TODO: Implement scale", scaleX, scaleY);
  }, []);

  return (
    <React.Fragment>
      <Text
        ref={shapeRef}
        text={` ${text} `}
        fill={color}
        fontSize={fontSize}
        x={x + pos.x}
        y={y + pos.y}
        draggable
        onClick={toggleSelect}
        onDragStart={enableSelect}
        onDragEnd={handleOnDragEnd}
        onTransform={handleOnTransform}
      />
      {isSelected && <Transformer ref={trRef} rotateEnabled={false} />}
    </React.Fragment>
  );
};

const RectTransformer: React.FC<{
  shapeProps: RectConfig;
  isSelected: boolean;
  setSelected: React.Dispatch<React.SetStateAction<"" | "title" | "shape">>;
  onChange: (newProps: RectConfig) => void;
  ui: EntityUI;
  parentType: string;
}> = ({ shapeProps, isSelected, onChange, setSelected, ui, parentType }) => {
  const [{ transparent, color }, setMenu] = useControls(
    "Shape Props",
    () => ({
      transparent: "transparent" in ui.shape && ui.shape.transparent ? true : false,
      color: {
        value: "color" in ui.shape && ui.shape.color ? ui.shape.color : "#ccc",
        render: (getValue) => !getValue("Shape Props.transparent"),
      },
    }),
    [ui.shape],
  );
  React.useEffect(() => {
    setMenu({
      transparent: "transparent" in ui.shape && ui.shape.transparent ? true : false,
      color: "color" in ui.shape && ui.shape.color ? ui.shape.color : "#ccc",
    });
  }, [ui.shape, setMenu]);
  const { centerPaneWidth, sidePaneHeight, innerBorderWidth } = React.useContext(PaneCtx);

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

  const dispatch = useLibraryDispatch();

  const handleDrag = React.useCallback(
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

      return { x, y, width, height };
    },
    [centerPaneWidth, innerBorderWidth, sidePaneHeight],
  );

  const handleOnDragEnd = React.useCallback(
    (e: KonvaEventObject<DragEvent>) => {
      const { x, y, width, height } = handleDrag(e);

      dispatch({
        type: "updateRootThumbnail",
        parentType,
        ...{
          ...shapeProps,
          x,
          y,
          width,
          height,
        },
      });
    },
    [dispatch, parentType, shapeProps, handleDrag],
  );

  const handleOnDragMove = React.useCallback(
    (e: KonvaEventObject<DragEvent>) => {
      const { x, y } = handleDrag(e);

      onChange({
        ...shapeProps,
        x,
        y,
      });
    },
    [onChange, shapeProps, handleDrag],
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
  }, [centerPaneWidth, innerBorderWidth, onChange, shapeProps, sidePaneHeight]);

  const toggleSelect = React.useCallback(() => {
    setSelected((prev) => (prev === "shape" ? "" : "shape"));
  }, [setSelected]);

  const enableSelect = React.useCallback(() => {
    setSelected("shape");
  }, [setSelected]);

  const boundBoxFunc = React.useCallback((oldBox: Box, newBox: Box) => {
    // Limit resize.
    if (newBox.width < 35 || newBox.height < 35) {
      return oldBox;
    }
    return newBox;
  }, []);

  return (
    <React.Fragment>
      <Rect
        ref={shapeRef}
        {...shapeProps}
        fill={transparent ? undefined : color}
        stroke="black"
        strokeEnabled={transparent}
        onClick={toggleSelect}
        draggable
        onDragStart={enableSelect}
        onDragMove={handleOnDragMove}
        onDragEnd={handleOnDragEnd}
        onTransform={handleOnTransform}
      />
      {isSelected && <Transformer ref={trRef} rotateEnabled={false} keepRatio={false} boundBoxFunc={boundBoxFunc} />}
    </React.Fragment>
  );
};

type RectConfig = {
  fill?: string;
  width: number;
  height: number;
  x: number;
  y: number;
};

export const ThumbnailEditor: React.FC<{
  title: string;
  ui: EntityUI;
  inputs: IO[];
  outputs: IO[];
}> = ({ title, ui, inputs, outputs }) => {
  const { centerPaneX, centerPaneWidth, innerBorderWidth, sidePaneHeight } = React.useContext(PaneCtx);
  const [shapeProps, setShapeProps] = React.useState<RectConfig>({ ...ui.shape });
  const [selected, setSelected] = React.useState<"" | "shape" | "title">("");
  const dispatch = useLibraryDispatch();

  const handlePinChange = React.useCallback(
    (value: string, path: string) => {
      switch (path) {
        case "Pins.radius":
          dispatch({ type: "updateThumbnailUIPins", parentType: title, radius: parseInt(value), color: ui.pins.color });
          return;
        case "Pins.color":
          dispatch({ type: "updateThumbnailUIPins", parentType: title, radius: ui.pins.radius, color: value });
          return;
        default:
          throw new Error(`unknown pinChange path '${path}'`);
      }
    },
    [ui.pins.radius, ui.pins.color, dispatch, title],
  );

  const [{ radius: pinRadius, color: pinColor }, setPinMenu] = useControls(
    "Pins",
    () => ({
      radius: { value: ui.pins.radius, min: 5, max: 30, step: 1, onEditEnd: handlePinChange },
      color: { value: ui.pins.color ?? "white", onEditEnd: handlePinChange },
    }),
    [ui.pins.radius, ui.pins.color],
  );

  React.useEffect(() => {
    setPinMenu({ radius: ui.pins.radius, color: ui.pins.color ?? "white" });
  }, [ui.pins.radius, ui.pins.color, setPinMenu]);

  React.useEffect(() => {
    setShapeProps({
      fill: "transparent" in ui.shape ? undefined : ui.shape.color,
      width: ui.shape.width,
      height: ui.shape.height,
      x: ui.shape.x,
      y: ui.shape.y,
    });
  }, [ui.shape]);

  const inputComponents = React.useMemo(
    () => inputs.map((elem, i) => <Circle key={i} fill={pinColor} radius={pinRadius} x={shapeProps.x} y={shapeProps.y + shapeProps.height * elem.y} />),
    [inputs, shapeProps.x, shapeProps.y, shapeProps.height, pinRadius, pinColor],
  );

  const outputComponents = React.useMemo(
    () =>
      outputs.map((elem, i) => (
        <Circle key={i} fill={pinColor} radius={pinRadius} x={shapeProps.x + shapeProps.width} y={shapeProps.y + shapeProps.height * elem.y} />
      )),
    [outputs, shapeProps.x, shapeProps.y, shapeProps.height, shapeProps.width, pinRadius, pinColor],
  );

  const unselect = React.useCallback(() => {
    setSelected("");
  }, []);

  return (
    <Group x={centerPaneX + innerBorderWidth * 2} y={innerBorderWidth * 2}>
      <Rect width={centerPaneWidth} height={sidePaneHeight} onClick={unselect} />
      {inputComponents}
      {outputComponents}
      <RectTransformer
        shapeProps={shapeProps}
        isSelected={selected === "shape"}
        setSelected={setSelected}
        onChange={setShapeProps}
        ui={ui}
        parentType={title}
      />
      <TextTransformer ui={ui} x={shapeProps.x} y={shapeProps.y} text={title} isSelected={selected === "title"} setSelected={setSelected} parentType={title} />
    </Group>
  );
};
