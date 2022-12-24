import Konva from "konva";
import type { KonvaEventObject } from "konva/lib/Node";
import React from "react";
import { Circle, Group, Line, Rect, Text } from "react-konva";
import type {
  Connection,
  ConnectionIO,
  EntityInstance,
  IO,
} from "./entityInstance";
import { PaneCtx, ScreenCtx } from "./UI";

const IOElement: React.FC<{
  pos: number;
  mode: "inputs" | "outputs";
  paneWidth: number;
  height: number;
  title?: string;
  setPos?: (title: string, newPos: number) => void;
  color: string;
  onClickConnection?: (target: ConnectionIO, x: number, y: number) => void;
  setConnections?: (hdlr: (connections: Connection[]) => Connection[]) => void;
}> = ({
  mode,
  pos,
  paneWidth,
  height,
  title,
  setPos,
  color,
  onClickConnection,
  setConnections,
}) => {
  const { screenWidth, screenHeight } = React.useContext(ScreenCtx);
  const { centerPaneX, outerBorderWidth, sidePaneHeight } =
    React.useContext(PaneCtx);
  const ref = React.useRef<Konva.Group>(null);
  const width = paneWidth * 0.6;

  const x =
    mode === "inputs"
      ? (paneWidth - width) / 2
      : screenWidth - paneWidth + (paneWidth - width) / 2;

  const toggleRadius = 10;
  const connectionRadius = toggleRadius / 2;

  const handleDragMove = React.useCallback(
    (e: KonvaEventObject<DragEvent>) => {
      e.currentTarget.x(x);
      e.currentTarget.y(e.currentTarget.y());

      const absPos = e.currentTarget.absolutePosition();

      setConnections?.((connections) =>
        (connections ?? []).map((elem) => {
          if (
            elem.From.Type === "" &&
            elem.From.title === "" &&
            elem.From.subtype === mode &&
            elem.From.subtitle === title
          ) {
            elem.points.From[1] =
              (absPos.y + height / 2 - connectionRadius / 2) / screenHeight;
          }
          if (
            elem.To.Type === "" &&
            elem.To.title === "" &&
            elem.To.subtype === mode &&
            elem.To.subtitle === title
          ) {
            elem.points.To[1] =
              (absPos.y + height / 2 - connectionRadius / 2) / screenHeight;
          }

          return elem;
        })
      );

      if (setPos && title) {
        setPos(title, (e.currentTarget.y() + height / 2) / sidePaneHeight);
      }
    },
    [
      screenWidth,
      screenHeight,
      sidePaneHeight,
      mode,
      title,
      connectionRadius,
      height,
      setPos,
    ]
  );

  const handleDragOnMouseOver = React.useCallback(
    (e: KonvaEventObject<MouseEvent>) => {
      e.currentTarget.setAttr("prev_fill", e.currentTarget.getAttr("fill"));
      e.currentTarget.setAttr("fill", "rgb(126, 126, 126)");
    },
    []
  );

  const handleDragOnMouseOut = React.useCallback(
    (e: KonvaEventObject<MouseEvent>) => {
      e.currentTarget.setAttr("fill", e.currentTarget.getAttr("prev_fill"));
    },
    []
  );

  const handleConnectionOnMouseOver = React.useCallback(
    (e: KonvaEventObject<MouseEvent>) => {
      e.currentTarget.setAttr("prev_fill", e.currentTarget.getAttr("fill"));
      const prevRadius = parseInt(e.currentTarget.getAttr("radius"));
      e.currentTarget.setAttr("prev_radius", prevRadius);
      e.currentTarget.setAttr("fill", "rgb(126, 126, 126)");
      e.currentTarget.setAttr("radius", prevRadius * 1.3);
    },
    []
  );

  const handleConnectionOnMouseOut = React.useCallback(
    (e: KonvaEventObject<MouseEvent>) => {
      e.currentTarget.setAttr("fill", e.currentTarget.getAttr("prev_fill"));
      e.currentTarget.setAttr("radius", e.currentTarget.getAttr("prev_radius"));
    },
    []
  );

  const handleConnectionOnClick = React.useCallback(
    (e: KonvaEventObject<MouseEvent>) => {
      if (!title) return;
      e.cancelBubble = true;
      const pos = e.currentTarget.absolutePosition();
      onClickConnection?.(
        { Type: "", title: "", subtype: mode, subtitle: title },
        pos.x,
        pos.y - connectionRadius / 2
      );
    },
    [onClickConnection, connectionRadius]
  );

  return (
    <Group
      x={x}
      y={pos * sidePaneHeight - height / 2}
      ref={ref}
      draggable
      onDragMove={handleDragMove}
    >
      <Rect
        fill={color}
        width={width}
        height={height}
        onMouseOver={handleDragOnMouseOver}
        onMouseOut={handleDragOnMouseOut}
      />
      <Line
        stroke="black"
        strokeWidth={1}
        points={[
          mode === "inputs"
            ? centerPaneX - x
            : -(paneWidth - width) / 2 - outerBorderWidth,
          height / 2,
          mode === "inputs"
            ? centerPaneX - x + toggleRadius * 2.5
            : -(paneWidth - width) / 2 - outerBorderWidth - toggleRadius * 2.5,
          height / 2,
        ]}
      />
      <Circle
        fill="red"
        x={
          mode === "inputs"
            ? centerPaneX - x
            : -(paneWidth - width) / 2 - outerBorderWidth
        }
        y={height / 2}
        radius={toggleRadius}
      />
      <Circle
        fill="black"
        x={
          mode === "inputs"
            ? centerPaneX - x + toggleRadius * 2.5
            : -(paneWidth - width) / 2 - outerBorderWidth - toggleRadius * 2.5
        }
        y={height / 2}
        radius={connectionRadius}
        onMouseOver={handleConnectionOnMouseOver}
        onMouseOut={handleConnectionOnMouseOut}
        onClick={handleConnectionOnClick}
      />
    </Group>
  );
};

const IOPane: React.FC<{
  mode: "inputs" | "outputs";
  ios: IO[] | undefined;
  setIOPos: (title: string, newPos: number) => void;
  addIO: (pos: number) => void;
  onClickConnection: (target: ConnectionIO, x: number, y: number) => void;
  setConnections?: (hdlr: (connections: Connection[]) => Connection[]) => void;
}> = ({
  mode,
  ios = [],
  setIOPos,
  addIO,
  onClickConnection,
  setConnections,
}) => {
  const { screenWidth, screenHeight } = React.useContext(ScreenCtx);
  const { sidePaneWidth, sidePaneHeight } = React.useContext(PaneCtx);
  const [pos, setPos] = React.useState<number | null>(null);

  const ioHeight = screenHeight * 0.046;

  const handleOnMouseMove = React.useCallback(
    (e: KonvaEventObject<MouseEvent>) => {
      const newPos =
        e.evt.offsetY -
        (screenHeight * 0.07 + screenHeight * 0.02 + screenHeight * 0.005 * 2);
      if (
        ios.find(
          ({ y = 0 }) =>
            newPos < ioHeight / 2 ||
            (newPos >= y * sidePaneHeight &&
              newPos <= y * sidePaneHeight + ioHeight) ||
            (newPos + ioHeight >= y * sidePaneHeight &&
              newPos + ioHeight <= y * sidePaneHeight + ioHeight) ||
            newPos + ioHeight >= sidePaneHeight
        )
      ) {
        setPos(null);
        return;
      }
      setPos(newPos / sidePaneHeight);
    },
    [setPos, ios, sidePaneWidth, sidePaneHeight, ioHeight]
  );
  const handleOnMouseLeave = React.useCallback(
    (_: KonvaEventObject<MouseEvent>) => {
      setPos(null);
    },
    [setPos]
  );

  const handleOnClick = React.useCallback(
    (_: KonvaEventObject<MouseEvent>) => {
      if (!pos) return;
      addIO(pos);
      setPos(null);
    },
    [setPos, addIO, pos]
  );

  return (
    <Group
      onMouseMove={handleOnMouseMove}
      onMouseLeave={handleOnMouseLeave}
      onClick={handleOnClick}
    >
      <Rect
        x={mode === "inputs" ? 0 : screenWidth - sidePaneWidth}
        y={0}
        width={sidePaneWidth}
        height={screenHeight - screenHeight * (0.07 + 0.02)}
      />
      {!!pos && (
        <IOElement
          mode={mode}
          paneWidth={sidePaneWidth}
          height={ioHeight}
          pos={pos}
          color="rgb(126, 126, 126)"
        />
      )}
      {ios.map((io, i) => (
        <IOElement
          key={i}
          mode={mode}
          paneWidth={sidePaneWidth}
          height={ioHeight}
          pos={io.y ?? 50 * i}
          title={io.title}
          setPos={setIOPos}
          color="rgb(58, 58, 58)"
          onClickConnection={onClickConnection}
          setConnections={setConnections}
        />
      ))}
    </Group>
  );
};

export const IOPanes: React.FC<{
  inputs: IO[];
  setInputs: React.Dispatch<React.SetStateAction<IO[]>>;
  outputs: IO[];
  setOutputs: React.Dispatch<React.SetStateAction<IO[]>>;
  setConnections: (hdlr: (connections: Connection[]) => Connection[]) => void;
  handleOnClickConnection: (target: ConnectionIO, x: number, y: number) => void;
}> = ({
  setConnections,
  handleOnClickConnection,
  inputs,
  setInputs,
  outputs,
  setOutputs,
}) => {
  const setInputPos = React.useCallback(
    (title: string, newPos: number) => {
      setInputs((inputs) =>
        inputs.map((elem) => ({
          ...elem,
          y: elem.title === title ? newPos : elem.y,
        }))
      );
    },
    [setInputs]
  );
  const setOutputPos = React.useCallback(
    (title: string, newPos: number) => {
      setOutputs((outputs) =>
        outputs.map((elem) => ({
          ...elem,
          y: elem.title === title ? newPos : elem.y,
        }))
      );
    },
    [setOutputs]
  );
  const addInput = React.useCallback(
    (pos: number) => {
      setInputs((inputs) => [
        ...inputs,
        { title: (inputs.length + 1).toString(), value: false, y: pos },
      ]);
    },
    [setInputs]
  );
  const addOutput = React.useCallback(
    (pos: number) => {
      setOutputs((outputs) => [
        ...outputs,
        { title: (outputs.length + 1).toString(), value: false, y: pos },
      ]);
    },
    [setOutputs]
  );

  return (
    <>
      <IOPane
        mode="inputs"
        ios={inputs}
        setIOPos={setInputPos}
        addIO={addInput}
        onClickConnection={handleOnClickConnection}
        setConnections={setConnections}
      />
      <IOPane
        mode="outputs"
        ios={outputs}
        setIOPos={setOutputPos}
        addIO={addOutput}
        onClickConnection={handleOnClickConnection}
        setConnections={setConnections}
      />
    </>
  );
};

export const useIOPanes = (
  g: EntityInstance,
  setConnections: (hdlr: (connections: Connection[]) => Connection[]) => void,
  handleOnClickConnection: (target: ConnectionIO, x: number, y: number) => void
) => {
  const [inputs, setInputs] = React.useState(g.root.inputs ?? []);
  const [outputs, setOutputs] = React.useState(g.root.outputs ?? []);
  React.useEffect(() => {
    setInputs(g.root.inputs ?? []);
    setOutputs(g.root.outputs ?? []);
  }, [g, setInputs, setOutputs]);

  const renderedIOPanes = React.useMemo(
    () => (
      <IOPanes
        setConnections={setConnections}
        handleOnClickConnection={handleOnClickConnection}
        inputs={inputs}
        setInputs={setInputs}
        outputs={outputs}
        setOutputs={setOutputs}
      />
    ),
    [
      setConnections,
      handleOnClickConnection,
      setInputs,
      inputs,
      setOutputs,
      outputs,
    ]
  );

  return { inputs, outputs, renderedIOPanes };
};