import '../../App.css';
import React from 'react';
import { calculate } from './calculator.js'
import { InvertColorsOff, ThreeSixtySharp } from '@material-ui/icons';
import { getItem } from '../globals.js'
import { fade, makeStyles } from '@material-ui/core/styles';
import { Button, Typography, FormControl, Input, Select } from '@material-ui/core';
import {Link} from 'react-router-dom';

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

    this.state = {
      scheme: null, // to be set in finishInit
      animate: false,
      assignmentsPtsReceived: null, // to be set in finishInit
      assignmentsPtsOutOf: null, // to be set in finishInit
      assignmentsType: null, // to be set in finishInit
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
  }

  
  componentDidMount() {
    getItem(this.query, "grading_schemes").then(data => data.json()).then(schemes => {
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
    else if(event.target.name === "assignmenttype"){
      const assignment = this.state.assignmentsType.slice();
      assignment[arr[0]][arr[1]] = event.target.value;
      this.setState({
        assignmentsType: assignment
      });
    }
  }

  addAssignment = i => (event) => {
    event.preventDefault();
    const names = this.state.assignmentsName.slice();
    names[i] = names[i].concat([""]);
    const assignment1 = this.state.assignmentsPtsReceived.slice();
    assignment1[i] = assignment1[i].concat([""]);
    const assignment2 = this.state.assignmentsPtsOutOf.slice();
    assignment2[i] = assignment2[i].concat([""]);
    const assignment3 = this.state.assignmentsType.slice();
    assignment3[i] = assignment3[i].concat(["Graded"]);

    this.setState({
      assignmentsName: names,
      assignmentsPtsReceived: assignment1,
      assignmentsPtsOutOf: assignment2,
      assignmentsType: assignment3
    });
  }

  removeAssignment = arr => (event) => {
    event.preventDefault();
    const names = this.state.assignmentsName.slice();
    names[arr[0]].splice(arr[1],1);
    const assignment1 = this.state.assignmentsPtsReceived.slice();
    assignment1[arr[0]].splice(arr[1],1);
    const assignment2 = this.state.assignmentsPtsOutOf.slice();
    assignment2[arr[0]].splice(arr[1],1);
    const assignment3 = this.state.assignmentsType.slice();
    assignment3[arr[0]].splice(arr[1],1);

    this.setState({
      assignmentsName: names,
      assignmentsPtsReceived: assignment1,
      assignmentsPtsOutOf: assignment2,
      assignmentsType: assignment3
    });
  }

  submitGrades(event) {
    event.preventDefault();
    const grades = {
      categories: [],
      target: null
    };
    var count = 0;
    for (let category of this.state.scheme.categories) {
      let graded = [];
      let projected = [];
      let pr, po;
      let negativePoints = false; // track if user entered a negative number and display a warning
      for(var i = 0; i < this.state.assignmentsType[count].length; i++){
        if(this.state.assignmentsType[count][i] === "Graded"){
          if(this.state.assignmentsPtsReceived[count][i] === "" || this.state.assignmentsPtsOutOf[count][i] === ""){
            alert("All graded assignments must have all points fields filled out");
            return;
          }
          pr = parseFloat(this.state.assignmentsPtsReceived[count][i]);
          po = parseFloat(this.state.assignmentsPtsOutOf[count][i]);
          if (isNaN(pr) || isNaN(po)) {
            alert("All points fields for graded assignments must be numbers");
            return;
          }
          if (pr < 0 || po < 0) {
            negativePoints = true;
          }

          graded.push({ptsReceived: pr, ptsOutOf: po});
        }
        else {
          if(this.state.assignmentsPtsOutOf[count][i] === ""){
            alert("All projected assignments must have all Total Points fields filled out");
            return;
          }
          
          pr = parseFloat(this.state.assignmentsPtsReceived[count][i]);
          po = parseFloat(this.state.assignmentsPtsOutOf[count][i]);
          const toPredict = this.state.assignmentsPtsReceived[count][i] === "" || this.state.assignmentsPtsReceived[count][i] === "-";
          if ((isNaN(pr) && !toPredict)  || isNaN(po)) {
            alert("All points fields for projected assignments must be numbers, empty, or -");
            return;
          }
          if (pr < 0 || po < 0) {
            negativePoints = true;
          }

          if(toPredict){
            projected.push({ptsReceived: "-", ptsOutOf: po});
          }
          else{
            projected.push({ptsReceived: pr, ptsOutOf: po});
          }
        }
      }

      if (negativePoints) {
        if (!window.confirm("Warning! You entered a negative number. Would you like to proceed anyways? (You may get unexpected results)")) {
          return;
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


    let match = false;
    for (const pair of this.state.scheme.letterGrades) {
      if (pair.letter === this.state.gradeWanted) {
        grades.target = pair.cutoff;
        match = true;
        break;
      }
    }
    if (!match) {
      const targetGrade = parseFloat(this.state.gradeWanted);
      if (!isNaN(targetGrade)) {
        if (targetGrade < 0 || targetGrade > 105) {
          if (!window.confirm("Warning! The number you entered as a target grade was unexpected. Would you like to proceed anyways?")) {
            return;
          }
        }
        grades.target = parseFloat(this.state.gradeWanted);
      }
      else if (this.state.gradeWanted === "" || this.state.gradeWanted === "-") {
        grades.target = null;
      }
      else {
        alert("Couldn't identify your target grade as a number or a letter grade.");
      }
    }

    const results = calculate(grades);
    let message = "";
    if (results.currentGrade === null) {
      message += "Current grade: N/A\n";
    }
    else {
      message += ("Current grade: " + results.currentGrade + "% " + getLetterGrade(results.currentGrade, this.state.scheme.letterGrades) + "\n");
    }
    if (results.projectedGrade === null) {
      message += "Projected grade: N/A\n";
    }
    else {
      message += ("Projected grade: " + results.projectedGrade + "% " + getLetterGrade(results.projectedGrade, this.state.scheme.letterGrades) + "\n");
    }
    if (results.gradedNeededScore === null) {
      message += "Average grade needed to reach target grade from current grade: N/A\n";
    }
    else {
      message += ("Average grade needed to reach target grade from current grade: " + results.gradedNeededScore + 
        "% " + getLetterGrade(results.gradedNeededScore, this.state.scheme.letterGrades) + "\n");
    }
    if (results.projectedNeededScore === null) {
      message += "Average grade needed to reach target grade from projected grade: N/A";
    }
    else {
      message += ("Average grade needed to reach target grade from projected grade: " + results.projectedNeededScore + 
        "% " + getLetterGrade(results.projectedNeededScore, this.state.scheme.letterGrades) + "\n");
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
        <Typography variant="caption" style = {{fontSize: "2.0rem"}}>
        Scheme Calculator
        </Typography>
      </h2>
    );
    items.push(
      <Typography variant="caption" style = {{fontSize: "1.5rem", lineHeight: "2"}}>
        <label>
          Scheme Owner: {this.state.scheme.owner}
        <br/>
          University: {this.state.scheme.university}
        <br/>
          Professor: {this.state.scheme.professor}
        <br/>
          Class: {this.state.scheme.class}
        </label>
        </Typography>
    );
    for (var i = 0; i < this.count; i++) {
      items.push(
        <h2 key={i + "-title"}>
          <FormControl onClick={this.addAssignment(i)}>
            <Button type="input" className = {classes.colorButton}>
            Add assignment
            </Button>
          </FormControl>
          &nbsp;&nbsp;&nbsp;
          <Typography variant="caption" style = {{fontSize: "1.5rem", backgroundColor: "#ffefd5"}}>
            &nbsp;{this.state.scheme.categories[i].name} Category ({this.state.scheme.categories[i].weight}% Weight)&nbsp;&nbsp;
          </Typography>
        </h2>);
      for (var j = 0; j < this.state.assignmentsPtsReceived[i].length; j++) {
        items.push(
          <h2 key={i + "-"+ j + "-body"}>
            <FormControl style = {{float: "left", paddingRight: "10px"}}>
              <Typography variant="caption" style = {{fontSize: "1.25rem"}}>
                Name:&nbsp;&nbsp;
              <Input type="text" name="assignmentname" onChange={this.handleChange([i, j])} value={this.state.assignmentsName[i][j]} style = {{width: "150px"}} />
              </Typography>
            </FormControl>
            <FormControl style = {{float: "left", paddingRight: "10px"}}>
              <Typography variant="caption" style = {{fontSize: "1.25rem"}}>
                &nbsp;&nbsp;Points Received:&nbsp;&nbsp;
              <Input type="text" name="ptsreceived" onChange={this.handleChange([i, j])} value={this.state.assignmentsPtsReceived[i][j]} style = {{width: "40px"}} />
              </Typography>
            </FormControl>
            <FormControl style = {{float: "left", paddingRight: "10px"}}>
              <Typography variant="caption" style = {{fontSize: "1.25rem"}}>
                &nbsp;&nbsp;Total Points: &nbsp;&nbsp;
              <Input type="text" name="ptsoutof" onChange={this.handleChange([i, j])} value={this.state.assignmentsPtsOutOf[i][j]} style = {{width: "40px"}} />
              </Typography>
            </FormControl>
            <FormControl style = {{float: "left", paddingRight: "10px"}}>
              <Typography variant="caption" style = {{fontSize: "1.25rem"}}>
                &nbsp;&nbsp;Grade Type: &nbsp;
                <Select id = "select" value={this.state.assignmentsType[i][j]} name = "assignmenttype" onChange={this.handleChange([i, j])}>
                  <option value="Projected">Projected</option>
                  <option value="Graded">Graded</option>
                </Select>
              </Typography>
            </FormControl>
            <br></br>
            <br></br>
            <FormControl onClick={this.removeAssignment([i,j])} style = {{float: "left"}}>
            <Button type="input" className = {classes.colorButton}>
            Remove assignment
            </Button>
            </FormControl>
            <br></br>
          </h2>
        );
      }
      if(j!=0){
        items.push(
          <br></br>
          );
      }
    }
    items.push(
      <h2 key="target">
        <FormControl style = {{float: "left", paddingRight: "10px"}}>
              <Typography variant="caption" style = {{fontSize: "1.5rem"}}>
              Final Grade You Want (0-100%, or a defined letter grade): &nbsp;
              <Input type="text" name="gradeWanted" onChange={this.handleChange(this.count)} value={this.state.gradeWanted} style = {{width: "40px"}} />
              </Typography>
        </FormControl>
        <br></br>
      </h2>
    );
    items.push(
      <FormControl onClick={this.submitGrades} key="submit">
        <Button type="input" className = {classes.colorButton}>
            Calculate
        </Button>
      </FormControl>
    );

    return (
      <div className="Assignment">
        {items}
        <h2>
        {this.state.scheme.letterGrades.map((element, index) => {
          return(
            <div key={'Letter' + index}>
              {element.letter + ": " + element.cutoff} 
            </div>
          )
        })}
        </h2>
        <h2>
          <Typography variant="caption" style = {{fontSize: "1.5rem", whiteSpace: "pre-wrap", lineHeight: "200%"}}>
          {this.state.result}
          </Typography>
        </h2>
        <Link to="/">
          Return to dashboard
        </Link>
      </div>
    );
  }
  
}

// grade is a numerical value, letterGrades is an arry of {letter, cutoff} pairs sorted in descending order of cutoff.
// F if lower than any specified grade cutoff
function getLetterGrade(grade, letterGrades) {
  if (!letterGrades)
    return null;

  for (const pair of letterGrades) {
    if (grade >= pair.cutoff)
      return pair.letter;
  }
  return "F";
}

export default withMyHook(calculatorInterface);