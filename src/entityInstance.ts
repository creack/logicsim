export type IO = {
  title: string;
  value?: boolean | undefined;

  y?: number;
  colorOn?: string;
  colorOff?: string;
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
  points?: number[];
  color?: string;
};

export type Entity = {
  Type: string;
  title: string;
  width?: number;
  height?: number;
  x?: number;
  y?: number;
  color?: string;
  inputs?: IO[];
  outputs?: IO[];
  entities?: Entity[];
  connections?: Connection[];
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

export const formatEntity = (entity: {
  Type?: string;
  title?: string;
  subtype?: string;
  subtitle?: string;
}): string => {
  return [entity.Type, entity.title, entity.subtype, entity.subtitle]
    .filter((elem) => !!elem)
    .join(":");
};

export class EntityInstance {
  root: Entity;
  entities: EntityInstance[] = [];

  actions: Array<{
    From: { title: string; subtype: string; subtitle: string };
    fct: (value: boolean) => void;
    description: string;
  }> = [];

  constructor(root: Entity, library: () => Entity[], indent: number = 0) {
    this.root = root;
    this.entities = (this.root.entities ?? []).map((elem) => {
      if (elem.Type === "nand") {
        // Primitive.
        return new EntityInstance(
          {
            inputs: [{ title: "0" }, { title: "1" }],
            outputs: [{ title: "0" }],
            color: "purple",
            height: 200,
            ...elem,
          },
          library,
          indent + 1
        );
      }
      const ret = library().find((libEntry) => libEntry.Type === elem.Type);
      if (!ret) {
        throw new Error(`entity type '${elem.Type}' not found`);
      }
      return new EntityInstance({ ...ret, ...elem }, library, indent + 1);
    });

    this.root.connections?.forEach((connection) => {
      if (connection.From.Type === "root") {
        const ret =
          connection.To.Type === "root"
            ? this
            : this.entities.find(
                (entity) => entity.root.title === connection.To.title
              );
        if (!ret) {
          throw new Error(
            `[to] Target for connection not found ${formatEntity(
              connection.To
            )} in ${formatEntity(this.root)}`
          );
        }

        this.actions.push({
          From: connection.From,
          fct: (value: boolean) => {
            ret.setValue(connection.To.subtype, connection.To.subtitle, value);
          },
          description: `[action] from: ${formatEntity(
            connection.From
          )} in ${formatEntity(this.root)} setValue ${formatEntity(
            connection.To
          )}`,
        });
        return;
      }
      if (connection.From.Type === "entity") {
        const target = this.entities.find(
          (entity) => entity.root.title === connection.From.title
        );
        if (!target) {
          throw new Error(
            `[from] Taget connected entity not found ${formatEntity(
              connection.From
            )} in ${formatEntity(this.root)}}`
          );
        }

        const ret =
          connection.To.Type === "root"
            ? this
            : this.entities.find(
                (entity) => entity.root.title === connection.To.title
              );
        if (!ret) {
          throw new Error(
            `[to] Target for conneciton not found ${formatEntity(
              connection.To
            )} in ${formatEntity(this.root)})`
          );
        }
        target.actions.push({
          From: connection.From,
          fct: (value: boolean) => {
            ret.setValue(connection.To.subtype, connection.To.subtitle, value);
          },
          description: `[action] from: ${formatEntity(
            connection.From
          )} in ${formatEntity(this.root)} setValue ${formatEntity(
            connection.To
          )}`,
        });
        return;
      }
      throw new Error(`unknown connection from type ${connection.From.Type}`);
    });
  }

  run() {
    if (this.root.Type === "nand") {
      const output = !(
        !!this.root.inputs?.[0]?.value && !!this.root.inputs?.[1]?.value
      );
      if (this.root.outputs?.[0].value !== output) {
        this.setValue("outputs", "0", output);
      }
    }
  }

  setValue(Type: string, title: string, value: boolean) {
    const ret = (
      Type === "inputs" ? this.root.inputs : this.root.outputs
    )?.find((elem) => elem.title === title);
    if (!ret) {
      throw new Error(
        `${Type} '${title}' not found in ${formatEntity(this.root)}`
      );
    }
    if (ret.value === value) {
      console.warn(
        `Value ${Type}:${title} in ${formatEntity(this.root)} already set!`
      );
      return;
    }
    ret.value = value;
    this.run();

    this.actions
      .filter(
        (action) =>
          action.From.subtype === Type && action.From.subtitle === title
      )
      .forEach((action) => {
        action.fct(value);
      });
  }
}
