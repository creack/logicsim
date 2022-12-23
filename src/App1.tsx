import React from "react";
import { Circle, Group, Layer, Line, Rect, Stage, Text } from "react-konva";
import { Html } from "react-konva-utils";
import { useDrawConnections } from "./drawConnections";
import type { ConnectionIO, Entity } from "./entityInstance";
import { EntityInstance, formatEntity } from "./entityInstance";
import { IOPanes } from "./ioPanes";
import { library } from "./lib";
import {
  PaneCtx,
  ScreenCtx,
  UILayoutFooter,
  UILayoutHeader,
  UILayoutMain,
} from "./UI";

const baseLibrary = library();

const lookupLibrary = (Type: string): Entity | undefined => {
  return baseLibrary.find((elem) => elem.Type === Type);
};

const Main: React.FC<{ srcType: string }> = ({ srcType }) => {
  const g = React.useMemo(
    () =>
      new EntityInstance(
        library().find((elem) => elem.Type === srcType),
        library
      ),
    [srcType]
  );
  const [connections, setConnections] = React.useState(
    g.root.connections ?? []
  );
  const [entities, setEntities] = React.useState(g.root.entities ?? []);
  React.useEffect(() => {
    setConnections(g.root.connections ?? []);
    setEntities(g.root.entities ?? []);
  }, [g, setConnections, setEntities]);

  const { screenWidth, screenHeight } = React.useContext(ScreenCtx);
  const { centerPaneX, centerPaneY, innerBorderWidth } =
    React.useContext(PaneCtx);

  const {
    handleOnClick,
    handleOnMouseMove,
    setDrawConnection,
    renderedDrawConnection,
  } = useDrawConnections();

  const handleOnClickConnection = React.useCallback(
    (target: ConnectionIO, x: number, y: number) => {
      setDrawConnection((draw) => {
        if (draw.drawing && draw.From) {
          setConnections((connections) => [
            ...connections,
            {
              From: draw.From!,
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

  return (
    <Group
      width={screenWidth}
      height={screenHeight}
      onMouseMove={handleOnMouseMove}
      onClick={handleOnClick}
    >
      <Rect width={screenWidth} height={screenHeight} />
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
                    if (!targetPin) {
                      throw new Error(
                        `target from pin ${formatEntity(elem.From)} not found`
                      );
                    }

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
                    if (!targetPin) {
                      throw new Error(
                        `target to pin ${formatEntity(elem.To)} not found`
                      );
                    }

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
              width={ui.shape.width}
              height={ui.shape.height}
              stroke="red"
              strokeEnabled
              fill={
                "transparent" in ui.shape && ui.shape.transparent
                  ? undefined
                  : ui.shape.color
              }
            />
            <Text
              text={entity.Type}
              fontSize={ui.title.fontSize}
              x={ui.title.x}
              y={ui.title.y}
              scaleX={ui.title.scaleX}
              scaleY={ui.title.scaleY}
              fill={ui.title.color}
            />
            {base.inputs.map((input, i) => (
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
            {base.outputs.map((output, i) => (
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
      {renderedDrawConnection}

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

      <IOPanes
        g={g}
        setConnections={setConnections}
        handleOnClickConnection={handleOnClickConnection}
      />
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
                {baseLibrary.map((elem, i) => (
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
