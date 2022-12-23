// import {
//   RawEightSegmentsDisplay,
//   SignedEigthSegmentsDisplay,
//   ThreeDigitDecimalDisplay,
// } from "./Components";
import type { Entity } from "./entityInstance";

export const library: () => Entity[] = () => [
  {
    Type: "nand",
    title: "nand",
    inputs: [
      { title: "nandIn0", y: 0.28 },
      { title: "nandIn1", y: 0.72 },
    ],
    outputs: [{ title: "nandOut0", y: 0.5 }],
    entities: [], // Primitive.
    connections: [], // Primitive.
    ui: {
      pins: {
        radius: 5,
      },
      shape: {
        x: 10,
        y: 10,
        width: 100,
        height: 50,
        color: "purple",
      },
      title: {
        x: 15,
        y: 10,
        fontSize: 28,
        scaleX: 1,
        scaleY: 1,
        color: "#fff",
      },
    },
  },
  {
    Type: "not",
    title: "not",
    ui: {
      pins: {
        radius: 5,
      },
      shape: {
        x: 10,
        y: 10,
        width: 90,
        height: 30,
        transparent: false,
        color: "#ff0000",
      },
      title: {
        x: 20,
        y: 0,
        fontSize: 28,
        color: "#ffffff",
        scaleX: 1,
        scaleY: 1,
      },
    },
    inputs: [{ title: "0", y: 0.5 }],
    outputs: [{ title: "0", y: 0.5 }],
    entities: [
      {
        Type: "nand",
        title: "nand1",
        ui: {
          shape: {
            x: 40,
            y: 40,
          },
        },
      },
    ],
    connections: [
      {
        From: {
          Type: "root",
          title: "not",
          subtype: "inputs",
          subtitle: "0",
        },
        To: {
          Type: "entity",
          title: "nand1",
          subtype: "inputs",
          subtitle: "0",
        },
        points: {
          From: [0, 0],
          intermediaries: [],
          To: [100, 100],
        },
      },
      {
        From: {
          Type: "root",
          title: "not",
          subtype: "inputs",
          subtitle: "0",
        },
        To: {
          Type: "entity",
          title: "nand1",
          subtype: "inputs",
          subtitle: "1",
        },
        points: {
          From: [100, 100],
          intermediaries: [],
          To: [200, 200],
        },
      },
      {
        From: {
          Type: "entity",
          title: "nand1",
          subtype: "outputs",
          subtitle: "0",
        },
        To: { Type: "root", title: "not", subtype: "outputs", subtitle: "0" },
        points: {
          From: [200, 200],
          intermediaries: [],
          To: [300, 300],
        },
      },
    ],
  },
  {
    Type: "and",
    title: "and",
    ui: {
      pins: {
        radius: 5,
      },
      shape: {
        x: 10,
        y: 10,
        width: 300,
        height: 120,
        transparent: true,
      },
      title: {
        x: 30,
        y: 40,
        fontSize: 28,
        color: "#000",
        scaleX: 1,
        scaleY: 1,
      },
    },
    inputs: [
      { title: "andIn0", y: 0.28 },
      { title: "andIn1", y: 0.72 },
    ],
    outputs: [{ title: "andOut0", y: 0.5 }],
    entities: [
      {
        Type: "nand",
        title: "nand0",
        ui: {
          shape: {
            x: 200,
            y: 50,
          },
        },
      },
      {
        Type: "not",
        title: "not0",
        ui: {
          shape: {
            x: 360,
            y: 250,
          },
        },
      },
      {
        Type: "not",
        title: "not1",
        ui: {
          shape: {
            x: 360,
            y: 450,
          },
        },
      },
    ],
    connections: [
      // {
      //   From: {
      //     Type: "root",
      //     title: "and",
      //     subtype: "inputs",
      //     subtitle: "0",
      //   },
      //   To: {
      //     Type: "entity",
      //     title: "nand0",
      //     subtype: "inputs",
      //     subtitle: "0",
      //   },
      //   points: [77.5, 119.5, 259.68, 133.5],
      // },
      // {
      //   From: {
      //     Type: "root",
      //     title: "and",
      //     subtype: "inputs",
      //     subtitle: "1",
      //   },
      //   To: {
      //     Type: "entity",
      //     title: "nand0",
      //     subtype: "inputs",
      //     subtitle: "1",
      //   },
      //   points: [77.5, 269.5, 94, 184, 116, 162, 259.68, 155.5],
      // },
      // {
      //   From: {
      //     Type: "entity",
      //     title: "nand0",
      //     subtype: "outputs",
      //     subtitle: "0",
      //   },
      //   To: {
      //     Type: "entity",
      //     title: "not0",
      //     subtype: "inputs",
      //     subtitle: "0",
      //   },
      //   points: [
      //     359.68, 144.5, 435, 147, 443, 205, 310, 216, 306, 342, 419.68, 334.5,
      //   ],
      // },
      // {
      //   From: {
      //     Type: "entity",
      //     title: "not0",
      //     subtype: "outputs",
      //     subtitle: "0",
      //   },
      //   To: { Type: "root", title: "and", subtype: "outputs", subtitle: "0" },
      //   points: [509.68, 334.5, 1202.52, 269.5],
      // },
      // {
      //   From: {
      //     Type: "entity",
      //     title: "not0",
      //     subtype: "outputs",
      //     subtitle: "0",
      //   },
      //   To: { Type: "root", title: "and", subtype: "outputs", subtitle: "0" },
      //   points: [509.68, 334.5, 1202.52, 269.5],
      // },
    ],
  },
  // {
  //   Type: "or",
  //   title: "or",
  //   width: 320,
  //   height: 200,
  //   x: 10,
  //   y: 10,
  //   color: "magenta",
  //   inputs: [{ title: "0" }, { title: "1" }],
  //   outputs: [{ title: "0" }],
  //   entities: [
  //     {
  //       Type: "nand",
  //       title: "nand0",
  //       x: 60,
  //       y: 50,
  //     },
  //     {
  //       Type: "not",
  //       title: "not0",
  //       x: 60,
  //       y: 120,
  //       width: 100,
  //       height: 50,
  //     },
  //     {
  //       Type: "nand",
  //       title: "nand2",
  //       x: 200,
  //       y: 80,
  //     },
  //   ],
  //   connections: [
  //     {
  //       From: {
  //         Type: "root",
  //         title: "or",
  //         subtype: "inputs",
  //         subtitle: "0",
  //       },
  //       To: {
  //         Type: "entity",
  //         title: "nand0",
  //         subtype: "inputs",
  //         subtitle: "0",
  //       },
  //     },
  //     {
  //       From: {
  //         Type: "root",
  //         title: "or",
  //         subtype: "inputs",
  //         subtitle: "0",
  //       },
  //       To: {
  //         Type: "entity",
  //         title: "nand0",
  //         subtype: "inputs",
  //         subtitle: "1",
  //       },
  //     },
  //     {
  //       From: {
  //         Type: "root",
  //         title: "or",
  //         subtype: "inputs",
  //         subtitle: "1",
  //       },
  //       To: {
  //         Type: "entity",
  //         title: "not0",
  //         subtype: "inputs",
  //         subtitle: "0",
  //       },
  //     },
  //     {
  //       From: {
  //         Type: "entity",
  //         title: "nand0",
  //         subtype: "outputs",
  //         subtitle: "0",
  //       },
  //       To: {
  //         Type: "entity",
  //         title: "nand2",
  //         subtype: "inputs",
  //         subtitle: "0",
  //       },
  //     },
  //     {
  //       From: {
  //         Type: "entity",
  //         title: "not0",
  //         subtype: "outputs",
  //         subtitle: "0",
  //       },
  //       To: {
  //         Type: "entity",
  //         title: "nand2",
  //         subtype: "inputs",
  //         subtitle: "1",
  //       },
  //     },
  //     {
  //       From: {
  //         Type: "entity",
  //         title: "nand2",
  //         subtype: "outputs",
  //         subtitle: "0",
  //       },
  //       To: {
  //         Type: "root",
  //         title: "or",
  //         subtype: "outputs",
  //         subtitle: "0",
  //       },
  //     },
  //   ],
  // },
  // {
  //   Type: "xor",
  //   title: "xor",
  //   width: 450,
  //   height: 200,
  //   x: 10,
  //   y: 10,
  //   color: "pink",
  //   inputs: [{ title: "0" }, { title: "1" }],
  //   outputs: [{ title: "0" }],
  //   entities: [
  //     {
  //       Type: "nand",
  //       title: "nand0",
  //       x: 40,
  //       y: 80,
  //     },
  //     {
  //       Type: "nand",
  //       title: "nand1",
  //       x: 180,
  //       y: 40,
  //     },
  //     {
  //       Type: "nand",
  //       title: "nand2",
  //       x: 180,
  //       y: 120,
  //     },
  //     {
  //       Type: "nand",
  //       title: "nand3",
  //       x: 320,
  //       y: 80,
  //     },
  //   ],
  //   connections: [
  //     {
  //       From: {
  //         Type: "root",
  //         title: "xor",
  //         subtype: "inputs",
  //         subtitle: "0",
  //       },
  //       To: {
  //         Type: "entity",
  //         title: "nand0",
  //         subtype: "inputs",
  //         subtitle: "0",
  //       },
  //     },
  //     {
  //       From: {
  //         Type: "root",
  //         title: "xor",
  //         subtype: "inputs",
  //         subtitle: "1",
  //       },
  //       To: {
  //         Type: "entity",
  //         title: "nand0",
  //         subtype: "inputs",
  //         subtitle: "1",
  //       },
  //     },
  //     {
  //       From: {
  //         Type: "root",
  //         title: "xor",
  //         subtype: "inputs",
  //         subtitle: "0",
  //       },
  //       To: {
  //         Type: "entity",
  //         title: "nand1",
  //         subtype: "inputs",
  //         subtitle: "0",
  //       },
  //     },
  //     {
  //       From: {
  //         Type: "root",
  //         title: "xor",
  //         subtype: "inputs",
  //         subtitle: "1",
  //       },
  //       To: {
  //         Type: "entity",
  //         title: "nand2",
  //         subtype: "inputs",
  //         subtitle: "1",
  //       },
  //     },
  //     {
  //       From: {
  //         Type: "entity",
  //         title: "nand0",
  //         subtype: "outputs",
  //         subtitle: "0",
  //       },
  //       To: {
  //         Type: "entity",
  //         title: "nand1",
  //         subtype: "inputs",
  //         subtitle: "1",
  //       },
  //     },
  //     {
  //       From: {
  //         Type: "entity",
  //         title: "nand0",
  //         subtype: "outputs",
  //         subtitle: "0",
  //       },
  //       To: {
  //         Type: "entity",
  //         title: "nand2",
  //         subtype: "inputs",
  //         subtitle: "0",
  //       },
  //     },
  //     {
  //       From: {
  //         Type: "entity",
  //         title: "nand1",
  //         subtype: "outputs",
  //         subtitle: "0",
  //       },
  //       To: {
  //         Type: "entity",
  //         title: "nand3",
  //         subtype: "inputs",
  //         subtitle: "0",
  //       },
  //     },
  //     {
  //       From: {
  //         Type: "entity",
  //         title: "nand2",
  //         subtype: "outputs",
  //         subtitle: "0",
  //       },
  //       To: {
  //         Type: "entity",
  //         title: "nand3",
  //         subtype: "inputs",
  //         subtitle: "1",
  //       },
  //     },
  //     {
  //       From: {
  //         Type: "entity",
  //         title: "nand3",
  //         subtype: "outputs",
  //         subtitle: "0",
  //       },
  //       To: {
  //         Type: "root",
  //         title: "xor",
  //         subtype: "outputs",
  //         subtitle: "0",
  //       },
  //     },
  //   ],
  // },
  // {
  //   Type: "nor",
  //   title: "nor",
  //   x: 10,
  //   y: 10,
  //   width: 300,
  //   height: 100,
  //   color: "#ff3300",
  //   inputs: [{ title: "0" }, { title: "1" }],
  //   outputs: [{ title: "0" }],
  //   entities: [
  //     { Type: "or", title: "or1", x: 40, y: 40, width: 100, height: 50 },
  //     { Type: "not", title: "not1", x: 180, y: 40, width: 100, height: 50 },
  //   ],
  //   connections: [
  //     {
  //       From: { Type: "root", title: "nor", subtype: "inputs", subtitle: "0" },
  //       To: { Type: "entity", title: "or1", subtype: "inputs", subtitle: "0" },
  //     },
  //     {
  //       From: { Type: "root", title: "nor", subtype: "inputs", subtitle: "1" },
  //       To: { Type: "entity", title: "or1", subtype: "inputs", subtitle: "1" },
  //     },
  //     {
  //       From: {
  //         Type: "entity",
  //         title: "or1",
  //         subtype: "outputs",
  //         subtitle: "0",
  //       },
  //       To: { Type: "entity", title: "not1", subtype: "inputs", subtitle: "0" },
  //     },
  //     {
  //       From: {
  //         Type: "entity",
  //         title: "not1",
  //         subtype: "outputs",
  //         subtitle: "0",
  //       },
  //       To: { Type: "root", title: "nor", subtype: "outputs", subtitle: "0" },
  //     },
  //   ],
  // },
  // {
  //   Type: "raw8segments",
  //   title: "raw8segments",
  //   Component: RawEightSegmentsDisplay,
  //   inputs: [
  //     { title: "0" },
  //     { title: "1" },
  //     { title: "2" },
  //     { title: "3" },
  //     { title: "4" },
  //     { title: "5" },
  //     { title: "6" },
  //     { title: "7" },
  //   ],
  // },
  // {
  //   Type: "adder",
  //   title: "adder",
  //   x: 10,
  //   y: 10,
  //   width: 600,
  //   height: 300,
  //   inputs: [{ title: "0" }, { title: "1" }, { title: "carry" }],
  //   outputs: [{ title: "sum" }, { title: "carry" }],
  //   entities: [
  //     { Type: "xor", title: "xor0", x: 100, y: 60, width: 100, height: 50 },
  //     { Type: "xor", title: "xor1", x: 440, y: 60, width: 100, height: 50 },
  //     { Type: "and", title: "and0", x: 100, y: 220, width: 100, height: 50 },
  //     { Type: "and", title: "and1", x: 280, y: 140, width: 100, height: 50 },
  //     { Type: "or", title: "or0", x: 440, y: 220, width: 100, height: 50 },
  //   ],
  //   connections: [
  //     {
  //       From: {
  //         Type: "root",
  //         title: "adder",
  //         subtype: "inputs",
  //         subtitle: "0",
  //       },
  //       To: {
  //         Type: "entity",
  //         title: "xor0",
  //         subtype: "inputs",
  //         subtitle: "0",
  //       },
  //     },
  //     {
  //       From: {
  //         Type: "root",
  //         title: "adder",
  //         subtype: "inputs",
  //         subtitle: "0",
  //       },
  //       To: {
  //         Type: "entity",
  //         title: "and0",
  //         subtype: "inputs",
  //         subtitle: "1",
  //       },
  //     },

  //     {
  //       From: {
  //         Type: "root",
  //         title: "adder",
  //         subtype: "inputs",
  //         subtitle: "1",
  //       },
  //       To: {
  //         Type: "entity",
  //         title: "xor0",
  //         subtype: "inputs",
  //         subtitle: "1",
  //       },
  //     },
  //     {
  //       From: {
  //         Type: "root",
  //         title: "adder",
  //         subtype: "inputs",
  //         subtitle: "1",
  //       },
  //       To: {
  //         Type: "entity",
  //         title: "and0",
  //         subtype: "inputs",
  //         subtitle: "0",
  //       },
  //     },

  //     {
  //       From: {
  //         Type: "root",
  //         title: "adder",
  //         subtype: "inputs",
  //         subtitle: "carry",
  //       },
  //       To: {
  //         Type: "entity",
  //         title: "xor1",
  //         subtype: "inputs",
  //         subtitle: "1",
  //       },
  //     },
  //     {
  //       From: {
  //         Type: "root",
  //         title: "adder",
  //         subtype: "inputs",
  //         subtitle: "carry",
  //       },
  //       To: {
  //         Type: "entity",
  //         title: "and1",
  //         subtype: "inputs",
  //         subtitle: "1",
  //       },
  //     },

  //     {
  //       From: {
  //         Type: "entity",
  //         title: "xor0",
  //         subtype: "outputs",
  //         subtitle: "0",
  //       },
  //       To: {
  //         Type: "entity",
  //         title: "xor1",
  //         subtype: "inputs",
  //         subtitle: "0",
  //       },
  //     },
  //     {
  //       From: {
  //         Type: "entity",
  //         title: "xor0",
  //         subtype: "outputs",
  //         subtitle: "0",
  //       },
  //       To: {
  //         Type: "entity",
  //         title: "and1",
  //         subtype: "inputs",
  //         subtitle: "0",
  //       },
  //     },

  //     {
  //       From: {
  //         Type: "entity",
  //         title: "and0",
  //         subtype: "outputs",
  //         subtitle: "0",
  //       },
  //       To: {
  //         Type: "entity",
  //         title: "or0",
  //         subtype: "inputs",
  //         subtitle: "1",
  //       },
  //     },

  //     {
  //       From: {
  //         Type: "entity",
  //         title: "and1",
  //         subtype: "outputs",
  //         subtitle: "0",
  //       },
  //       To: {
  //         Type: "entity",
  //         title: "or0",
  //         subtype: "inputs",
  //         subtitle: "0",
  //       },
  //     },

  //     {
  //       From: {
  //         Type: "entity",
  //         title: "xor1",
  //         subtype: "outputs",
  //         subtitle: "0",
  //       },
  //       To: {
  //         Type: "root",
  //         title: "adder",
  //         subtype: "outputs",
  //         subtitle: "sum",
  //       },
  //     },
  //     {
  //       From: {
  //         Type: "entity",
  //         title: "or0",
  //         subtype: "outputs",
  //         subtitle: "0",
  //       },
  //       To: {
  //         Type: "root",
  //         title: "adder",
  //         subtype: "outputs",
  //         subtitle: "carry",
  //       },
  //     },
  //   ],
  // },
  // {
  //   Type: "4bitsAdder",
  //   title: "4bitsAdder",
  //   x: 120,
  //   y: 10,
  //   width: 620,
  //   height: 340,
  //   color: "lightgreen",
  //   inputs: [
  //     { title: "a0" },
  //     { title: "a1" },
  //     { title: "a2" },
  //     { title: "a3" },
  //     { title: "b0" },
  //     { title: "b1" },
  //     { title: "b2" },
  //     { title: "b3" },
  //     { title: "carry" },
  //   ],
  //   outputs: [
  //     { title: "0" },
  //     { title: "1" },
  //     { title: "2" },
  //     { title: "3" },
  //     { title: "carry" },
  //   ],
  //   entities: [
  //     {
  //       Type: "adder",
  //       title: "adder3",
  //       x: 170,
  //       y: 260,
  //       width: 100,
  //       height: 80,
  //     },
  //     {
  //       Type: "adder",
  //       title: "adder2",
  //       x: 310,
  //       y: 180,
  //       width: 100,
  //       height: 80,
  //     },
  //     {
  //       Type: "adder",
  //       title: "adder1",
  //       x: 450,
  //       y: 120,
  //       width: 100,
  //       height: 80,
  //     },
  //     {
  //       Type: "adder",
  //       title: "adder0",
  //       x: 590,
  //       y: 60,
  //       width: 100,
  //       height: 80,
  //     },
  //   ],
  //   connections: [
  //     {
  //       From: {
  //         Type: "root",
  //         title: "4bitsAdder",
  //         subtype: "inputs",
  //         subtitle: "a0",
  //       },
  //       To: {
  //         Type: "entity",
  //         title: "adder0",
  //         subtype: "inputs",
  //         subtitle: "0",
  //       },
  //     },
  //     {
  //       From: {
  //         Type: "root",
  //         title: "4bitsAdder",
  //         subtype: "inputs",
  //         subtitle: "a1",
  //       },
  //       To: {
  //         Type: "entity",
  //         title: "adder1",
  //         subtype: "inputs",
  //         subtitle: "0",
  //       },
  //     },
  //     {
  //       From: {
  //         Type: "root",
  //         title: "4bitsAdder",
  //         subtype: "inputs",
  //         subtitle: "a2",
  //       },
  //       To: {
  //         Type: "entity",
  //         title: "adder2",
  //         subtype: "inputs",
  //         subtitle: "0",
  //       },
  //     },
  //     {
  //       From: {
  //         Type: "root",
  //         title: "4bitsAdder",
  //         subtype: "inputs",
  //         subtitle: "a3",
  //       },
  //       To: {
  //         Type: "entity",
  //         title: "adder3",
  //         subtype: "inputs",
  //         subtitle: "0",
  //       },
  //     },

  //     {
  //       From: {
  //         Type: "root",
  //         title: "4bitsAdder",
  //         subtype: "inputs",
  //         subtitle: "b0",
  //       },
  //       To: {
  //         Type: "entity",
  //         title: "adder0",
  //         subtype: "inputs",
  //         subtitle: "1",
  //       },
  //     },
  //     {
  //       From: {
  //         Type: "root",
  //         title: "4bitsAdder",
  //         subtype: "inputs",
  //         subtitle: "b1",
  //       },
  //       To: {
  //         Type: "entity",
  //         title: "adder1",
  //         subtype: "inputs",
  //         subtitle: "1",
  //       },
  //     },
  //     {
  //       From: {
  //         Type: "root",
  //         title: "4bitsAdder",
  //         subtype: "inputs",
  //         subtitle: "b2",
  //       },
  //       To: {
  //         Type: "entity",
  //         title: "adder2",
  //         subtype: "inputs",
  //         subtitle: "1",
  //       },
  //     },
  //     {
  //       From: {
  //         Type: "root",
  //         title: "4bitsAdder",
  //         subtype: "inputs",
  //         subtitle: "b3",
  //       },
  //       To: {
  //         Type: "entity",
  //         title: "adder3",
  //         subtype: "inputs",
  //         subtitle: "1",
  //       },
  //     },

  //     {
  //       From: {
  //         Type: "root",
  //         title: "4bitsAdder",
  //         subtype: "inputs",
  //         subtitle: "carry",
  //       },
  //       To: {
  //         Type: "entity",
  //         title: "adder3",
  //         subtype: "inputs",
  //         subtitle: "carry",
  //       },
  //     },
  //     {
  //       From: {
  //         Type: "entity",
  //         title: "adder3",
  //         subtype: "outputs",
  //         subtitle: "carry",
  //       },
  //       To: {
  //         Type: "entity",
  //         title: "adder2",
  //         subtype: "inputs",
  //         subtitle: "carry",
  //       },
  //     },
  //     {
  //       From: {
  //         Type: "entity",
  //         title: "adder2",
  //         subtype: "outputs",
  //         subtitle: "carry",
  //       },
  //       To: {
  //         Type: "entity",
  //         title: "adder1",
  //         subtype: "inputs",
  //         subtitle: "carry",
  //       },
  //     },
  //     {
  //       From: {
  //         Type: "entity",
  //         title: "adder1",
  //         subtype: "outputs",
  //         subtitle: "carry",
  //       },
  //       To: {
  //         Type: "entity",
  //         title: "adder0",
  //         subtype: "inputs",
  //         subtitle: "carry",
  //       },
  //     },
  //     {
  //       From: {
  //         Type: "entity",
  //         title: "adder0",
  //         subtype: "outputs",
  //         subtitle: "carry",
  //       },
  //       To: {
  //         Type: "root",
  //         title: "4bitsAdder",
  //         subtype: "outputs",
  //         subtitle: "carry",
  //       },
  //     },

  //     {
  //       From: {
  //         Type: "entity",
  //         title: "adder0",
  //         subtype: "outputs",
  //         subtitle: "sum",
  //       },
  //       To: {
  //         Type: "root",
  //         title: "4bitsAdder",
  //         subtype: "outputs",
  //         subtitle: "0",
  //       },
  //     },
  //     {
  //       From: {
  //         Type: "entity",
  //         title: "adder1",
  //         subtype: "outputs",
  //         subtitle: "sum",
  //       },
  //       To: {
  //         Type: "root",
  //         title: "4bitsAdder",
  //         subtype: "outputs",
  //         subtitle: "1",
  //       },
  //     },
  //     {
  //       From: {
  //         Type: "entity",
  //         title: "adder2",
  //         subtype: "outputs",
  //         subtitle: "sum",
  //       },
  //       To: {
  //         Type: "root",
  //         title: "4bitsAdder",
  //         subtype: "outputs",
  //         subtitle: "2",
  //       },
  //     },
  //     {
  //       From: {
  //         Type: "entity",
  //         title: "adder3",
  //         subtype: "outputs",
  //         subtitle: "sum",
  //       },
  //       To: {
  //         Type: "root",
  //         title: "4bitsAdder",
  //         subtype: "outputs",
  //         subtitle: "3",
  //       },
  //     },
  //   ],
  // },
  // {
  //   Type: "negate",
  //   title: "negate",
  //   x: 10,
  //   y: 10,
  //   width: 600,
  //   height: 520,
  //   color: "blue",
  //   inputs: [
  //     { title: "enabled" },
  //     { title: "0" },
  //     { title: "1" },
  //     { title: "2" },
  //     { title: "3" },
  //     { title: "4" },
  //     { title: "5" },
  //     { title: "6" },
  //     { title: "7" },
  //   ],
  //   outputs: [
  //     { title: "0" },
  //     { title: "1" },
  //     { title: "2" },
  //     { title: "3" },
  //     { title: "4" },
  //     { title: "5" },
  //     { title: "6" },
  //     { title: "7" },
  //   ],
  //   entities: [
  //     { Type: "xor", title: "xor0", x: 60, y: 40, width: 100, height: 50 },
  //     { Type: "xor", title: "xor1", x: 60, y: 100, width: 100, height: 50 },
  //     { Type: "xor", title: "xor2", x: 60, y: 160, width: 100, height: 50 },
  //     { Type: "xor", title: "xor3", x: 60, y: 220, width: 100, height: 50 },
  //     { Type: "xor", title: "xor4", x: 60, y: 280, width: 100, height: 50 },
  //     { Type: "xor", title: "xor5", x: 60, y: 340, width: 100, height: 50 },
  //     { Type: "xor", title: "xor6", x: 60, y: 400, width: 100, height: 50 },
  //     { Type: "xor", title: "xor7", x: 60, y: 460, width: 100, height: 50 },

  //     {
  //       Type: "4bitsAdder",
  //       title: "4bitsAdder0",
  //       x: 420,
  //       y: 100,
  //       width: 120,
  //       height: 200,
  //     },
  //     {
  //       Type: "4bitsAdder",
  //       title: "4bitsAdder1",
  //       x: 240,
  //       y: 200,
  //       width: 120,
  //       height: 200,
  //     },
  //   ],
  //   connections: [
  //     ...[...Array(8)].map((_, i) => ({
  //       From: {
  //         Type: "root",
  //         title: "negate",
  //         subtype: "inputs" as const,
  //         subtitle: i.toString(),
  //       },
  //       To: {
  //         Type: "entity",
  //         title: `xor${i}`,
  //         subtype: "inputs" as const,
  //         subtitle: "0",
  //       },
  //     })),
  //     ...[...Array(8)].map((_, i) => ({
  //       From: {
  //         Type: "root",
  //         title: "negate",
  //         subtype: "inputs" as const,
  //         subtitle: "enabled",
  //       },
  //       To: {
  //         Type: "entity",
  //         title: `xor${i}`,
  //         subtype: "inputs" as const,
  //         subtitle: "1",
  //       },
  //     })),
  //     {
  //       From: {
  //         Type: "root",
  //         title: "negate",
  //         subtype: "inputs",
  //         subtitle: "enabled",
  //       },
  //       To: {
  //         Type: "entity",
  //         title: "4bitsAdder1",
  //         subtype: "inputs",
  //         subtitle: "carry",
  //       },
  //     },
  //     ...[...Array(4)].map((_, i) => ({
  //       From: {
  //         Type: "entity",
  //         title: `xor${i}`,
  //         subtype: "outputs" as const,
  //         subtitle: "0",
  //       },
  //       To: {
  //         Type: "entity",
  //         title: "4bitsAdder0",
  //         subtype: "inputs" as const,
  //         subtitle: `a${i}`,
  //       },
  //     })),
  //     ...[...Array(4)].map((_, i) => ({
  //       From: {
  //         Type: "entity",
  //         title: `xor${4 + i}`,
  //         subtype: "outputs" as const,
  //         subtitle: "0",
  //       },
  //       To: {
  //         Type: "entity",
  //         title: "4bitsAdder1",
  //         subtype: "inputs" as const,
  //         subtitle: `a${i}`,
  //       },
  //     })),
  //     {
  //       From: {
  //         Type: "entity",
  //         title: "4bitsAdder1",
  //         subtype: "outputs",
  //         subtitle: "carry",
  //       },
  //       To: {
  //         Type: "entity",
  //         title: "4bitsAdder0",
  //         subtype: "inputs",
  //         subtitle: "carry",
  //       },
  //     },
  //     ...[...Array(4)].map((_, i) => ({
  //       From: {
  //         Type: "entity",
  //         title: "4bitsAdder0",
  //         subtype: "outputs" as const,
  //         subtitle: i.toString(),
  //       },
  //       To: {
  //         Type: "root",
  //         title: "negate",
  //         subtype: "outputs" as const,
  //         subtitle: i.toString(),
  //       },
  //     })),
  //     ...[...Array(4)].map((_, i) => ({
  //       From: {
  //         Type: "entity",
  //         title: "4bitsAdder1",
  //         subtype: "outputs" as const,
  //         subtitle: i.toString(),
  //       },
  //       To: {
  //         Type: "root",
  //         title: "negate",
  //         subtype: "outputs" as const,
  //         subtitle: (4 + i).toString(),
  //       },
  //     })),
  //   ],
  // },
  // {
  //   Type: "dable",
  //   title: "dable",
  //   x: 10,
  //   y: 10,
  //   width: 600,
  //   height: 300,
  //   inputs: [{ title: "0" }, { title: "1" }, { title: "2" }, { title: "3" }],
  //   outputs: [{ title: "0" }, { title: "1" }, { title: "2" }, { title: "3" }],
  //   entities: [
  //     { Type: "xor", title: "xor0", x: 60, y: 60, width: 100, height: 50 },
  //     { Type: "nor", title: "nor0", x: 60, y: 120, width: 100, height: 50 },
  //     { Type: "xor", title: "xor1", x: 60, y: 180, width: 100, height: 50 },
  //     { Type: "nor", title: "nor1", x: 200, y: 60, width: 100, height: 50 },
  //     { Type: "nor", title: "nor2", x: 320, y: 60, width: 100, height: 50 },
  //     { Type: "or", title: "or0", x: 320, y: 120, width: 100, height: 50 },
  //     { Type: "nor", title: "nor3", x: 460, y: 60, width: 100, height: 50 },
  //     { Type: "and", title: "and0", x: 460, y: 120, width: 100, height: 50 },
  //     { Type: "xor", title: "xor2", x: 460, y: 180, width: 100, height: 50 },
  //   ],
  //   connections: [
  //     ...[
  //       ["xor0", "1"],
  //       ["nor0", "0"],
  //       ["xor1", "0"],
  //     ].map((target) => ({
  //       From: {
  //         Type: "root",
  //         title: "dable",
  //         subtype: "inputs" as const,
  //         subtitle: "0",
  //       },
  //       To: {
  //         Type: "entity",
  //         title: target[0],
  //         subtype: "inputs" as const,
  //         subtitle: target[1],
  //       },
  //     })),

  //     {
  //       From: {
  //         Type: "root",
  //         title: "dable",
  //         subtype: "inputs",
  //         subtitle: "1",
  //       },
  //       To: {
  //         Type: "entity",
  //         title: "nor0",
  //         subtype: "inputs",
  //         subtitle: "1",
  //       },
  //     },

  //     ...["xor1", "nor3"].map((target) => ({
  //       From: {
  //         Type: "root",
  //         title: "dable",
  //         subtype: "inputs" as const,
  //         subtitle: "2",
  //       },
  //       To: {
  //         Type: "entity",
  //         title: target,
  //         subtype: "inputs" as const,
  //         subtitle: "1",
  //       },
  //     })),

  //     ...[
  //       ["xor0", "0"],
  //       ["xor2", "1"],
  //     ].map((target) => ({
  //       From: {
  //         Type: "root",
  //         title: "dable",
  //         subtype: "inputs" as const,
  //         subtitle: "3",
  //       },
  //       To: {
  //         Type: "entity",
  //         title: target[0],
  //         subtype: "inputs" as const,
  //         subtitle: target[1],
  //       },
  //     })),

  //     ...[
  //       ["nor1", "0"],
  //       ["or0", "1"],
  //     ].map((target) => ({
  //       From: {
  //         Type: "entity",
  //         title: "xor0",
  //         subtype: "outputs" as const,
  //         subtitle: "0",
  //       },
  //       To: {
  //         Type: "entity",
  //         title: target[0],
  //         subtype: "inputs" as const,
  //         subtitle: target[1],
  //       },
  //     })),

  //     ...[
  //       ["nor2", "1"],
  //       ["or0", "0"],
  //     ].map((target) => ({
  //       From: {
  //         Type: "entity",
  //         title: "nor0",
  //         subtype: "outputs" as const,
  //         subtitle: "0",
  //       },
  //       To: {
  //         Type: "entity",
  //         title: target[0],
  //         subtype: "inputs" as const,
  //         subtitle: target[1],
  //       },
  //     })),

  //     ...[
  //       ["nor1", "1"],
  //       ["and0", "1"],
  //     ].map((target) => ({
  //       From: {
  //         Type: "entity",
  //         title: "xor1",
  //         subtype: "outputs" as const,
  //         subtitle: "0",
  //       },
  //       To: {
  //         Type: "entity",
  //         title: target[0],
  //         subtype: "inputs" as const,
  //         subtitle: target[1],
  //       },
  //     })),

  //     ...[["nor2", "0"]].map((target) => ({
  //       From: {
  //         Type: "entity",
  //         title: "nor1",
  //         subtype: "outputs" as const,
  //         subtitle: "0",
  //       },
  //       To: {
  //         Type: "entity",
  //         title: target[0],
  //         subtype: "inputs" as const,
  //         subtitle: target[1],
  //       },
  //     })),

  //     ...[
  //       ["root", "dable", "outputs", "0"],
  //       ["entity", "xor2", "inputs", "0"],
  //     ].map((target) => ({
  //       From: {
  //         Type: "entity",
  //         title: "nor2",
  //         subtype: "outputs" as const,
  //         subtitle: "0",
  //       },
  //       To: {
  //         Type: target[0],
  //         title: target[1],
  //         subtype: target[2] as "outputs" | "inputs",
  //         subtitle: target[3],
  //       },
  //     })),

  //     ...[
  //       ["nor3", "0"],
  //       ["and0", "0"],
  //     ].map((target) => ({
  //       From: {
  //         Type: "entity",
  //         title: "or0",
  //         subtype: "outputs" as const,
  //         subtitle: "0",
  //       },
  //       To: {
  //         Type: "entity",
  //         title: target[0],
  //         subtype: "inputs" as const,
  //         subtitle: target[1],
  //       },
  //     })),

  //     ...[
  //       ["nor3", "1"],
  //       ["and0", "2"],
  //       ["xor2", "3"],
  //     ].map((target) => ({
  //       From: {
  //         Type: "entity",
  //         title: target[0],
  //         subtype: "outputs" as const,
  //         subtitle: "0",
  //       },
  //       To: {
  //         Type: "root",
  //         title: "dable",
  //         subtype: "outputs" as const,
  //         subtitle: target[1],
  //       },
  //     })),
  //   ],
  // },
  // {
  //   Type: "false",
  //   title: "false",
  //   x: 0,
  //   y: 0,
  //   width: 240,
  //   height: 120,
  //   inputs: [{ title: "0" }],
  //   outputs: [{ title: "0" }],
  //   entities: [
  //     { Type: "true", title: "true0", x: 40, y: 70, width: 80, height: 40 },
  //     { Type: "nand", title: "nand0", x: 140, y: 50, width: 80, height: 60 },
  //   ],
  //   connections: [
  //     {
  //       From: {
  //         Type: "root",
  //         title: "false",
  //         subtype: "inputs",
  //         subtitle: "0",
  //       },
  //       To: {
  //         Type: "entity",
  //         title: "true0",
  //         subtype: "inputs",
  //         subtitle: "0",
  //       },
  //     },
  //     {
  //       From: {
  //         Type: "entity",
  //         title: "true0",
  //         subtype: "outputs",
  //         subtitle: "0",
  //       },
  //       To: {
  //         Type: "entity",
  //         title: "nand0",
  //         subtype: "inputs",
  //         subtitle: "0",
  //       },
  //     },
  //     {
  //       From: {
  //         Type: "entity",
  //         title: "true0",
  //         subtype: "outputs",
  //         subtitle: "0",
  //       },
  //       To: {
  //         Type: "entity",
  //         title: "nand0",
  //         subtype: "inputs",
  //         subtitle: "1",
  //       },
  //     },
  //     {
  //       From: {
  //         Type: "entity",
  //         title: "nand0",
  //         subtype: "outputs",
  //         subtitle: "0",
  //       },
  //       To: {
  //         Type: "root",
  //         title: "false",
  //         subtype: "outputs",
  //         subtitle: "0",
  //       },
  //     },
  //   ],
  // },
  // {
  //   Type: "true",
  //   title: "true",
  //   x: 0,
  //   y: 0,
  //   width: 240,
  //   height: 100,
  //   inputs: [{ title: "0" }],
  //   outputs: [{ title: "0" }],
  //   entities: [
  //     { Type: "nand", title: "nand0", x: 40, y: 40, width: 80, height: 40 },
  //     { Type: "nand", title: "nand1", x: 140, y: 40, width: 80, height: 40 },
  //   ],
  //   connections: [
  //     {
  //       From: {
  //         Type: "root",
  //         title: "true",
  //         subtype: "inputs",
  //         subtitle: "0",
  //       },
  //       To: {
  //         Type: "entity",
  //         title: "nand0",
  //         subtype: "inputs",
  //         subtitle: "0",
  //       },
  //     },
  //     {
  //       From: {
  //         Type: "root",
  //         title: "true",
  //         subtype: "inputs",
  //         subtitle: "0",
  //       },
  //       To: {
  //         Type: "entity",
  //         title: "nand0",
  //         subtype: "inputs",
  //         subtitle: "1",
  //       },
  //     },
  //     {
  //       From: {
  //         Type: "root",
  //         title: "true",
  //         subtype: "inputs",
  //         subtitle: "0",
  //       },
  //       To: {
  //         Type: "entity",
  //         title: "nand1",
  //         subtype: "inputs",
  //         subtitle: "0",
  //       },
  //     },
  //     {
  //       From: {
  //         Type: "entity",
  //         title: "nand0",
  //         subtype: "outputs",
  //         subtitle: "0",
  //       },
  //       To: {
  //         Type: "entity",
  //         title: "nand1",
  //         subtype: "inputs",
  //         subtitle: "1",
  //       },
  //     },
  //     {
  //       From: {
  //         Type: "entity",
  //         title: "nand1",
  //         subtype: "outputs",
  //         subtitle: "0",
  //       },
  //       To: {
  //         Type: "root",
  //         title: "true",
  //         subtype: "outputs",
  //         subtitle: "0",
  //       },
  //     },
  //   ],
  // },
  // {
  //   Type: "doubledable",
  //   title: "doubledable",
  //   x: 10,
  //   y: 10,
  //   width: 600,
  //   height: 400,
  //   inputs: [
  //     { title: "a" },
  //     { title: "b" },
  //     { title: "c" },
  //     { title: "d" },
  //     { title: "e" },
  //     { title: "f" },
  //     { title: "g" },
  //     { title: "h" },
  //   ],
  //   outputs: [
  //     { title: "h3" },
  //     { title: "h2" },
  //     { title: "h1" },
  //     { title: "h0" },
  //     { title: "t3" },
  //     { title: "t2" },
  //     { title: "t1" },
  //     { title: "t0" },
  //     { title: "o3" },
  //     { title: "o2" },
  //     { title: "o1" },
  //     { title: "o0" },
  //   ],
  //   entities: [
  //     { Type: "false", title: "f0", x: 35, y: 25, width: 0, height: 0 },
  //     { Type: "false", title: "f1", x: 340, y: 35, width: 0, height: 0 },
  //     { Type: "false", title: "f2", x: 580, y: 20, width: 0, height: 0 },
  //     { Type: "dable", title: "t", x: 60, y: 40, width: 60, height: 100 },
  //     { Type: "dable", title: "u", x: 160, y: 60, width: 60, height: 100 },
  //     { Type: "dable", title: "v", x: 260, y: 80, width: 60, height: 100 },
  //     { Type: "dable", title: "w", x: 360, y: 40, width: 60, height: 100 },
  //     { Type: "dable", title: "x", x: 360, y: 160, width: 60, height: 100 },
  //     { Type: "dable", title: "y", x: 460, y: 80, width: 60, height: 100 },
  //     { Type: "dable", title: "z", x: 460, y: 200, width: 60, height: 100 },
  //   ],
  //   connections: [
  //     {
  //       From: {
  //         Type: "root",
  //         title: "doubledable",
  //         subtype: "inputs",
  //         subtitle: "a",
  //       },
  //       To: {
  //         Type: "entity",
  //         title: "f0",
  //         subtype: "inputs",
  //         subtitle: "0",
  //       },
  //     },
  //     {
  //       From: {
  //         Type: "entity",
  //         title: "f0",
  //         subtype: "outputs",
  //         subtitle: "0",
  //       },
  //       To: {
  //         Type: "entity",
  //         title: "t",
  //         subtype: "inputs",
  //         subtitle: "0",
  //       },
  //     },

  //     {
  //       From: {
  //         Type: "root",
  //         title: "doubledable",
  //         subtype: "inputs",
  //         subtitle: "a",
  //       },
  //       To: {
  //         Type: "entity",
  //         title: "f1",
  //         subtype: "inputs",
  //         subtitle: "0",
  //       },
  //     },
  //     {
  //       From: {
  //         Type: "entity",
  //         title: "f1",
  //         subtype: "outputs",
  //         subtitle: "0",
  //       },
  //       To: {
  //         Type: "entity",
  //         title: "w",
  //         subtype: "inputs",
  //         subtitle: "0",
  //       },
  //     },

  //     ...[
  //       ["a", "1"],
  //       ["b", "2"],
  //       ["c", "3"],
  //     ].map((target) => ({
  //       From: {
  //         Type: "root",
  //         title: "doubledable",
  //         subtype: "inputs" as const,
  //         subtitle: target[0],
  //       },
  //       To: {
  //         Type: "entity",
  //         title: "t",
  //         subtype: "inputs" as const,
  //         subtitle: target[1],
  //       },
  //     })),
  //     ...[
  //       ["c", "t", "3"],
  //       ["d", "u", "3"],
  //       ["e", "v", "3"],
  //       ["f", "x", "3"],
  //       ["g", "z", "3"],
  //     ].map((target) => ({
  //       From: {
  //         Type: "root",
  //         title: "doubledable",
  //         subtype: "inputs" as const,
  //         subtitle: target[0],
  //       },
  //       To: {
  //         Type: "entity",
  //         title: target[1],
  //         subtype: "inputs" as const,
  //         subtitle: target[2],
  //       },
  //     })),

  //     ...[
  //       ["t", "1", "u", "0"],
  //       ["t", "2", "u", "1"],
  //       ["t", "3", "u", "2"],
  //       ["u", "1", "v", "0"],
  //       ["u", "2", "v", "1"],
  //       ["u", "3", "v", "2"],
  //       ["v", "1", "x", "0"],
  //       ["v", "2", "x", "1"],
  //       ["v", "3", "x", "2"],
  //       ["x", "1", "z", "0"],
  //       ["x", "2", "z", "1"],
  //       ["x", "3", "z", "2"],
  //       ["w", "1", "y", "0"],
  //       ["w", "2", "y", "1"],
  //       ["w", "3", "y", "2"],

  //       ["t", "0", "w", "1"],
  //       ["u", "0", "w", "2"],
  //       ["v", "0", "w", "3"],
  //       ["x", "0", "y", "3"],
  //     ].map((target) => ({
  //       From: {
  //         Type: "entity",
  //         title: target[0],
  //         subtype: "outputs" as const,
  //         subtitle: target[1],
  //       },
  //       To: {
  //         Type: "entity",
  //         title: target[2],
  //         subtype: "inputs" as const,
  //         subtitle: target[3],
  //       },
  //     })),

  //     ...[
  //       ["w", "0", "h1"],
  //       ["y", "0", "h0"],
  //       ["y", "1", "t3"],
  //       ["y", "2", "t2"],
  //       ["y", "3", "t1"],
  //       ["z", "0", "t0"],
  //       ["z", "1", "o3"],
  //       ["z", "2", "o2"],
  //       ["z", "3", "o1"],
  //     ].map((target) => ({
  //       From: {
  //         Type: "entity",
  //         title: target[0],
  //         subtype: "outputs" as const,
  //         subtitle: target[1],
  //       },
  //       To: {
  //         Type: "root",
  //         title: "doubledable",
  //         subtype: "outputs" as const,
  //         subtitle: target[2],
  //       },
  //     })),

  //     {
  //       From: {
  //         Type: "entity",
  //         title: "w",
  //         subtype: "outputs",
  //         subtitle: "0",
  //       },
  //       To: {
  //         Type: "entity",
  //         title: "f2",
  //         subtype: "inputs",
  //         subtitle: "0",
  //       },
  //     },
  //     {
  //       From: {
  //         Type: "entity",
  //         title: "f2",
  //         subtype: "outputs",
  //         subtitle: "0",
  //       },
  //       To: {
  //         Type: "root",
  //         title: "doubledable",
  //         subtype: "outputs",
  //         subtitle: "h3",
  //       },
  //     },
  //     {
  //       From: {
  //         Type: "entity",
  //         title: "f2",
  //         subtype: "outputs",
  //         subtitle: "0",
  //       },
  //       To: {
  //         Type: "root",
  //         title: "doubledable",
  //         subtype: "outputs",
  //         subtitle: "h2",
  //       },
  //     },

  //     {
  //       From: {
  //         Type: "root",
  //         title: "doubledable",
  //         subtype: "inputs",
  //         subtitle: "h",
  //       },
  //       To: {
  //         Type: "root",
  //         title: "doubledable",
  //         subtype: "outputs",
  //         subtitle: "o0",
  //       },
  //     },
  //   ],
  // },
  // {
  //   Type: "3digitDecimalDisplayDriver",
  //   title: "3digitDecimalDisplayDriver",
  //   x: 10,
  //   y: 10,
  //   width: 440,
  //   height: 300,
  //   inputs: [
  //     { title: "rippleNegative" },
  //     { title: "0" },
  //     { title: "1" },
  //     { title: "2" },
  //     { title: "3" },
  //     { title: "4" },
  //     { title: "5" },
  //     { title: "6" },
  //     { title: "7" },
  //     { title: "rippleBlanking" },
  //   ],
  //   outputs: [
  //     { title: "rippleNegative" },
  //     { title: "h3" },
  //     { title: "h2" },
  //     { title: "h1" },
  //     { title: "h0" },
  //     { title: "t3" },
  //     { title: "t2" },
  //     { title: "t1" },
  //     { title: "t0" },
  //     { title: "o3" },
  //     { title: "o2" },
  //     { title: "o1" },
  //     { title: "o0" },
  //     { title: "rippleBlanking" },
  //   ],
  //   entities: [
  //     {
  //       Type: "and",
  //       title: "and0",
  //       x: 40,
  //       y: 20,
  //       width: 60,
  //       height: 50,
  //     },
  //     {
  //       Type: "negate",
  //       title: "negate0",
  //       x: 60,
  //       y: 80,
  //       width: 120,
  //       height: 190,
  //     },
  //     {
  //       Type: "doubledable",
  //       title: "doubledable0",
  //       x: 260,
  //       y: 40,
  //       width: 120,
  //       height: 260,
  //     },
  //   ],
  //   connections: [
  //     ...[...Array(8)].map((_, i) => ({
  //       From: {
  //         Type: "root",
  //         title: "3digitDecimalDisplayDriver",
  //         subtype: "inputs" as const,
  //         subtitle: i.toString(),
  //       },
  //       To: {
  //         Type: "entity",
  //         title: "negate0",
  //         subtype: "inputs" as const,
  //         subtitle: i.toString(),
  //       },
  //     })),
  //     ...["a", "b", "c", "d", "e", "f", "g", "h"].map((elem, i) => ({
  //       From: {
  //         Type: "entity",
  //         title: "negate0",
  //         subtype: "outputs" as const,
  //         subtitle: i.toString(),
  //       },
  //       To: {
  //         Type: "entity",
  //         title: "doubledable0",
  //         subtype: "inputs" as const,
  //         subtitle: elem,
  //       },
  //     })),
  //     ...[
  //       "h3",
  //       "h2",
  //       "h1",
  //       "h0",
  //       "t3",
  //       "t2",
  //       "t1",
  //       "t0",
  //       "o3",
  //       "o2",
  //       "o1",
  //       "o0",
  //     ].map((elem) => ({
  //       From: {
  //         Type: "entity",
  //         title: "doubledable0",
  //         subtype: "outputs" as const,
  //         subtitle: elem,
  //       },
  //       To: {
  //         Type: "root",
  //         title: "3digitDecimalDisplayDriver",
  //         subtype: "outputs" as const,
  //         subtitle: elem,
  //       },
  //     })),

  //     {
  //       From: {
  //         Type: "root",
  //         title: "3digitDecimalDisplayDriver",
  //         subtype: "inputs" as const,
  //         subtitle: "rippleNegative",
  //       },
  //       To: {
  //         Type: "entity",
  //         title: "and0",
  //         subtype: "inputs" as const,
  //         subtitle: "0",
  //       },
  //     },
  //     {
  //       From: {
  //         Type: "root",
  //         title: "3digitDecimalDisplayDriver",
  //         subtype: "inputs" as const,
  //         subtitle: "0",
  //       },
  //       To: {
  //         Type: "entity",
  //         title: "and0",
  //         subtype: "inputs" as const,
  //         subtitle: "1",
  //       },
  //     },
  //     {
  //       From: {
  //         Type: "entity",
  //         title: "and0",
  //         subtype: "outputs" as const,
  //         subtitle: "0",
  //       },
  //       To: {
  //         Type: "entity",
  //         title: "negate0",
  //         subtype: "inputs" as const,
  //         subtitle: "enabled",
  //       },
  //     },

  //     {
  //       From: {
  //         Type: "entity",
  //         title: "and0",
  //         subtype: "outputs" as const,
  //         subtitle: "0",
  //       },
  //       To: {
  //         Type: "root",
  //         title: "3digitDecimalDisplayDriver",
  //         subtype: "outputs" as const,
  //         subtitle: "rippleNegative",
  //       },
  //     },
  //     {
  //       From: {
  //         Type: "root",
  //         title: "3digitDecimalDisplayDriver",
  //         subtype: "inputs" as const,
  //         subtitle: "rippleBlanking",
  //       },
  //       To: {
  //         Type: "root",
  //         title: "3digitDecimalDisplayDriver",
  //         subtype: "outputs" as const,
  //         subtitle: "rippleBlanking",
  //       },
  //     },
  //   ],
  // },
  // {
  //   Type: "3digitDecimalDisplay",
  //   title: "3digitDecimalDisplay",
  //   x: 10,
  //   y: 10,
  //   width: 800,
  //   height: 360,
  //   Component: ThreeDigitDecimalDisplay,
  //   inputs: [
  //     { title: "rippleNegative" },
  //     { title: "0" },
  //     { title: "1" },
  //     { title: "2" },
  //     { title: "3" },
  //     { title: "4" },
  //     { title: "5" },
  //     { title: "6" },
  //     { title: "7" },
  //     { title: "rippleBlanking" },
  //   ],
  //   entities: [
  //     {
  //       Type: "3digitDecimalDisplayDriver",
  //       title: "3digitDecimalDisplayDriver0",
  //       x: 320,
  //       y: 60,
  //       width: 120,
  //       height: 300,
  //     },
  //     ...[...Array(3)].map((_, i) => ({
  //       Type: "signed8segments",
  //       title: `signed8segments${i}`,
  //       x: 460 + 120 * i,
  //       y: 100,
  //       width: 100,
  //       height: 160,
  //     })),
  //   ],
  //   connections: [
  //     ...[...Array(8)].map((_, i) => ({
  //       From: {
  //         Type: "root",
  //         title: "3digitDecimalDisplay",
  //         subtype: "inputs" as const,
  //         subtitle: i.toString(),
  //       },
  //       To: {
  //         Type: "entity",
  //         title: "3digitDecimalDisplayDriver0",
  //         subtype: "inputs" as const,
  //         subtitle: i.toString(),
  //       },
  //     })),

  //     ...["h3", "h2", "h1", "h0"].map((elem, i) => ({
  //       From: {
  //         Type: "entity",
  //         title: "3digitDecimalDisplayDriver0",
  //         subtype: "outputs" as const,
  //         subtitle: elem,
  //       },
  //       To: {
  //         Type: "entity",
  //         title: "signed8segments0",
  //         subtype: "inputs" as const,
  //         subtitle: i.toString(),
  //       },
  //     })),
  //     ...["t3", "t2", "t1", "t0"].map((elem, i) => ({
  //       From: {
  //         Type: "entity",
  //         title: "3digitDecimalDisplayDriver0",
  //         subtype: "outputs" as const,
  //         subtitle: elem,
  //       },
  //       To: {
  //         Type: "entity",
  //         title: "signed8segments1",
  //         subtype: "inputs" as const,
  //         subtitle: i.toString(),
  //       },
  //     })),
  //     ...["o3", "o2", "o1", "o0"].map((elem, i) => ({
  //       From: {
  //         Type: "entity",
  //         title: "3digitDecimalDisplayDriver0",
  //         subtype: "outputs" as const,
  //         subtitle: elem,
  //       },
  //       To: {
  //         Type: "entity",
  //         title: "signed8segments2",
  //         subtype: "inputs" as const,
  //         subtitle: i.toString(),
  //       },
  //     })),

  //     {
  //       From: {
  //         Type: "root",
  //         title: "3digitDecimalDisplay",
  //         subtype: "inputs" as const,
  //         subtitle: "rippleNegative",
  //       },
  //       To: {
  //         Type: "entity",
  //         title: "3digitDecimalDisplayDriver0",
  //         subtype: "inputs" as const,
  //         subtitle: "rippleNegative",
  //       },
  //     },
  //     {
  //       From: {
  //         Type: "root",
  //         title: "3digitDecimalDisplay",
  //         subtype: "inputs" as const,
  //         subtitle: "rippleBlanking",
  //       },
  //       To: {
  //         Type: "entity",
  //         title: "3digitDecimalDisplayDriver0",
  //         subtype: "inputs" as const,
  //         subtitle: "rippleBlanking",
  //       },
  //     },

  //     {
  //       From: {
  //         Type: "entity",
  //         title: "3digitDecimalDisplayDriver0",
  //         subtype: "outputs" as const,
  //         subtitle: "rippleNegative",
  //       },
  //       To: {
  //         Type: "entity",
  //         title: "signed8segments0",
  //         subtype: "inputs" as const,
  //         subtitle: "rippleNegative",
  //       },
  //     },
  //     {
  //       From: {
  //         Type: "entity",
  //         title: "3digitDecimalDisplayDriver0",
  //         subtype: "outputs" as const,
  //         subtitle: "rippleBlanking",
  //       },
  //       To: {
  //         Type: "entity",
  //         title: "signed8segments0",
  //         subtype: "inputs" as const,
  //         subtitle: "rippleBlanking",
  //       },
  //     },
  //     {
  //       From: {
  //         Type: "entity",
  //         title: "signed8segments0",
  //         subtype: "outputs" as const,
  //         subtitle: "rippleNegative",
  //       },
  //       To: {
  //         Type: "entity",
  //         title: "signed8segments1",
  //         subtype: "inputs" as const,
  //         subtitle: "rippleNegative",
  //       },
  //     },
  //     {
  //       From: {
  //         Type: "entity",
  //         title: "signed8segments1",
  //         subtype: "outputs" as const,
  //         subtitle: "rippleNegative",
  //       },
  //       To: {
  //         Type: "entity",
  //         title: "signed8segments2",
  //         subtype: "inputs" as const,
  //         subtitle: "rippleNegative",
  //       },
  //     },

  //     {
  //       From: {
  //         Type: "entity",
  //         title: "signed8segments0",
  //         subtype: "outputs" as const,
  //         subtitle: "rippleBlanking",
  //       },
  //       To: {
  //         Type: "entity",
  //         title: "signed8segments1",
  //         subtype: "inputs" as const,
  //         subtitle: "rippleBlanking",
  //       },
  //     },
  //   ],
  // },
  // {
  //   Type: "srlatch",
  //   title: "srlatch",
  //   x: 10,
  //   y: 10,
  //   width: 300,
  //   height: 160,
  //   inputs: [{ title: "set" }, { title: "reset" }],
  //   outputs: [{ title: "0" }],
  //   entities: [
  //     { Type: "or", title: "or1", x: 60, y: 40, width: 100, height: 50 },
  //     { Type: "not", title: "not1", x: 60, y: 100, width: 100, height: 50 },
  //     { Type: "and", title: "and1", x: 200, y: 80, width: 100, height: 50 },
  //   ],
  //   connections: [
  //     {
  //       From: {
  //         Type: "root",
  //         title: "srlatch",
  //         subtype: "inputs",
  //         subtitle: "set",
  //       },
  //       To: {
  //         Type: "entity",
  //         title: "or1",
  //         subtype: "inputs",
  //         subtitle: "1",
  //       },
  //     },
  //     {
  //       From: {
  //         Type: "root",
  //         title: "srlatch",
  //         subtype: "inputs",
  //         subtitle: "reset",
  //       },
  //       To: {
  //         Type: "entity",
  //         title: "not1",
  //         subtype: "inputs",
  //         subtitle: "0",
  //       },
  //     },
  //     {
  //       From: {
  //         Type: "entity",
  //         title: "or1",
  //         subtype: "outputs",
  //         subtitle: "0",
  //       },
  //       To: {
  //         Type: "entity",
  //         title: "and1",
  //         subtype: "inputs",
  //         subtitle: "0",
  //       },
  //     },
  //     {
  //       From: {
  //         Type: "entity",
  //         title: "not1",
  //         subtype: "outputs",
  //         subtitle: "0",
  //       },
  //       To: {
  //         Type: "entity",
  //         title: "and1",
  //         subtype: "inputs",
  //         subtitle: "1",
  //       },
  //     },
  //     {
  //       From: {
  //         Type: "entity",
  //         title: "and1",
  //         subtype: "outputs",
  //         subtitle: "0",
  //       },
  //       To: {
  //         Type: "root",
  //         title: "srlatch",
  //         subtype: "outputs",
  //         subtitle: "0",
  //       },
  //     },
  //     {
  //       From: {
  //         Type: "entity",
  //         title: "and1",
  //         subtype: "outputs",
  //         subtitle: "0",
  //       },
  //       To: {
  //         Type: "entity",
  //         title: "or1",
  //         subtype: "inputs",
  //         subtitle: "0",
  //       },
  //     },
  //   ],
  // },
  // {
  //   Type: "srlatchnor",
  //   title: "srlatchnor",
  //   x: 10,
  //   y: 10,
  //   width: 300,
  //   height: 160,
  //   inputs: [{ title: "set" }, { title: "reset" }],
  //   outputs: [{ title: "0" }],
  //   entities: [
  //     {
  //       Type: "nor",
  //       title: "nor1",
  //       x: 100,
  //       y: 40,
  //       width: 100,
  //       height: 50,
  //     },
  //     {
  //       Type: "nor",
  //       title: "nor2",
  //       x: 100,
  //       y: 100,
  //       width: 100,
  //       height: 50,
  //     },
  //   ],
  //   connections: [
  //     {
  //       From: {
  //         Type: "root",
  //         title: "srlatchnor",
  //         subtype: "inputs",
  //         subtitle: "set",
  //       },
  //       To: {
  //         Type: "entity",
  //         title: "nor1",
  //         subtype: "inputs",
  //         subtitle: "0",
  //       },
  //     },
  //     {
  //       From: {
  //         Type: "root",
  //         title: "srlatchnor",
  //         subtype: "inputs",
  //         subtitle: "reset",
  //       },
  //       To: {
  //         Type: "entity",
  //         title: "nor2",
  //         subtype: "inputs",
  //         subtitle: "1",
  //       },
  //     },
  //     {
  //       From: {
  //         Type: "entity",
  //         title: "nor1",
  //         subtype: "outputs",
  //         subtitle: "0",
  //       },
  //       To: {
  //         Type: "entity",
  //         title: "nor2",
  //         subtype: "inputs",
  //         subtitle: "0",
  //       },
  //     },
  //     {
  //       From: {
  //         Type: "entity",
  //         title: "nor2",
  //         subtype: "outputs",
  //         subtitle: "0",
  //       },
  //       To: {
  //         Type: "entity",
  //         title: "nor1",
  //         subtype: "inputs",
  //         subtitle: "1",
  //       },
  //     },
  //     {
  //       From: {
  //         Type: "entity",
  //         title: "nor2",
  //         subtype: "outputs",
  //         subtitle: "0",
  //       },
  //       To: {
  //         Type: "root",
  //         title: "srlatchnor",
  //         subtype: "outputs",
  //         subtitle: "0",
  //       },
  //     },
  //   ],
  // },
  // {
  //   Type: "dlatch",
  //   title: "dlatch",
  //   x: 10,
  //   y: 10,
  //   width: 400,
  //   height: 160,
  //   inputs: [{ title: "data" }, { title: "store" }],
  //   outputs: [{ title: "0" }],
  //   entities: [
  //     {
  //       Type: "and",
  //       title: "and1",
  //       x: 120,
  //       y: 40,
  //       width: 100,
  //       height: 50,
  //     },
  //     {
  //       Type: "and",
  //       title: "and2",
  //       x: 120,
  //       y: 100,
  //       width: 100,
  //       height: 50,
  //     },
  //     {
  //       Type: "not",
  //       title: "not1",
  //       x: 30,
  //       y: 100,
  //       width: 60,
  //       height: 30,
  //     },
  //     {
  //       Type: "nor",
  //       title: "nor1",
  //       x: 260,
  //       y: 40,
  //       width: 100,
  //       height: 50,
  //     },
  //     {
  //       Type: "nor",
  //       title: "nor2",
  //       x: 260,
  //       y: 100,
  //       width: 100,
  //       height: 50,
  //     },
  //   ],
  //   connections: [
  //     {
  //       From: {
  //         Type: "root",
  //         title: "dlatch",
  //         subtype: "inputs",
  //         subtitle: "data",
  //       },
  //       To: {
  //         Type: "entity",
  //         title: "and1",
  //         subtype: "inputs",
  //         subtitle: "0",
  //       },
  //     },
  //     {
  //       From: {
  //         Type: "root",
  //         title: "dlatch",
  //         subtype: "inputs",
  //         subtitle: "store",
  //       },
  //       To: {
  //         Type: "entity",
  //         title: "and1",
  //         subtype: "inputs",
  //         subtitle: "1",
  //       },
  //     },
  //     {
  //       From: {
  //         Type: "root",
  //         title: "dlatch",
  //         subtype: "inputs",
  //         subtitle: "data",
  //       },
  //       To: {
  //         Type: "entity",
  //         title: "not1",
  //         subtype: "inputs",
  //         subtitle: "0",
  //       },
  //     },
  //     {
  //       From: {
  //         Type: "entity",
  //         title: "not1",
  //         subtype: "outputs",
  //         subtitle: "0",
  //       },
  //       To: {
  //         Type: "entity",
  //         title: "and2",
  //         subtype: "inputs",
  //         subtitle: "1",
  //       },
  //     },
  //     {
  //       From: {
  //         Type: "root",
  //         title: "dlatch",
  //         subtype: "inputs",
  //         subtitle: "store",
  //       },
  //       To: {
  //         Type: "entity",
  //         title: "and2",
  //         subtype: "inputs",
  //         subtitle: "0",
  //       },
  //     },
  //     {
  //       From: {
  //         Type: "entity",
  //         title: "and1",
  //         subtype: "outputs",
  //         subtitle: "0",
  //       },
  //       To: {
  //         Type: "entity",
  //         title: "nor1",
  //         subtype: "inputs",
  //         subtitle: "0",
  //       },
  //     },
  //     {
  //       From: {
  //         Type: "entity",
  //         title: "and2",
  //         subtype: "outputs",
  //         subtitle: "0",
  //       },
  //       To: {
  //         Type: "entity",
  //         title: "nor2",
  //         subtype: "inputs",
  //         subtitle: "1",
  //       },
  //     },
  //     {
  //       From: {
  //         Type: "entity",
  //         title: "nor1",
  //         subtype: "outputs",
  //         subtitle: "0",
  //       },
  //       To: {
  //         Type: "entity",
  //         title: "nor2",
  //         subtype: "inputs",
  //         subtitle: "0",
  //       },
  //     },
  //     {
  //       From: {
  //         Type: "entity",
  //         title: "nor2",
  //         subtype: "outputs",
  //         subtitle: "0",
  //       },
  //       To: {
  //         Type: "entity",
  //         title: "nor1",
  //         subtype: "inputs",
  //         subtitle: "1",
  //       },
  //     },
  //     {
  //       From: {
  //         Type: "entity",
  //         title: "nor2",
  //         subtype: "outputs",
  //         subtitle: "0",
  //       },
  //       To: {
  //         Type: "root",
  //         title: "dlatch",
  //         subtype: "outputs",
  //         subtitle: "0",
  //       },
  //     },
  //   ],
  // },

  // {
  //   Type: "4bitsRegisterDumb",
  //   title: "4bitsRegisterDumb",
  //   x: 10,
  //   y: 10,
  //   width: 300,
  //   height: 300,
  //   inputs: [
  //     { title: "data3" },
  //     { title: "data2" },
  //     { title: "data1" },
  //     { title: "data0" },
  //     { title: "store" },
  //   ],
  //   outputs: [{ title: "3" }, { title: "2" }, { title: "1" }, { title: "0" }],
  //   entities: [
  //     {
  //       Type: "dlatch",
  //       title: "dlatch3",
  //       x: 120,
  //       y: 40,
  //       width: 80,
  //       height: 50,
  //     },
  //     {
  //       Type: "dlatch",
  //       title: "dlatch2",
  //       x: 120,
  //       y: 100,
  //       width: 80,
  //       height: 50,
  //     },
  //     {
  //       Type: "dlatch",
  //       title: "dlatch1",
  //       x: 120,
  //       y: 160,
  //       width: 80,
  //       height: 50,
  //     },
  //     {
  //       Type: "dlatch",
  //       title: "dlatch0",
  //       x: 120,
  //       y: 220,
  //       width: 80,
  //       height: 50,
  //     },
  //   ],
  //   connections: [
  //     {
  //       From: {
  //         Type: "root",
  //         title: "4bitsRegisterDumb",
  //         subtype: "inputs",
  //         subtitle: "data0",
  //       },
  //       To: {
  //         Type: "entity",
  //         title: "dlatch0",
  //         subtype: "inputs",
  //         subtitle: "data",
  //       },
  //     },
  //     {
  //       From: {
  //         Type: "root",
  //         title: "4bitsRegisterDumb",
  //         subtype: "inputs",
  //         subtitle: "data1",
  //       },
  //       To: {
  //         Type: "entity",
  //         title: "dlatch1",
  //         subtype: "inputs",
  //         subtitle: "data",
  //       },
  //     },
  //     {
  //       From: {
  //         Type: "root",
  //         title: "4bitsRegisterDumb",
  //         subtype: "inputs",
  //         subtitle: "data2",
  //       },
  //       To: {
  //         Type: "entity",
  //         title: "dlatch2",
  //         subtype: "inputs",
  //         subtitle: "data",
  //       },
  //     },
  //     {
  //       From: {
  //         Type: "root",
  //         title: "4bitsRegisterDumb",
  //         subtype: "inputs",
  //         subtitle: "data3",
  //       },
  //       To: {
  //         Type: "entity",
  //         title: "dlatch3",
  //         subtype: "inputs",
  //         subtitle: "data",
  //       },
  //     },

  //     {
  //       From: {
  //         Type: "root",
  //         title: "4bitsRegisterDumb",
  //         subtype: "inputs",
  //         subtitle: "store",
  //       },
  //       To: {
  //         Type: "entity",
  //         title: "dlatch0",
  //         subtype: "inputs",
  //         subtitle: "store",
  //       },
  //     },
  //     {
  //       From: {
  //         Type: "root",
  //         title: "4bitsRegisterDumb",
  //         subtype: "inputs",
  //         subtitle: "store",
  //       },
  //       To: {
  //         Type: "entity",
  //         title: "dlatch1",
  //         subtype: "inputs",
  //         subtitle: "store",
  //       },
  //     },
  //     {
  //       From: {
  //         Type: "root",
  //         title: "4bitsRegisterDumb",
  //         subtype: "inputs",
  //         subtitle: "store",
  //       },
  //       To: {
  //         Type: "entity",
  //         title: "dlatch2",
  //         subtype: "inputs",
  //         subtitle: "store",
  //       },
  //     },
  //     {
  //       From: {
  //         Type: "root",
  //         title: "4bitsRegisterDumb",
  //         subtype: "inputs",
  //         subtitle: "store",
  //       },
  //       To: {
  //         Type: "entity",
  //         title: "dlatch3",
  //         subtype: "inputs",
  //         subtitle: "store",
  //       },
  //     },

  //     {
  //       From: {
  //         Type: "entity",
  //         title: "dlatch0",
  //         subtype: "outputs",
  //         subtitle: "0",
  //       },
  //       To: {
  //         Type: "root",
  //         title: "4bitsRegisterDumb",
  //         subtype: "outputs",
  //         subtitle: "0",
  //       },
  //     },
  //     {
  //       From: {
  //         Type: "entity",
  //         title: "dlatch1",
  //         subtype: "outputs",
  //         subtitle: "0",
  //       },
  //       To: {
  //         Type: "root",
  //         title: "4bitsRegisterDumb",
  //         subtype: "outputs",
  //         subtitle: "1",
  //       },
  //     },
  //     {
  //       From: {
  //         Type: "entity",
  //         title: "dlatch2",
  //         subtype: "outputs",
  //         subtitle: "0",
  //       },
  //       To: {
  //         Type: "root",
  //         title: "4bitsRegisterDumb",
  //         subtype: "outputs",
  //         subtitle: "2",
  //       },
  //     },
  //     {
  //       From: {
  //         Type: "entity",
  //         title: "dlatch3",
  //         subtype: "outputs",
  //         subtitle: "0",
  //       },
  //       To: {
  //         Type: "root",
  //         title: "4bitsRegisterDumb",
  //         subtype: "outputs",
  //         subtitle: "3",
  //       },
  //     },
  //   ],
  // },

  // {
  //   Type: "dFlipFlop",
  //   title: "dFlipFlop",
  //   x: 10,
  //   y: 10,
  //   width: 360,
  //   height: 160,
  //   inputs: [{ title: "data" }, { title: "clock" }],
  //   outputs: [{ title: "0" }],
  //   entities: [
  //     {
  //       Type: "not",
  //       title: "not0",
  //       x: 30,
  //       y: 60,
  //       width: 60,
  //       height: 30,
  //     },
  //     {
  //       Type: "dlatch",
  //       title: "dlatch0",
  //       x: 120,
  //       y: 40,
  //       width: 80,
  //       height: 50,
  //     },
  //     {
  //       Type: "dlatch",
  //       title: "dlatch1",
  //       x: 240,
  //       y: 100,
  //       width: 80,
  //       height: 50,
  //     },
  //   ],
  //   connections: [
  //     {
  //       From: {
  //         Type: "root",
  //         title: "dFlipFlop",
  //         subtype: "inputs",
  //         subtitle: "data",
  //       },
  //       To: {
  //         Type: "entity",
  //         title: "dlatch0",
  //         subtype: "inputs",
  //         subtitle: "data",
  //       },
  //     },
  //     {
  //       From: {
  //         Type: "root",
  //         title: "dFlipFlop",
  //         subtype: "inputs",
  //         subtitle: "clock",
  //       },
  //       To: {
  //         Type: "entity",
  //         title: "dlatch1",
  //         subtype: "inputs",
  //         subtitle: "store",
  //       },
  //     },
  //     {
  //       From: {
  //         Type: "entity",
  //         title: "not0",
  //         subtype: "outputs",
  //         subtitle: "0",
  //       },
  //       To: {
  //         Type: "entity",
  //         title: "dlatch0",
  //         subtype: "inputs",
  //         subtitle: "store",
  //       },
  //     },
  //     {
  //       From: {
  //         Type: "entity",
  //         title: "dlatch0",
  //         subtype: "outputs",
  //         subtitle: "0",
  //       },
  //       To: {
  //         Type: "entity",
  //         title: "dlatch1",
  //         subtype: "inputs",
  //         subtitle: "data",
  //       },
  //     },
  //     {
  //       From: {
  //         Type: "entity",
  //         title: "dlatch1",
  //         subtype: "outputs",
  //         subtitle: "0",
  //       },
  //       To: {
  //         Type: "root",
  //         title: "dFlipFlop",
  //         subtype: "outputs",
  //         subtitle: "0",
  //       },
  //     },
  //     {
  //       From: {
  //         Type: "root",
  //         title: "dFlipFlop",
  //         subtype: "inputs",
  //         subtitle: "clock",
  //       },
  //       To: {
  //         Type: "entity",
  //         title: "not0",
  //         subtype: "inputs",
  //         subtitle: "0",
  //       },
  //     },
  //   ],
  // },

  // {
  //   Type: "1bitRegister",
  //   title: "1bitRegister",
  //   x: 10,
  //   y: 10,
  //   width: 460,
  //   height: 240,
  //   inputs: [{ title: "data" }, { title: "store" }, { title: "clock" }],
  //   outputs: [{ title: "0" }],
  //   entities: [
  //     {
  //       Type: "not",
  //       title: "not0",
  //       x: 50,
  //       y: 40,
  //       width: 60,
  //       height: 40,
  //     },
  //     {
  //       Type: "and",
  //       title: "and0",
  //       x: 140,
  //       y: 40,
  //       width: 60,
  //       height: 50,
  //     },
  //     {
  //       Type: "and",
  //       title: "and1",
  //       x: 140,
  //       y: 100,
  //       width: 60,
  //       height: 50,
  //     },
  //     {
  //       Type: "or",
  //       title: "or0",
  //       x: 220,
  //       y: 80,
  //       width: 60,
  //       height: 50,
  //     },
  //     {
  //       Type: "dFlipFlop",
  //       title: "dFlipFlop0",
  //       x: 300,
  //       y: 180,
  //       width: 80,
  //       height: 50,
  //     },
  //   ],
  //   connections: [
  //     {
  //       From: {
  //         Type: "root",
  //         title: "1bitRegister",
  //         subtype: "inputs",
  //         subtitle: "data",
  //       },
  //       To: {
  //         Type: "entity",
  //         title: "and1",
  //         subtype: "inputs",
  //         subtitle: "1",
  //       },
  //     },
  //     {
  //       From: {
  //         Type: "root",
  //         title: "1bitRegister",
  //         subtype: "inputs",
  //         subtitle: "store",
  //       },
  //       To: {
  //         Type: "entity",
  //         title: "and1",
  //         subtype: "inputs",
  //         subtitle: "0",
  //       },
  //     },
  //     {
  //       From: {
  //         Type: "root",
  //         title: "1bitRegister",
  //         subtype: "inputs",
  //         subtitle: "store",
  //       },
  //       To: {
  //         Type: "entity",
  //         title: "not0",
  //         subtype: "inputs",
  //         subtitle: "0",
  //       },
  //     },
  //     {
  //       From: {
  //         Type: "root",
  //         title: "1bitRegister",
  //         subtype: "inputs",
  //         subtitle: "clock",
  //       },
  //       To: {
  //         Type: "entity",
  //         title: "dFlipFlop0",
  //         subtype: "inputs",
  //         subtitle: "clock",
  //       },
  //     },
  //     {
  //       From: {
  //         Type: "entity",
  //         title: "not0",
  //         subtype: "outputs",
  //         subtitle: "0",
  //       },
  //       To: {
  //         Type: "entity",
  //         title: "and0",
  //         subtype: "inputs",
  //         subtitle: "1",
  //       },
  //     },
  //     {
  //       From: {
  //         Type: "entity",
  //         title: "dFlipFlop0",
  //         subtype: "outputs",
  //         subtitle: "0",
  //       },
  //       To: {
  //         Type: "entity",
  //         title: "and0",
  //         subtype: "inputs",
  //         subtitle: "0",
  //       },
  //     },
  //     {
  //       From: {
  //         Type: "entity",
  //         title: "and0",
  //         subtype: "outputs",
  //         subtitle: "0",
  //       },
  //       To: {
  //         Type: "entity",
  //         title: "or0",
  //         subtype: "inputs",
  //         subtitle: "0",
  //       },
  //     },
  //     {
  //       From: {
  //         Type: "entity",
  //         title: "and1",
  //         subtype: "outputs",
  //         subtitle: "0",
  //       },
  //       To: {
  //         Type: "entity",
  //         title: "or0",
  //         subtype: "inputs",
  //         subtitle: "1",
  //       },
  //     },
  //     {
  //       From: {
  //         Type: "entity",
  //         title: "or0",
  //         subtype: "outputs",
  //         subtitle: "0",
  //       },
  //       To: {
  //         Type: "entity",
  //         title: "dFlipFlop0",
  //         subtype: "inputs",
  //         subtitle: "data",
  //       },
  //     },

  //     {
  //       From: {
  //         Type: "entity",
  //         title: "dFlipFlop0",
  //         subtype: "outputs",
  //         subtitle: "0",
  //       },
  //       To: {
  //         Type: "root",
  //         title: "1bitRegister",
  //         subtype: "outputs",
  //         subtitle: "0",
  //       },
  //     },
  //   ],
  // },

  // {
  //   Type: "4bitsRegister",
  //   title: "4bitsRegister",
  //   x: 10,
  //   y: 10,
  //   width: 300,
  //   height: 360,
  //   inputs: [
  //     { title: "data3" },
  //     { title: "data2" },
  //     { title: "data1" },
  //     { title: "data0" },
  //     { title: "store" },
  //     { title: "clock" },
  //   ],
  //   outputs: [{ title: "3" }, { title: "2" }, { title: "1" }, { title: "0" }],
  //   entities: [
  //     {
  //       Type: "1bitRegister",
  //       title: "1bitRegister3",
  //       x: 120,
  //       y: 40,
  //       width: 80,
  //       height: 70,
  //     },
  //     {
  //       Type: "1bitRegister",
  //       title: "1bitRegister2",
  //       x: 120,
  //       y: 120,
  //       width: 80,
  //       height: 70,
  //     },
  //     {
  //       Type: "1bitRegister",
  //       title: "1bitRegister1",
  //       x: 120,
  //       y: 200,
  //       width: 80,
  //       height: 70,
  //     },
  //     {
  //       Type: "1bitRegister",
  //       title: "1bitRegister0",
  //       x: 120,
  //       y: 280,
  //       width: 80,
  //       height: 70,
  //     },
  //   ],
  //   connections: [
  //     {
  //       From: {
  //         Type: "root",
  //         title: "4bitsRegister",
  //         subtype: "inputs",
  //         subtitle: "data0",
  //       },
  //       To: {
  //         Type: "entity",
  //         title: "1bitRegister0",
  //         subtype: "inputs",
  //         subtitle: "data",
  //       },
  //     },
  //     {
  //       From: {
  //         Type: "root",
  //         title: "4bitsRegister",
  //         subtype: "inputs",
  //         subtitle: "data1",
  //       },
  //       To: {
  //         Type: "entity",
  //         title: "1bitRegister1",
  //         subtype: "inputs",
  //         subtitle: "data",
  //       },
  //     },
  //     {
  //       From: {
  //         Type: "root",
  //         title: "4bitsRegister",
  //         subtype: "inputs",
  //         subtitle: "data2",
  //       },
  //       To: {
  //         Type: "entity",
  //         title: "1bitRegister2",
  //         subtype: "inputs",
  //         subtitle: "data",
  //       },
  //     },
  //     {
  //       From: {
  //         Type: "root",
  //         title: "4bitsRegister",
  //         subtype: "inputs",
  //         subtitle: "data3",
  //       },
  //       To: {
  //         Type: "entity",
  //         title: "1bitRegister3",
  //         subtype: "inputs",
  //         subtitle: "data",
  //       },
  //     },

  //     {
  //       From: {
  //         Type: "root",
  //         title: "4bitsRegister",
  //         subtype: "inputs",
  //         subtitle: "store",
  //       },
  //       To: {
  //         Type: "entity",
  //         title: "1bitRegister0",
  //         subtype: "inputs",
  //         subtitle: "store",
  //       },
  //     },
  //     {
  //       From: {
  //         Type: "root",
  //         title: "4bitsRegister",
  //         subtype: "inputs",
  //         subtitle: "store",
  //       },
  //       To: {
  //         Type: "entity",
  //         title: "1bitRegister1",
  //         subtype: "inputs",
  //         subtitle: "store",
  //       },
  //     },
  //     {
  //       From: {
  //         Type: "root",
  //         title: "4bitsRegister",
  //         subtype: "inputs",
  //         subtitle: "store",
  //       },
  //       To: {
  //         Type: "entity",
  //         title: "1bitRegister2",
  //         subtype: "inputs",
  //         subtitle: "store",
  //       },
  //     },
  //     {
  //       From: {
  //         Type: "root",
  //         title: "4bitsRegister",
  //         subtype: "inputs",
  //         subtitle: "store",
  //       },
  //       To: {
  //         Type: "entity",
  //         title: "1bitRegister3",
  //         subtype: "inputs",
  //         subtitle: "store",
  //       },
  //     },

  //     {
  //       From: {
  //         Type: "root",
  //         title: "4bitsRegister",
  //         subtype: "inputs",
  //         subtitle: "clock",
  //       },
  //       To: {
  //         Type: "entity",
  //         title: "1bitRegister0",
  //         subtype: "inputs",
  //         subtitle: "clock",
  //       },
  //     },
  //     {
  //       From: {
  //         Type: "root",
  //         title: "4bitsRegister",
  //         subtype: "inputs",
  //         subtitle: "clock",
  //       },
  //       To: {
  //         Type: "entity",
  //         title: "1bitRegister1",
  //         subtype: "inputs",
  //         subtitle: "clock",
  //       },
  //     },
  //     {
  //       From: {
  //         Type: "root",
  //         title: "4bitsRegister",
  //         subtype: "inputs",
  //         subtitle: "clock",
  //       },
  //       To: {
  //         Type: "entity",
  //         title: "1bitRegister2",
  //         subtype: "inputs",
  //         subtitle: "clock",
  //       },
  //     },
  //     {
  //       From: {
  //         Type: "root",
  //         title: "4bitsRegister",
  //         subtype: "inputs",
  //         subtitle: "clock",
  //       },
  //       To: {
  //         Type: "entity",
  //         title: "1bitRegister3",
  //         subtype: "inputs",
  //         subtitle: "clock",
  //       },
  //     },

  //     {
  //       From: {
  //         Type: "entity",
  //         title: "1bitRegister0",
  //         subtype: "outputs",
  //         subtitle: "0",
  //       },
  //       To: {
  //         Type: "root",
  //         title: "4bitsRegister",
  //         subtype: "outputs",
  //         subtitle: "0",
  //       },
  //     },
  //     {
  //       From: {
  //         Type: "entity",
  //         title: "1bitRegister1",
  //         subtype: "outputs",
  //         subtitle: "0",
  //       },
  //       To: {
  //         Type: "root",
  //         title: "4bitsRegister",
  //         subtype: "outputs",
  //         subtitle: "1",
  //       },
  //     },
  //     {
  //       From: {
  //         Type: "entity",
  //         title: "1bitRegister2",
  //         subtype: "outputs",
  //         subtitle: "0",
  //       },
  //       To: {
  //         Type: "root",
  //         title: "4bitsRegister",
  //         subtype: "outputs",
  //         subtitle: "2",
  //       },
  //     },
  //     {
  //       From: {
  //         Type: "entity",
  //         title: "1bitRegister3",
  //         subtype: "outputs",
  //         subtitle: "0",
  //       },
  //       To: {
  //         Type: "root",
  //         title: "4bitsRegister",
  //         subtype: "outputs",
  //         subtitle: "3",
  //       },
  //     },
  //   ],
  // },
  // {
  //   Type: "4bitsToDecimalDecoder",
  //   title: "4bitsToDecimalDecoder",
  //   x: 10,
  //   y: 10,
  //   width: 660,
  //   height: 520,
  //   inputs: [{ title: "0" }, { title: "1" }, { title: "2" }, { title: "3" }],
  //   outputs: [
  //     { title: "0" },
  //     { title: "1" },
  //     { title: "2" },
  //     { title: "3" },
  //     { title: "4" },
  //     { title: "5" },
  //     { title: "6" },
  //   ],
  //   entities: [
  //     {
  //       Type: "xor",
  //       title: "xor0",
  //       x: 60,
  //       y: 180,
  //       width: 80,
  //       height: 50,
  //     },
  //     {
  //       Type: "not",
  //       title: "not0",
  //       x: 60,
  //       y: 280,
  //       width: 80,
  //       height: 50,
  //     },

  //     {
  //       Type: "nand",
  //       title: "nand0",
  //       x: 180,
  //       y: 280,
  //       width: 80,
  //       height: 50,
  //     },

  //     {
  //       Type: "xor",
  //       title: "xor1",
  //       x: 300,
  //       y: 100,
  //       width: 80,
  //       height: 50,
  //     },
  //     {
  //       Type: "xor",
  //       title: "xor2",
  //       x: 300,
  //       y: 380,
  //       width: 80,
  //       height: 50,
  //     },
  //     {
  //       Type: "or",
  //       title: "or0",
  //       x: 300,
  //       y: 460,
  //       width: 80,
  //       height: 50,
  //     },

  //     {
  //       Type: "or",
  //       title: "or1",
  //       x: 420,
  //       y: 40,
  //       width: 80,
  //       height: 50,
  //     },
  //     {
  //       Type: "or",
  //       title: "or2",
  //       x: 420,
  //       y: 160,
  //       width: 80,
  //       height: 50,
  //     },
  //     {
  //       Type: "or",
  //       title: "or3",
  //       x: 420,
  //       y: 340,
  //       width: 80,
  //       height: 50,
  //     },

  //     {
  //       Type: "nand",
  //       title: "nand1",
  //       x: 540,
  //       y: 100,
  //       width: 80,
  //       height: 50,
  //     },
  //     {
  //       Type: "or",
  //       title: "or4",
  //       x: 540,
  //       y: 160,
  //       width: 80,
  //       height: 50,
  //     },
  //     {
  //       Type: "and",
  //       title: "and0",
  //       x: 540,
  //       y: 220,
  //       width: 80,
  //       height: 50,
  //     },
  //     {
  //       Type: "and",
  //       title: "and1",
  //       x: 540,
  //       y: 280,
  //       width: 80,
  //       height: 50,
  //     },
  //     {
  //       Type: "and",
  //       title: "and2",
  //       x: 540,
  //       y: 340,
  //       width: 80,
  //       height: 50,
  //     },
  //     {
  //       Type: "and",
  //       title: "and3",
  //       x: 540,
  //       y: 400,
  //       width: 80,
  //       height: 50,
  //     },
  //   ],
  //   connections: [
  //     {
  //       From: {
  //         Type: "root",
  //         title: "4bitsToDecimalDecoder",
  //         subtype: "inputs",
  //         subtitle: "0",
  //       },
  //       To: {
  //         Type: "entity",
  //         title: "xor0",
  //         subtype: "inputs",
  //         subtitle: "0",
  //       },
  //     },

  //     {
  //       From: {
  //         Type: "root",
  //         title: "4bitsToDecimalDecoder",
  //         subtype: "inputs",
  //         subtitle: "1",
  //       },
  //       To: {
  //         Type: "entity",
  //         title: "nand0",
  //         subtype: "inputs",
  //         subtitle: "0",
  //       },
  //     },
  //     {
  //       From: {
  //         Type: "root",
  //         title: "4bitsToDecimalDecoder",
  //         subtype: "inputs",
  //         subtitle: "1",
  //       },
  //       To: {
  //         Type: "entity",
  //         title: "or0",
  //         subtype: "inputs",
  //         subtitle: "0",
  //       },
  //     },
  //     {
  //       From: {
  //         Type: "root",
  //         title: "4bitsToDecimalDecoder",
  //         subtype: "inputs",
  //         subtitle: "1",
  //       },
  //       To: {
  //         Type: "entity",
  //         title: "xor2",
  //         subtype: "inputs",
  //         subtitle: "0",
  //       },
  //     },
  //     {
  //       From: {
  //         Type: "root",
  //         title: "4bitsToDecimalDecoder",
  //         subtype: "inputs",
  //         subtitle: "1",
  //       },
  //       To: {
  //         Type: "entity",
  //         title: "or2",
  //         subtype: "inputs",
  //         subtitle: "0",
  //       },
  //     },
  //     {
  //       From: {
  //         Type: "root",
  //         title: "4bitsToDecimalDecoder",
  //         subtype: "inputs",
  //         subtitle: "1",
  //       },
  //       To: {
  //         Type: "entity",
  //         title: "nand1",
  //         subtype: "inputs",
  //         subtitle: "1",
  //       },
  //     },

  //     {
  //       From: {
  //         Type: "root",
  //         title: "4bitsToDecimalDecoder",
  //         subtype: "inputs",
  //         subtitle: "2",
  //       },
  //       To: {
  //         Type: "entity",
  //         title: "xor0",
  //         subtype: "inputs",
  //         subtitle: "1",
  //       },
  //     },
  //     {
  //       From: {
  //         Type: "root",
  //         title: "4bitsToDecimalDecoder",
  //         subtype: "inputs",
  //         subtitle: "2",
  //       },
  //       To: {
  //         Type: "entity",
  //         title: "not0",
  //         subtype: "inputs",
  //         subtitle: "0",
  //       },
  //     },

  //     {
  //       From: {
  //         Type: "root",
  //         title: "4bitsToDecimalDecoder",
  //         subtype: "inputs",
  //         subtitle: "3",
  //       },
  //       To: {
  //         Type: "entity",
  //         title: "xor1",
  //         subtype: "inputs",
  //         subtitle: "1",
  //       },
  //     },
  //     {
  //       From: {
  //         Type: "root",
  //         title: "4bitsToDecimalDecoder",
  //         subtype: "inputs",
  //         subtitle: "3",
  //       },
  //       To: {
  //         Type: "entity",
  //         title: "or4",
  //         subtype: "inputs",
  //         subtitle: "1",
  //       },
  //     },

  //     {
  //       From: {
  //         Type: "entity",
  //         title: "xor0",
  //         subtype: "outputs",
  //         subtitle: "0",
  //       },
  //       To: {
  //         Type: "entity",
  //         title: "or0",
  //         subtype: "inputs",
  //         subtitle: "1",
  //       },
  //     },
  //     {
  //       From: {
  //         Type: "entity",
  //         title: "xor0",
  //         subtype: "outputs",
  //         subtitle: "0",
  //       },
  //       To: {
  //         Type: "entity",
  //         title: "xor2",
  //         subtype: "inputs",
  //         subtitle: "1",
  //       },
  //     },
  //     {
  //       From: {
  //         Type: "entity",
  //         title: "xor0",
  //         subtype: "outputs",
  //         subtitle: "0",
  //       },
  //       To: {
  //         Type: "entity",
  //         title: "or1",
  //         subtype: "inputs",
  //         subtitle: "0",
  //       },
  //     },

  //     {
  //       From: {
  //         Type: "entity",
  //         title: "not0",
  //         subtype: "outputs",
  //         subtitle: "0",
  //       },
  //       To: {
  //         Type: "entity",
  //         title: "nand0",
  //         subtype: "inputs",
  //         subtitle: "1",
  //       },
  //     },
  //     {
  //       From: {
  //         Type: "entity",
  //         title: "not0",
  //         subtype: "outputs",
  //         subtitle: "0",
  //       },
  //       To: {
  //         Type: "entity",
  //         title: "or2",
  //         subtype: "inputs",
  //         subtitle: "1",
  //       },
  //     },

  //     {
  //       From: {
  //         Type: "entity",
  //         title: "nand0",
  //         subtype: "outputs",
  //         subtitle: "0",
  //       },
  //       To: {
  //         Type: "entity",
  //         title: "xor1",
  //         subtype: "inputs",
  //         subtitle: "0",
  //       },
  //     },
  //     {
  //       From: {
  //         Type: "entity",
  //         title: "nand0",
  //         subtype: "outputs",
  //         subtitle: "0",
  //       },
  //       To: {
  //         Type: "entity",
  //         title: "and1",
  //         subtype: "inputs",
  //         subtitle: "1",
  //       },
  //     },

  //     {
  //       From: {
  //         Type: "entity",
  //         title: "xor1",
  //         subtype: "outputs",
  //         subtitle: "0",
  //       },
  //       To: {
  //         Type: "entity",
  //         title: "or1",
  //         subtype: "inputs",
  //         subtitle: "1",
  //       },
  //     },
  //     {
  //       From: {
  //         Type: "entity",
  //         title: "xor1",
  //         subtype: "outputs",
  //         subtitle: "0",
  //       },
  //       To: {
  //         Type: "entity",
  //         title: "nand1",
  //         subtype: "inputs",
  //         subtitle: "0",
  //       },
  //     },
  //     {
  //       From: {
  //         Type: "entity",
  //         title: "xor1",
  //         subtype: "outputs",
  //         subtitle: "0",
  //       },
  //       To: {
  //         Type: "entity",
  //         title: "and1",
  //         subtype: "inputs",
  //         subtitle: "0",
  //       },
  //     },
  //     {
  //       From: {
  //         Type: "entity",
  //         title: "xor1",
  //         subtype: "outputs",
  //         subtitle: "0",
  //       },
  //       To: {
  //         Type: "entity",
  //         title: "or3",
  //         subtype: "inputs",
  //         subtitle: "0",
  //       },
  //     },

  //     {
  //       From: {
  //         Type: "entity",
  //         title: "xor2",
  //         subtype: "outputs",
  //         subtitle: "0",
  //       },
  //       To: {
  //         Type: "entity",
  //         title: "or3",
  //         subtype: "inputs",
  //         subtitle: "1",
  //       },
  //     },

  //     {
  //       From: {
  //         Type: "entity",
  //         title: "or0",
  //         subtype: "outputs",
  //         subtitle: "0",
  //       },
  //       To: {
  //         Type: "entity",
  //         title: "and3",
  //         subtype: "inputs",
  //         subtitle: "1",
  //       },
  //     },

  //     {
  //       From: {
  //         Type: "entity",
  //         title: "or1",
  //         subtype: "outputs",
  //         subtitle: "0",
  //       },
  //       To: {
  //         Type: "entity",
  //         title: "and0",
  //         subtype: "inputs",
  //         subtitle: "0",
  //       },
  //     },

  //     {
  //       From: {
  //         Type: "entity",
  //         title: "or2",
  //         subtype: "outputs",
  //         subtitle: "0",
  //       },
  //       To: {
  //         Type: "entity",
  //         title: "or4",
  //         subtype: "inputs",
  //         subtitle: "0",
  //       },
  //     },
  //     {
  //       From: {
  //         Type: "entity",
  //         title: "or2",
  //         subtype: "outputs",
  //         subtitle: "0",
  //       },
  //       To: {
  //         Type: "entity",
  //         title: "and2",
  //         subtype: "inputs",
  //         subtitle: "0",
  //       },
  //     },

  //     {
  //       From: {
  //         Type: "entity",
  //         title: "or3",
  //         subtype: "outputs",
  //         subtitle: "0",
  //       },
  //       To: {
  //         Type: "entity",
  //         title: "and0",
  //         subtype: "inputs",
  //         subtitle: "1",
  //       },
  //     },
  //     {
  //       From: {
  //         Type: "entity",
  //         title: "or3",
  //         subtype: "outputs",
  //         subtitle: "0",
  //       },
  //       To: {
  //         Type: "entity",
  //         title: "and2",
  //         subtype: "inputs",
  //         subtitle: "1",
  //       },
  //     },
  //     {
  //       From: {
  //         Type: "entity",
  //         title: "or3",
  //         subtype: "outputs",
  //         subtitle: "0",
  //       },
  //       To: {
  //         Type: "entity",
  //         title: "and3",
  //         subtype: "inputs",
  //         subtitle: "0",
  //       },
  //     },

  //     {
  //       From: {
  //         Type: "entity",
  //         title: "or1",
  //         subtype: "outputs",
  //         subtitle: "0",
  //       },
  //       To: {
  //         Type: "root",
  //         title: "4bitsToDecimalDecoder",
  //         subtype: "outputs",
  //         subtitle: "0",
  //       },
  //     },
  //     {
  //       From: {
  //         Type: "entity",
  //         title: "nand1",
  //         subtype: "outputs",
  //         subtitle: "0",
  //       },
  //       To: {
  //         Type: "root",
  //         title: "4bitsToDecimalDecoder",
  //         subtype: "outputs",
  //         subtitle: "1",
  //       },
  //     },
  //     {
  //       From: {
  //         Type: "entity",
  //         title: "or4",
  //         subtype: "outputs",
  //         subtitle: "0",
  //       },
  //       To: {
  //         Type: "root",
  //         title: "4bitsToDecimalDecoder",
  //         subtype: "outputs",
  //         subtitle: "2",
  //       },
  //     },
  //     {
  //       From: {
  //         Type: "entity",
  //         title: "and0",
  //         subtype: "outputs",
  //         subtitle: "0",
  //       },
  //       To: {
  //         Type: "root",
  //         title: "4bitsToDecimalDecoder",
  //         subtype: "outputs",
  //         subtitle: "3",
  //       },
  //     },
  //     {
  //       From: {
  //         Type: "entity",
  //         title: "and1",
  //         subtype: "outputs",
  //         subtitle: "0",
  //       },
  //       To: {
  //         Type: "root",
  //         title: "4bitsToDecimalDecoder",
  //         subtype: "outputs",
  //         subtitle: "4",
  //       },
  //     },
  //     {
  //       From: {
  //         Type: "entity",
  //         title: "and2",
  //         subtype: "outputs",
  //         subtitle: "0",
  //       },
  //       To: {
  //         Type: "root",
  //         title: "4bitsToDecimalDecoder",
  //         subtype: "outputs",
  //         subtitle: "5",
  //       },
  //     },
  //     {
  //       From: {
  //         Type: "entity",
  //         title: "and3",
  //         subtype: "outputs",
  //         subtitle: "0",
  //       },
  //       To: {
  //         Type: "root",
  //         title: "4bitsToDecimalDecoder",
  //         subtype: "outputs",
  //         subtitle: "6",
  //       },
  //     },
  //   ],
  // },
  // {
  //   Type: "signed8segmentsdriver",
  //   title: "signed8segmentsdriver",
  //   x: 10,
  //   y: 10,
  //   width: 700,
  //   height: 520,
  //   inputs: [
  //     { title: "rippleNegative" },
  //     { title: "0" },
  //     { title: "1" },
  //     { title: "2" },
  //     { title: "3" },
  //     { title: "rippleBlanking" },
  //   ],
  //   outputs: [
  //     { title: "rippleNegative" },
  //     { title: "0" },
  //     { title: "1" },
  //     { title: "2" },
  //     { title: "3" },
  //     { title: "4" },
  //     { title: "5" },
  //     { title: "6" },
  //     { title: "7" },
  //     { title: "rippleBlanking" },
  //   ],
  //   entities: [
  //     {
  //       Type: "4bitsToDecimalDecoder",
  //       title: "4bitsToDecimalDecoder0",
  //       x: 240,
  //       y: 60,
  //       width: 120,
  //       height: 180,
  //     },

  //     {
  //       Type: "quadOR",
  //       title: "quadOR0",
  //       x: 80,
  //       y: 320,
  //       width: 100,
  //       height: 100,
  //     },
  //     {
  //       Type: "not",
  //       title: "not0",
  //       x: 200,
  //       y: 320,
  //       width: 60,
  //       height: 40,
  //     },
  //     {
  //       Type: "and",
  //       title: `and0`,
  //       x: 280,
  //       y: 360,
  //       width: 60,
  //       height: 50,
  //     },
  //     {
  //       Type: "not",
  //       title: "not1",
  //       x: 360,
  //       y: 360,
  //       width: 60,
  //       height: 60,
  //     },
  //     ...[...Array(8)].map((_, i) => ({
  //       Type: "and",
  //       title: `and${1 + i}`,
  //       x: 480,
  //       y: 40 + i * 60,
  //       width: 60,
  //       height: 50,
  //     })),
  //     {
  //       Type: "not",
  //       title: "not2",
  //       x: 560,
  //       y: 460,
  //       width: 60,
  //       height: 50,
  //     },
  //     {
  //       Type: "and",
  //       title: "and9",
  //       x: 640,
  //       y: 430,
  //       width: 60,
  //       height: 50,
  //     },
  //   ],
  //   connections: [
  //     ...[...Array(4)].map((_, i) => ({
  //       From: {
  //         Type: "root",
  //         title: "signed8segmentsdriver",
  //         subtype: "inputs" as const,
  //         subtitle: i.toString(),
  //       },
  //       To: {
  //         Type: "entity",
  //         title: "4bitsToDecimalDecoder0",
  //         subtype: "inputs" as const,
  //         subtitle: i.toString(),
  //       },
  //     })),
  //     ...[...Array(4)].map((_, i) => ({
  //       From: {
  //         Type: "root",
  //         title: "signed8segmentsdriver",
  //         subtype: "inputs" as const,
  //         subtitle: i.toString(),
  //       },
  //       To: {
  //         Type: "entity",
  //         title: "quadOR0",
  //         subtype: "inputs" as const,
  //         subtitle: i.toString(),
  //       },
  //     })),

  //     {
  //       From: {
  //         Type: "entity",
  //         title: "quadOR0",
  //         subtype: "outputs" as const,
  //         subtitle: "0",
  //       },
  //       To: {
  //         Type: "entity",
  //         title: "not0",
  //         subtype: "inputs" as const,
  //         subtitle: "0",
  //       },
  //     },
  //     {
  //       From: {
  //         Type: "entity",
  //         title: "not0",
  //         subtype: "outputs" as const,
  //         subtitle: "0",
  //       },
  //       To: {
  //         Type: "entity",
  //         title: "and0",
  //         subtype: "inputs" as const,
  //         subtitle: "0",
  //       },
  //     },
  //     {
  //       From: {
  //         Type: "root",
  //         title: "signed8segmentsdriver",
  //         subtype: "inputs" as const,
  //         subtitle: "rippleBlanking",
  //       },
  //       To: {
  //         Type: "entity",
  //         title: "and0",
  //         subtype: "inputs" as const,
  //         subtitle: "1",
  //       },
  //     },
  //     {
  //       From: {
  //         Type: "entity",
  //         title: "and0",
  //         subtype: "outputs" as const,
  //         subtitle: "0",
  //       },
  //       To: {
  //         Type: "entity",
  //         title: "not1",
  //         subtype: "inputs" as const,
  //         subtitle: "0",
  //       },
  //     },
  //     ...[...Array(8)].map((_, i) => ({
  //       From: {
  //         Type: "entity",
  //         title: "not1",
  //         subtype: "outputs" as const,
  //         subtitle: "0",
  //       },
  //       To: {
  //         Type: "entity",
  //         title: `and${1 + i}`,
  //         subtype: "inputs" as const,
  //         subtitle: "1",
  //       },
  //     })),
  //     ...[...Array(7)].map((_, i) => ({
  //       From: {
  //         Type: "entity",
  //         title: "4bitsToDecimalDecoder0",
  //         subtype: "outputs" as const,
  //         subtitle: i.toString(),
  //       },
  //       To: {
  //         Type: "entity",
  //         title: `and${1 + i}`,
  //         subtype: "inputs" as const,
  //         subtitle: "0",
  //       },
  //     })),
  //     ...[...Array(8)].map((_, i) => ({
  //       From: {
  //         Type: "entity",
  //         title: `and${1 + i}`,
  //         subtype: "outputs" as const,
  //         subtitle: "0",
  //       },
  //       To: {
  //         Type: "root",
  //         title: "signed8segmentsdriver",
  //         subtype: "outputs" as const,
  //         subtitle: i.toString(),
  //       },
  //     })),
  //     {
  //       From: {
  //         Type: "entity",
  //         title: "and0",
  //         subtype: "outputs" as const,
  //         subtitle: "0",
  //       },
  //       To: {
  //         Type: "root",
  //         title: "signed8segmentsdriver",
  //         subtype: "outputs" as const,
  //         subtitle: "rippleBlanking",
  //       },
  //     },
  //     {
  //       From: {
  //         Type: "root",
  //         title: "signed8segmentsdriver",
  //         subtype: "inputs" as const,
  //         subtitle: "rippleNegative",
  //       },
  //       To: {
  //         Type: "entity",
  //         title: "and8",
  //         subtype: "inputs" as const,
  //         subtitle: "0",
  //       },
  //     },
  //     {
  //       From: {
  //         Type: "entity",
  //         title: "and8",
  //         subtype: "inputs" as const,
  //         subtitle: "0",
  //       },
  //       To: {
  //         Type: "entity",
  //         title: "and9",
  //         subtype: "inputs" as const,
  //         subtitle: "0",
  //       },
  //     },
  //     {
  //       From: {
  //         Type: "entity",
  //         title: "and8",
  //         subtype: "outputs" as const,
  //         subtitle: "0",
  //       },
  //       To: {
  //         Type: "entity",
  //         title: "not2",
  //         subtype: "inputs" as const,
  //         subtitle: "0",
  //       },
  //     },
  //     {
  //       From: {
  //         Type: "entity",
  //         title: "not2",
  //         subtype: "outputs" as const,
  //         subtitle: "0",
  //       },
  //       To: {
  //         Type: "entity",
  //         title: "and9",
  //         subtype: "inputs" as const,
  //         subtitle: "1",
  //       },
  //     },
  //     {
  //       From: {
  //         Type: "entity",
  //         title: "and9",
  //         subtype: "outputs" as const,
  //         subtitle: "0",
  //       },
  //       To: {
  //         Type: "root",
  //         title: "signed8segmentsdriver",
  //         subtype: "outputs" as const,
  //         subtitle: "rippleNegative",
  //       },
  //     },
  //   ],
  // },
  // {
  //   Type: "quadOR",
  //   title: "quadOR",
  //   x: 10,
  //   y: 10,
  //   width: 340,
  //   height: 180,
  //   inputs: [{ title: "0" }, { title: "1" }, { title: "2" }, { title: "3" }],
  //   outputs: [{ title: "0" }],
  //   entities: [
  //     {
  //       Type: "or",
  //       title: "or0",
  //       x: 50,
  //       y: 50,
  //       width: 60,
  //       height: 50,
  //     },
  //     {
  //       Type: "or",
  //       title: "or1",
  //       x: 140,
  //       y: 80,
  //       width: 60,
  //       height: 50,
  //     },
  //     {
  //       Type: "or",
  //       title: "or2",
  //       x: 240,
  //       y: 110,
  //       width: 60,
  //       height: 50,
  //     },
  //   ],
  //   connections: [
  //     {
  //       From: {
  //         Type: "root",
  //         title: "quadOR",
  //         subtype: "inputs",
  //         subtitle: "0",
  //       },
  //       To: {
  //         Type: "entity",
  //         title: "or0",
  //         subtype: "inputs",
  //         subtitle: "0",
  //       },
  //     },
  //     ...[...Array(3)].map((_, i) => ({
  //       From: {
  //         Type: "root",
  //         title: "quadOR",
  //         subtype: "inputs" as const,
  //         subtitle: (i + 1).toString(),
  //       },
  //       To: {
  //         Type: "entity",
  //         title: `or${i}`,
  //         subtype: "inputs" as const,
  //         subtitle: "1",
  //       },
  //     })),
  //     ...[...Array(2)].map((_, i) => ({
  //       From: {
  //         Type: "entity",
  //         title: `or${i}`,
  //         subtype: "outputs" as const,
  //         subtitle: "0",
  //       },
  //       To: {
  //         Type: "entity",
  //         title: `or${i + 1}`,
  //         subtype: "inputs" as const,
  //         subtitle: "0",
  //       },
  //     })),
  //     {
  //       From: {
  //         Type: "entity",
  //         title: `or2`,
  //         subtype: "outputs",
  //         subtitle: "0",
  //       },
  //       To: {
  //         Type: "root",
  //         title: "quadOR",
  //         subtype: "outputs",
  //         subtitle: "0",
  //       },
  //     },
  //   ],
  //   truthTable: [
  //     {
  //       inputs: [
  //         { title: "0", value: false },
  //         { title: "1", value: false },
  //         { title: "2", value: false },
  //         { title: "3", value: false },
  //       ],
  //       outputs: [{ title: "0", value: false }],
  //     },
  //     {
  //       inputs: [
  //         { title: "0", value: true },
  //         { title: "1", value: false },
  //         { title: "2", value: false },
  //         { title: "3", value: false },
  //       ],
  //       outputs: [{ title: "0", value: true }],
  //     },
  //     {
  //       inputs: [
  //         { title: "0", value: false },
  //         { title: "1", value: true },
  //         { title: "2", value: false },
  //         { title: "3", value: false },
  //       ],
  //       outputs: [{ title: "0", value: true }],
  //     },
  //     {
  //       inputs: [
  //         { title: "0", value: false },
  //         { title: "1", value: false },
  //         { title: "2", value: true },
  //         { title: "3", value: false },
  //       ],
  //       outputs: [{ title: "0", value: true }],
  //     },
  //     {
  //       inputs: [
  //         { title: "0", value: false },
  //         { title: "1", value: false },
  //         { title: "2", value: false },
  //         { title: "3", value: true },
  //       ],
  //       outputs: [{ title: "0", value: true }],
  //     },

  //     {
  //       inputs: [
  //         { title: "0", value: true },
  //         { title: "1", value: true },
  //         { title: "2", value: false },
  //         { title: "3", value: false },
  //       ],
  //       outputs: [{ title: "0", value: true }],
  //     },
  //     {
  //       inputs: [
  //         { title: "0", value: true },
  //         { title: "1", value: false },
  //         { title: "2", value: true },
  //         { title: "3", value: false },
  //       ],
  //       outputs: [{ title: "0", value: true }],
  //     },
  //     {
  //       inputs: [
  //         { title: "0", value: true },
  //         { title: "1", value: false },
  //         { title: "2", value: false },
  //         { title: "3", value: true },
  //       ],
  //       outputs: [{ title: "0", value: true }],
  //     },
  //     {
  //       inputs: [
  //         { title: "0", value: false },
  //         { title: "1", value: true },
  //         { title: "2", value: true },
  //         { title: "3", value: false },
  //       ],
  //       outputs: [{ title: "0", value: true }],
  //     },
  //     {
  //       inputs: [
  //         { title: "0", value: false },
  //         { title: "1", value: true },
  //         { title: "2", value: false },
  //         { title: "3", value: true },
  //       ],
  //       outputs: [{ title: "0", value: true }],
  //     },
  //     {
  //       inputs: [
  //         { title: "0", value: false },
  //         { title: "1", value: false },
  //         { title: "2", value: true },
  //         { title: "3", value: true },
  //       ],
  //       outputs: [{ title: "0", value: true }],
  //     },

  //     {
  //       inputs: [
  //         { title: "0", value: true },
  //         { title: "1", value: true },
  //         { title: "2", value: true },
  //         { title: "3", value: false },
  //       ],
  //       outputs: [{ title: "0", value: true }],
  //     },
  //     {
  //       inputs: [
  //         { title: "0", value: true },
  //         { title: "1", value: false },
  //         { title: "2", value: true },
  //         { title: "3", value: true },
  //       ],
  //       outputs: [{ title: "0", value: true }],
  //     },
  //     {
  //       inputs: [
  //         { title: "0", value: true },
  //         { title: "1", value: true },
  //         { title: "2", value: false },
  //         { title: "3", value: true },
  //       ],
  //       outputs: [{ title: "0", value: true }],
  //     },
  //     {
  //       inputs: [
  //         { title: "0", value: false },
  //         { title: "1", value: true },
  //         { title: "2", value: true },
  //         { title: "3", value: true },
  //       ],
  //       outputs: [{ title: "0", value: true }],
  //     },
  //     {
  //       inputs: [
  //         { title: "0", value: true },
  //         { title: "1", value: true },
  //         { title: "2", value: true },
  //         { title: "3", value: true },
  //       ],
  //       outputs: [{ title: "0", value: true }],
  //     },
  //   ],
  // },
  // {
  //   Type: "signed8segments",
  //   title: "signed8segments",
  //   x: 10,
  //   y: 10,
  //   width: 700,
  //   height: 520,
  //   Component: SignedEigthSegmentsDisplay,
  //   inputs: [
  //     { title: "rippleNegative" },
  //     { title: "0" },
  //     { title: "1" },
  //     { title: "2" },
  //     { title: "3" },
  //     { title: "rippleBlanking" },
  //   ],
  //   outputs: [{ title: "rippleNegative" }, { title: "rippleBlanking" }],
  //   entities: [
  //     {
  //       Type: "signed8segmentsdriver",
  //       title: "signed8segmentsdriver0",
  //       x: 240,
  //       y: 70,
  //       width: 120,
  //       height: 220,
  //     },
  //     {
  //       Type: "raw8segments",
  //       title: "raw8segments0",
  //       x: 580,
  //       y: 140,
  //       width: 100,
  //       height: 180,
  //     },
  //   ],
  //   connections: [
  //     ...["rippleNegative", "0", "1", "2", "3", "rippleBlanking"].map((i) => ({
  //       From: {
  //         Type: "root",
  //         title: "signed8segments",
  //         subtype: "inputs" as const,
  //         subtitle: i.toString(),
  //       },
  //       To: {
  //         Type: "entity",
  //         title: "signed8segmentsdriver0",
  //         subtype: "inputs" as const,
  //         subtitle: i.toString(),
  //       },
  //     })),
  //     ...[...Array(8)].map((_, i) => ({
  //       From: {
  //         Type: "entity",
  //         title: "signed8segmentsdriver0",
  //         subtype: "outputs" as const,
  //         subtitle: i.toString(),
  //       },
  //       To: {
  //         Type: "entity",
  //         title: "raw8segments0",
  //         subtype: "inputs" as const,
  //         subtitle: i.toString(),
  //       },
  //     })),
  //     {
  //       From: {
  //         Type: "entity",
  //         title: "signed8segmentsdriver0",
  //         subtype: "outputs" as const,
  //         subtitle: "rippleBlanking",
  //       },
  //       To: {
  //         Type: "root",
  //         title: "signed8segments",
  //         subtype: "outputs" as const,
  //         subtitle: "rippleBlanking",
  //       },
  //     },
  //     {
  //       From: {
  //         Type: "entity",
  //         title: "signed8segmentsdriver0",
  //         subtype: "outputs" as const,
  //         subtitle: "rippleNegative",
  //       },
  //       To: {
  //         Type: "root",
  //         title: "signed8segments",
  //         subtype: "outputs" as const,
  //         subtitle: "rippleNegative",
  //       },
  //     },
  //   ],
  // },
];

// export const gState: () => Entity = () => ({
//   Type: "root",
//   title: "troot",
//   x: 10,
//   y: 10,
//   width: 500,
//   height: 400,
//   inputs: [
//     { title: "rippleNegative" },
//     { title: "0" },
//     { title: "1" },
//     { title: "2" },
//     { title: "3" },
//     { title: "4" },
//     { title: "5" },
//     { title: "6" },
//     { title: "7" },
//     { title: "rippleBlanking" },
//   ],
//   outputs: [],
//   entities: [
//     {
//       Type: "3digitDecimalDisplay",
//       title: "3digitDecimalDisplay0",
//       x: 50,
//       y: 50,
//       width: 300,
//       height: 220,
//     },
//   ],
//   connections: [],
// });
