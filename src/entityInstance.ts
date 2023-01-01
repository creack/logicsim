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
    color: string;
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
  disabledLogs = false;

  entities: EntityInstance[] = [];

  parentTree(): string {
    if (!this.parent) return this.root.Type + ":" + this.root.title;
    return this.parent.parentTree() + ">" + this.root.Type + ":" + this.root.title;
  }
  // Expected any.
  //eslint-disable-next-line @typescript-eslint/no-explicit-any
  log(...args: any[]) {
    if (this.disabledLogs) return;
    console.log(`[${this.parentTree()}]`, ...args);
  }

  constructor(root: Omit<Entity, "ui"> | undefined, lib: Omit<Entity, "ui">[], parent?: EntityInstance, disabledLogs = false) {
    if (!root) {
      throw new Error(`missing root entity`);
    }
    this.root = JSON.parse(JSON.stringify(root));
    this.parent = parent;
    this.disabledLogs = disabledLogs;
    this.log("New instance");
    this.entities = (this.root.entities ?? []).map((elem) => {
      const ret = (JSON.parse(JSON.stringify(lib)) as typeof lib).find((libEntry) => libEntry.Type === elem.Type);
      if (!ret) {
        throw new Error(`entity type '${elem.Type}' not found`);
      }
      return new EntityInstance({ ...ret, ...elem }, lib, this, disabledLogs);
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
    this.log(`Settings value ${this.root.Type}:${this.root.title}:${Type}:${title} to ${value}.`);
    const ret = this.root[Type].find((elem) => elem.title === title);
    if (!ret) {
      throw new Error(`${Type} '${title}' not found in ${formatEntity(this.root)}`);
    }
    if (ret.value === value) {
      this.log(`Value ${Type}:${title} in ${formatEntity(this.root)} already set!`);
      return;
    }
    this.root[Type] = this.root[Type].map((elem) => (elem.title === title ? { ...elem, value } : elem));

    this.root.connections
      .filter((c) => formatEntity(c.From) === `root:${this.root.Type}:${Type}:${title}`)
      .forEach((c) => {
        const target = c.To.Type === "entity" ? this.entities.find((elem) => elem.root.title === c.To.title) : this;
        if (!target) throw new Error(`connected target not found from ${formatEntity(c.From)} to ${formatEntity(c.To)}`);
        this.log(`-- Setting ${c.To.subtype}:${c.To.subtitle} to ${value} because connection.From ${formatEntity(c.From)} matched.`);
        target.setValue(c.To.subtype, c.To.subtitle, value);
      });

    this.root.connections
      .filter((c) => formatEntity(c.To) === `root:${this.root.Type}:${Type}:${title}`)
      .forEach((c) => {
        const target = c.From.Type === "entity" ? this.entities.find((elem) => elem.root.title === c.From.title) : this;
        if (!target) throw new Error(`connected target not found from ${formatEntity(c.From)} to ${formatEntity(c.To)}`);
        target.setValue(c.From.subtype, c.From.subtitle, value);
      });

    this.parent?.root.connections
      .filter((c) => formatEntity(c.From) === `entity:${this.root.title}:${Type}:${title}`)
      .forEach((c) => {
        const target = c.To.Type === "entity" ? this.parent?.entities.find((elem) => elem.root.title === c.To.title) : this.parent;
        if (!target) throw new Error(`connected target not found from ${formatEntity(c.From)} to ${formatEntity(c.To)}`);
        target.setValue(c.To.subtype, c.To.subtitle, value);
      });

    this.parent?.root.connections
      .filter((c) => formatEntity(c.To) === `entity:${this.root.title}:${Type}:${title}`)
      .forEach((c) => {
        const target = c.From.Type === "entity" ? this.parent?.entities.find((elem) => elem.root.title === c.From.title) : this.parent;
        if (!target) throw new Error(`connected target not found from ${formatEntity(c.From)} to ${formatEntity(c.To)}`);
        target.setValue(c.From.subtype, c.From.subtitle, value);
      });

    this.run();
  }
}
