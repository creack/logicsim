import React from "react";
import { Line } from "react-konva";
import { EntityInstance } from "./entityInstance";
import { PaneCtx, ScreenCtx } from "./UI";

export const useConnections = (g: EntityInstance) => {
  const { screenWidth, screenHeight } = React.useContext(ScreenCtx);
  const { centerPaneY } = React.useContext(PaneCtx);

  const [connections, setConnections] = React.useState(
    g.root.connections ?? []
  );
  React.useEffect(() => {
    setConnections(g.root.connections ?? []);
  }, [g, setConnections]);

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

  return { renderedConnections, setConnections };
};
