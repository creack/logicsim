import React from "react";
import { Stage, Layer, Line, Circle, Rect, Group, Text } from "react-konva";
import type { KonvaEventObject } from "konva/lib/Node";
import type konva from "konva";
import { library, gState } from "./lib";
import type { ConnectionIO, IO } from "./entityInstance";
import { EntityInstance } from "./entityInstance";
import {
  ScreenCtx,
  UILayoutHeader,
  UILayoutFooter,
  UILayoutMain,
  PaneCtx,
} from "./UI";
import { Html } from "react-konva-utils";
import Konva from "konva";

const IOElement: React.FC<{
  pos: number;
  mode: "input" | "output";
  paneWidth: number;
  height: number;
  title?: string;
  setPos?: (title: string, newPos: number) => void;
  color: string;
}> = ({ mode, pos, paneWidth, height, title, setPos, color }) => {
  const { screenWidth } = React.useContext(ScreenCtx);
  const { centerPaneX, outerBorderWidth } = React.useContext(PaneCtx);
  const ref = React.useRef<Konva.Group>(null);
  const width = paneWidth * 0.6;

  const x =
    mode === "input"
      ? (paneWidth - width) / 2
      : screenWidth - paneWidth + (paneWidth - width) / 2;

  const toggleRadius = 10;
  const connectionRadius = toggleRadius / 2;

  const handleDragMove = React.useCallback((e: KonvaEventObject<DragEvent>) => {
    e.currentTarget.x(x);
    e.currentTarget.y(e.currentTarget.y());
  }, []);

  const handleDragEnd = React.useCallback(
    (e: KonvaEventObject<DragEvent>) => {
      if (setPos && title) {
        setPos(title, e.currentTarget.y() + height / 2);
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
      e.currentTarget.setAttr("prev_radius", prevRadius.toString());
      e.currentTarget.setAttr("fill", "rgb(126, 126, 126)");
      e.currentTarget.setAttr("radius", (prevRadius * 1.3).toString());
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

  return (
    <Group
      x={x}
      y={pos - height / 2}
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
          mode === "input"
            ? centerPaneX - x
            : -(paneWidth - width) / 2 - outerBorderWidth,
          height / 2,
          mode === "input"
            ? centerPaneX - x + toggleRadius * 2.5
            : -(paneWidth - width) / 2 - outerBorderWidth - toggleRadius * 2.5,
          height / 2,
        ]}
      />
      <Circle
        fill="red"
        x={
          mode === "input"
            ? centerPaneX - x
            : -(paneWidth - width) / 2 - outerBorderWidth
        }
        y={height / 2}
        radius={toggleRadius}
      />
      <Circle
        fill="black"
        x={
          mode === "input"
            ? centerPaneX - x + toggleRadius * 2.5
            : -(paneWidth - width) / 2 - outerBorderWidth - toggleRadius * 2.5
        }
        y={height / 2}
        radius={connectionRadius}
        onMouseOver={handleConnectionOnMouseOver}
        onMouseOut={handleConnectionOnMouseOut}
      />
    </Group>
  );
};

const IOPane: React.FC<{
  mode: "input" | "output";
  ios: IO[] | undefined;
  setIOPos: (title: string, newPos: number) => void;
}> = ({ mode, ios = [], setIOPos }) => {
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
            newPos < 0 ||
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
    (e: KonvaEventObject<MouseEvent>) => {
      setPos(null);
      console.log("MOUSE LEAVE", e);
    },
    [setPos]
  );

  const handleOnClick = React.useCallback(
    (e: KonvaEventObject<MouseEvent>) => {
      console.log(">>>", e.currentTarget);
      setPos(null);
    },
    [setPos]
  );

  return (
    <Group
      onMouseMove={handleOnMouseMove}
      onMouseLeave={handleOnMouseLeave}
      onClick={handleOnClick}
    >
      <Rect
        x={mode === "input" ? 0 : screenWidth - sidePaneWidth}
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
        />
      ))}
      <Text text="worl2d" />
    </Group>
  );
};

const Main: React.FC = () => {
  const g = React.useMemo(
    () =>
      new EntityInstance(
        library().find((elem) => elem.Type === "and") ?? gState(),
        library
      ),
    []
  );
  const [inputs, setInputs] = React.useState(g.root.inputs ?? []);
  const [outputs, setOutputs] = React.useState(g.root.outputs ?? []);

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

  return (
    <>
      <IOPane mode="input" ios={inputs} setIOPos={setInputPos} />
      <IOPane mode="output" ios={outputs} setIOPos={setOutputPos} />
    </>
  );
};

export const App1 = () => {
  const [hide, setHide] = React.useState(false);
  const [srcType, setSrcType] = React.useState("root");

  React.useEffect(() => {
    if (hide) {
      setHide(false);
    }
  }, [hide, setHide]);

  const src = React.useMemo(
    () =>
      srcType === "root"
        ? gState()
        : library().find((elem) => elem.Type === srcType),
    [srcType]
  );
  if (!src) throw new Error("source not found");
  const pp = React.useMemo(() => {
    const pp = new EntityInstance(src, library);
    pp.root.inputs?.forEach((input) => {
      pp.setValue("inputs", input.title, false);
    });

    if (pp.root.truthTable) {
      pp.root.truthTable.forEach((entry) => {
        entry.inputs.forEach((input) => {
          pp.setValue("inputs", input.title, !!input.value);
        });
        let success = true;
        entry.outputs.forEach((output) => {
          if (
            pp.root.outputs?.find((elem) => elem.title === output.title)
              ?.value !== output.value
          ) {
            success = false;
          }
        });
        if (!success) {
          console.error("error checking truth table", {
            expect: entry,
            got: { inputs: pp.root.inputs, outputs: pp.root.outputs },
          });
          throw new Error(`invalid truth table`);
        } else {
          console.log("success!");
        }
      });
    }
    return pp;
  }, [src]);

  const [inputs, setInputs] = React.useState<
    Array<{ title: string; value?: boolean }>
  >(pp.root.inputs?.map((elem) => ({ ...elem, value: false })) ?? []);

  React.useEffect(() => {
    inputs.forEach((elem) => {
      if (
        pp.root.inputs?.find((input) => input.title === elem.title)?.value ===
        elem.value
      ) {
        return;
      }
      pp.setValue("inputs", elem.title, elem.value ?? false);
    });
    // setHide(true);
  }, [inputs, pp, setHide]);

  const toggleInputByTitle = React.useCallback(
    (title: string) => {
      setInputs((inputs) =>
        inputs.map((subelem) => ({
          ...subelem,
          value: subelem.title === title ? !subelem.value : subelem.value,
        }))
      );
    },
    [setInputs]
  );

  const [mouse, setMouse] = React.useState({ x: 0, y: 0 });
  const handleOnMouseMove = React.useCallback(
    (e: KonvaEventObject<MouseEvent>) => {
      setMouse({ x: e.evt.offsetX, y: e.evt.offsetY });
    },
    [setMouse]
  );

  const screenWidth = 1280;
  const screenHeight = 720;

  return (
    <ScreenCtx.Provider value={{ screenWidth, screenHeight }}>
      {false && (
        <>
          {[gState(), ...library()].map((elem, i) => (
            <button
              key={i}
              onClick={() => {
                setInputs(elem.inputs ?? []);
                setSrcType(elem.Type);
              }}
            >
              {elem.Type}
            </button>
          ))}
          <br />
          <br />
          {pp.root.inputs?.map((elem, i) => (
            <button
              style={elem.value ? { borderColor: "blue" } : undefined}
              key={i}
              onClick={() => {
                toggleInputByTitle(elem.title);
              }}
            >
              {elem.title}
            </button>
          ))}
        </>
      )}
      {!hide && (
        <Stage
          width={screenWidth}
          height={screenHeight}
          onMouseMove={handleOnMouseMove}
        >
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
                        setInputs(elem.inputs ?? []);
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
              <Main />
            </UILayoutMain>

            {false && (
              <Foo
                pp={pp}
                toggleInputByTitle={toggleInputByTitle}
                mousePosition={{ x: mouse.x, y: mouse.y }}
              />
            )}
          </Layer>
        </Stage>
      )}
    </ScreenCtx.Provider>
  );
};

const Foo: React.FC<{
  toggleInputByTitle: (title: string) => void;
  mousePosition: { x: number; y: number };
  pp: EntityInstance;
}> = ({ toggleInputByTitle, mousePosition, pp }) => {
  const ref = React.useRef<konva.Group>(null);
  const [lines, setLines] = React.useState<
    Array<{ color: string; points: number[] }>
  >([]);
  const [lines2, setLines2] = React.useState<
    Array<{ color: string; points: number[] }>
  >([]);

  React.useEffect(() => {
    if (!ref.current) {
      console.log("missing ref");
      return;
    }
    const localLines = [...lines];
    pp.root.connections?.forEach((connection) => {
      const newLine: number[] = [];
      let color = "black";
      const fct = (conn: {
        Type: string;
        title: string;
        subtype?: string;
        subtitle?: string;
      }) => {
        const ret1 = ref.current!.find(
          `#${conn.title}:${conn.subtype}:${conn.subtitle}`
        );
        if (!ret1?.length) {
          throw new Error(
            `entity connection not found ${conn.title}:${conn.subtype}:${conn.subtitle}`
          );
        }
        const pos1 = ret1[0].getAbsolutePosition();
        newLine.push(pos1.x);
        newLine.push(pos1.y);
        color = ret1[0].getAttr("fill");
      };
      fct(connection.From);
      fct(connection.To);
      localLines.push({ color, points: newLine });
      setLines(localLines);
    });
  }, []);

  const [drawing, setDrawing] = React.useState(false);
  const toggleDrawing = React.useCallback(
    (target: ConnectionIO) => {
      setDrawing((prev) => !prev);
    },
    [setDrawing]
  );

  React.useEffect(() => {
    if (!drawing) return;
    console.log("<<<<", mousePosition);
    setLines2([
      { color: "red", points: [250, 250, mousePosition.x, mousePosition.y] },
    ]);
  }, [drawing, setLines2, mousePosition]);

  return <Rect fill="rgb(53, 53, 53)" x={50} y={75} width={30} height={916} />;
  return (
    <Group ref={ref} x={100} y={100}>
      {[pp, ...pp.entities].map((entity, i) => (
        <React.Fragment key={i}>
          {entity.root.Component && (
            <entity.root.Component
              entity={entity}
              inputs={entity.root.inputs}
              x={entity.root.x}
              y={entity.root.y}
            />
          )}
          <MyRect
            entity={entity}
            x={entity.root.x}
            y={entity.root.y}
            width={entity.root.width}
            height={entity.root.height}
            title={entity.root.title}
            inputs={entity.root.inputs}
            outputs={entity.root.outputs}
            isRoot={i === 0}
            toggleDrawing={toggleDrawing}
            toggleInputByTitle={toggleInputByTitle}
          />
        </React.Fragment>
      ))}
      {lines.map((line, i) => (
        <Line
          key={i}
          stroke={line.color ?? "black"}
          strokeEnabled
          points={[...line.points]}
        />
      ))}
      {lines2[0] && (
        <Line
          stroke={lines2[0].color ?? "black"}
          strokeEnabled
          points={[...lines2[0].points]}
        />
      )}
    </Group>
  );
};

type InstanceIO = {
  title: string;
  value?: boolean | undefined;
};

const MyRect: React.FC<{
  entity: EntityInstance;
  title?: string;
  width?: number;
  height?: number;
  x?: number;
  y?: number;
  color?: string;
  heightOffset?: number;
  inputs?: InstanceIO[];
  outputs?: InstanceIO[];
  toggleInputByTitle?: (title: string) => void;
  isRoot?: boolean;
  toggleDrawing?: (target: ConnectionIO) => void;
  children?: JSX.Element | JSX.Element[];
}> = ({
  entity,
  title,
  width = 100,
  height: propHeight,
  heightOffset = 40,
  x = 100,
  y = 100,
  color,
  inputs = [],
  outputs = [],
  toggleInputByTitle,
  isRoot,
  toggleDrawing,
  children,
}) => {
  const [rect, setRect] = React.useState({ x, y, isDragging: false });
  const [overed, setOvered] = React.useState<number | false>(false);
  const [drawnPoints, setDrawnPoints] = React.useState<number[]>([]);
  const [isDrawing, setIsDrawing] = React.useState<number | false>(false);

  const ioRadius = 50; //heightOffset / 4;

  const maxLen = Math.max(inputs.length, outputs.length);
  const height = propHeight ?? (maxLen + 1) * heightOffset;

  const handleOnDragStartRect = React.useCallback(
    (_: KonvaEventObject<DragEvent>) => {
      setRect((rect) => ({ ...rect, isDragging: true }));
    },
    [setRect]
  );

  const handleOnDragEndRect = React.useCallback(
    (e: KonvaEventObject<DragEvent>) => {
      setRect((rect) => ({
        ...rect,
        isDragging: false,
        x: e.target.x(),
        y: e.target.y(),
      }));
    },
    [setRect]
  );

  return (
    <Group
      x={rect.x}
      y={rect.y}
      draggable
      onDragStart={handleOnDragStartRect}
      onDragEnd={handleOnDragEndRect}
    >
      <Rect
        width={width}
        height={height}
        stroke="black"
        strokeWidth={1}
        fill={color}
      />
      {title && (
        <Text
          fontSize={20}
          fontFamily="Arial"
          fontVariant="bold"
          width={width}
          y={10}
          align="center"
          text={title}
        />
      )}
      {inputs.map((elem, i) => (
        <React.Fragment key={i}>
          {isRoot && (
            <Rect
              fill="black"
              x={0}
              y={(i + 1) * heightOffset - heightOffset / 32}
              width={10}
              height={1}
              stroke="black"
              strokeWidth={1}
            />
          )}
          {isRoot && (
            <Circle
              fill={overed === i ? "gray" : "black"}
              x={10 + ioRadius * 0.5}
              y={(i + 1) * heightOffset - heightOffset / 128}
              radius={ioRadius * 0.5}
              onMouseOver={() => {
                setOvered(i);
              }}
              onMouseOut={() => {
                setOvered(false);
              }}
              onClick={() => {
                toggleDrawing?.({
                  Type: entity.root.Type,
                  title: entity.root.title,
                  subtype: "inputs",
                  subtitle: elem.title,
                });
                console.log("<<<<<< entity", entity);
              }}
            />
          )}
          <Circle
            id={`${title}:inputs:${elem.title ?? i.toString()}`}
            fill={elem.value ? "red" : "black"}
            radius={ioRadius}
            y={(i + 1) * heightOffset}
            onClick={() => {
              toggleInputByTitle?.(elem.title);
            }}
          />
        </React.Fragment>
      ))}
      {outputs.map((elem, i) => (
        <Circle
          key={i}
          id={`${title}:outputs:${elem.title ?? i.toString()}`}
          stroke="black"
          strokeWidth={1}
          fill={
            elem.value === undefined ? "white" : elem.value ? "red" : "black"
          }
          radius={ioRadius}
          x={width}
          y={(i + 1) * heightOffset}
          onMouseOver={() => {
            setOvered(i);
          }}
          onMouseOut={() => {
            setOvered(false);
          }}
          scaleX={isRoot && overed === i ? 1.5 : 1}
          scaleY={isRoot && overed === i ? 1.5 : 1}
          onClick={() => {
            if (!isRoot) return;
            toggleInputByTitle?.(elem.title);
          }}
        />
      ))}
      {children}
    </Group>
  );
};
