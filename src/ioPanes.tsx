import type { KonvaEventObject } from "konva/lib/Node";
import React from "react";
import { Circle, Group, Line, Rect } from "react-konva";
import type { Connection, ConnectionIO, EntityInstance, IO } from "./entityInstance";
import { LogicLabel } from "./Label";
import { useLibraryDispatch } from "./reducer";
import { PaneCtx, ScreenCtx } from "./UI";

const IOElement: React.FC<{
  pos: number;
  mode: "inputs" | "outputs";
  paneWidth: number;
  height: number;
  parentType: string;
  title?: string;
  value?: boolean;
  setPos?: (title: string, newPos: number) => void;
  color: string;
  onClickConnection?: (target: ConnectionIO, x: number, y: number) => void;
  setConnections?: (hdlr: (connections: Connection[]) => Connection[]) => void;
}> = ({ mode, pos, value, paneWidth, height, parentType, title, setPos, color, onClickConnection, setConnections }) => {
  const { screenWidth, screenHeight } = React.useContext(ScreenCtx);
  const { centerPaneX, outerBorderWidth, sidePaneHeight } = React.useContext(PaneCtx);
  const dispatch = useLibraryDispatch();

  const width = paneWidth * 0.6;
  const x = mode === "inputs" ? (paneWidth - width) / 2 : screenWidth - paneWidth + (paneWidth - width) / 2;

  const toggleRadius = 10;
  const connectionRadius = toggleRadius / 2;

  const handleDragEnd = React.useCallback(
    (e: KonvaEventObject<DragEvent>) => {
      if (!title) return;
      dispatch({
        type: "updateIOPane",
        action: "update",
        parentType,
        mode,
        title,
        y: (e.currentTarget.y() + height / 2) / sidePaneHeight,
      });
    },
    [parentType, mode, title, height, sidePaneHeight, dispatch],
  );

  const handleDragMove = React.useCallback(
    (e: KonvaEventObject<DragEvent>) => {
      e.currentTarget.x(x);
      e.currentTarget.y(e.currentTarget.y());

      const absPos = e.currentTarget.absolutePosition();

      setConnections?.((connections) =>
        (connections ?? []).map((elem) => {
          if (elem.From.Type === "root" && elem.From.title === parentType && elem.From.subtype === mode && elem.From.subtitle === title) {
            elem.points.From[1] = (absPos.y + height / 2 - connectionRadius / 2) / screenHeight;
          }
          if (elem.To.Type === "root" && elem.To.title === parentType && elem.To.subtype === mode && elem.To.subtitle === title) {
            elem.points.To[1] = (absPos.y + height / 2 - connectionRadius / 2) / screenHeight;
          }

          return elem;
        }),
      );

      if (setPos && title) {
        setPos(title, (e.currentTarget.y() + height / 2) / sidePaneHeight);
      }
    },
    [screenHeight, sidePaneHeight, mode, parentType, title, connectionRadius, height, setPos, setConnections, x],
  );

  const handleDragOnMouseOver = React.useCallback((e: KonvaEventObject<MouseEvent>) => {
    e.currentTarget.setAttr("prev_fill", e.currentTarget.getAttr("fill"));
    e.currentTarget.setAttr("fill", "rgb(126, 126, 126)");
  }, []);

  const handleDragOnMouseOut = React.useCallback((e: KonvaEventObject<MouseEvent>) => {
    e.currentTarget.setAttr("fill", e.currentTarget.getAttr("prev_fill"));
  }, []);

  const handleConnectionOnMouseOver = React.useCallback((e: KonvaEventObject<MouseEvent>) => {
    e.currentTarget.setAttr("prev_fill", e.currentTarget.getAttr("fill"));
    const prevRadius = parseInt(e.currentTarget.getAttr("radius"));
    e.currentTarget.setAttr("prev_radius", prevRadius);
    e.currentTarget.setAttr("fill", "rgb(126, 126, 126)");
    e.currentTarget.setAttr("radius", prevRadius * 1.3);
  }, []);

  const handleConnectionOnMouseOut = React.useCallback((e: KonvaEventObject<MouseEvent>) => {
    e.currentTarget.setAttr("fill", e.currentTarget.getAttr("prev_fill"));
    e.currentTarget.setAttr("radius", e.currentTarget.getAttr("prev_radius"));
  }, []);

  const handleConnectionOnClick = React.useCallback(
    (e: KonvaEventObject<MouseEvent>) => {
      if (!title) return;
      e.cancelBubble = true;
      const pos = e.currentTarget.absolutePosition();
      onClickConnection?.({ Type: "", title: "", subtype: mode, subtitle: title }, pos.x, pos.y - connectionRadius / 2);
    },
    [title, onClickConnection, connectionRadius, mode],
  );

  const handleDblClick = React.useCallback(() => {
    dispatch({
      type: "updateIOPane",
      action: "remove",
      parentType,
      mode,
      title: title!,
      y: 0,
    });
  }, [parentType, title, mode, dispatch]);

  return (
    <Group x={x} y={pos * sidePaneHeight - height / 2} draggable onDragMove={handleDragMove} onDragEnd={handleDragEnd}>
      <Rect fill={color} width={width} height={height} onMouseOver={handleDragOnMouseOver} onMouseOut={handleDragOnMouseOut} onDblClick={handleDblClick} />
      <Line
        stroke="black"
        strokeWidth={1}
        points={[
          mode === "inputs" ? centerPaneX - x : -(paneWidth - width) / 2 - outerBorderWidth,
          height / 2,
          mode === "inputs" ? centerPaneX - x + toggleRadius * 2.5 : -(paneWidth - width) / 2 - outerBorderWidth - toggleRadius * 2.5,
          height / 2,
        ]}
      />
      <Circle
        fill={value === undefined ? "white" : value ? "red" : "black"}
        x={mode === "inputs" ? centerPaneX - x : -(paneWidth - width) / 2 - outerBorderWidth}
        y={height / 2}
        radius={toggleRadius}
      />
      <Circle
        fill="black"
        x={mode === "inputs" ? centerPaneX - x + toggleRadius * 2.5 : -(paneWidth - width) / 2 - outerBorderWidth - toggleRadius * 2.5}
        y={height / 2}
        radius={connectionRadius}
        onMouseOver={handleConnectionOnMouseOver}
        onMouseOut={handleConnectionOnMouseOut}
        onClick={handleConnectionOnClick}
      />
      <LogicLabel
        x={mode === "inputs" ? centerPaneX - x + toggleRadius * 2.5 : -(paneWidth - width) / 2 - outerBorderWidth - toggleRadius * 2.5}
        y={height / 2 - 5}
        pointerDirection="down"
        pointerWidth={5}
        pointerHeight={5}
        fontSize={8}
        text={title ?? "?"}
      />
    </Group>
  );
};

const IOPane: React.FC<{
  parentType: string;
  mode: "inputs" | "outputs";
  ios: IO[] | undefined;
  setIOPos: (title: string, newPos: number) => void;
  addIO: (pos: number) => void;
  onClickConnection: (target: ConnectionIO, x: number, y: number) => void;
  setConnections?: (hdlr: (connections: Connection[]) => Connection[]) => void;
}> = ({ parentType, mode, ios = [], setIOPos, addIO, onClickConnection, setConnections }) => {
  const { screenWidth, screenHeight } = React.useContext(ScreenCtx);
  const { sidePaneWidth, sidePaneHeight } = React.useContext(PaneCtx);
  const [pos, setPos] = React.useState<number | null>(null);

  const ioHeight = screenHeight * 0.046;

  const handleOnMouseMove = React.useCallback(
    (e: KonvaEventObject<MouseEvent>) => {
      const newPos = e.evt.offsetY - (screenHeight * 0.07 + screenHeight * 0.02 + screenHeight * 0.005 * 2);
      if (
        ios.find(
          ({ y = 0 }) =>
            newPos < ioHeight / 2 ||
            (newPos >= y * sidePaneHeight && newPos <= y * sidePaneHeight + ioHeight) ||
            (newPos + ioHeight >= y * sidePaneHeight && newPos + ioHeight <= y * sidePaneHeight + ioHeight) ||
            newPos + ioHeight >= sidePaneHeight,
        )
      ) {
        setPos(null);
        return;
      }
      setPos(newPos / sidePaneHeight);
    },
    [setPos, ios, sidePaneHeight, ioHeight, screenHeight],
  );
  const handleOnMouseLeave = React.useCallback(() => {
    setPos(null);
  }, [setPos]);

  const handleOnClick = React.useCallback(() => {
    if (!pos) return;
    addIO(pos);
    setPos(null);
  }, [setPos, addIO, pos]);

  return (
    <Group onMouseMove={handleOnMouseMove} onMouseLeave={handleOnMouseLeave} onClick={handleOnClick}>
      <Rect x={mode === "inputs" ? 0 : screenWidth - sidePaneWidth} y={0} width={sidePaneWidth} height={screenHeight - screenHeight * (0.07 + 0.02)} />
      {!!pos && <IOElement parentType={parentType} mode={mode} paneWidth={sidePaneWidth} height={ioHeight} pos={pos} color="rgb(126, 126, 126)" />}
      {ios.map((io, i) => (
        <IOElement
          key={i}
          parentType={parentType}
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
  parentType: string;
  inputs: IO[];
  setInputs: React.Dispatch<React.SetStateAction<IO[]>>;
  outputs: IO[];
  setOutputs: React.Dispatch<React.SetStateAction<IO[]>>;
  setConnections: (hdlr: (connections: Connection[]) => Connection[]) => void;
  handleOnClickConnection: (target: ConnectionIO, x: number, y: number) => void;
}> = ({ parentType, setConnections, handleOnClickConnection, inputs, setInputs, outputs, setOutputs }) => {
  const dispatch = useLibraryDispatch();

  const setInputPos = React.useCallback(
    (title: string, newPos: number) => {
      setInputs((inputs) =>
        inputs.map((elem) => ({
          ...elem,
          y: elem.title === title ? newPos : elem.y,
        })),
      );
    },
    [setInputs],
  );
  const setOutputPos = React.useCallback(
    (title: string, newPos: number) => {
      setOutputs((outputs) =>
        outputs.map((elem) => ({
          ...elem,
          y: elem.title === title ? newPos : elem.y,
        })),
      );
    },
    [setOutputs],
  );
  const addInput = React.useCallback(
    (pos: number) => {
      setInputs((ios) => {
        const newIO: IO = {
          title: (ios.length + 1).toString(),
          value: false,
          y: pos,
        };
        dispatch({
          type: "updateIOPane",
          action: "add",
          parentType,
          mode: "inputs",
          title: newIO.title,
          y: newIO.y,
        });
        return [...ios, newIO];
      });
    },
    [setInputs, parentType, dispatch],
  );
  const addOutput = React.useCallback(
    (pos: number) => {
      setOutputs((ios) => {
        const newIO: IO = {
          title: (ios.length + 1).toString(),
          value: false,
          y: pos,
        };
        dispatch({
          type: "updateIOPane",
          action: "add",
          parentType,
          mode: "outputs",
          title: newIO.title,
          y: newIO.y,
        });
        return [...ios, newIO];
      });
    },
    [setOutputs, parentType, dispatch],
  );

  return (
    <>
      <IOPane
        parentType={parentType}
        mode="inputs"
        ios={inputs}
        setIOPos={setInputPos}
        addIO={addInput}
        onClickConnection={handleOnClickConnection}
        setConnections={setConnections}
      />
      <IOPane
        parentType={parentType}
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
  handleOnClickConnection: (target: ConnectionIO, x: number, y: number) => void,
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
        parentType={g.root.Type}
        setConnections={setConnections}
        handleOnClickConnection={handleOnClickConnection}
        inputs={inputs}
        setInputs={setInputs}
        outputs={outputs}
        setOutputs={setOutputs}
      />
    ),
    [setConnections, handleOnClickConnection, setInputs, inputs, setOutputs, outputs, g.root.Type],
  );

  return { inputs, outputs, renderedIOPanes };
};
