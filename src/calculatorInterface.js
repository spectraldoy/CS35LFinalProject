import './App.css';
import React from 'react';
import { calculate } from './calculator.js'


class calculatorInterface extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      gradeQuery: "",
      grades: Array(5).fill(null),
      weights: [10, 30, 20, 40]
    };

    this.submitGrades = this.submitGrades.bind(this);
    this.handleChange = this.handleChange.bind(this);
  }

  handleChange = i => (event) => {
    event.preventDefault();
    const grades = this.state.grades.slice();
    grades[i] = event.target.value;
    this.setState({
      grades: grades
    });
  }
  
  submitGrades(event){
    event.preventDefault();
    const grades = { 
      		categories: [
      			{
      				weight: 10,
      				graded: ((this.state.grades[0] === null || this.state.grades[0] === "") ? [] : [{ptsReceived: parseInt(this.state.grades[0]), ptsOutOf: 100}]),
      				projected: []
      			},
      			{
      				weight: 30,
      				graded: ((this.state.grades[1] === null || this.state.grades[1] === "") ? [] : [{ptsReceived: parseInt(this.state.grades[1]), ptsOutOf: 100}]),
      				projected: []
      			},
            {
      				weight: 20,
      				graded: ((this.state.grades[2] === null || this.state.grades[2] === "") ? [] : [{ptsReceived: parseInt(this.state.grades[2]), ptsOutOf: 100}]),
      				projected: []
      			},
            {
      				weight: 40,
      				graded: ((this.state.grades[3] === null || this.state.grades[3] === "") ? [] : [{ptsReceived: parseInt(this.state.grades[3]), ptsOutOf: 100}]),
      				projected: []
      			},
      		],
       		target: ((this.state.grades[4] === null || this.state.grades[4] === "") ? 0 : parseInt(this.state.grades[4]))
      	};
    console.log(grades);
    const results = calculate(grades);
    let message = "";
    if(results.currentGrade === null){
      message += "Current grade: 0%"; 
    }
    else{
      message += ("Current grade: " + results.currentGrade + "%");
    }
    message += "\n";
    if(results.projectedGrade === null){
      message += "Projected grade: 0%"; 
    }
    else{
      message += ("Projected grade: " + results.projectedGrade + "%");
    }
    message += "\n";
    if(results.gradedNeededScore === null){
      message += "Grade Needed: 0%"; 
    }
    else{
      message += ("Grade Needed: " + results.gradedNeededScore + "%");
    }
    message += "\n";
    if(results.projectedNeededScore === null){
      message += "Projected Grade Needed: 0%"; 
    }
    else{
      message += ("Projected Grade Needed: " + results.projectedNeededScore + "%");
    }

    alert(message);
  }

  render() {
    return (
      <div className="Assignment">
        <h2>
          <form>
            <label>
              Current Homework Grade (10%):&nbsp;&nbsp;
          <input type="text" name="name" onChange={this.handleChange(0)}/>
            </label>
          </form>
        </h2>
        <h2>
          < form>
            <label>
              Current Midterm Grade (30%):&nbsp;&nbsp;
          <input type="text" name="name" onChange={this.handleChange(1)}/>
            </label>
          </form>
        </h2>
        <h2>
          < form>
            <label>
              Current Quizzes Grade (20%):&nbsp;&nbsp;
          <input type="text" name="name" onChange={this.handleChange(2)}/>
            </label>
          </form>
        </h2>
        <h2>
          < form>
            <label>
              Current Final Grade (40%):&nbsp;&nbsp;
          <input type="text" name="name" onChange={this.handleChange(3)}/>
            </label>
          </form>
        </h2>
        <h2>
          < form>
            <label>
              Final Grade You Want (0-100%):&nbsp;&nbsp;
          <input type="text" name="name" onChange={this.handleChange(4)}/>
            </label>
          </form>
        </h2>
        <form onSubmit = {this.submitGrades}>
        <input type="submit" value="Calculate!" />
        </form>
      </div>
    );
  }
}

export default calculatorInterface;
