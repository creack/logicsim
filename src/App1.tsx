import type konva from "konva";
import Konva from "konva";
import type { KonvaEventObject } from "konva/lib/Node";
import React from "react";
import { Circle, Group, Layer, Line, Rect, Stage, Text } from "react-konva";
import { Html } from "react-konva-utils";
import {
  Entity,
  Connection,
  ConnectionIO,
  IO,
  formatEntity,
} from "./entityInstance";
import { EntityInstance } from "./entityInstance";
import { gState, library } from "./lib";
import {
  PaneCtx,
  ScreenCtx,
  UILayoutFooter,
  UILayoutHeader,
  UILayoutMain,
} from "./UI";
import { button, useControls } from "leva";
import { ThumbnailEditor } from "./ThumbnailEditor";

const IOElement: React.FC<{
  g: EntityInstance;
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
  g,
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
  const { centerPaneX, centerPaneWidth, outerBorderWidth, sidePaneHeight } =
    React.useContext(PaneCtx);
  const ref = React.useRef<Konva.Group>(null);
  const width = paneWidth * 0.6;

  const x =
    mode === "inputs"
      ? (paneWidth - width) / 2
      : screenWidth - paneWidth + (paneWidth - width) / 2;

  const toggleRadius = 10;
  const connectionRadius = toggleRadius / 2;

  const handleDragMove = React.useCallback((e: KonvaEventObject<DragEvent>) => {
    e.currentTarget.x(x);
    e.currentTarget.y(e.currentTarget.y());

    const pos = e.currentTarget.absolutePosition();

    setConnections?.((connections) =>
      (connections ?? []).map((elem) => {
        if (
          elem.From.Type === "" &&
          elem.From.title === "" &&
          elem.From.subtype === mode &&
          elem.From.subtitle === title
        ) {
          elem.points.From[1] =
            (pos.y + height / 2 - connectionRadius / 2) / screenHeight;
        }
        if (
          elem.To.Type === "" &&
          elem.To.title === "" &&
          elem.To.subtype === mode &&
          elem.To.subtitle === title
        ) {
          elem.points.To[1] =
            (pos.y + height / 2 - connectionRadius / 2) / screenHeight;
        }

        return elem;
      })
    );
  }, []);

  const handleDragEnd = React.useCallback(
    (e: KonvaEventObject<DragEvent>) => {
      if (setPos && title) {
        setPos(title, (e.currentTarget.y() + height / 2) / sidePaneHeight);
      }
    },
    [setPos, title, height]
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
      onDragEnd={handleDragEnd}
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
  g: EntityInstance;
  mode: "inputs" | "outputs";
  ios: IO[] | undefined;
  setIOPos: (title: string, newPos: number) => void;
  addIO: (pos: number) => void;
  onClickConnection: (target: ConnectionIO, x: number, y: number) => void;
  setConnections?: (hdlr: (connections: Connection[]) => Connection[]) => void;
}> = ({
  g,
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
            (newPos >= y && newPos <= y + ioHeight) ||
            (newPos + ioHeight >= y && newPos + ioHeight <= y + ioHeight) ||
            newPos + ioHeight >= sidePaneHeight
        )
      ) {
        setPos(null);
        return;
      }
      setPos(newPos);
    },
    [setPos, ios, sidePaneWidth, ioHeight]
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
          g={g}
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
          g={g}
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
      <Text text="worl2d" />
    </Group>
  );
};

const baseLibrary = library();

const lookupLibrary = (Type: string): Entity | undefined => {
  return baseLibrary.find((elem) => elem.Type === Type);
};

const LevaTest: React.FC = () => {
  const [viewMode, setViewMode] = React.useState<"main" | "thumbnail">("main");
  const values = useControls("View Mode", {
    main: button(() => {
      setViewMode("main");
    }),
    thumbnail: button(() => {
      setViewMode("thumbnail");
    }),
  });

  return (
    <Html>
      <p>{JSON.stringify({ values, viewMode })}</p>
    </Html>
  );
};

const Main: React.FC<{ srcType: string }> = ({ srcType }) => {
  const g = React.useMemo(
    () =>
      new EntityInstance(
        library().find((elem) => elem.Type === srcType) ?? gState(),
        library
      ),
    [srcType]
  );
  const [inputs, setInputs] = React.useState(g.root.inputs ?? []);
  const [outputs, setOutputs] = React.useState(g.root.outputs ?? []);
  const [connections, setConnections] = React.useState(
    g.root.connections ?? []
  );
  const [entities, setEntities] = React.useState(g.root.entities ?? []);

  React.useEffect(() => {
    setInputs(g.root.inputs ?? []);
    setOutputs(g.root.outputs ?? []);
    setConnections(g.root.connections ?? []);
    setEntities(g.root.entities ?? []);
  }, [g, setInputs, setOutputs, setConnections, setEntities]);

  const [drawConnection, setDrawConnection] = React.useState<{
    drawing: boolean;
    drawingPoint: [number, number] | null;
    From?: ConnectionIO;
    To?: ConnectionIO;
    points: [number, number][];
  }>({ drawing: false, drawingPoint: null, points: [] });

  const { screenWidth, screenHeight } = React.useContext(ScreenCtx);
  const { centerPaneX, centerPaneY, innerBorderWidth, sidePaneHeight } =
    React.useContext(PaneCtx);

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

  const handleOnClickConnection = React.useCallback(
    (target: ConnectionIO, x: number, y: number) => {
      setDrawConnection((draw) => {
        if (draw.drawing && draw.From) {
          setConnections((connections) => [
            ...connections,
            {
              From: draw.From,
              To: target,
              points: {
                From: [
                  draw.points[0][0] / screenWidth,
                  draw.points[0][1] / screenHeight,
                ],
                intermediaries: draw.points
                  .slice(1)
                  .map((p) => [p[0] / screenWidth, p[1] / screenHeight]),
                To: [x / screenWidth, y / screenHeight],
              },
            },
          ]);
        }
        return {
          drawing: !draw.drawing,
          drawingPoint: draw.drawing ? null : [x, y],
          points: draw.drawing ? [] : [[x, y]],
          From: target,
        };
      });
    },
    [setDrawConnection, setConnections]
  );

  React.useEffect(() => {
    console.log("Connections change:", connections);
  }, [connections]);

  const handleOnMouseMove = React.useCallback(
    (e: KonvaEventObject<MouseEvent>) => {
      if (!drawConnection.drawing) return;

      setDrawConnection({
        ...drawConnection,
        drawingPoint: [e.evt.offsetX, e.evt.offsetY],
      });
    },
    [drawConnection, setDrawConnection]
  );

  const handleOnClick = React.useCallback(
    (e: KonvaEventObject<MouseEvent>) => {
      if (!drawConnection.drawing) return;

      setDrawConnection({
        ...drawConnection,
        points: [...drawConnection.points, [e.evt.offsetX, e.evt.offsetY]],
      });
    },
    [drawConnection, setDrawConnection]
  );

  return (
    <Group
      width={screenWidth}
      height={screenHeight}
      onMouseMove={handleOnMouseMove}
      onClick={handleOnClick}
    >
      <Rect width={screenWidth} height={screenHeight} />
      <IOPane
        g={g}
        mode="inputs"
        ios={inputs}
        setIOPos={setInputPos}
        addIO={addInput}
        onClickConnection={handleOnClickConnection}
        setConnections={setConnections}
      />
      <IOPane
        g={g}
        mode="outputs"
        ios={outputs}
        setIOPos={setOutputPos}
        addIO={addOutput}
        onClickConnection={handleOnClickConnection}
        setConnections={setConnections}
      />

      {entities.map((entity, i) => {
        const base = lookupLibrary(entity.Type);
        if (!base) {
          throw new Error(`entity type ${entity.Type} not found in library`);
        }
        const ui = {
          pins: { ...base.ui.pins, ...entity.ui.pins },
          shape: { ...base.ui.shape, ...entity.ui.shape },
          title: { ...base.ui.title, ...entity.ui.title },
        };
        return (
          <Group
            key={i}
            x={centerPaneX + 2 * innerBorderWidth + ui.shape.x}
            y={ui.shape.y}
            draggable
            onDragMove={(e) => {
              const pos = e.currentTarget.absolutePosition();

              setConnections((connections) =>
                (connections ?? []).map((elem) => {
                  if (
                    elem.From.Type === entity.Type &&
                    elem.From.title === entity.title
                  ) {
                    elem.points.From[0] =
                      elem.From.subtype === "inputs"
                        ? pos.x / screenWidth
                        : (pos.x + ui.shape.width) / screenWidth;

                    const targetPin = (
                      elem.From.subtype === "inputs"
                        ? base.inputs
                        : base.outputs
                    )?.find((pin) => pin.title === elem.From.subtitle);

                    elem.points.From[1] =
                      (pos.y -
                        ui.pins.radius / 2 +
                        targetPin.y * ui.shape.height) /
                      screenHeight;
                  }
                  if (
                    elem.To.Type === entity.Type &&
                    elem.To.title === entity.title
                  ) {
                    elem.points.To[0] =
                      elem.To.subtype === "inputs"
                        ? pos.x / screenWidth
                        : (pos.x + ui.shape.width) / screenWidth;

                    const targetPin = (
                      elem.To.subtype === "inputs" ? base.inputs : base.outputs
                    )?.find((pin) => pin.title === elem.To.subtitle);

                    elem.points.To[1] =
                      (pos.y -
                        ui.pins.radius / 2 +
                        targetPin.y * ui.shape.height) /
                      screenHeight;
                  }

                  return elem;
                })
              );
            }}
          >
            <Rect
              width={ui.shape.width ?? 200}
              height={ui.shape.height ?? 200}
              stroke="red"
              strokeEnabled
              fill={ui.shape.transparent ? undefined : ui.shape.color ?? "#111"}
            />
            <Text
              text={entity.Type}
              fontSize={ui.title.fontSize}
              x={ui.title.x}
              y={ui.title.y}
              scaleX={ui.title.scaleX}
              scaleY={ui.title.scaleY}
              fill={ui.title.color ?? "#fff"}
            />
            {base.inputs?.map((input, i) => (
              <Circle
                key={i}
                fill="blue"
                x={0}
                y={ui.shape.height * (input.y ?? 0)}
                radius={ui.pins.radius}
                onMouseOver={(e) => {
                  const prevRadius = parseInt(
                    e.currentTarget.getAttr("radius")
                  );
                  e.currentTarget.setAttr("prev_radius", prevRadius);
                  e.currentTarget.setAttr(
                    "prev_fill",
                    e.currentTarget.getAttr("fill")
                  );
                  e.currentTarget.setAttr("fill", "rgb(126, 126, 126)");
                  e.currentTarget.setAttr("radius", prevRadius * 1.3);
                }}
                onMouseOut={(e) => {
                  e.currentTarget.setAttr(
                    "fill",
                    e.currentTarget.getAttr("prev_fill")
                  );
                  e.currentTarget.setAttr(
                    "radius",
                    e.currentTarget.getAttr("prev_radius")
                  );
                }}
                onClick={(e) => {
                  e.cancelBubble = true;
                  const pos = e.currentTarget.absolutePosition();
                  handleOnClickConnection(
                    {
                      Type: entity.Type,
                      title: entity.title,
                      subtype: "inputs",
                      subtitle: input.title,
                    },
                    pos.x,
                    pos.y - ui.pins.radius / 2
                  );
                }}
              />
            ))}
            {base.outputs?.map((output, i) => (
              <Circle
                key={i}
                fill="blue"
                x={ui.shape.width}
                y={ui.shape.height * (output.y ?? 0)}
                radius={ui.pins.radius}
                onMouseOver={(e) => {
                  e.currentTarget.setAttr(
                    "prev_fill",
                    e.currentTarget.getAttr("fill")
                  );
                  e.currentTarget.setAttr("fill", "rgb(126, 126, 126)");
                }}
                onMouseOut={(e) => {
                  e.currentTarget.setAttr(
                    "fill",
                    e.currentTarget.getAttr("prev_fill")
                  );
                }}
                onClick={(e) => {
                  e.cancelBubble = true;
                  const pos = e.currentTarget.absolutePosition();
                  handleOnClickConnection(
                    {
                      Type: entity.Type,
                      title: entity.title,
                      subtype: "outputs",
                      subtitle: output.title,
                    },
                    pos.x,
                    pos.y - ui.pins.radius / 2
                  );
                }}
              />
            ))}
          </Group>
        );
      })}
      {(drawConnection.drawing || drawConnection.points.length > 1) && (
        <Line
          stroke="black"
          strokeWidth={3}
          tension={0.3}
          points={[
            ...drawConnection.points,
            drawConnection.drawingPoint as [number, number],
          ]
            .filter((elem) => !!elem)
            .flat()
            .map((elem, i) => (i % 2 === 0 ? elem : elem - centerPaneY))}
        />
      )}

      {connections.map((connection, i) => (
        <Line
          key={i}
          stroke="rgb(32, 36, 46)"
          strokeWidth={1}
          tension={0.3}
          points={[
            connection.points!.From,
            ...(connection.points?.intermediaries ?? []),
            connection.points!.To,
          ]
            .flat()
            .map((elem, i) =>
              i % 2 === 0
                ? elem * screenWidth
                : elem * screenHeight - centerPaneY
            )}
        />
      ))}
    </Group>
  );
};
/*
 *       {srcType === "root" ? (
 *         <LevaTest />
 *       ) : (
 *         <ThumbnailEditor
 *           title={g.root.title}
 *           inputs={inputs}
 *           outputs={outputs}
 *         />
 *       )}
 *  */

export const App1 = () => {
  const screenWidth = 1280;
  const screenHeight = 720;

  const [srcType, setSrcType] = React.useState("and");

  return (
    <ScreenCtx.Provider value={{ screenWidth, screenHeight }}>
      <Stage width={screenWidth} height={screenHeight}>
        <Layer>
          <UILayoutHeader>
            <Text text="hello" />
          </UILayoutHeader>
          <UILayoutFooter>
            <Html>
              <div
                style={{
                  width: screenWidth,
                  maxWidth: screenWidth,
                  display: "flex",
                  justifyContent: "center",
                  flexWrap: "wrap",
                }}
              >
                {[gState(), ...library()].map((elem, i) => (
                  <button
                    key={i}
                    style={{ marginLeft: 1, marginRight: 1 }}
                    onClick={() => {
                      setSrcType(elem.Type);
                    }}
                  >
                    {elem.Type}
                  </button>
                ))}
              </div>
            </Html>
          </UILayoutFooter>
          <UILayoutMain>
            <Main srcType={srcType} />
          </UILayoutMain>
        </Layer>
      </Stage>
    </ScreenCtx.Provider>
  );
};
