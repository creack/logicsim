import { button as levalButton, LevaInputs, useControls } from "leva";
import React from "react";
import { Group, Layer, Rect, Stage, Text } from "react-konva";
import { useConnections } from "./connections";
import { useDrawConnections } from "./drawConnections";
import { Entities } from "./Entities";
import { EntityInstance } from "./entityInstance";
import type { Entity } from "./entityInstance";
import { useIOPanes } from "./ioPanes";
import { LogicLabel } from "./Label";
import { LibraryCtx, LibraryDispatchCtx, useLibrary, useLibraryDispatch, useLibraryReducer, useLookupLibrary } from "./reducer";
import { ThumbnailEditor } from "./ThumbnailEditor";
import { PaneCtx, ScreenCtx, UILayoutFooter, UILayoutHeader, UILayoutMain } from "./UI";

const Main: React.FC<{
  srcType: string;
  setSrcType: (newSrcType: string) => void;
}> = ({ srcType, setSrcType }) => {
  const { screenWidth, screenHeight } = React.useContext(ScreenCtx);
  const [viewMode, setViewMode] = React.useState<"main" | "thumbnail">("main");
  const { centerPaneX, centerPaneWidth, innerBorderWidth, outerBorderWidth, sidePaneHeight } = React.useContext(PaneCtx);

  const dispatch = useLibraryDispatch();

  const [{ Title: title }, setMenu] = useControls(
    "Settings",
    () => ({
      Title: {
        value: srcType,
        type: LevaInputs.STRING,
        order: -1,
        onEditEnd: (newTitle: string) => {
          dispatch({
            type: "updateRootTitle",
            parentType: srcType,
            title: newTitle,
          });
          setSrcType(newTitle);
        },
      },
    }),
    [srcType],
  );
  React.useEffect(() => {
    setMenu({ Title: srcType });
  }, [srcType, setMenu]);

  useControls(
    "View Mode",
    () => ({
      Main: levalButton(
        () => {
          setViewMode("main");
        },
        { disabled: viewMode === "main" },
      ),
      Thumbnail: levalButton(
        () => {
          setViewMode("thumbnail");
        },
        { disabled: viewMode === "thumbnail" },
      ),
    }),
    [viewMode, setViewMode],
  );

  const lib = useLibrary();
  const base = useLookupLibrary(srcType);
  const g = React.useMemo(() => {
    if (!base) throw new Error(`${srcType} not found in lib`);
    console.log("---------- Root new EntityInstance ----------");
    const out = new EntityInstance(base, lib);
    console.log("---------- !Root new EntityInstance ----------", out);
    return out;
  }, [base, srcType, lib]);

  const { handleOnClick, handleOnMouseMove, setDrawConnection, renderedDrawConnection } = useDrawConnections();
  const { setConnections, handleOnClickConnection, renderedConnections } = useConnections(g, setDrawConnection);

  const { inputs, outputs, renderedIOPanes } = useIOPanes(g, setConnections, handleOnClickConnection);

  return (
    <Group width={screenWidth} height={screenHeight} onMouseMove={handleOnMouseMove} onClick={handleOnClick}>
      <LogicLabel x={centerPaneX + centerPaneWidth / 2.1} y={-innerBorderWidth - outerBorderWidth} fontSize={outerBorderWidth} text={title} />
      <Rect x={centerPaneX} y={0} width={centerPaneWidth} height={sidePaneHeight} />

      {viewMode === "main" && (
        <>
          <Entities g={g} setConnections={setConnections} handleOnClickConnection={handleOnClickConnection} />
          {renderedDrawConnection}
          {renderedConnections}
        </>
      )}
      {renderedIOPanes}

      {viewMode === "thumbnail" && <ThumbnailEditor ui={{ ...base!.ui }} title={title} inputs={inputs} outputs={outputs} />}
    </Group>
  );
};

const Header: React.FC<{
  srcType: string;
  setSrcType: (newSrcType: string) => void;
}> = ({ srcType, setSrcType }) => {
  const { screenWidth } = React.useContext(ScreenCtx);

  const dispatch = useLibraryDispatch();

  const lib = useLibrary();
  const types = React.useMemo(() => lib.map((elem) => elem.Type), [lib]);

  return (
    <>
      <Text fontSize={20} text="Open:" fill="white" />
      {types.map((elem, i) => (
        <LogicLabel
          key={i}
          x={(60 + i * 80) % screenWidth}
          y={5 * (1 + Math.floor((60 + i * 80) / screenWidth))}
          fontSize={16}
          text={elem}
          width={70}
          onClick={() => {
            setSrcType(elem);
          }}
          textColor="white"
          backgroundColor="black"
          labelStroke={elem === srcType ? "white" : undefined}
        />
      ))}
      <LogicLabel
        x={screenWidth - 60}
        fontSize={20}
        text="New"
        textColor="white"
        backgroundColor="blue"
        onClick={() => {
          const title = prompt("Title:");
          if (!title) {
            return;
          }
          if (types.find((elem) => elem === title)) {
            alert("Error: title already in use.");
            return;
          }
          dispatch({ type: "newRoot", title });
          setSrcType(title);
        }}
      />
    </>
  );
};

const Footer: React.FC<{ srcType: string }> = ({ srcType }) => {
  const { screenWidth } = React.useContext(ScreenCtx);

  const dispatch = useLibraryDispatch();

  const lib = useLibrary();

  const recursiveCheck = React.useCallback(
    (elem?: Entity): boolean => {
      if (!elem) return false;
      if (elem.Type === srcType) return false;

      return elem.entities?.map((parent) => lib.find((libElem) => libElem.Type === parent.Type)).filter(recursiveCheck).length === 0;
    },
    [srcType, lib],
  );

  const types = React.useMemo(
    () =>
      lib
        .filter((elem) => elem.Type !== srcType)
        .filter(recursiveCheck)
        .map((elem) => elem.Type),
    [lib, srcType, recursiveCheck],
  );

  if (!srcType) {
    return null;
  }
  return (
    <>
      <Text fontSize={20} text="Insert:" fill="white" />
      {types.map((elem, i) => (
        <LogicLabel
          key={i}
          x={(60 + i * 80) % screenWidth}
          y={5 * (1 + Math.floor((60 + i * 80) / screenWidth))}
          fontSize={16}
          text={elem}
          width={70}
          onClick={() => {
            dispatch({ type: "newEntity", parentType: srcType, Type: elem });
          }}
          textColor="white"
          backgroundColor="black"
        />
      ))}
    </>
  );
};

export const App1: React.FC = () => {
  const screenWidth = 1280;
  const screenHeight = 720;

  const [srcType, setSrcType0] = React.useState(localStorage.getItem("srcType") ?? "");
  const setSrcType = React.useCallback((newSrcType: string) => {
    setSrcType0(newSrcType);
    localStorage.setItem("srcType", newSrcType);
  }, []);

  const [lib, dispatch] = useLibraryReducer();

  useControls("Settings", {
    Save: levalButton(() => {
      dispatch({ type: "save" });
    }),
    Reset: levalButton(() => {
      dispatch({ type: "reset" });
    }),
  });

  return (
    <LibraryDispatchCtx.Provider value={dispatch}>
      <LibraryCtx.Provider value={lib}>
        <ScreenCtx.Provider value={{ screenWidth, screenHeight }}>
          <Stage width={screenWidth} height={screenHeight}>
            <Layer>
              <UILayoutHeader>
                <Header srcType={srcType} setSrcType={setSrcType} />
              </UILayoutHeader>
              <UILayoutFooter>
                <Footer srcType={srcType} />
              </UILayoutFooter>
              <UILayoutMain>{!!srcType && <Main srcType={srcType} setSrcType={setSrcType} />}</UILayoutMain>
            </Layer>
          </Stage>
        </ScreenCtx.Provider>
      </LibraryCtx.Provider>
    </LibraryDispatchCtx.Provider>
  );
};
