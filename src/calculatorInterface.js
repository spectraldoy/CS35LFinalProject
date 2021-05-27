import './App.css';
import React from 'react';
import { calculate } from './calculator.js'
import { InvertColorsOff, ThreeSixtySharp } from '@material-ui/icons';
import {getScheme} from './globals.js'
import { fade, makeStyles } from '@material-ui/core/styles';
import { Button } from '@material-ui/core';

const hc = getComputedStyle(document.documentElement).getPropertyValue('--highlight-color');

function withMyHook(Component) {
  return function WrappedComponent(props) {
    const classes = useStyles();
    return <Component {...props} myHookValue={classes} />;
  }
}
const useStyles = makeStyles((theme) => ({
  colorButton: {
    fullWidth: true,
    backgroundColor: fade(hc, 0.15),
    '&:hover': {
        backgroundColor: fade(hc, 0.55),
    }
  },
}));

class calculatorInterface extends React.Component {
  constructor(props) {
    super(props);

    // extract URL parameter
    const url = window.location.href;
    const idLocation = url.search("id");
    this.query = url.substring(idLocation, url.length);
    
    // TODO: Remove when URL parameter is working
    this.query = "id=60aae5db54867f1138747ff7";

    this.state = {
      scheme: null,
      animate: false,
      assignmentsPtsReceived: null, // to be set later
      assignmentsPtsOutOf: null, // to be set later
      assignmentsType: null, // to be set later
      gradeWanted: "",
      result: ""
    };

    this.weights = [];
    this.names = [];
    this.count = 0;

    this.finishInit = this.finishInit.bind(this);
    this.submitGrades = this.submitGrades.bind(this);
    this.addAssignment = this.addAssignment.bind(this);
    this.handleChange = this.handleChange.bind(this);
    this.handleAssignmentTypeChange = this.handleAssignmentTypeChange.bind(this);

  }

  
  componentDidMount() {
    getScheme(this.query, "grading_schemes").then(data => data.json()).then(schemes => {
      this.finishInit(schemes[0])
    });
  }

  finishInit = (myScheme) => {
    for (let category of myScheme.categories) {
      this.weights.push(category.weight);
      this.names.push(category.name);
      this.count += 1;
    }

    this.setState({
      scheme: myScheme, 
      animate: true,
      assignmentsName: Array(this.count).fill(Array(0)),
      assignmentsPtsReceived: Array(this.count).fill(Array(0)),
      assignmentsPtsOutOf: Array(this.count).fill(Array(0)),
      assignmentsType: Array(this.count).fill(Array(0)),
      gradeWanted: "",
      result: "",
    });
  }


  handleChange = arr => (event) => {
    event.preventDefault();
    if (event.target.name === "gradeWanted") {
      this.setState({
        gradeWanted: event.target.value
      });
    }
    else if (event.target.name === "assignmentname") {
      const assignment = this.state.assignmentsName.slice();
      assignment[arr[0]][arr[1]] = event.target.value;
      this.setState({
        assignmentsName: assignment
      });
    }
    else if (event.target.name === "ptsreceived") {
      const assignment = this.state.assignmentsPtsReceived.slice();
      assignment[arr[0]][arr[1]] = event.target.value;
      this.setState({
        assignmentsPtsReceived: assignment
      });
    }
    else if (event.target.name === "ptsoutof") {
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
    const names = this.state.assignmentsName.slice();
    names[i] = names[i].concat([""]);
    const assignment = this.state.assignmentsPtsReceived.slice();
    assignment[i] = assignment[i].concat([""]);
    const assignment2 = this.state.assignmentsPtsOutOf.slice();
    assignment2[i] = assignment2[i].concat([""]);
    const assignment4 = this.state.assignmentsType.slice();
    assignment4[i] = assignment4[i].concat(["Graded"]);

    this.setState({
      assignmentsName: names,
      assignmentsPtsReceived: assignment,
      assignmentsPtsOutOf: assignment2,
      assignmentsType: assignment4
    });
  }

  removeAssignment = arr => (event) => {
    event.preventDefault();
    const names = this.state.assignmentsName.slice();
    names[arr[0]].splice(arr[1],1);
    const assignment = this.state.assignmentsPtsReceived.slice();
    assignment[arr[0]].splice(arr[1],1);
    const assignment2 = this.state.assignmentsPtsOutOf.slice();
    assignment2[arr[0]].splice(arr[1],1);
    const assignment4 = this.state.assignmentsType.slice();
    assignment4[arr[0]].splice(arr[1],1);

    this.setState({
      assignmentsName: names,
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
    for (let category of this.state.scheme.categories) {
      let graded = [];
      let projected = [];
      for(var i = 0; i < this.state.assignmentsType[count].length; i++){
        if(this.state.assignmentsType[count][i] === "Graded"){
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
    console.log(this.state.scheme);
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
    const classes = this.props.myHookValue;
    if (!this.state.animate)
      return <h1>Retrieving Scheme...</h1>;

    const items = []
    items.push(
      <h2 key = "Title">
        <label>
        Scheme Calculator
        </label>
      </h2>
    );
    items.push(
      <h2 key ={"Owner"} className = "SchemeInfo">
        <label>
          Scheme Owner: {this.state.scheme.owner}
        </label>
        <br></br>
        <label>
          University: {this.state.scheme.university}
        </label>
        <br></br>
        <label>
          Professor: {this.state.scheme.professor}
        </label>
        <br></br>
        <label>
          Class: {this.state.scheme.class}
        </label>
      </h2>
    );
    console.log(classes);
    console.log(this.state.colorButton);
    for (var i = 0; i < this.count; i++) {
      items.push(
        <h2 key={i + "-title"}>
          <form onClick={this.addAssignment(i)} className="inlineForm">
            <Button type="input" className = {classes.colorButton}>
            Add assignment
            </Button>
          </form>
          <label className = "Category">
            {this.state.scheme.categories[i].name} Category ({this.state.scheme.categories[i].weight}% Weight)&nbsp;&nbsp;
          </label>
        </h2>);
      for (var j = 0; j < this.state.assignmentsPtsReceived[i].length; j++) {
        items.push(
          <h2 key={i + "-"+ j + "-body"}>
            <form className="inlineForm">
              <label className="Points">
                Name:&nbsp;
              <input type="text" name="assignmentname" onChange={this.handleChange([i, j])} value={this.state.assignmentsName[i][j]} className="inputForm" />
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
            <Button type="input" className = {classes.colorButton}>
            Remove assignment
            </Button>
            </form>
          </h2>
        );
      }
    }
    items.push(
      <h2 key="target">
        <form>
          <label className = "FinalGrade">
            Final Grade You Want (0-100%):
          </label>
          <label>&nbsp;&nbsp;</label>
          <input type="text" name="gradeWanted" onChange={this.handleChange(this.count)} value={this.state.gradeWanted} className="inputForm" />
        </form>
      </h2>
    );
    items.push(
      <form onSubmit={this.submitGrades} key="submit">
        <Button type="input" className = {classes.colorButton}>
            Calculate
        </Button>
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

export default withMyHook(calculatorInterface);
