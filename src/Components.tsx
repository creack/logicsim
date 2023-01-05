import React from "react";
import { Arrow, Circle, Group, Rect } from "react-konva";
import type { EntityInstance, IO } from "./entityInstance";

export const SignedEigthSegmentsDisplay: React.FC<{
  entity: EntityInstance;
  x?: number;
  y?: number;
}> = ({ ...props }) => {
  const instance = props.entity.entities.find((elem) => elem.root.title === "signed8segmentsdriver0");
  if (!instance) {
    throw new Error(`entity 'signed8segmentsdriver0' not found`);
  }

  const signed = !!instance.root.inputs?.find((elem) => elem.title === "rippleNegative")?.value;

  return <RawSevenSegmentsDisplay {...props} inputs={instance.root.outputs} signed={signed} />;
};

export const ThreeDigitDecimalDisplay: React.FC<{
  entity: EntityInstance;
  x?: number;
  y?: number;
}> = ({ entity, x = 0, ...props }) => {
  const h = entity.entities.find((elem) => elem.root.title === "signed8segments0");
  if (!h?.root.inputs) {
    throw new Error(`entity 'signed8segments0' not found in 3digitDecimalDisplay`);
  }

  const t = entity.entities.find((elem) => elem.root.title === "signed8segments1");
  if (!t?.root.inputs) {
    throw new Error(`entity 'signed8segments1' not found in 3digitDecimalDisplay`);
  }

  const o = entity.entities.find((elem) => elem.root.title === "signed8segments2");
  if (!o?.root.inputs) {
    throw new Error(`entity 'signed8segments2' not found in 3digitDecimalDisplay`);
  }

  return (
    <Group>
      {[h, t, o].map((elem, i) => (
        <SignedEigthSegmentsDisplay key={i} entity={elem} x={20 + x + i * 80} {...props} />
      ))}
    </Group>
  );
};

export const RawSevenSegmentsDisplay: React.FC<{
  inputs?: IO[];
  x?: number;
  y?: number;
  signed?: boolean;
}> = ({ inputs = [], x = 100, y = 100, signed = false }) => {
  const enabledColor = "red";
  const disabledColor = "#eee";

  return (
    <Group key={0} x={x + 15} y={y + 30}>
      <Rect x={25} y={10} width={30} height={10} fill={inputs.find((elem) => elem.title === "0")?.value ? enabledColor : disabledColor} />
      <Rect x={60} y={10} width={10} height={50} fill={inputs.find((elem) => elem.title === "1")?.value ? enabledColor : disabledColor} />
      <Rect x={60} y={70} width={10} height={50} fill={inputs.find((elem) => elem.title === "2")?.value ? enabledColor : disabledColor} />
      <Rect x={25} y={110} width={30} height={10} fill={inputs.find((elem) => elem.title === "3")?.value ? enabledColor : disabledColor} />
      <Rect x={10} y={70} width={10} height={50} fill={inputs.find((elem) => elem.title === "4")?.value ? enabledColor : disabledColor} />
      <Rect x={10} y={10} width={10} height={50} fill={inputs.find((elem) => elem.title === "5")?.value ? enabledColor : disabledColor} />
      <Rect x={25} y={60} width={30} height={10} fill={inputs.find((elem) => elem.title === "6")?.value ? enabledColor : disabledColor} />
      {signed ? (
        <Rect x={-10} y={61} width={16} height={8} fill={inputs.find((elem) => elem.title === "7")?.value ? enabledColor : disabledColor} />
      ) : (
        <Circle x={80} y={115} radius={5} fill={inputs.find((elem) => elem.title === "7")?.value ? enabledColor : disabledColor} />
      )}
    </Group>
  );
};
