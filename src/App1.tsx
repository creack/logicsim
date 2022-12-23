import React from "react";
import { Group, Layer, Rect, Stage, Text } from "react-konva";
import { Html } from "react-konva-utils";
import { useConnections } from "./connections";
import { useDrawConnections } from "./drawConnections";
import { Entities } from "./Entities";
import type { ConnectionIO } from "./entityInstance";
import { EntityInstance } from "./entityInstance";
import { IOPanes } from "./ioPanes";
import { baseLibrary, library } from "./lib";
import { ScreenCtx, UILayoutFooter, UILayoutHeader, UILayoutMain } from "./UI";

const Main: React.FC<{ srcType: string }> = ({ srcType }) => {
  const { screenWidth, screenHeight } = React.useContext(ScreenCtx);

  const g = React.useMemo(
    () =>
      new EntityInstance(
        library().find((elem) => elem.Type === srcType),
        library
      ),
    [srcType]
  );

  const { setConnections, renderedConnections } = useConnections(g);
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

      <Entities
        g={g}
        setConnections={setConnections}
        handleOnClickConnection={handleOnClickConnection}
      />

      {renderedDrawConnection}
      {renderedConnections}

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
