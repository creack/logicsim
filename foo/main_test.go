package main

import "testing"

func TestPrimitives(t *testing.T) {
	t.Run("not", func(t *testing.T) {
		table := UnaryTruthTable{
			{a: false, out: true},
			{a: true, out: false},
		}
		for _, elem := range table {
			if ret := PrimitiveNot(elem.a); ret != elem.out {
				t.Errorf("Unexepected result for NOT %t: %t, expected %t.\n", elem.a, ret, elem.out)
			}
		}
	})
	t.Run("or", func(t *testing.T) {
		table := BinaryTruthTable{
			{a: false, b: false, out: false},
			{a: false, b: true, out: true},
			{a: true, b: false, out: true},
			{a: true, b: true, out: true},
		}
		for _, elem := range table {
			if ret := PrimitiveOr(elem.a, elem.b); ret != elem.out {
				t.Errorf("Unexepected result for %t OR %t: %t, expected %t.\n", elem.a, elem.b, ret, elem.out)
			}
		}
	})
	t.Run("and", func(t *testing.T) {
		table := BinaryTruthTable{
			{a: false, b: false, out: false},
			{a: false, b: true, out: false},
			{a: true, b: false, out: false},
			{a: true, b: true, out: true},
		}
		for _, elem := range table {
			if ret := PrimitiveAnd(elem.a, elem.b); ret != elem.out {
				t.Errorf("Unexepected result for %t AND %t: %t, expected %t.\n", elem.a, elem.b, ret, elem.out)
			}
		}
	})
	t.Run("nand", func(t *testing.T) {
		table := BinaryTruthTable{
			{a: false, b: false, out: true},
			{a: false, b: true, out: true},
			{a: true, b: false, out: true},
			{a: true, b: true, out: false},
		}
		for _, elem := range table {
			if ret := PrimitiveNand(elem.a, elem.b); ret != elem.out {
				t.Errorf("Unexepected result for %t NAND %t: %t, expected %t.\n", elem.a, elem.b, ret, elem.out)
			}
		}
	})
	t.Run("xor", func(t *testing.T) {
		table := BinaryTruthTable{
			{a: false, b: false, out: false},
			{a: false, b: true, out: true},
			{a: true, b: false, out: true},
			{a: true, b: true, out: false},
		}
		for _, elem := range table {
			if ret := PrimitiveXor(elem.a, elem.b); ret != elem.out {
				t.Errorf("Unexepected result for %t XOR %t: %t, expected %t.\n", elem.a, elem.b, ret, elem.out)
			}
		}
	})
}
