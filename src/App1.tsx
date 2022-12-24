import { button as levalButton, useControls } from "leva";
import React from "react";
import { Group, Layer, Rect, Stage, Text } from "react-konva";
import { Html } from "react-konva-utils";
import { useConnections } from "./connections";
import { useDrawConnections } from "./drawConnections";
import { Entities } from "./Entities";
import { EntityInstance } from "./entityInstance";
import { useIOPanes } from "./ioPanes";
import {
  LibraryCtx,
  LibraryDispatchCtx,
  useLibraryReducer,
  useLookupLibrary,
} from "./lib";
import { ThumbnailEditor } from "./ThumbnailEditor";
import { ScreenCtx, UILayoutFooter, UILayoutHeader, UILayoutMain } from "./UI";

const Main: React.FC<{ srcType: string }> = ({ srcType }) => {
  const { screenWidth, screenHeight } = React.useContext(ScreenCtx);
  const [viewMode, setViewMode] = React.useState<"main" | "thumbnail">("main");
  const lib = React.useContext(LibraryCtx);

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

  const base = useLookupLibrary(srcType);
  const g = React.useMemo(() => {
    if (!base) throw new Error(`${srcType} not found in lib`);
    return new EntityInstance(base, lib);
  }, [base, srcType, lib]);

  React.useEffect(() => {
    console.log("G Changed:", g);
  }, [g]);

  React.useEffect(() => {
    console.log("srcType Changed:", srcType);
  }, [srcType]);

  React.useEffect(() => {
    console.log("Base ui Changed:", base!.ui);
  }, [base!.ui]);

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
          ui={{ ...base!.ui }}
          title={g.root.title}
          inputs={inputs}
          outputs={outputs}
        />
      )}
    </Group>
  );
};

const Footer: React.FC<{
  setSrcType: React.Dispatch<React.SetStateAction<string>>;
}> = ({ setSrcType }) => {
  const { screenWidth } = React.useContext(ScreenCtx);
  const lib = React.useContext(LibraryCtx);

  const types = React.useMemo(() => lib.map((elem) => elem.Type), [lib]);

  return React.useMemo(
    () => (
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
          {types.map((elem, i) => (
            <button
              key={i}
              style={{ marginLeft: 1, marginRight: 1 }}
              onClick={() => {
                setSrcType(elem);
              }}
            >
              {elem}
            </button>
          ))}
        </div>
      </Html>
    ),
    [JSON.stringify(types)]
  );
};

export const App1: React.FC = () => {
  const screenWidth = 1280;
  const screenHeight = 720;

  const [srcType, setSrcType] = React.useState("and");

  const [lib, dispatch] = useLibraryReducer();

  useControls({
    Save: levalButton(() => {
      dispatch({ type: "save" });
    }),
  });

  return (
    <LibraryDispatchCtx.Provider value={dispatch}>
      <LibraryCtx.Provider value={lib}>
        <ScreenCtx.Provider value={{ screenWidth, screenHeight }}>
          <Stage width={screenWidth} height={screenHeight}>
            <Layer>
              <UILayoutHeader>
                <Text text="hello" />
              </UILayoutHeader>
              <UILayoutFooter>
                <Footer setSrcType={setSrcType} />
              </UILayoutFooter>
              <UILayoutMain>
                <Main srcType={srcType} />
              </UILayoutMain>
            </Layer>
          </Stage>
        </ScreenCtx.Provider>
      </LibraryCtx.Provider>
    </LibraryDispatchCtx.Provider>
  );
};
