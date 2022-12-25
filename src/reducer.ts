import React from "react";
import type { Connection, ConnectionIO, Entity } from "./entityInstance";
import { formatEntity } from "./entityInstance";
import { library } from "./lib";

type actionTypes =
  | { type: "save" }
  | { type: "reset" }
  | { type: "newRoot"; title: string }
  | { type: "updateRootTitle"; parentType: string; title: string }
  | { type: "newEntity"; parentType: string; Type: string }
  | {
      type: "updateChildEntityCoordinates";
      parentType: string;
      childTitle: string;
      x: number;
      y: number;
    }
  | {
      type: "removeChildEntity";
      parentType: string;
      childTitle: string;
    }
  | {
      type: "addConnection";
      parentType: string;
      From: ConnectionIO;
      To: ConnectionIO;
      points: Connection["points"];
    }
  | {
      type: "removeConnection";
      parentType: string;
      From: ConnectionIO;
      To?: ConnectionIO;
    }
  | {
      type: "updateIOPane";
      parentType: string;
      mode: "inputs" | "outputs";
      title: string;
      y: number;
      action: "add" | "update" | "remove";
    };

const newRoot = (title: string): Entity => ({
  Type: title,
  title,
  inputs: [],
  outputs: [],
  entities: [],
  connections: [],
  ui: {
    pins: { radius: 10 },
    shape: {
      x: 0,
      y: 0,
      width: 100,
      height: 100,
      transparent: true,
      color: "",
    },
    title: {
      x: 0,
      y: 0,
      scaleX: 1,
      scaleY: 1,
      fontSize: 18,
      color: "white",
    },
  },
});

const reducer = (state: Entity[], action: actionTypes): Entity[] => {
  const parent = "parentType" in action && action.parentType ? state.find((elem) => elem.Type === action.parentType) : undefined;

  if ("parentType" in action && !parent) {
    throw new Error(`parent target '${action.parentType}' not found`);
  }

  switch (action.type) {
    case "reset":
      localStorage.removeItem("srcType");
      localStorage.removeItem("library");
      return (() => {
        const lib = library();
        localStorage.setItem("library", JSON.stringify(lib));
        return lib;
      })();

    case "save":
      localStorage.setItem("library", JSON.stringify(state));
      return state;

    case "newRoot":
      return [...state, newRoot(action.title)];

    case "updateRootTitle":
      return state.map((parent) => (parent.Type === action.parentType ? { ...parent, Type: action.title, title: action.title } : parent));

    case "newEntity":
      if (!state.find((elem) => elem.Type === action.Type)) {
        throw new Error(`entity type ${action.Type} not found`);
      }
      return (() => {
        let title = `${action.Type}${parent!.entities.filter((elem) => elem.Type === action.Type).length}`;
        for (let i = 0; i < 1000; i++) {
          if (!parent!.entities.find((elem) => elem.title === title)) {
            break;
          }
          title = `${title}New`;
        }
        return state.map((parent) =>
          parent.Type === action.parentType
            ? {
                ...parent,
                entities: [
                  ...parent.entities,
                  {
                    Type: action.Type,
                    title,
                    ui: {
                      shape: { transparent: false, color: "red" },
                    },
                  },
                ],
              }
            : parent,
        );
      })();

    case "updateChildEntityCoordinates":
      lookupChildTarget(state, action); // Throws if parent of child is missing.
      return state.map((parent) =>
        parent.Type === action.parentType
          ? {
              ...parent,
              entities: parent.entities.map((child) =>
                child.title === action.childTitle
                  ? {
                      ...child,
                      ui: {
                        ...child.ui,
                        shape: {
                          ...(child.ui.shape ?? {}),
                          x: action.x,
                          y: action.y,
                        },
                      },
                    }
                  : child,
              ),
            }
          : parent,
      );

    case "removeChildEntity":
      lookupChildTarget(state, action); // Throws if parent of child is missing.
      return state.map((parent) =>
        parent.Type === action.parentType
          ? {
              ...parent,
              entities: parent.entities.filter((elem) => elem.title !== action.childTitle),
              connections: parent.connections.filter((elem) => !(elem.From.title === action.childTitle || elem.To.title === action.childTitle)),
            }
          : parent,
      );

    case "addConnection":
      return state.map((parent) =>
        parent.Type === action.parentType
          ? {
              ...parent,
              connections: [
                ...parent.connections.filter(
                  (elem) =>
                    !(formatEntity(elem.From) === formatEntity(action.From) && formatEntity(elem.To) === formatEntity(action.To)) &&
                    !(formatEntity(elem.From) === formatEntity(action.To) && formatEntity(elem.To) === formatEntity(action.From)),
                ),
                {
                  From: { ...action.From },
                  To: { ...action.To },
                  points: {
                    From: [...action.points.From],
                    To: [...action.points.To],
                    intermediaries: [...action.points.intermediaries.map((elem) => [...elem] as [number, number])],
                  },
                },
              ],
            }
          : parent,
      );

    case "removeConnection":
      if (!action.To) {
        // If we don't have a "To", delete all connection that originate or target the "From".
        return state.map((parent) =>
          parent.Type === action.parentType
            ? {
                ...parent,
                connections: parent.connections.filter(
                  (elem) => !(formatEntity(elem.From) === formatEntity(action.From) || formatEntity(elem.To) === formatEntity(action.From)),
                ),
              }
            : parent,
        );
      }
      return state.map((parent) =>
        parent.Type === action.parentType
          ? {
              ...parent,
              connections: parent.connections.filter(
                (elem) => !(formatEntity(elem.From) === formatEntity(action.From) && formatEntity(elem.To) === formatEntity(action.To!)),
              ),
            }
          : parent,
      );

    case "updateIOPane":
      if (!state.find((elem) => elem.Type === action.parentType)) {
        throw new Error(`parent target '${action.parentType}' not found`);
      }
      switch (action.action) {
        case "add":
          return state.map((parent) =>
            parent.Type === action.parentType
              ? {
                  ...parent,
                  [action.mode]: [...parent[action.mode], { title: action.title, y: action.y }],
                }
              : parent,
          );
        case "remove":
          return state.map((parent) =>
            parent.Type === action.parentType
              ? {
                  ...parent,
                  [action.mode]: parent[action.mode].filter((elem) => elem.title !== action.title),
                  connections: parent.connections.filter(
                    (elem) =>
                      !((elem.From.Type === "root" && elem.From.subtitle === action.title) || (elem.To.Type === "root" && elem.To.subtitle === action.title)),
                  ),
                }
              : parent,
          );
        case "update":
          return state.map((parent) =>
            parent.Type === action.parentType
              ? {
                  ...parent,
                  [action.mode]: [...parent[action.mode].map((elem) => (elem.title === action.title ? { ...elem, y: action.y } : elem))],
                }
              : parent,
          );
        default:
          throw new Error(`unknown updateIOPane action '${JSON.stringify(action)}'`);
      }

    default:
      throw new Error(`unknown reducer action type '${JSON.stringify(action)}'`);
  }
};

const lookupChildTarget = (
  state: Entity[],
  action: {
    parentType: string;
    childTitle: string;
  },
) => {
  const parentTarget = state.find((elem) => elem.Type === action.parentType);
  if (!parentTarget) {
    throw new Error(`parent target '${action.parentType}' not found`);
  }
  const childTarget = parentTarget.entities.find((elem) => elem.title === action.childTitle);
  if (!childTarget) {
    console.warn({ parentTarget });
    throw new Error(`child target '${action.childTitle}' in '${action.parentType}' not found`);
  }
  return { parentTarget, childTarget };
};

export const useLibraryReducer = () => React.useReducer(reducer, library());

export const LibraryDispatchCtx = React.createContext<React.Dispatch<actionTypes>>(null as unknown as React.Dispatch<actionTypes>);
export const LibraryCtx = React.createContext<Entity[]>([]);

export const useLibraryDispatch = () => React.useContext(LibraryDispatchCtx);
export const useLibrary = () => React.useContext(LibraryCtx);

export const useLookupLibrary = (Type: string): Entity | undefined => {
  const lib = useLibrary();

  return React.useMemo(() => lib.find((elem) => elem.Type === Type), [lib, Type]);
};
