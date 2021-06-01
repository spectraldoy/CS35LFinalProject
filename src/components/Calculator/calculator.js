// Code for calculating grades
// Can be used by including the following line
// import {calculate} from './calculator.js'

// Parameters: grades should have the following format
//  grades = { 
//		categories: [
//			{
//				weight: 00
//				graded: [{ptsReceived: 00, ptsOutOf: 00, }, {another assignment}, ...]
//				projected: [{ptsReceived: 00, ptsOutOf: 00, }, {another assignment}, ...]
//			},
//			{ another category },
//			...
//		]
// 		target: a number or null
//	}
//
// Enforce: Weights should be in range [0, 100] and sum of weights should be 100
//
// Return value: An object containing four fields
// 		currentGrade: grade based on current graded scores
// 		projectedGrade: grade based on current and projected scores
//		gradedNeededScore: grade needed on unfilled assignments to raise current grade to
//			target grade, ignoring projected grades
//		projectedNeededScore: grade needed on unfilled assignments to raise projected grade
//			 to target grade
// If one of these fields cannot be calculated, it will be set to null.
//
// Notes:
// Need to make sure the grades are numbers (or possibly "-")
// If the only grade entered in a category is out of 0, it will be ignored. Otherwise, the points
// will be counted as extra credit
// Weights, grades are entered and returned as percents (from 0 - 100)
// Returned numbers are unrounded, so may have a lot of decimal places
export function calculate(grades) {
	var summary = {
		// used for calculating current grade
		currGradedScore: 0, 
		currGradedWeights: 0, 
		// used for calculating projected grade
		currProjectedScore: 0, 
		currProjectedWeights: 0, 
		// used for calculating gradedNeededScore
		finalGradedScore: 0,
		finalGradedWeights: 0,
		// used for calculating projectedNeededScore
		finalProjectedScore: 0,
		finalProjectedWeights : 0,
	}
	

	for (let category of grades.categories) {
		calculateCategory(category, summary);
	}

	var currentGrade = null;
	var projectedGrade = null;
	var gradedNeededScore = null;
	var projectedNeededScore = null;

	// check to make sure we don't divide by zero
	if (summary.currGradedWeights !== 0) {
		currentGrade = summary.currGradedScore / summary.currGradedWeights * 100;
	}
	if (summary.currProjectedWeights !== 0) {
		projectedGrade = summary.currProjectedScore / summary.currProjectedWeights * 100;
	}
	if (grades.target !== null) {
		if (summary.finalGradedWeights !== 100) {
			gradedNeededScore = (grades.target - summary.finalGradedScore) / (100 - summary.finalGradedWeights) * 100;
		}
		if (summary.finalProjectedWeights !== 100) {
			projectedNeededScore = (grades.target - summary.finalProjectedScore) / (100 - summary.finalProjectedWeights) * 100;
		}
	}

	return ({
		currentGrade: roundToHundredths(currentGrade),
		projectedGrade: roundToHundredths(projectedGrade),
		gradedNeededScore: roundToHundredths(gradedNeededScore),
		projectedNeededScore: roundToHundredths(projectedNeededScore),
	});
}

// Helper function: extract info from a single category
function calculateCategory(category, summary) {
	let gradedPtsReceived = 0;
	let gradedPtsTotal = 0;
	let projectedPtsReceived = 0;
	let projectedPtsTotal = 0;
	let unassignedPts = 0;

	for (let assignment of category.graded) {
		gradedPtsReceived += assignment.ptsReceived;
		gradedPtsTotal += assignment.ptsOutOf;
	}
	for (let assignment of category.projected) {
		if (assignment.ptsReceived === "-") {
			unassignedPts += assignment.ptsOutOf;
		}
		else {
			projectedPtsReceived += assignment.ptsReceived;
			projectedPtsTotal += assignment.ptsOutOf;
		}
	}

	// check to make sure that we don't divide by zero
	if (gradedPtsTotal !== 0) {
		summary.currGradedScore += category.weight * gradedPtsReceived / gradedPtsTotal;
		summary.currGradedWeights += category.weight;
	}
	if (gradedPtsTotal + projectedPtsTotal !== 0) {
		summary.currProjectedScore += category.weight * (projectedPtsReceived + gradedPtsReceived) / (gradedPtsTotal + projectedPtsTotal);
		summary.currProjectedWeights += category.weight;
	}

	var ptsTotal = unassignedPts + gradedPtsTotal + projectedPtsTotal;
	if (ptsTotal !== 0) {
		summary.finalGradedScore += category.weight * gradedPtsReceived / ptsTotal;
		summary.finalGradedWeights += category.weight * gradedPtsTotal / ptsTotal;
		summary.finalProjectedScore += category.weight * (gradedPtsReceived + projectedPtsReceived) / ptsTotal;
		summary.finalProjectedWeights += category.weight * (gradedPtsTotal + projectedPtsTotal) / ptsTotal;	
	}
}

// Round the given num to two decimal points
function roundToHundredths(num) {
	if (num === null)
		return null;
	return Math.round((num + Number.EPSILON) * 100) / 100;
}