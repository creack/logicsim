import React from "react";
import type { Connection, ConnectionIO, Entity } from "./entityInstance";
import { formatEntity } from "./entityInstance";
import { library } from "./lib";

type actionTypes =
  | { type: "save" }
  | { type: "reset" }
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

const reducer = (state: Entity[], action: actionTypes): Entity[] => {
  switch (action.type) {
    case "reset":
      localStorage.removeItem("library");
      const lib = library();
      localStorage.setItem("library", JSON.stringify(lib));
      return lib;

    case "save":
      localStorage.setItem("library", JSON.stringify(state));
      return state;

    case "updateChildEntityCoordinates":
      const { childTarget } = lookupChildTarget(state, action);
      if (!childTarget.ui.shape) {
        childTarget.ui.shape = {};
      }
      childTarget.ui.shape.x = action.x;
      childTarget.ui.shape.y = action.y;
      return state;

    case "removeChildEntity":
      lookupChildTarget(state, action); // Throws if parent of child is missing.
      return state.map((parent) =>
        parent.Type === action.parentType
          ? {
              ...parent,
              entities: parent.entities.filter(
                (elem) => elem.title !== action.childTitle
              ),
              connections: parent.connections.filter(
                (elem) =>
                  !(
                    elem.From.title === action.childTitle ||
                    elem.To.title === action.childTitle
                  )
              ),
            }
          : parent
      );

    case "addConnection":
      if (!state.find((elem) => elem.Type === action.parentType)) {
        throw new Error(`parent target '${action.parentType}' not found`);
      }
      return state.map((parent) =>
        parent.Type === action.parentType
          ? {
              ...parent,
              connections: [
                ...parent.connections.filter(
                  (elem) =>
                    !(
                      formatEntity(elem.From) === formatEntity(action.From) &&
                      formatEntity(elem.To) === formatEntity(action.To)
                    ) &&
                    !(
                      formatEntity(elem.From) === formatEntity(action.To) &&
                      formatEntity(elem.To) === formatEntity(action.From)
                    )
                ),
                {
                  From: { ...action.From },
                  To: { ...action.To },
                  points: {
                    From: [...action.points.From],
                    To: [...action.points.To],
                    intermediaries: [
                      ...action.points.intermediaries.map(
                        (elem) => [...elem] as [number, number]
                      ),
                    ],
                  },
                },
              ],
            }
          : parent
      );

    case "removeConnection":
      if (!action.To) {
        // If we don't have a "To", delete all connection that originate or target the "From".
        return state.map((parent) =>
          parent.Type === action.parentType
            ? {
                ...parent,
                connections: parent.connections.filter(
                  (elem) =>
                    !(
                      formatEntity(elem.From) === formatEntity(action.From) ||
                      formatEntity(elem.To) === formatEntity(action.From)
                    )
                ),
              }
            : parent
        );
      }
      return state.map((parent) =>
        parent.Type === action.parentType
          ? {
              ...parent,
              connections: parent.connections.filter(
                (elem) =>
                  !(
                    formatEntity(elem.From) === formatEntity(action.From) &&
                    formatEntity(elem.To) === formatEntity(action.To!)
                  )
              ),
            }
          : parent
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
                  [action.mode]: [
                    ...parent[action.mode],
                    { title: action.title, y: action.y },
                  ],
                }
              : parent
          );
        case "remove":
          return state.map((parent) =>
            parent.Type === action.parentType
              ? {
                  ...parent,
                  [action.mode]: [
                    ...parent[action.mode].filter(
                      (elem) => elem.title !== action.title
                    ),
                  ],
                }
              : parent
          );
        case "update":
          return state.map((parent) =>
            parent.Type === action.parentType
              ? {
                  ...parent,
                  [action.mode]: [
                    ...parent[action.mode].map((elem) =>
                      elem.title === action.title
                        ? { ...elem, y: action.y }
                        : elem
                    ),
                  ],
                }
              : parent
          );
        default:
          throw new Error(
            `unknown updateIOPane action '${JSON.stringify(action)}'`
          );
      }

    default:
      throw new Error(
        `unknown reducer action type '${JSON.stringify(action)}'`
      );
  }
};

const lookupChildTarget = (
  state: Entity[],
  action: {
    parentType: string;
    childTitle: string;
  }
) => {
  const parentTarget = state.find((elem) => elem.Type === action.parentType);
  if (!parentTarget) {
    throw new Error(`parent target '${action.parentType}' not found`);
  }
  const childTarget = parentTarget.entities.find(
    (elem) => elem.title === action.childTitle
  );
  if (!childTarget) {
    console.warn({ parentTarget });
    throw new Error(
      `child target '${action.childTitle}' in '${action.parentType}' not found`
    );
  }
  return { parentTarget, childTarget };
};

export const useLibraryReducer = () => React.useReducer(reducer, library());

export const LibraryDispatchCtx = React.createContext<
  React.Dispatch<actionTypes>
>(null as unknown as React.Dispatch<actionTypes>);
export const LibraryCtx = React.createContext<Entity[]>([]);

export const useLibraryDispatch = () => React.useContext(LibraryDispatchCtx);
export const useLibrary = () => React.useContext(LibraryCtx);

export const useLookupLibrary = (Type: string): Entity | undefined => {
  const lib = useLibrary();

  return React.useMemo(
    () => lib.find((elem) => elem.Type === Type),
    [lib, Type]
  );
};
