import { expect, describe, test } from "vitest";
import { EntityInstance, formatEntity } from "./entityInstance";
import type { Connection, ConnectionIO, Entity } from "./entityInstance";
import { useLibrary, useLookupLibrary } from "./reducer";

const getChild = (e: EntityInstance, childName: string): EntityInstance => {
  const child = e.entities.find((elem) => elem.root.title === childName);
  expect(child).toBeDefined();
  return child!;
};

const getInput = (e: EntityInstance, subtitle: string): boolean | undefined => {
  const target = e.root.inputs.find((elem) => elem.title === subtitle);
  expect(target).toBeDefined();
  return target?.value;
};

const getChildInput = (e: EntityInstance, childName: string, subtitle: string): boolean | undefined => {
  const target = getChild(e, childName).root.inputs.find((elem) => elem.title === subtitle);
  expect(target).toBeDefined();
  return target?.value;
};

const getOutput = (e: EntityInstance, subtitle: string): boolean | undefined => {
  const target = e.root.outputs.find((elem) => elem.title === subtitle);
  expect(target).toBeDefined();
  return target?.value;
};

const getChildOutput = (e: EntityInstance, childName: string, subtitle: string): boolean | undefined => {
  const target = getChild(e, childName).root.outputs.find((elem) => elem.title === subtitle);
  expect(target).toBeDefined();
  return target?.value;
};

const newTestEntity = (name: string): Entity => {
  return {
    Type: name,
    title: name,
    inputs: [],
    outputs: [],
    entities: [],
    connections: [],
    ui: {
      pins: { radius: 0 },
      shape: { height: 0, width: 0, x: 0, y: 0, color: "", transparent: true },
      title: { x: 0, y: 0, color: "", fontSize: 0, scaleX: 1, scaleY: 1 },
    },
  };
};

const newTestConnection = (From: ConnectionIO, To: ConnectionIO): Connection => {
  return {
    From,
    To,
    points: {
      From: [0, 0],
      intermediaries: [],
      To: [0, 0],
    },
  };
};

describe("Set value without entities", () => {
  test("Root input without connection", () => {
    const root = newTestEntity("t");
    root.inputs = [
      { title: "0", y: 0 },
      { title: "1", y: 0 },
      { title: "2", y: 0 },
    ];
    const e = new EntityInstance(root, [], undefined, true);

    e.setValue("inputs", "0", true);
    expect(getInput(e, "0")).toBe(true);
    expect(getInput(e, "1")).toBe(undefined);
    expect(getInput(e, "2")).toBe(undefined);

    e.setValue("inputs", "0", true);
    expect(getInput(e, "0")).toBe(true);
    expect(getInput(e, "1")).toBe(undefined);
    expect(getInput(e, "2")).toBe(undefined);

    e.setValue("inputs", "0", false);
    expect(getInput(e, "0")).toBe(false);
    expect(getInput(e, "1")).toBe(undefined);
    expect(getInput(e, "2")).toBe(undefined);

    e.setValue("inputs", "1", true);
    expect(getInput(e, "0")).toBe(false);
    expect(getInput(e, "1")).toBe(true);
    expect(getInput(e, "2")).toBe(undefined);

    e.setValue("inputs", "2", false);
    expect(getInput(e, "0")).toBe(false);
    expect(getInput(e, "1")).toBe(true);
    expect(getInput(e, "2")).toBe(false);
  });

  test("Root input to root input", () => {
    const root = newTestEntity("t");
    root.inputs = [
      { title: "0", y: 0 },
      { title: "1", y: 0 },
      { title: "2", y: 0 },
    ];
    root.connections = [
      newTestConnection({ Type: "root", title: "t", subtype: "inputs", subtitle: "0" }, { Type: "root", title: "t", subtype: "inputs", subtitle: "1" }),
    ];
    const e = new EntityInstance(root, [], undefined, true);

    e.setValue("inputs", "0", true);
    expect(getInput(e, "0")).toBe(true);
    expect(getInput(e, "1")).toBe(true);
    expect(getInput(e, "2")).toBe(undefined);

    e.setValue("inputs", "0", true);
    expect(getInput(e, "0")).toBe(true);
    expect(getInput(e, "1")).toBe(true);
    expect(getInput(e, "2")).toBe(undefined);

    e.setValue("inputs", "0", false);
    expect(getInput(e, "0")).toBe(false);
    expect(getInput(e, "1")).toBe(false);
    expect(getInput(e, "2")).toBe(undefined);

    e.setValue("inputs", "2", true);
    expect(getInput(e, "0")).toBe(false);
    expect(getInput(e, "1")).toBe(false);
    expect(getInput(e, "2")).toBe(true);
  });

  test("Root input to root input - reverse", () => {
    const root = newTestEntity("t");
    root.inputs = [
      { title: "0", y: 0 },
      { title: "1", y: 0 },
      { title: "2", y: 0 },
    ];
    root.connections = [
      newTestConnection({ Type: "root", title: "t", subtype: "inputs", subtitle: "1" }, { Type: "root", title: "t", subtype: "inputs", subtitle: "0" }),
    ];
    const e = new EntityInstance(root, [], undefined, true);

    e.setValue("inputs", "0", true);
    expect(getInput(e, "0")).toBe(true);
    expect(getInput(e, "1")).toBe(true);
    expect(getInput(e, "2")).toBe(undefined);

    e.setValue("inputs", "0", true);
    expect(getInput(e, "0")).toBe(true);
    expect(getInput(e, "1")).toBe(true);
    expect(getInput(e, "2")).toBe(undefined);

    e.setValue("inputs", "0", false);
    expect(getInput(e, "0")).toBe(false);
    expect(getInput(e, "1")).toBe(false);
    expect(getInput(e, "2")).toBe(undefined);

    e.setValue("inputs", "2", true);
    expect(getInput(e, "0")).toBe(false);
    expect(getInput(e, "1")).toBe(false);
    expect(getInput(e, "2")).toBe(true);
  });

  test("Root input to root output", () => {
    const root = newTestEntity("t");
    root.inputs = [
      { title: "0", y: 0 },
      { title: "1", y: 0 },
    ];
    root.outputs = [{ title: "0", y: 0 }];
    root.connections = [
      newTestConnection({ Type: "root", title: "t", subtype: "inputs", subtitle: "0" }, { Type: "root", title: "t", subtype: "outputs", subtitle: "0" }),
    ];
    const e = new EntityInstance(root, [], undefined, true);

    e.setValue("inputs", "1", true);
    expect(getInput(e, "0")).toBe(undefined);
    expect(getInput(e, "1")).toBe(true);
    expect(getOutput(e, "0")).toBe(undefined);

    e.setValue("inputs", "0", true);
    expect(getInput(e, "0")).toBe(true);
    expect(getInput(e, "1")).toBe(true);
    expect(getOutput(e, "0")).toBe(true);

    e.setValue("inputs", "0", true);
    expect(getInput(e, "0")).toBe(true);
    expect(getInput(e, "1")).toBe(true);
    expect(getOutput(e, "0")).toBe(true);

    e.setValue("inputs", "0", false);
    expect(getInput(e, "0")).toBe(false);
    expect(getInput(e, "1")).toBe(true);
    expect(getOutput(e, "0")).toBe(false);
  });

  test("Root input to root output - reverse", () => {
    const root = newTestEntity("t");
    root.inputs = [
      { title: "0", y: 0 },
      { title: "1", y: 0 },
    ];
    root.outputs = [{ title: "0", y: 0 }];
    root.connections = [
      newTestConnection({ Type: "root", title: "t", subtype: "outputs", subtitle: "0" }, { Type: "root", title: "t", subtype: "inputs", subtitle: "0" }),
    ];
    const e = new EntityInstance(root, [], undefined, true);

    e.setValue("inputs", "1", true);
    expect(getInput(e, "0")).toBe(undefined);
    expect(getInput(e, "1")).toBe(true);
    expect(getOutput(e, "0")).toBe(undefined);

    e.setValue("inputs", "0", true);
    expect(getInput(e, "0")).toBe(true);
    expect(getInput(e, "1")).toBe(true);
    expect(getOutput(e, "0")).toBe(true);

    e.setValue("inputs", "0", true);
    expect(getInput(e, "0")).toBe(true);
    expect(getInput(e, "1")).toBe(true);
    expect(getOutput(e, "0")).toBe(true);

    e.setValue("inputs", "0", false);
    expect(getInput(e, "0")).toBe(false);
    expect(getInput(e, "1")).toBe(true);
    expect(getOutput(e, "0")).toBe(false);
  });

  test("Root input to root output to root input", () => {
    const root = newTestEntity("t");
    root.inputs = [
      { title: "0", y: 0 },
      { title: "1", y: 0 },
    ];
    root.outputs = [{ title: "0", y: 0 }];
    root.connections = [
      newTestConnection({ Type: "root", title: "t", subtype: "inputs", subtitle: "0" }, { Type: "root", title: "t", subtype: "outputs", subtitle: "0" }),
      newTestConnection({ Type: "root", title: "t", subtype: "inputs", subtitle: "1" }, { Type: "root", title: "t", subtype: "outputs", subtitle: "0" }),
    ];
    const e = new EntityInstance(root, [], undefined, true);

    e.setValue("inputs", "0", true);
    expect(getInput(e, "0")).toBe(true);
    expect(getInput(e, "1")).toBe(true);
    expect(getOutput(e, "0")).toBe(true);

    e.setValue("inputs", "0", true);
    expect(getInput(e, "0")).toBe(true);
    expect(getInput(e, "1")).toBe(true);
    expect(getOutput(e, "0")).toBe(true);

    e.setValue("inputs", "0", false);
    expect(getInput(e, "0")).toBe(false);
    expect(getInput(e, "1")).toBe(false);
    expect(getOutput(e, "0")).toBe(false);
  });

  test("Root input to root output to root input - reverse", () => {
    const root = newTestEntity("t");
    root.inputs = [
      { title: "0", y: 0 },
      { title: "1", y: 0 },
    ];
    root.outputs = [{ title: "0", y: 0 }];
    root.connections = [
      newTestConnection({ Type: "root", title: "t", subtype: "outputs", subtitle: "0" }, { Type: "root", title: "t", subtype: "inputs", subtitle: "0" }),
      newTestConnection({ Type: "root", title: "t", subtype: "outputs", subtitle: "0" }, { Type: "root", title: "t", subtype: "inputs", subtitle: "1" }),
    ];
    const e = new EntityInstance(root, [], undefined, true);

    e.setValue("inputs", "0", true);
    expect(getInput(e, "0")).toBe(true);
    expect(getInput(e, "1")).toBe(true);
    expect(getOutput(e, "0")).toBe(true);

    e.setValue("inputs", "0", true);
    expect(getInput(e, "0")).toBe(true);
    expect(getInput(e, "1")).toBe(true);
    expect(getOutput(e, "0")).toBe(true);

    e.setValue("inputs", "0", false);
    expect(getInput(e, "0")).toBe(false);
    expect(getInput(e, "1")).toBe(false);
    expect(getOutput(e, "0")).toBe(false);
  });

  test("Root input to root output to root input - mix", () => {
    const root = newTestEntity("t");
    root.inputs = [
      { title: "0", y: 0 },
      { title: "1", y: 0 },
    ];
    root.outputs = [{ title: "0", y: 0 }];
    root.connections = [
      newTestConnection({ Type: "root", title: "t", subtype: "inputs", subtitle: "0" }, { Type: "root", title: "t", subtype: "outputs", subtitle: "0" }),
      newTestConnection({ Type: "root", title: "t", subtype: "outputs", subtitle: "0" }, { Type: "root", title: "t", subtype: "inputs", subtitle: "1" }),
    ];
    const e = new EntityInstance(root, [], undefined, true);

    e.setValue("inputs", "0", true);
    expect(getInput(e, "0")).toBe(true);
    expect(getInput(e, "1")).toBe(true);
    expect(getOutput(e, "0")).toBe(true);

    e.setValue("inputs", "0", true);
    expect(getInput(e, "0")).toBe(true);
    expect(getInput(e, "1")).toBe(true);
    expect(getOutput(e, "0")).toBe(true);

    e.setValue("inputs", "0", false);
    expect(getInput(e, "0")).toBe(false);
    expect(getInput(e, "1")).toBe(false);
    expect(getOutput(e, "0")).toBe(false);
  });
});

describe("setValue with entities", () => {
  test("Root input to entity input", () => {
    const root = newTestEntity("t");
    root.inputs = [{ title: "0", y: 0 }];
    const child = newTestEntity("e");
    child.inputs = [{ title: "0", y: 0 }];
    root.entities = [child];
    root.connections = [
      newTestConnection({ Type: "root", title: "t", subtype: "inputs", subtitle: "0" }, { Type: "entity", title: "e", subtype: "inputs", subtitle: "0" }),
    ];
    const e = new EntityInstance(root, [child], undefined, true);

    e.setValue("inputs", "0", true);
    expect(getInput(e, "0")).toBe(true);
    expect(getChildInput(e, "e", "0")).toBe(true);
  });
});

describe("nand primitive", () => {
  test("truth table check via setValues", () => {
    const root = newTestEntity("nand");
    root.inputs = [
      { title: "0", y: 0 },
      { title: "1", y: 0 },
    ];
    root.outputs = [{ title: "0", y: 0 }];
    const e = new EntityInstance(root, [], undefined, true);

    e.setValue("inputs", "0", true);
    expect(getInput(e, "0")).toBe(true);
    expect(getInput(e, "1")).toBe(undefined);
    expect(getOutput(e, "0")).toBe(true);

    e.setValue("inputs", "1", true);
    expect(getInput(e, "0")).toBe(true);
    expect(getInput(e, "1")).toBe(true);
    expect(getOutput(e, "0")).toBe(false);

    [
      [false, false, true],
      [false, true, true],
      [true, false, true],
      [true, true, false],
    ].forEach((elem) => {
      e.setValue("inputs", "0", elem[0]);
      e.setValue("inputs", "1", elem[1]);
      expect(getOutput(e, "0")).toBe(elem[2]);
    });
  });
});

describe("nand entity", () => {
  test("truth table check via setValues", () => {
    const root = newTestEntity("t");
    root.inputs = [
      { title: "0", y: 0 },
      { title: "1", y: 0 },
    ];
    root.outputs = [{ title: "0", y: 0 }];
    const child = newTestEntity("nand");
    child.inputs = [
      { title: "0", y: 0 },
      { title: "1", y: 0 },
    ];
    child.outputs = [{ title: "0", y: 0 }];
    root.entities = [{ ...child, title: "nand0" }];
    root.connections = [
      newTestConnection({ Type: "root", title: "t", subtype: "inputs", subtitle: "0" }, { Type: "entity", title: "nand0", subtype: "inputs", subtitle: "0" }),
      newTestConnection({ Type: "root", title: "t", subtype: "inputs", subtitle: "1" }, { Type: "entity", title: "nand0", subtype: "inputs", subtitle: "1" }),
      newTestConnection({ Type: "entity", title: "nand0", subtype: "outputs", subtitle: "0" }, { Type: "root", title: "t", subtype: "outputs", subtitle: "0" }),
    ];
    const e = new EntityInstance(root, [child], undefined, true);

    e.setValue("inputs", "0", true);
    expect(getInput(e, "0")).toBe(true);
    expect(getInput(e, "1")).toBe(undefined);
    expect(getOutput(e, "0")).toBe(true);

    e.setValue("inputs", "1", true);
    expect(getInput(e, "0")).toBe(true);
    expect(getInput(e, "1")).toBe(true);
    expect(getOutput(e, "0")).toBe(false);

    [
      [false, false, true],
      [false, true, true],
      [true, false, true],
      [true, true, false],
    ].forEach((elem) => {
      e.setValue("inputs", "0", elem[0]);
      e.setValue("inputs", "1", elem[1]);
      expect(getOutput(e, "0")).toBe(elem[2]);
    });
  });
});

describe("nand entity - reverse", () => {
  test("truth table check via setValues", () => {
    const root = newTestEntity("t");
    root.inputs = [
      { title: "0", y: 0 },
      { title: "1", y: 0 },
    ];
    root.outputs = [{ title: "0", y: 0 }];
    const child = newTestEntity("nand");
    child.inputs = [
      { title: "0", y: 0 },
      { title: "1", y: 0 },
    ];
    child.outputs = [{ title: "0", y: 0 }];
    root.entities = [{ ...child, title: "nand0" }];
    root.connections = [
      newTestConnection({ Type: "root", title: "t", subtype: "inputs", subtitle: "0" }, { Type: "entity", title: "nand0", subtype: "inputs", subtitle: "0" }),
      newTestConnection({ Type: "root", title: "t", subtype: "inputs", subtitle: "1" }, { Type: "entity", title: "nand0", subtype: "inputs", subtitle: "1" }),
      newTestConnection({ Type: "root", title: "t", subtype: "outputs", subtitle: "0" }, { Type: "entity", title: "nand0", subtype: "outputs", subtitle: "0" }),
    ];
    const e = new EntityInstance(root, [child], undefined, true);

    e.setValue("inputs", "0", true);
    expect(getInput(e, "0")).toBe(true);
    expect(getInput(e, "1")).toBe(undefined);
    expect(getOutput(e, "0")).toBe(true);

    e.setValue("inputs", "1", true);
    expect(getInput(e, "0")).toBe(true);
    expect(getInput(e, "1")).toBe(true);
    expect(getOutput(e, "0")).toBe(false);

    [
      [false, false, true],
      [false, true, true],
      [true, false, true],
      [true, true, false],
    ].forEach((elem) => {
      e.setValue("inputs", "0", elem[0]);
      e.setValue("inputs", "1", elem[1]);
      expect(getOutput(e, "0")).toBe(elem[2]);
    });
  });
});

describe("not canvas", () => {
  test("truth table check via setValues", () => {
    const root = newTestEntity("t");
    root.inputs = [{ title: "tIn0", y: 0 }];
    root.outputs = [{ title: "tOut0", y: 0 }];

    const nandChild = newTestEntity("nand");
    nandChild.inputs = [
      { title: "nandIn0", y: 0 },
      { title: "nandIn1", y: 0 },
    ];
    nandChild.outputs = [{ title: "nandOut0", y: 0 }];

    root.entities = [{ ...nandChild, title: "nand0" }];
    root.connections = [
      newTestConnection(
        { Type: "root", title: "t", subtype: "inputs", subtitle: "tIn0" },
        { Type: "entity", title: "nand0", subtype: "inputs", subtitle: "nandIn0" },
      ),
      newTestConnection(
        { Type: "root", title: "t", subtype: "inputs", subtitle: "tIn0" },
        { Type: "entity", title: "nand0", subtype: "inputs", subtitle: "nandIn1" },
      ),
      newTestConnection(
        { Type: "entity", title: "nand0", subtype: "outputs", subtitle: "nandOut0" },
        { Type: "root", title: "t", subtype: "outputs", subtitle: "tOut0" },
      ),
    ];
    const e = new EntityInstance(root, [nandChild], undefined, true);

    e.setValue("inputs", "tIn0", true);

    expect(getChildInput(e, "nand0", "nandIn0")).toBe(true);
    expect(getChildInput(e, "nand0", "nandIn1")).toBe(true);
    expect(getChildOutput(e, "nand0", "nandOut0")).toBe(false);

    expect(getOutput(e, "tOut0")).toBe(false);
  });
});

describe("and canvas", () => {
  test("truth table check via setValues", () => {
    const root = newTestEntity("t");
    root.inputs = [
      { title: "tIn0", y: 0 },
      { title: "tIn1", y: 0 },
    ];
    root.outputs = [{ title: "tOut0", y: 0 }];

    const notChild = (() => {
      const not = newTestEntity("not");
      not.inputs = [{ title: "notIn0", y: 0 }];
      not.outputs = [{ title: "notOut0", y: 0 }];

      const nandChild0 = newTestEntity("nand");
      nandChild0.inputs = [
        { title: "nandIn0", y: 0 },
        { title: "nandIn1", y: 0 },
      ];
      nandChild0.outputs = [{ title: "nandOut0", y: 0 }];

      not.entities = [{ ...nandChild0, title: "nand0" }];
      not.connections = [
        newTestConnection(
          { Type: "root", title: "not", subtype: "inputs", subtitle: "notIn0" },
          { Type: "entity", title: "nand0", subtype: "inputs", subtitle: "nandIn0" },
        ),
        newTestConnection(
          { Type: "root", title: "not", subtype: "inputs", subtitle: "notIn0" },
          { Type: "entity", title: "nand0", subtype: "inputs", subtitle: "nandIn1" },
        ),
        newTestConnection(
          { Type: "entity", title: "nand0", subtype: "outputs", subtitle: "nandOut0" },
          { Type: "root", title: "not", subtype: "outputs", subtitle: "notOut0" },
        ),
      ];
      return not;
    })();

    const nandChild1 = (() => {
      const nand = newTestEntity("nand");
      nand.inputs = [
        { title: "nandIn0", y: 0 },
        { title: "nandIn1", y: 0 },
      ];
      nand.outputs = [{ title: "nandOut0", y: 0 }];
      return nand;
    })();

    root.entities = [
      { ...nandChild1, title: "nand1" },
      { ...notChild, title: "not0" },
    ];

    root.connections = [
      newTestConnection(
        { Type: "root", title: "t", subtype: "inputs", subtitle: "tIn0" },
        { Type: "entity", title: "nand1", subtype: "inputs", subtitle: "nandIn0" },
      ),
      newTestConnection(
        { Type: "root", title: "t", subtype: "inputs", subtitle: "tIn1" },
        { Type: "entity", title: "nand1", subtype: "inputs", subtitle: "nandIn1" },
      ),
      newTestConnection(
        { Type: "entity", title: "nand1", subtype: "outputs", subtitle: "nandOut0" },
        { Type: "entity", title: "not0", subtype: "inputs", subtitle: "notIn0" },
      ),
      newTestConnection(
        { Type: "entity", title: "not0", subtype: "outputs", subtitle: "notOut0" },
        { Type: "root", title: "t", subtype: "outputs", subtitle: "tOut0" },
      ),
    ];

    const e = new EntityInstance(root, [nandChild1, notChild], undefined, true);

    e.setValue("inputs", "tIn0", true);
    e.setValue("inputs", "tIn1", true);

    expect(getChildInput(e, "nand1", "nandIn0")).toBe(true);
    expect(getChildInput(e, "nand1", "nandIn1")).toBe(true);
    expect(getChildOutput(e, "nand1", "nandOut0")).toBe(false);

    expect(getChildInput(e, "not0", "notIn0")).toBe(false);

    expect(getChildInput(getChild(e, "not0"), "nand0", "nandIn0")).toBe(false);
    expect(getChildInput(getChild(e, "not0"), "nand0", "nandIn1")).toBe(false);
    expect(getChildOutput(getChild(e, "not0"), "nand0", "nandOut0")).toBe(true);

    expect(getChildOutput(e, "not0", "notOut0")).toBe(true);

    expect(getOutput(e, "tOut0")).toBe(true);
  });
});
