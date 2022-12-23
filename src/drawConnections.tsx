import type { KonvaEventObject } from "konva/lib/Node";
import React from "react";
import { Line } from "react-konva";
import type { ConnectionIO } from "./entityInstance";
import { PaneCtx } from "./UI";

export const useDrawConnections = () => {
  const { centerPaneY } = React.useContext(PaneCtx);

  const [drawConnection, setDrawConnection] = React.useState<{
    drawing: boolean;
    drawingPoint: [number, number] | null;
    From?: ConnectionIO;
    To?: ConnectionIO;
    points: [number, number][];
  }>({ drawing: false, drawingPoint: null, points: [] });

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

  const renderedDrawConnection = React.useMemo(
    () =>
      (drawConnection.drawing || drawConnection.points.length > 1) && (
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
      ),
    [drawConnection, centerPaneY]
  );

  return {
    handleOnClick,
    handleOnMouseMove,
    setDrawConnection,
    renderedDrawConnection,
  };
};
