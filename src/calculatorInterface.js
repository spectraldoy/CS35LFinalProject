import './App.css';
import React, { Component } from 'react';
import { calculate } from './calculator.js'
import { InvertColorsOff, ThreeSixtySharp } from '@material-ui/icons';


class calculatorInterface extends React.Component {

  constructor(props) {
    super(props);
    this.scheme = props.scheme;
    this.scheme =
    {
      Owner: "aaisara",
      University: "UCLA",
      Professor: "Eggert",
      Class: "CS35L",
      Categories: [
        { name: "Homework", weight: 10 },
        { name: "Midterm", weight: 30 },
        { name: "Quizzes", weight: 20 },
        { name: "Final", weight: 40 }
      ]

    };
    this.weights = [];
    this.names = [];
    this.count = 0;
    for (let category of this.scheme.Categories) {
      this.weights.push(category.weight);
      this.names.push(category.name);
      this.count += 1;
    }
    this.state = {
      gradeQuery: "",
      assignmentsPtsReceived: Array(this.count).fill(Array(0)),
      assignmentsPtsOutOf: Array(this.count).fill(Array(0)),
      assignmentsType: Array(this.count).fill(Array(0)),
      gradeWanted: "",
      result: ""
    };

    this.submitGrades = this.submitGrades.bind(this);
    this.addAssignment = this.addAssignment.bind(this);
    this.handleChange = this.handleChange.bind(this);
    this.handleAssignmentTypeChange = this.handleAssignmentTypeChange.bind(this);
  }

  handleChange = arr => (event) => {
    event.preventDefault();
    if (event.target.name == "gradeWanted") {
      this.setState({
        gradeWanted: event.target.value
      });
    }
    else if (event.target.name == "ptsreceived") {
      const assignment = this.state.assignmentsPtsReceived.slice();
      assignment[arr[0]][arr[1]] = event.target.value;
      this.setState({
        assignmentsPtsReceived: assignment
      });
    }
    else if (event.target.name == "ptsoutof") {
      const assignment = this.state.assignmentsPtsOutOf.slice();
      assignment[arr[0]][arr[1]] = event.target.value;
      this.setState({
        assignmentsPtsOutOf: assignment
      });
    }
  }
  handleAssignmentTypeChange = arr => (event) => {
    const assignment = this.state.assignmentsType.slice();
    assignment[arr[0]][arr[1]] = event.target.value;
    this.setState({
      assignmentsType: assignment
    });

  }

  addAssignment = i => (event) => {
    event.preventDefault();
    const assignment = this.state.assignmentsPtsReceived.slice();
    assignment[i] = assignment[i].concat([null]);
    const assignment2 = this.state.assignmentsPtsOutOf.slice();
    assignment2[i] = assignment2[i].concat([null]);
    const assignment4 = this.state.assignmentsType.slice();
    assignment4[i] = assignment4[i].concat(["Graded"]);

    this.setState({
      assignmentsPtsReceived: assignment,
      assignmentsPtsOutOf: assignment2,
      assignmentsType: assignment4
    });
  }

  removeAssignment = arr => (event) => {
    event.preventDefault();
    const assignment = this.state.assignmentsPtsReceived.slice();
    assignment[arr[0]].splice(arr[1],1);
    const assignment2 = this.state.assignmentsPtsOutOf.slice();
    assignment2[arr[0]].splice(arr[1],1);
    const assignment4 = this.state.assignmentsType.slice();
    assignment4[arr[0]].splice(arr[1],1);

    this.setState({
      assignmentsPtsReceived: assignment,
      assignmentsPtsOutOf: assignment2,
      assignmentsType: assignment4
    });
  }
  submitGrades(event) {
    event.preventDefault();
    const grades = {
      categories: []
    };

    var count = 0;
    for (let category of this.scheme.Categories) {
      let graded = [];
      let projected = [];
      for(var i = 0; i < this.state.assignmentsType[count].length; i ++){
        if(this.state.assignmentsType[count][i] == "Graded"){
          if(this.state.assignmentsPtsReceived[count][i] === null || this.state.assignmentsPtsReceived[count][i] === "" || this.state.assignmentsPtsOutOf[count][i] === null || this.state.assignmentsPtsOutOf[count][i] === ""){
            alert("All graded assignments must have all points fields filled out");
            return;
          }
          graded.push({ptsReceived: parseInt(this.state.assignmentsPtsReceived[count][i]), ptsOutOf: parseInt(this.state.assignmentsPtsOutOf[count][i])});
        }
        else{
          if(this.state.assignmentsPtsOutOf[count][i] === null || this.state.assignmentsPtsOutOf[count][i] === ""){
            alert("All projected assignments must have all Total Points fields filled out");
            return;
          }
          if(this.state.assignmentsPtsReceived[count][i] === null || this.state.assignmentsPtsReceived[count][i] === ""){
            projected.push({ptsReceived: "-", ptsOutOf: parseInt(this.state.assignmentsPtsOutOf[count][i])});
          }
          else{
            projected.push({ptsReceived: parseInt(this.state.assignmentsPtsReceived[count][i]), ptsOutOf: parseInt(this.state.assignmentsPtsOutOf[count][i])});
          }
        }
      }
      grades.categories.push(
        {
          weight: category.weight,
          graded: graded,
          projected: projected
        }
      );
      count += 1;
    }
    grades.target = ((this.state.gradeWanted[count] === "") ? 0 : parseInt(this.state.gradeWanted));
    console.log(grades);
    const results = calculate(grades);
    let message = "";
    if (results.currentGrade === null) {
      message += "Current grade: 0%";
    }
    else {
      message += ("Current grade: " + results.currentGrade.toFixed(2) + "%");
    }
    message += "\n";
    if (results.projectedGrade === null) {
      message += "Projected grade: 0%";
    }
    else {
      message += ("Projected grade: " + results.projectedGrade.toFixed(2) + "%");
    }
    message += "\n";
    if (results.gradedNeededScore === null) {
      message += "Grade Needed: 0%";
    }
    else {
      message += ("Grade Needed: " + results.gradedNeededScore.toFixed(2) + "%");
    }
    message += "\n";
    if (results.projectedNeededScore === null) {
      message += "Projected Grade Needed: 0%";
    }
    else {
      message += ("Projected Grade Needed: " + results.projectedNeededScore.toFixed(2) + "%");
    }
    this.setState({
      result: message
    });
  }

  render() {
    const items = []
    for (var i = 0; i < this.count; i++) {
      items.push(
        <h2>
          <form onClick={this.addAssignment(i)} className="inlineForm">
            <input type="button" value="Add Assignment" />
          </form>
            <label>
              {this.scheme.Categories[i].name} Category ({this.scheme.Categories[i].weight}% Weight)&nbsp;&nbsp;
            </label>
        </h2>);
      for (var j = 0; j < this.state.assignmentsPtsReceived[i].length; j++) {
        items.push(
          <h2>
            <form className="inlineForm">
              <label className="Points">
                Name:&nbsp;
            <input type="text" className="inputForm" />
              </label>
            </form>
            <form className="inlineForm">
              <label className="Points">
                Points Received:&nbsp;
            <input type="text" name="ptsreceived" onChange={this.handleChange([i, j])} value={this.state.assignmentsPtsReceived[i][j]} className="inputForm" />
              </label>
            </form>
            <form className = "inlineForm">
              <label className="Points">
                Total Points: &nbsp;
              <input type="text" name="ptsoutof" onChange={this.handleChange([i, j])} value={this.state.assignmentsPtsOutOf[i][j]} className="inputForm" />
              </label>
            </form>
            <form className = "inlineForm">
            <label className="Points">
              Grade Type: &nbsp;
              <select value={this.state.assignmentsType[i][j]} onChange={this.handleAssignmentTypeChange([i, j])} className="Switch">
                <option value="Projected">Projected</option>
                <option selected value="Graded">Graded</option>
              </select>
            </label>
            </form>
            <form onClick={this.removeAssignment([i,j])}>
              <input type="button" value="Remove Assignment" />
            </form>
          </h2>
        );
      }
    }
    items.push(
      <h2>
        < form>
          <label>
            Final Grade You Want (0-100%):&nbsp;&nbsp;
          <input type="text" name="gradeWanted" onChange={this.handleChange(this.count)} value={this.state.gradeWanted} className="inputForm" />
          </label>
        </form>
      </h2>
    );
    items.push(
      <form onSubmit={this.submitGrades}>
        <input type="submit" value="Calculate!" />
      </form>
    );
    return (
      <div className="Assignment">
        {items}
        <h2 className="Result">
          {this.state.result}
        </h2>
      </div>
    );
  }
}

export default calculatorInterface;
