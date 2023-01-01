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
  viewMode: string;
  setViewMode: (viewMode: "main" | "thumbnail") => void;
}> = ({ srcType, setSrcType, viewMode, setViewMode }) => {
  const { screenWidth, screenHeight } = React.useContext(ScreenCtx);
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
    const out = new EntityInstance(base, lib, undefined, true);
    return out;
  }, [base, srcType, lib]);

  const { handleOnClick, handleOnMouseMove, setDrawConnection, renderedDrawConnection } = useDrawConnections();
  const { setConnections, handleOnClickConnection, renderedConnections } = useConnections(g, setDrawConnection);

  const { inputs, outputs, renderedIOPanes } = useIOPanes(g, setConnections, handleOnClickConnection, viewMode);

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

const deepSearchType: (srcType: string, lib: Entity[]) => (e: Entity) => boolean = (srcType, lib) => {
  return (e) => {
    if (e.Type === srcType) {
      return false;
    }
    if (e.entities.find((elem) => elem.Type === srcType)) {
      return false;
    }
    const m = e.entities.map((elem) => lib.find((child) => child.Type === elem.Type) as Entity);
    if (m.find((elem) => elem.entities.find((child) => child.Type === srcType))) {
      return false;
    }
    return !!m.filter(deepSearchType(srcType, lib));
  };
};

const Footer: React.FC<{ srcType: string }> = ({ srcType }) => {
  const { screenWidth } = React.useContext(ScreenCtx);

  const dispatch = useLibraryDispatch();

  const lib = useLibrary();

  const types = React.useMemo(() => lib.filter(deepSearchType(srcType, lib)).map((elem) => elem.Type), [lib, srcType]);

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

  const [viewMode, setViewMode0] = React.useState<"thumbnail" | "main">((localStorage.getItem("viewMode") as "thumbnail" | "main" | "undefined") ?? "main");
  const setViewMode = React.useCallback((newViewMode: "thumbnail" | "main") => {
    setViewMode0(newViewMode);
    localStorage.setItem("viewMode", newViewMode);
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
              <UILayoutMain>{!!srcType && <Main srcType={srcType} setSrcType={setSrcType} viewMode={viewMode} setViewMode={setViewMode} />}</UILayoutMain>
            </Layer>
          </Stage>
        </ScreenCtx.Provider>
      </LibraryCtx.Provider>
    </LibraryDispatchCtx.Provider>
  );
};
