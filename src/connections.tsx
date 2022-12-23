import React from "react";
import { Line } from "react-konva";
import type { drawState } from "./drawConnections";
import type { ConnectionIO, EntityInstance } from "./entityInstance";
import { PaneCtx, ScreenCtx } from "./UI";

export const useConnections = (
  g: EntityInstance,
  setDrawConnection: React.Dispatch<React.SetStateAction<drawState>>
) => {
  const { screenWidth, screenHeight } = React.useContext(ScreenCtx);
  const { centerPaneY } = React.useContext(PaneCtx);

  const [connections, setConnections] = React.useState(
    g.root.connections ?? []
  );
  React.useEffect(() => {
    setConnections(g.root.connections ?? []);
  }, [g, setConnections]);

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

  const renderedConnections = React.useMemo(
    () =>
      connections.map((connection, i) => (
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
      )),
    [connections, screenWidth, screenHeight, centerPaneY]
  );

  return { renderedConnections, setConnections, handleOnClickConnection };
};
