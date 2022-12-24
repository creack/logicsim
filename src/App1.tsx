import React from "react";
import { Group, Layer, Rect, Stage, Text } from "react-konva";
import { Html } from "react-konva-utils";
import { useConnections } from "./connections";
import { useDrawConnections } from "./drawConnections";
import { Entities } from "./Entities";
import { EntityInstance } from "./entityInstance";
import { useIOPanes } from "./ioPanes";
import { baseLibrary, library } from "./lib";
import { ThumbnailEditor } from "./ThumbnailEditor";
import { ScreenCtx, UILayoutFooter, UILayoutHeader, UILayoutMain } from "./UI";
import { useControls, button as levalButton } from "leva";

const Main: React.FC<{ srcType: string }> = ({ srcType }) => {
  const { screenWidth, screenHeight } = React.useContext(ScreenCtx);
  const [viewMode, setViewMode] = React.useState<"main" | "thumbnail">("main");

  useControls(
    "View Mode",
    () => ({
      Main: levalButton(
        () => {
          setViewMode("main");
        },
        { disabled: viewMode === "main" }
      ),
      Thumbnail: levalButton(
        () => {
          setViewMode("thumbnail");
        },
        { disabled: viewMode === "thumbnail" }
      ),
    }),
    [viewMode, setViewMode]
  );

  const { base, g } = React.useMemo(() => {
    const base = library().find((elem) => elem.Type === srcType);
    if (!base) throw new Error(`${srcType} not found in lib`);
    const g = new EntityInstance(base, library);
    return { base, g };
  }, [srcType]);

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

      {viewMode === "main" && (
        <>
          <Entities
            g={g}
            setConnections={setConnections}
            handleOnClickConnection={handleOnClickConnection}
          />
          {renderedDrawConnection}
          {renderedConnections}
        </>
      )}
      {renderedIOPanes}

      {viewMode === "thumbnail" && (
        <ThumbnailEditor
          ui={base.ui}
          title={g.root.title}
          inputs={inputs}
          outputs={outputs}
        />
      )}
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
