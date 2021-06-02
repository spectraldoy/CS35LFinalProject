import '../../App.css';
import React from 'react';
import axios from 'axios';
import {Link} from 'react-router-dom';
import { Button, Grid, Input, InputLabel } from '@material-ui/core';
import { fade, withStyles, createStyles } from '@material-ui/core/styles';
import clsx from 'clsx';

const hc = getComputedStyle(document.documentElement).getPropertyValue('--highlight-color');

const styles = createStyles({
    colorButton: {
        fullWidth: true,
        backgroundColor: fade(hc, 0.15),
        '&:hover': {
            backgroundColor: fade(hc, 0.55),
        }
      },
      buttonGrid: {
        justify:'center',
        alignItems:'center',
        spacing:2
      }
});

class schemeInterface extends React.Component {
    
    categoriesCreated = 0;
    letterGradesCreated = 0;

    constructor(props) {
        super(props);
        this.state = {
            categories: [],
            ids: [],
            letterGrades: [],
            letterGradeIds: [],
            university: sessionStorage.getItem('university'),
            course: '',
            professor: '',
        };

        this.handleChange = this.handleChange.bind(this);
    }
    
    handleChange(event) {
        let i, newGrades, newCategories;
        switch (event.target.name.split(',')[0])
        {
            case 'University':
                this.setState({university: event.target.value});
                break;
            case 'Course':
                this.setState({course: event.target.value});
                break;
            case 'Professor':
                this.setState({professor: event.target.value});
                break;
            case 'Name':
                i = parseInt(event.target.name.split(',')[1]);
                newCategories = this.state.categories.slice();
                newCategories.splice(i, 1, {name:event.target.value, weight:this.state.categories[i]['weight']});
                this.setState({categories:newCategories});
                break;
            case 'Weight':
                i = parseInt(event.target.name.split(',')[1]);
                newCategories = this.state.categories.slice();
                newCategories.splice(i, 1, {name:this.state.categories[i]['name'], weight:event.target.value});
                this.setState({categories:newCategories});
                break;
            case 'Letter':
                i = parseInt(event.target.name.split(',')[1]);
                newGrades = this.state.letterGrades.slice();
                newGrades[i].letter = event.target.value;
                this.setState({letterGrades: newGrades});
                break;
            case 'Cutoff':
                i = parseInt(event.target.name.split(',')[1]);
                newGrades = this.state.letterGrades.slice();
                newGrades[i].cutoff = event.target.value;
                this.setState({letterGrades: newGrades});
                break;
            default:
                break;
        }
    }
    

    postScheme() {      
        var sum = 0;
        var valid = true;
        var notEmpty = true;
        var hasCategories = true;
        var sumTo100 = true;
        var error = false;
        for (var i = 0; i < this.state.categories.length; i++)
        {
            if (this.state.categories[i]['weight'] === '' || this.state.categories[i]['name'] === '')
            {
                notEmpty = false;
            }
            if (parseFloat(this.state.categories[i]['weight']) <= 0)
            {
                valid = false;
            }
            sum += parseFloat(this.state.categories[i]['weight']);
        }

        if ((this.state.university === '' || this.state.course === '' || this.state.professor === '' || !notEmpty) && !error)
        {
            notEmpty = false;
            error = true;
            alert('Please fill out all fields before submitting!');
        }
        if (this.state.categories.length === 0 && !error)
        {
            hasCategories = false;
            error = true;
            alert('Must have at least one category!');
        }
        if (!valid && !error)
        {
            error = true;
            alert('Invalid inputs!');
        }
        if (Math.abs(sum - 100) > 1e-6 && !error)
        {
            sumTo100 = false;
            error = true;
            alert('Weights must add up to 100!');
        }

        for (const pair of this.state.letterGrades) {
            if (pair.letter === '') {
                alert('One of the letter grades does not have a name!');
                return;
            }
            else if (!isNaN(parseFloat(pair.letter))) {
                alert('A letter grade cannot be a number');
                return;
            }
            const cutoffNum = parseFloat(pair.cutoff);
            if (isNaN(parseFloat(cutoffNum))) {
                alert("Cutoff entered for " + pair.letter + " is not a number");
                return;
            }
            else if (cutoffNum < 0 || cutoffNum > 100) {
                if (!window.confirm("Expected a cutoff from 0-100 but received " + cutoffNum + ". Would you like to proceed anyways?")) {
                    return;
                }
            }
        }

        if (valid && notEmpty && hasCategories && sumTo100){
            var temp = this.state.letterGrades.slice();
            temp.sort((a, b) => {return b.cutoff - a.cutoff;}); // performs subtraction as numbers

            const scheme = { 
                owner: sessionStorage.getItem('user'),
                university: this.state.university,
                professor: this.state.professor,
                class: this.state.course,
                categories: this.state.categories,
                letterGrades: temp,
            }

            axios.post('http://localhost:3001/grading_schemes', scheme)
            .catch(error => {
                this.setState({ errorMessage: error.message });
                console.error('There was an error!', error);
            });
            alert('Submitted grading scheme!');
        }
    }

    addCategory() {
        var num = this.categoriesCreated++;
        this.setState(() => ({
            categories: [...this.state.categories, {name:'', weight:0}],
            ids: [...this.state.ids, num]
        }));
    }

    addLetterGrade() {
        var num = this.letterGradesCreated++;
        this.setState(() => ({
            letterGrades: [...this.state.letterGrades, {letter:'', cutoff:0}],
            letterGradeIds: [...this.state.letterGradeIds, num]
        }));
    }

    removeCategory(i) {
        var newCategories = this.state.categories.slice();
        newCategories.splice(i, 1);
        var newIds = this.state.ids.slice();
        newIds.splice(i, 1);
        
        this.setState(() => ({
            categories:newCategories,
            ids:newIds
        }));
    }

    removeLetterGrade(i) {
        var newGrades = this.state.letterGrades.slice();
        newGrades.splice(i, 1);
        var newIds = this.state.letterGradeIds.slice();
        newIds.splice(i, 1);

        this.setState(() => ({
            letterGrades : newGrades, 
            letterGradeIds: newIds
        }));
    }

    reset() {
        this.setState(() => ({
            categories: [],
            ids: []
        })); 
    }

    resetLetterGrades() {
        this.setState(() => ({
            letterGrades: []
        })); 
    }

    render() {
        const { classes } = this.props;
        return(
            <div>
                <h1>
                    Build Your Scheme:
                </h1>
                <h2>
                    <form>
                    <Grid container justify='center' alignItems='center' spacing={4} direction='column'>
                        <Grid item>
                            <InputLabel htmlFor='University'>University</InputLabel><br></br>
                            <Input type='text' value={this.state.university} id='University' name='University' onChange={this.handleChange}></Input><br></br>
                        </Grid>
                        <Grid item>
                            <InputLabel htmlFor='Course'>Course</InputLabel><br></br>
                            <Input type='text' value={this.state.course} id='Course' name='Course' onChange={this.handleChange}></Input><br></br>
                        </Grid>
                        <Grid item>
                            <InputLabel htmlFor='Professor'>Professor</InputLabel><br></br>
                            <Input type='text' value={this.state.professor} id='Professor' name='Professor' onChange={this.handleChange}></Input><br></br>
                        </Grid>
                        <Grid item>
                            Categories<br></br>
                        </Grid>
                        <Grid item>
                            <Grid container justify='center' alignItems='center' spacing={4} direction='column'>
                            {this.state.categories.map((element, index) => {
                                return(
                                <Grid item>
                                    <div key={'Category' + this.state.ids[index]}>
                                <Grid container justify='center' alignItems='center' spacing={4} direction='column'>
                                    <Grid item>
                                        <Category onChange={this.handleChange} inputName={element['name']} inputWeight={element['weight']} name={"" + index}></Category> 
                                    </Grid>
                                    <Grid item>
                                        <Button className={clsx(classes.colorButton, classes.hc)} type='Button' key={'Button' + this.state.ids[index]} name={'Button' + this.state.ids[index]} onClick={() => {this.removeCategory(index)}}>
                                        Delete Category
                                        </Button><br></br> 
                                    </Grid>
                                </Grid>
                                </div>
                                </Grid>
                            ) 
                            })}
                            </Grid>
                        </Grid>
                        </Grid>
                    </form>
                </h2>
                <div>
                    <Grid container justify='center' alignItems='center' spacing={2}>
                        <Grid item>
                            <Button className={clsx(classes.colorButton, classes.hc)} type='Button' onClick={() => {this.addCategory()}}>
                            Add Category
                            </Button>
                        </Grid>
                        <Grid item>
                            <Button className={clsx(classes.colorButton, classes.hc)} type='Button' onClick={() => {this.reset()}}>
                            Reset
                            </Button>
                        </Grid>
                        <Grid item>
                            <Button className={clsx(classes.colorButton, classes.hc)} type='Button' onClick={() => {this.postScheme()}}>
                            Upload Scheme
                            </Button>
                        </Grid>
                    </Grid>
                </div>
                <h2>
                <Grid container justify='center' alignItems='center' spacing={4} direction='column'>
                    <Grid item>
                    <form>
                    <Grid container justify='center' alignItems='center' spacing={4} direction='column'>
                    <Grid item>
                        Enter Grade Cutoffs:<br></br>
                    </Grid>
                    <Grid item>
                        <Grid container justify='center' alignItems='center' spacing={4} direction='column'>
                            {this.state.letterGrades.map((element, index) => {
                                    return(
                                    <Grid item>
                                        <div key={'Letter' + this.state.letterGradeIds[index]}>
                                        <Grid container justify='center' alignItems='center' spacing={4} direction='column'>
                                        <Grid item>
                                            <LetterGrade onChange={this.handleChange} inputName={element['letter']} inputWeight={element['cutoff']} name={index}></LetterGrade>
                                        </Grid>
                                        <Grid item>
                                        <Button className={clsx(classes.colorButton, classes.hc)} type='Button' key={'Button' + this.state.letterGradeIds[index]} name={'Button' + this.state.letterGradeIds[index]} onClick={() => {this.removeLetterGrade(index)}}>
                                        Delete Grade
                                        </Button><br></br> 
                                        </Grid>
                                        </Grid>
                                    </div>   
                                    </Grid>
                                )
                            })}
                        </Grid>
                    </Grid>
                    </Grid>
                    </form>
                    </Grid>
                    <Grid item>
                        <Grid container justify='center' alignItems='center' spacing={2}>
                            <Grid item>
                                <Button className={clsx(classes.colorButton, classes.hc)} type='Button' onClick={() => {this.addLetterGrade()}}>
                                Add
                                </Button>
                            </Grid>
                            <Grid item>
                                <Button className={clsx(classes.colorButton, classes.hc)} type='Button' onClick={() => {this.resetLetterGrades()}}>
                                Reset
                                </Button>
                            </Grid>
                        </Grid>
                    </Grid>
                </Grid>
                </h2>
                <Link to="/">
                <Button className={clsx(classes.colorButton, classes.hc)} type='Button'>
                    Return to dashboard
                </Button>
                </Link>
            </div>
        );
    }
}

class Category extends React.Component {
    render() {
        return(
            <>
            <Grid container justify='center' alignItems='center' spacing={2}>
            <Grid item>
            <InputLabel>Name </InputLabel><br></br>
            <Input defaultValue={this.props.inputName} type='text' name={'Name,' + this.props.name} onChange={this.props.onChange}></Input><br></br>
            </Grid>
            <Grid item>
            <InputLabel>Weight </InputLabel><br></br>
            <Input defaultValue={this.props.inputValue} type='number' name={'Weight,' + this.props.name} onChange={this.props.onChange}></Input><br></br>
            </Grid>
            </Grid>
            </>
        );
    }
}

class LetterGrade extends React.Component {
    render() {
        return(
            <>
            <Grid container justify='center' alignItems='center' spacing={2}>
            <Grid item>
            <InputLabel>Letter Grade </InputLabel><br></br>
            <Input defaultValue={this.props.inputName} type='text' name={'Letter,' + this.props.name} onChange={this.props.onChange}></Input><br></br>
            </Grid>
            <Grid item>
            <InputLabel>Score </InputLabel><br></br>
            <Input defaultValue={this.props.inputValue} type='number' name={'Cutoff,' + this.props.name} onChange={this.props.onChange}></Input><br></br>
            </Grid>
            </Grid>
            </>
        );
    }
}

export default withStyles(styles)(schemeInterface);