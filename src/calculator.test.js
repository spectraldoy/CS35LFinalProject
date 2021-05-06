import React from 'react';
import {calculate} from './calculator.js'

// =============================================

var grades1 = createGrades1();
var results1 = calculate(grades1);
test("Standard graded only", () => {
	expect(results1.currentGrade).toEqual(86);
	expect(results1.projectedGrade).toEqual(86);
	expect(results1.gradedNeededScore).toEqual(null);
	expect(results1.projectedNeededScore).toEqual(null);
  });

var grades2 = createGrades2();
var results2 = calculate(grades2);
test("Graded only, no target, assignments out of 0", () => {
	expect(results2.currentGrade).toEqual(93.75);
	expect(results2.projectedGrade).toEqual(93.75);
	expect(results2.gradedNeededScore).toEqual(null);
	expect(results2.projectedNeededScore).toEqual(null);
});

var grades3 = createGrades3();
var results3 = calculate(grades3);
test("Standard graded and projected, no target", () => {
	  expect(results3.currentGrade).toEqual(87.5);
	  expect(results3.projectedGrade).toEqual(86.25);
	  expect(results3.gradedNeededScore).toEqual(null);
	  expect(results3.projectedNeededScore).toEqual(null);
});

var grades4 = createGrades4();
var results4 = calculate(grades4);
test("Graded and projected, no target, assignments out of 0", () => {
	  expect(results4.currentGrade).toEqual(93.75);
	  expect(results4.projectedGrade).toEqual(101.25);
	  expect(results4.gradedNeededScore).toEqual(null);
	  expect(results4.projectedNeededScore).toEqual(null);
});

// TODO:
// Category with 0 weight
// Decimal weights
// Target testing: only empty categories, empty and mixed categories, with assignments out of 0
// 		nonsensical target value

// ============================================

function createGrades1() {
	var graded1 = [{ptsReceived: 40, ptsOutOf: 60,}, {ptsReceived: 40, ptsOutOf: 40,}];
	var graded2 = [{ptsReceived: 50, ptsOutOf: 50,}];

	var category1 = ({
		weight: 70,
		graded: graded1,
		projected: [],
	});
	var category2 = ({
		weight: 30,
		graded: graded2,
		projected: [],
	})

	var categories = [category1, category2];
	var target = 90;

	return ({
		categories: categories,
		target: target,
	});
}

function createGrades2() {
	var graded1 = [{ptsReceived: 40, ptsOutOf: 60,}, {ptsReceived: 40, ptsOutOf: 40,}, {ptsReceived: 10, ptsOutOf: 0,}];
	var graded2 = [{ptsReceived: 50, ptsOutOf: 50,}, {ptsReceived: 0, ptsOutOf: 0,}];
	var graded3 = [{ptsReceived: 5, ptsOutOf: 0,}];
	var projected4 = [{ptsReceived: 5, ptsOutOf: 0,}];

	var category1 = ({
		weight: 50,
		graded: graded1,
		projected: [],
	});
	var category2 = ({
		weight: 30,
		graded: graded2,
		projected: [],
	})
	var category3 = ({
		weight: 20,
		graded: graded3,
		projected: [],
	})

	var categories = [category1, category2, category3];
	var target = null;

	return ({
		categories: categories,
		target: target,
	});
}

function createGrades3() {
	var graded1 = [{ptsReceived: 40, ptsOutOf: 60,}, {ptsReceived: 40, ptsOutOf: 40,}];
	var projected2 = [{ptsReceived: 50, ptsOutOf: 50,}];
	var graded3 = [{ptsReceived: 10, ptsOutOf: 10,}, {ptsReceived: 20, ptsOutOf: 20,}];
	var projected3 = [{ptsReceived: 5, ptsOutOf: 10,}];

	var category1 = ({
		weight: 50,
		graded: graded1,
		projected: [],
	});
	var category2 = ({
		weight: 20,
		graded: [],
		projected: projected2,
	})
	var category3 = ({
		weight: 30,
		graded: graded3,
		projected: projected3,
	})

	var categories = [category1, category2, category3];
	var target = null;

	return ({
		categories: categories,
		target: target,
	});
}

function createGrades4() {
	var graded1 = [{ptsReceived: 40, ptsOutOf: 60,}, {ptsReceived: 40, ptsOutOf: 40,}, {ptsReceived: 10, ptsOutOf: 0,}];
	var graded2 = [{ptsReceived: 50, ptsOutOf: 50,}, {ptsReceived: 0, ptsOutOf: 0,}];
	var projected2 = [{ptsReceived: 10, ptsOutOf: 0,}];
	var graded3 = [{ptsReceived: 5, ptsOutOf: 0,}];
	var projected4 = [{ptsReceived: 1, ptsOutOf: 0,}];

	var category1 = ({
		weight: 50,
		graded: graded1,
		projected: [],
	});
	var category2 = ({
		weight: 30,
		graded: graded2,
		projected: projected2,
	})
	var category3 = ({
		weight: 10,
		graded: graded3,
		projected: [],
	})
	var category3 = ({
		weight: 10,
		graded: [],
		projected: projected4,
	})

	var categories = [category1, category2, category3];
	var target = null;

	return ({
		categories: categories,
		target: target,
	});
}