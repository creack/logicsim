import Konva from "konva";
import { KonvaEventObject } from "konva/lib/Node";
import { useControls } from "leva";
import React from "react";
import { Circle, Group, Rect, Text, Transformer } from "react-konva";
import type {
  Connection,
  ConnectionIO,
  Entity,
  EntityUI,
  IO,
  PartialEntityUI,
} from "./entityInstance";
import { EntityInstance, formatEntity } from "./entityInstance";
import { useLookupLibrary } from "./lib";
import { PaneCtx, ScreenCtx } from "./UI";

const IOComponent: React.FC<{
  entity: Pick<Entity, "Type" | "title">;
  mode: "inputs" | "outputs";
  ui: EntityUI;
  handleOnClickConnection: (target: ConnectionIO, x: number, y: number) => void;
  y: number;
  subtitle: string;
}> = ({ entity, mode, ui, handleOnClickConnection, y, subtitle }) => {
  const handleOnMouseOver = React.useCallback(
    (e: KonvaEventObject<MouseEvent>) => {
      const prevRadius = parseInt(e.currentTarget.getAttr("radius"));
      e.currentTarget.setAttr("prev_radius", prevRadius);
      e.currentTarget.setAttr("prev_fill", e.currentTarget.getAttr("fill"));
      e.currentTarget.setAttr("fill", "rgb(126, 126, 126)");
      e.currentTarget.setAttr("radius", prevRadius * 1.3);
    },
    []
  );
  const handleOnMouseOut = React.useCallback(
    (e: KonvaEventObject<MouseEvent>) => {
      e.currentTarget.setAttr("fill", e.currentTarget.getAttr("prev_fill"));
      e.currentTarget.setAttr("radius", e.currentTarget.getAttr("prev_radius"));
    },
    []
  );
  const targetIO = React.useMemo(
    () => ({
      Type: entity.Type,
      title: entity.title,
      subtype: mode,
      subtitle: subtitle,
    }),
    [entity.Type, entity.title, mode, subtitle]
  );
  const handleOnClick = React.useCallback(
    (e: KonvaEventObject<MouseEvent>) => {
      e.cancelBubble = true;
      const pos = e.currentTarget.absolutePosition();
      handleOnClickConnection(targetIO, pos.x, pos.y - ui.pins.radius / 2);
    },
    [handleOnClickConnection, ui.pins.radius, targetIO]
  );

  return (
    <Circle
      fill="blue"
      x={mode === "inputs" ? 0 : ui.shape.width}
      y={ui.shape.height * (y ?? 0)}
      radius={ui.pins.radius}
      onMouseOver={handleOnMouseOver}
      onMouseOut={handleOnMouseOut}
      onClick={handleOnClick}
    />
  );
};

const IOs: React.FC<{
  entity: Pick<Entity, "Type" | "title">;
  ios: IO[];
  mode: "inputs" | "outputs";
  ui: EntityUI;
  handleOnClickConnection: (target: ConnectionIO, x: number, y: number) => void;
}> = ({ entity, ios, mode, ui, handleOnClickConnection }) => {
  const renderedIOs = React.useMemo(
    () =>
      ios.map((io, i) => (
        <IOComponent
          key={i}
          entity={entity}
          mode={mode}
          ui={ui}
          handleOnClickConnection={handleOnClickConnection}
          subtitle={io.title}
          y={io.y}
        />
      )),
    [entity, mode, handleOnClickConnection, ios]
  );
  return <Group>{renderedIOs}</Group>;
};

const EntityTransformer: React.FC<{
  title: string;
  shapeRef: React.RefObject<Konva.Group>;
  ui: EntityUI;
  isSelected: boolean;
}> = ({ shapeRef, ui, isSelected, title }) => {
  const [{ transparent, color }, setMenu] = useControls(
    `Entity ${title} Props:`,
    () => ({
      transparent:
        "transparent" in ui.shape && ui.shape.transparent ? true : false,
      color: {
        value: "color" in ui.shape && ui.shape.color ? ui.shape.color : "#ccc",
        render: (getValue) => !getValue("Shape Props.transparent"),
      },
    }),
    [ui.shape]
  );
  React.useEffect(() => {
    setMenu({
      transparent:
        "transparent" in ui.shape && ui.shape.transparent ? true : false,
      color: "color" in ui.shape && ui.shape.color ? ui.shape.color : "#ccc",
    });
  }, [ui.shape, setMenu]);

  const trRef = React.useRef<Konva.Transformer>(null);
  React.useEffect(() => {
    if (!trRef.current || !shapeRef.current) return;
    if (isSelected) {
      // We need to attach transformer manually.
      trRef.current.nodes([shapeRef.current]);
      trRef.current.getLayer()?.batchDraw();
    }
  }, [isSelected]);

  return (
    <Transformer
      ref={trRef}
      rotateEnabled={false}
      keepRatio
      enabledAnchors={["top-left", "top-right", "bottom-left", "bottom-right"]}
      boundBoxFunc={(oldBox, newBox) => {
        // Limit resize.
        if (newBox.width < 35 || newBox.height < 35) {
          return oldBox;
        }
        return newBox;
      }}
    />
  );
};

const EntityComponent: React.FC<{
  entity: Omit<
    Entity,
    "ui" | "inputs" | "outputs" | "connections" | "entities"
  > & {
    ui: PartialEntityUI;
  };
  handleOnClickConnection: (target: ConnectionIO, x: number, y: number) => void;
  setConnections: React.Dispatch<React.SetStateAction<Connection[]>>;
  setSelected: React.Dispatch<React.SetStateAction<string>>;
  selected: string;
}> = ({
  entity,
  setConnections,
  handleOnClickConnection,
  setSelected,
  selected,
}) => {
  const { screenWidth, screenHeight } = React.useContext(ScreenCtx);
  const { centerPaneX, innerBorderWidth } = React.useContext(PaneCtx);

  const base = useLookupLibrary(entity.Type);
  if (!base) {
    throw new Error(`entity type ${entity.Type} not found in library`);
  }

  const ui = React.useMemo(
    () => ({
      pins: { ...base.ui.pins, ...entity.ui.pins },
      shape: { ...base.ui.shape, ...entity.ui.shape },
      title: { ...base.ui.title, ...entity.ui.title },
    }),
    [base.ui, entity.ui]
  );

  const handleOnClick = React.useCallback(() => {
    setSelected((selected) => (selected !== entity.title ? entity.title : ""));
  }, [setSelected]);

  const handleOnDragMove = React.useCallback(
    (e: KonvaEventObject<DragEvent>) => {
      if (selected !== entity.title) {
        setSelected(entity.title);
      }
      const pos = e.currentTarget.absolutePosition();

      const handle = (
        targetIO: ConnectionIO,
        targetPoints: [number, number]
      ) => {
        if (targetIO.Type === entity.Type && targetIO.title === entity.title) {
          targetPoints[0] =
            targetIO.subtype === "inputs"
              ? pos.x / screenWidth
              : (pos.x + ui.shape.width) / screenWidth;

          const targetPin = (
            targetIO.subtype === "inputs" ? base.inputs : base.outputs
          )?.find((pin) => pin.title === targetIO.subtitle);
          if (!targetPin) {
            throw new Error(
              `target from pin ${formatEntity(targetIO)} not found`
            );
          }

          targetPoints[1] =
            (pos.y - ui.pins.radius / 2 + targetPin.y * ui.shape.height) /
            screenHeight;
        }
      };

      setConnections((connections) =>
        (connections ?? []).map((elem) => {
          handle(elem.From, elem.points.From);
          handle(elem.To, elem.points.To);
          return elem;
        })
      );
    },
    [
      setConnections,
      ui,
      base,
      screenWidth,
      screenHeight,
      entity,
      selected,
      setSelected,
    ]
  );

  const isSelected = selected === entity.title;
  const shapeRef = React.useRef<Konva.Group>(null);

  return (
    <>
      <Group
        ref={shapeRef}
        x={centerPaneX + 2 * innerBorderWidth + ui.shape.x}
        y={ui.shape.y}
        draggable
        onClick={handleOnClick}
        onDragMove={handleOnDragMove}
      >
        <Rect
          width={ui.shape.width}
          height={ui.shape.height}
          stroke="red"
          strokeEnabled
          fill={
            "transparent" in ui.shape && ui.shape.transparent
              ? undefined
              : ui.shape.color
          }
        />
        <Text
          text={entity.Type}
          fontSize={ui.title.fontSize}
          x={ui.title.x}
          y={ui.title.y}
          scaleX={ui.title.scaleX}
          scaleY={ui.title.scaleY}
          fill={ui.title.color}
        />
        <IOs
          entity={entity}
          ios={base.inputs}
          mode="inputs"
          ui={ui}
          handleOnClickConnection={handleOnClickConnection}
        />
        <IOs
          entity={entity}
          ios={base.outputs}
          mode="outputs"
          ui={ui}
          handleOnClickConnection={handleOnClickConnection}
        />
      </Group>
      {isSelected && (
        <EntityTransformer
          shapeRef={shapeRef}
          isSelected={isSelected}
          ui={ui}
          title={entity.title}
        />
      )}
    </>
  );
};

export const Entities: React.FC<{
  g: EntityInstance;
  setConnections: React.Dispatch<React.SetStateAction<Connection[]>>;
  handleOnClickConnection: (target: ConnectionIO, x: number, y: number) => void;
}> = ({ g, setConnections, handleOnClickConnection }) => {
  const [entities, setEntities] = React.useState(g.root.entities ?? []);
  const [selected, setSelected] = React.useState("");

  React.useEffect(() => {
    setEntities(g.root.entities ?? []);
  }, [g, setEntities]);

  const renderedEntities = React.useMemo(
    () =>
      entities.map((entity, i) => (
        <EntityComponent
          key={i}
          entity={entity}
          setConnections={setConnections}
          handleOnClickConnection={handleOnClickConnection}
          selected={selected}
          setSelected={setSelected}
        />
      )),
    [entities, handleOnClickConnection, selected]
  );

  return <Group id="entities">{renderedEntities}</Group>;
};