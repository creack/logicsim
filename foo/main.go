package main

import (
	"context"
	"encoding/json"
	"fmt"
	"net/http"
	"strings"

	"github.com/gin-contrib/cors"
	"github.com/gin-gonic/gin"
)

type Operation struct {
	left []struct {
		resultIndex string
		name        string
		destIndex   string
	}

	Type string

	Inputs []struct {
		paramName string // Which input to set the value.

		valueType string // Where does the value come from. "input", or intermediary op name.
		valueName string // Which output name from the value to use.
	}
}

type Entities []*Entity

func (es Entities) Get(name string) (*Entity, error) {
	for _, elem := range es {
		if elem.Name == name {
			return elem, nil
		}
	}
	return nil, fmt.Errorf("entity %q not found", name)
}

func (es Entities) Clone() Entities {
	if len(es) == 0 {
		return nil
	}
	out := make(Entities, 0, len(es))
	for _, elem := range es {
		out = append(out, elem.Clone())
	}
	return out
}

type Entity struct {
	Name  string `json:"name"`
	Alias string `json:"alias"`

	Inputs         Entities `json:"inputs"`
	Outputs        Entities `json:"outputs"`
	Intermediaries Entities `json:"intermediaries"`

	Ops []string `json:"ops"`

	Value     *bool  `json:"value"`
	ValueFrom string `json:"valueFrom"`

	Tests []struct {
		Inputs  map[string]bool `json:"inputs"`
		Outputs map[string]bool `json:"outputs"`
	} `json:"tests"`
}

func (e Entity) Clone() *Entity {
	out := e
	out.Inputs = e.Inputs.Clone()
	out.Outputs = e.Outputs.Clone()
	out.Intermediaries = e.Intermediaries.Clone()
	if e.Value != nil {
		v := *e.Value
		out.Value = &v
	}
	return &out
}

func (e *Entity) Run() error {
	for _, ops := range e.Ops {
		parts0 := strings.Split(ops, "=")
		retType, op := parts0[0], parts0[1]

		parts2 := strings.Split(op, "-")
		parts3 := strings.Split(parts2[0], ":")
		opType, opName := parts3[0], parts3[1]

		inputParts := strings.Split(parts2[1], ",")
		inputsByName := map[string]bool{}
		for _, elem := range inputParts {
			inParts := strings.Split(elem, ":")
			inFromName := inParts[1] // Name to use to lookup the input value.
			inTypeParts := strings.Split(inParts[0], "|")
			// inTargetName is the name of the input expected by the "call".
			inTargetName, inType := inTypeParts[0], inTypeParts[1]
			switch inType {
			case "input":
				v, err := e.Inputs.Get(inFromName)
				if err != nil {
					return fmt.Errorf("inputs.Get %q: %w", inFromName, err)
				}
				if v.Value == nil {
					return fmt.Errorf("value for input %q not computed", inFromName)
				}
				inputsByName[inTargetName] = *v.Value
			case "e":
				v, err := e.Intermediaries.Get(inFromName)
				if err != nil {
					return fmt.Errorf("intermediaries.Get %q: %w", inFromName, err)
				}
				if v.Value == nil {
					return fmt.Errorf("value for intermediary %q not computed", inFromName)
				}
				inputsByName[inTargetName] = *v.Value
			default:
				v, err := e.Intermediaries.Get(inType)
				if err != nil {
					return fmt.Errorf("input intermediary %q not found", inType)
				}
				inputsByName[inTargetName] = *v.Value
			}
		}

		var opResult Entity
		opResult.Name = retType
		e.Intermediaries = append(e.Intermediaries, &opResult)
		switch opType {
		case "binaryPrimitive":
			p, ok := binaryPrimitives[opName]
			if !ok {
				return fmt.Errorf("unknown binary primitive %q", opName)
			}
			if len(inputsByName) != 2 {
				return fmt.Errorf("invalid inputs for binary primitive: expect 2 inputs, got %d", len(inputsByName))
			}
			ret := p(inputsByName["0"], inputsByName["1"])
			opResult.Outputs = Entities{{Name: "0", Value: &ret}}
			if err := opResult.Run(); err != nil {
				return fmt.Errorf("opResult.Run %q: %w", retType, err)
			}
		case "e":
			subE, err := gEntities.Entities.Get(opName)
			if err != nil {
				return fmt.Errorf("entities.Get %q: %w", opName, err)
			}
			op := subE.Clone()
			if len(op.Outputs) != 1 {
				return fmt.Errorf("multi outputs ops are not supported, got %d outputs", len(op.Outputs))
			}
			for _, elem := range op.Inputs {
				v, ok := inputsByName[elem.Name]
				if !ok {
					return fmt.Errorf("missing input %q for op %q", elem.Name, opName)
				}
				v1 := v
				elem.Value = &v1
			}
			if err := op.Run(); err != nil {
				return fmt.Errorf("op.Run %q: %w", op.Name, err)
			}
			opResult.Outputs = op.Outputs
		default:
			return fmt.Errorf("opType %q not supported", opType)
		}

		// switch retType {
		// case "output":
		// 	out, err := e.Outputs.Get(retName)
		// 	if err != nil {
		// 		return fmt.Errorf("outputs.Get %q: %w", retName, err)
		// 	}
		// 	v, err := opResult.Outputs.Get("0")
		// 	if err != nil {
		// 		return fmt.Errorf("missing entry %q in opResult outputs", "0")
		// 	}
		// 	out.Value = v.Value
		// // case "e":
		// // 	e.Intermediaries = append(e.Intermediaries, &Entity{
		// // 		Name:  retName,
		// // 		Value: &opResult,
		// // 	})
		// default:
		// 	return fmt.Errorf("return type %q not supported", retType)
		// }
	}

	for _, elem := range e.Outputs {
		parts := strings.Split(elem.ValueFrom, ":")
		if len(parts) != 2 {
			continue
		}
		fromType, fromName := parts[0], parts[1]

		var singleOut bool
		switch fromType {
		case "input":
			v, err := e.Inputs.Get(fromName)
			if err != nil {
				return fmt.Errorf("input %q not found", fromName)
			}
			singleOut = *v.Value
		case "output":
			v, err := e.Outputs.Get(fromName)
			if err != nil {
				return fmt.Errorf("output %q not found", fromName)
			}
			singleOut = *v.Value
		default:
			v, err := e.Intermediaries.Get(fromType)
			if err != nil {
				return fmt.Errorf("intermediary %q not found", fromType)
			}
			vv, err := v.Outputs.Get(fromName)
			if err != nil {
				return fmt.Errorf("output %q from intermediary %q not found", fromName, fromType)
			}
			singleOut = *vv.Value
		}
		elem.Value = &singleOut
	}

	if len(e.Outputs) == 1 {
		for _, elem := range e.Outputs {
			e.Value = elem.Value
		}
	}
	return nil
}

var binaryPrimitives = map[string]func(bool, bool) bool{
	"nand": func(a, b bool) bool { return !(a && b) },
}

var gEntities struct {
	Entities `json:"entities"`
}

func test(ctx context.Context) error {
	const foo = `
{
  "entities": [
    {
      "name": "not",
      "inputs": [
        {"name": "0"}
      ],
      "ops": [
        "A=binaryPrimitive:nand-0|input:0,1|input:0"
      ],
      "outputs": [
        {"name": "0", "valueFrom": "A:0"}
      ],
      "tests": [
        {"inputs": {"0": false}, "outputs": {"0": true}},
        {"inputs": {"0": true},  "outputs": {"0": false}}
      ]
    },
    {
      "name": "identity",
      "inputs": [
        {"name": "0"}
      ],
      "ops": [
        "A=binaryPrimitive:nand-0|input:0,1|input:0",
        "B=e:not-0|A:0"
      ],
      "outputs": [
        {"name": "0", "valueFrom": "B:0"}
      ],
      "tests": [
        {"inputs": {"0": false}, "outputs": {"0": false}},
        {"inputs": {"0": true},  "outputs": {"0": true}}
      ]
    },
    {
      "name": "and",
      "inputs": [
        {"name": "a0"},
        {"name": "a1"}
      ],
      "ops": [
        "A=binaryPrimitive:nand-0|input:a0,1|input:a1",
        "B=binaryPrimitive:nand-0|A:0,1|A:0"
      ],
      "outputs": [
        {"name": "a0", "valueFrom": "B:0"}
      ],
      "tests": [
        {"inputs": {"a0": false, "a1": false}, "outputs": {"a0": false}},
        {"inputs": {"a0": false, "a1": true},  "outputs": {"a0": false}},
        {"inputs": {"a0": true,  "a1": false}, "outputs": {"a0": false}},
        {"inputs": {"a0": true,  "a1": true},  "outputs": {"a0": true}}
      ]
    },
    {
      "name": "virtual_nand",
      "inputs": [
        {"name": "0"},
        {"name": "1"}
      ],
      "ops": [
        "A=e:and-a0|input:0,a1|input:1",
        "B=e:not-0|A:a0"
      ],
      "outputs": [
        {"name": "0", "value_from": "B:0"}
      ],
      "tests": [
        {"inputs": {"0": false, "1": false}, "outputs": {"0": true}},
        {"inputs": {"0": false, "1": true},  "outputs": {"0": true}},
        {"inputs": {"0": true,  "1": false}, "outputs": {"0": true}},
        {"inputs": {"0": true,  "1": true},  "outputs": {"0": false}}
      ]
    },
    {
      "name": "primitive_nand",
      "inputs": [
        {"name": "0"},
        {"name": "1"}
      ],
      "outputs": [
        {"name": "0"}
      ],
      "ops": [
        "output:0=binaryPrimitive:nand-0|input:0,1|input:1"
      ],
      "tests": [
        {"inputs": {"0": false, "1": false}, "outputs": {"0": true}},
        {"inputs": {"0": false, "1": true},  "outputs": {"0": true}},
        {"inputs": {"0": true,  "1": false}, "outputs": {"0": true}},
        {"inputs": {"0": true,  "1": true},  "outputs": {"0": false}}
      ]
    },
    {
      "name": "or",
      "inputs": [
        {"name": "0"},
        {"name": "1"}
      ],
      "outputs": [
        {"name": "0"}
      ],
      "ops": [
        "e:0=binaryPrimitive:nand-0|input:0,1|input:0",
        "e:1=binaryPrimitive:nand-0|input:1,1|input:1",
        "output:0=binaryPrimitive:nand-0|e:0,1|e:1"
      ],
      "tests": [
        {"inputs": {"0": false, "1": false}, "outputs": {"0": false}},
        {"inputs": {"0": false, "1": true},  "outputs": {"0": true}},
        {"inputs": {"0": true,  "1": false}, "outputs": {"0": true}},
        {"inputs": {"0": true,  "1": true},  "outputs": {"0": true}}
      ]
    },
    {
      "name": "xor",
      "inputs": [
        {"name": "0"},
        {"name": "1"}
      ],
      "outputs": [
        {"name": "0"}
      ],
      "ops": [
        "e:0=binaryPrimitive:nand-0|input:0,1|input:1",
        "e:1=binaryPrimitive:nand-0|input:0,1|e:0",
        "e:2=binaryPrimitive:nand-0|input:1,1|e:0",
        "output:0=binaryPrimitive:nand-0|e:1,1|e:2"
      ],
      "tests": [
        {"inputs": {"0": false, "1": false}, "outputs": {"0": false}},
        {"inputs": {"0": false, "1": true},  "outputs": {"0": true}},
        {"inputs": {"0": true,  "1": false}, "outputs": {"0": true}},
        {"inputs": {"0": true,  "1": true},  "outputs": {"0": false}}
      ]
    },
    {
      "name": "triand",
      "inputs": [
        {"name": "0"},
        {"name": "1"},
        {"name": "2"}
      ],
      "outputs": [
        {"name": "0"}
      ],
      "ops": [
        "eret=e:and-a0|input:0,a1|input:1",
        "output:0=e:and-a0|e:eret,a1|input:2"
      ],
      "tests": [
        {"inputs": {"0": false, "1": false, "2": false}, "outputs": {"0": false}},
        {"inputs": {"0": false, "1": false, "2": true},  "outputs": {"0": false}},
        {"inputs": {"0": false, "1": true,  "2": false}, "outputs": {"0": false}},
        {"inputs": {"0": false, "1": true,  "2": true},  "outputs": {"0": false}},
        {"inputs": {"0": true,  "1": false, "2": false}, "outputs": {"0": false}},
        {"inputs": {"0": true,  "1": false, "2": true},  "outputs": {"0": false}},
        {"inputs": {"0": true,  "1": true,  "2": false}, "outputs": {"0": false}},
        {"inputs": {"0": true,  "1": true,  "2": true},  "outputs": {"0": true}}
      ]
    }
  ]
}
`
	if err := json.Unmarshal([]byte(foo), &gEntities); err != nil {
		return fmt.Errorf("unmarshal: %w", err)
	}

	for _, gEntity := range gEntities.Entities {
		fmt.Printf("Entity %s:\n", gEntity.Name)
		for _, testElem := range gEntity.Tests {
			e := gEntity.Clone()

			for name, value := range testElem.Inputs {
				value := value
				in, err := e.Inputs.Get(name)
				if err != nil {
					return fmt.Errorf("inputs.Get %q: %w", name, err)
				}
				in.Value = &value
			}

			if err := e.Run(); err != nil {
				return fmt.Errorf("e.Run %q: %w", e.Name, err)
			}

			for _, in := range e.Inputs {
				fmt.Printf("%t\t", *in.Value)
			}
			fmt.Printf("-- ")
			for _, out := range e.Outputs {
				fmt.Printf("%t\t", *out.Value)
			}
			fmt.Printf("\n")
			for name, value := range testElem.Outputs {
				out, err := e.Outputs.Get(name)
				if err != nil {
					return fmt.Errorf("outputs.Get %q: %w", name, err)
				}
				if out.Value == nil || *out.Value != value {
					return fmt.Errorf("invalid output %q: expect %t, got: %v", name, value, out.Value)
				}
			}
		}
		fmt.Printf("\n")
	}
	return nil
}

func api() error {
	mux := gin.Default()
	mux.Use(cors.Default())
	mux.GET("/", func(c *gin.Context) {
		c.JSON(http.StatusOK, gEntities)
	})
	mux.POST("/", func(c *gin.Context) {
		gEntities.Entities = append(gEntities.Entities, &Entity{Name: "hello"})
		c.JSON(http.StatusOK, gEntities)
	})
	return mux.Run(":4000")
}

func main() {
	if err := api(); err != nil {
		println("Fail API:", err.Error())
		return
	}
	if err := test(context.Background()); err != nil {
		println("Fail:", err.Error())
		return
	}
	println("success")
}
