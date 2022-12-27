export type IO = {
  title: string;
  value?: boolean | undefined;

  y: number;
};

export type ConnectionIO = {
  Type: string;
  title: string;
  subtype: "inputs" | "outputs";
  subtitle: string;
};

export type Connection = {
  From: ConnectionIO;
  To: ConnectionIO;
  points: {
    From: [number, number];
    intermediaries: [number, number][];
    To: [number, number];
  };
};

export type EntityUI = {
  pins: {
    radius: number;
  };
  shape: {
    x: number;
    y: number;
    width: number;
    height: number;
  } & (
    | {
        transparent: true;
        color?: string;
      }
    | {
        transparent?: false;
        color: string;
      }
  );
  title: {
    x: number;
    y: number;
    fontSize: number;
    scaleX: number;
    scaleY: number;
    color: string;
  };
};

export type PartialEntityUI = {
  pins?: Partial<EntityUI["pins"]>;
  shape?: Partial<EntityUI["shape"]>;
  title?: Partial<EntityUI["title"]>;
};

export type Entity = {
  Type: string;
  title: string;
  ui: EntityUI;
  inputs: IO[];
  outputs: IO[];
  connections: Connection[];

  entities: Array<
    Omit<Entity, "ui" | "inputs" | "outputs" | "connections" | "entities"> & {
      ui: PartialEntityUI;
    }
  >;

  truthTable?: Array<{
    inputs: IO[];
    outputs: IO[];
  }>;

  Component?: React.FC<{
    entity: EntityInstance;
    inputs?: IO[];
    x?: number;
    y?: number;
  }>;
};

export const formatEntity = (entity: { Type?: string; title?: string; subtype?: string; subtitle?: string }): string => {
  return [entity.Type, entity.title, entity.subtype, entity.subtitle].filter((elem) => !!elem).join(":");
};

export class EntityInstance {
  root: Omit<Entity, "ui">;
  parent?: EntityInstance;

  entities: EntityInstance[] = [];

  parentTree(): string {
    if (!this.parent) return this.root.Type;
    return this.parent.parentTree() + ">" + this.root.Type;
  }
  // Expected any.
  //eslint-disable-next-line @typescript-eslint/no-explicit-any
  log(...args: any[]) {
    console.log(`[${this.parentTree()}]`, ...args);
  }

  constructor(root: Omit<Entity, "ui"> | undefined, lib: Omit<Entity, "ui">[], parent?: EntityInstance, indent = 0) {
    if (!root) {
      throw new Error(`missing root entity`);
    }
    this.root = root;
    this.parent = parent;
    this.entities = (this.root.entities ?? []).map((elem) => {
      const ret = lib.find((libEntry) => libEntry.Type === elem.Type);
      if (!ret) {
        throw new Error(`entity type '${elem.Type}' not found`);
      }
      return new EntityInstance({ ...ret, ...elem }, lib, this, indent + 1);
    });
  }

  run() {
    if (this.root.Type === "nand") {
      const output = !(!!this.root.inputs?.[0]?.value && !!this.root.inputs?.[1]?.value);
      if (this.root.outputs?.[0].value !== output) {
        this.setValue("outputs", this.root.outputs?.[0].title, output);
      }
    }
  }

  setValue(Type: "inputs" | "outputs", title: string, value: boolean) {
    this.log(`Settings value ${this.root.Type}:${this.root.title}:${Type}:${title} to ${value}.`, this);
    const ret = this.root[Type].find((elem) => elem.title === title);
    if (!ret) {
      throw new Error(`${Type} '${title}' not found in ${formatEntity(this.root)}`);
    }
    if (ret.value === value) {
      console.warn(`Value ${Type}:${title} in ${formatEntity(this.root)} already set!`);
      return;
    }
    this.root[Type] = this.root[Type].map((elem) => (elem.title === title ? { ...elem, value } : elem));

    // Propagate the value to all connected points on the root.
    this.root.connections
      .filter(
        (connection) =>
          connection.From.Type === "root" &&
          connection.From.title === this.root.title &&
          connection.From.subtype === Type &&
          connection.From.subtitle === title,
      )
      .forEach((connection) => {
        this.root.connections
          .filter((c) => c !== connection)
          .filter(
            (c) =>
              c.From.Type === connection.To.Type &&
              c.From.title === connection.To.title &&
              c.From.subtype === connection.To.subtype &&
              c.From.subtitle === connection.To.subtitle,
          )
          .forEach((c) => {
            this.setValue(c.To.subtype, c.To.subtitle, value);
          });

        this.root.connections
          .filter((c) => c !== connection)
          .filter(
            (c) =>
              c.To.Type === connection.To.Type &&
              c.To.title === connection.To.title &&
              c.To.subtype === connection.To.subtype &&
              c.To.subtitle === connection.To.subtitle,
          )
          .forEach((c) => {
            this.setValue(c.From.subtype, c.From.subtitle, value);
          });
      });

    this.root.connections
      .filter(
        (connection) =>
          connection.To.Type === "root" && connection.To.title === this.root.title && connection.To.subtype === Type && connection.To.subtitle === title,
      )
      .forEach((connection) => {
        this.root.connections
          .filter((c) => c !== connection)
          .filter(
            (c) =>
              c.From.Type === connection.From.Type &&
              c.From.title === connection.From.title &&
              c.From.subtype === connection.From.subtype &&
              c.From.subtitle === connection.From.subtitle,
          )
          .forEach((c) => {
            this.setValue(c.To.subtype, c.To.subtitle, value);
          });
        this.root.connections
          .filter((c) => c !== connection)
          .filter(
            (c) =>
              c.To.Type === connection.From.Type &&
              c.To.title === connection.From.title &&
              c.To.subtype === connection.From.subtype &&
              c.To.subtitle === connection.From.subtitle,
          )
          .forEach((c) => {
            this.setValue(c.From.subtype, c.From.subtitle, value);
          });
      });

    this.run();

    return;

    this.root.connections
      .filter(
        (connection) =>
          connection.From.Type === "root" &&
          connection.From.title === this.root.title &&
          connection.From.subtype === Type &&
          connection.From.subtitle === title,
      )
      .forEach((connection) => {
        const target = connection.To.Type === "root" ? this : this.entities.find((e) => e.root.title === connection.To.title);
        target?.setValue(connection.To.subtype, connection.To.subtitle, value);
        try {
          this.setValue(connection.From.subtype, connection.From.subtitle, value);
        } catch (e) {
          console.log("ignore", e);
        }
        try {
          this.parent?.setValue(connection.From.subtype, connection.From.subtitle, value);
        } catch (e) {
          console.log("ignore", e);
        }
      });

    this.root.connections
      .filter(
        (connection) =>
          connection.To.Type === "root" && connection.To.title === this.root.title && connection.To.subtype === Type && connection.To.subtitle === title,
      )
      .forEach((connection) => {
        const target = connection.From.Type === "root" ? this : this.entities.find((e) => e.root.title === connection.From.title);
        target?.setValue(connection.From.subtype, connection.From.subtitle, value);
        try {
          this.setValue(connection.To.subtype, connection.To.subtitle, value);
        } catch (e) {
          console.log("ignore", e);
        }
        try {
          this.parent?.setValue(connection.To.subtype, connection.To.subtitle, value);
        } catch (e) {
          console.log("ignore", e);
        }
      });
  }
}
