import React from "react";
import { Group, Layer, Rect, Stage, Text } from "react-konva";
import { Html } from "react-konva-utils";
import { useConnections } from "./connections";
import { useDrawConnections } from "./drawConnections";
import { Entities } from "./Entities";
import type { ConnectionIO } from "./entityInstance";
import { EntityInstance } from "./entityInstance";
import { useIOPanes } from "./ioPanes";
import { baseLibrary, library } from "./lib";
import { ThumbnailEditor } from "./ThumbnailEditor";
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

  const {
    handleOnClick,
    handleOnMouseMove,
    setDrawConnection,
    renderedDrawConnection,
  } = useDrawConnections();
  const { setConnections, handleOnClickConnection, renderedConnections } =
    useConnections(g, setDrawConnection);

  const { inputs, outputs, renderedIOPanes } = useIOPanes(
    g,
    setConnections,
    handleOnClickConnection
  );

  return (
    <Group
      width={screenWidth}
      height={screenHeight}
      onMouseMove={handleOnMouseMove}
      onClick={handleOnClick}
    >
      <Rect width={screenWidth} height={screenHeight} />

      {false && (
        <Entities
          g={g}
          setConnections={setConnections}
          handleOnClickConnection={handleOnClickConnection}
        />
      )}

      {false && renderedDrawConnection}
      {false && renderedConnections}
      {renderedIOPanes}

      <ThumbnailEditor title={g.root.title} inputs={inputs} outputs={outputs} />
    </Group>
  );
};

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
