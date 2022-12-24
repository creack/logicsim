import { KonvaEventObject } from "konva/lib/Node";
import { button, useControls } from "leva";
import React from "react";
import { Line } from "react-konva";
import type { drawState } from "./drawConnections";
import type {
  Connection,
  ConnectionIO,
  EntityInstance,
} from "./entityInstance";
import { useLibraryDispatch } from "./reducer";
import { PaneCtx, ScreenCtx } from "./UI";

export const useConnections = (
  g: EntityInstance,
  setDrawConnection: React.Dispatch<React.SetStateAction<drawState>>
) => {
  const { screenWidth, screenHeight } = React.useContext(ScreenCtx);
  const dispatch = useLibraryDispatch();

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
          const newConn: Connection = {
            From: draw.From!,
            To: {
              ...target,
              Type: target.Type === "" ? "root" : "entity",
              title: target.title === "" ? g.root.title : target.title,
            },
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
          };
          dispatch({
            type: "addConnection",
            parentType: g.root.Type,
            From: newConn.From,
            To: newConn.To,
            points: newConn.points,
          });
          setConnections((connections) => [...connections, newConn]);
        }
        return {
          drawing: !draw.drawing,
          drawingPoint: draw.drawing ? null : [x, y],
          points: draw.drawing ? [] : [[x, y]],
          From: {
            ...target,
            Type: target.Type === "" ? "root" : "entity",
            title: target.title === "" ? g.root.title : target.title,
          },
        };
      });
    },
    [setDrawConnection, setConnections, g.root.Type, g.root.title]
  );

  const [selected, setSelected] = React.useState<number | false>(false);

  const renderedConnections = React.useMemo(
    () =>
      connections.map((connection, i) => (
        <ConnectionComponent
          key={i}
          connection={connection}
          isSelected={i === selected}
          setSelected={(val: boolean) => setSelected(val ? i : false)}
          parentType={g.root.Type}
        />
      )),
    [connections, selected, g.root.Type]
  );

  return { renderedConnections, setConnections, handleOnClickConnection };
};

const SelectedConnectionMenu: React.FC<{
  connection: Connection;
  parentType: string;
}> = ({ connection, parentType }) => {
  const dispatch = useLibraryDispatch();

  useControls(
    `Connection ${connection.From.subtype.slice(0, 2)}:${
      connection.From.subtitle
    }->${connection.To.subtype.slice(0, 2)}:${connection.To.subtitle}:`,
    () => ({
      remove: button(() => {
        dispatch({
          type: "removeConnection",
          parentType,
          From: connection.From,
          To: connection.To,
        });
      }),
    }),
    [parentType]
  );

  return null;
};

const ConnectionComponent: React.FC<{
  connection: Connection;
  isSelected: boolean;
  setSelected: (value: boolean) => void;
  parentType: string;
}> = ({ connection, isSelected, setSelected, parentType }) => {
  const { screenWidth, screenHeight } = React.useContext(ScreenCtx);
  const { centerPaneY } = React.useContext(PaneCtx);

  return (
    <>
      {isSelected && (
        <SelectedConnectionMenu
          connection={connection}
          parentType={parentType}
        />
      )}
      <Line
        stroke={isSelected ? "black" : "rgb(32, 36, 46)"}
        strokeWidth={isSelected ? 4.5 : 3}
        hitStrokeWidth={20}
        onClick={(e: KonvaEventObject<MouseEvent>) => {
          if (isSelected) {
            setSelected(false);
            return;
          }
          setSelected(true);
          e.currentTarget.setAttr("prev_color", undefined);
          e.currentTarget.setAttr("prev_size", undefined);
        }}
        onMouseOver={(e: KonvaEventObject<MouseEvent>) => {
          if (isSelected) return;

          e.currentTarget.setAttr(
            "prev_color",
            e.currentTarget.getAttr("stroke")
          );
          e.currentTarget.setAttr("stroke", "black");

          const prevSize = e.currentTarget.getAttr("strokeWidth");
          e.currentTarget.setAttr("prev_size", prevSize);
          e.currentTarget.setAttr("strokeWidth", prevSize * 1.5);
        }}
        onMouseOut={(e: KonvaEventObject<MouseEvent>) => {
          if (isSelected) return;

          const prevColor = e.currentTarget.getAttr("prev_color");
          const prevSize = e.currentTarget.getAttr("prev_size");
          if (prevColor && prevSize) {
            e.currentTarget.setAttr("stroke", prevColor);
            e.currentTarget.setAttr("strokeWidth", prevSize);
          }
        }}
        tension={0.3}
        points={[
          connection.points!.From,
          ...(connection.points?.intermediaries ?? []),
          connection.points!.To,
        ]
          .flat()
          .map((elem, i) =>
            i % 2 === 0 ? elem * screenWidth : elem * screenHeight - centerPaneY
          )}
      />
    </>
  );
};
