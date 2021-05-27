import './App.css';
import React from 'react';
import axios from 'axios';

class schemeInterface extends React.Component {
    //Used as a key for categories
    categoriesCreated = 0;

    constructor(props) {
        super(props);
        this.state = {
            categories: [],
            ids: [],
            letterGrades: [],
            university: sessionStorage.getItem('user').split(',')[1],
            course: '',
            professor: '',
        };

        this.handleChange = this.handleChange.bind(this);
    }
    
    handleChange(event) {
        let i, newGrades;
        switch (event.target.name)
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
                i = 0;
                while (i < this.state.ids.length)
                {
                    if (this.state.ids[i] === parseInt(event.target.className))
                    {
                        break;
                    }
                    i++;
                }
                var newCategories = this.state.categories.slice();
                newCategories.splice(i, 1, {name:event.target.value, weight:this.state.categories[i]['weight']});
                this.setState({categories:newCategories});
                break;
            case 'Weight':
                i = 0;
                while (i < this.state.ids.length)
                {
                    if (this.state.ids[i] === parseInt(event.target.className))
                    {
                        break;
                    }
                    i++;
                }
                var newCategories = this.state.categories.slice();
                newCategories.splice(i, 1, {name:this.state.categories[i]['name'], weight:event.target.value});
                this.setState({categories:newCategories});
                break;
            case 'Letter':
                i = parseInt(event.target.className);
                newGrades = this.state.letterGrades.slice();
                newGrades[i].letter = event.target.value;
                this.setState({letterGrades: newGrades});
                break;
            case 'Cutoff':
                i = parseInt(event.target.className);
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
            if (parseInt(this.state.categories[i]['weight']) <= 0)
            {
                valid = false;
            }
            sum += parseInt(this.state.categories[i]['weight']);
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
        if (sum !== 100 & !error)
        {
            sumTo100 = false;
            error = true;
            alert('Weights must add up to 100!');
        }

        for (const pair of this.state.letterGrades) {
            if (pair.letter === '') {
                alert('One of the grade cutoffs does not have a name!');
                return;
            }
            else if (isNaN(parseFloat(pair.cutoff))) {
                alert("Cutoff entered for " + pair.letter + " is not a number");
                return;
            }
        }


        if (valid && notEmpty && hasCategories && sumTo100){
            const scheme = { 
                owner: sessionStorage.getItem('user').split(',')[0],
                university: this.state.university,
                professor: this.state.professor,
                class: this.state.course,
                categories: this.state.categories,
                letterGrades: this.state.letterGrades
            }


            //console.log(JSON.stringify(scheme));
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
        this.setState(() => ({
            letterGrades: [...this.state.letterGrades, {letter:'', cutoff:0}],
        }));
    }

    //Go through all ids and find the corresponding index that matches. Remove the Category and Id that matches.
    removeCategory(id) {
        var i = 0;
        while ( i < this.state.ids.length)
        {
            if (this.state.ids[i] === id)
            {
                break;
            }
            i++
        }
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

        this.setState(() => ({
            letterGrades : newGrades, 
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
        return(
            <div>
                <h1>
                    Build Your Scheme:
                </h1>
                <h2>
                    <form>
                        <label htmlFor='University'>University</label><br></br>
                        <input type='text' value={this.state.university} id='University' name='University' onChange={this.handleChange}></input><br></br>
                        <label htmlFor='Course'>Course</label><br></br>
                        <input type='text' value={this.state.course} id='Course' name='Course' onChange={this.handleChange}></input><br></br>
                        <label htmlFor='Professor'>Professor</label><br></br>
                        <input type='text' value={this.state.professor} id='Professor' name='Professor' onChange={this.handleChange}></input><br></br>
                        Categories<br></br>
                        {this.state.categories.map((element, index) => {
                            return(
                            <div key={'Category' + this.state.ids[index]}>
                            <Category onChange={this.handleChange} inputName={element['name']} inputWeight={element['weight']} name={this.state.ids[index]}></Category>
                            <button type='button' key={'Button' + this.state.ids[index]} name={'Button' + this.state.ids[index]} onClick={() => {this.removeCategory(this.state.ids[index])}}>
                            Delete Category
                            </button><br></br> 
                            </div>
                        )
                        })}
                    </form>
                </h2>
                <div>
                    <button type='button' onClick={() => {this.addCategory()}}>
                    Add Category
                    </button>
                    <button type='button' onClick={() => {this.reset()}}>
                    Reset
                    </button>
                    <button type='button' onClick={() => {this.postScheme()}}>
                    Upload Scheme
                    </button>
                </div>
                <h2>
                    Enter Grade Cutoffs:
                    <form>
                    {this.state.letterGrades.map((element, index) => {
                            return(
                            <div key={'Letter' + index}>
                            <LetterGrade onChange={this.handleChange} inputName={element['letter']} inputWeight={element['cutoff']} name={index}></LetterGrade>
                            <button type='button' key={'Button' + index} name={'Button' + index} onClick={() => {this.removeLetterGrade(index)}}>
                            Delete Grade
                            </button><br></br> 
                            </div>
                        )
                    })}
                    </form>
                    <button type='button' onClick={() => {this.addLetterGrade()}}>
                    Add
                    </button>
                    <button type='button' onClick={() => {this.resetLetterGrades()}}>
                    Reset
                    </button>
                </h2>
            </div>
        );
    }
}

class Category extends React.Component {
    render() {
        return(
            <>
            <label>Name </label><br></br>
            <input defaultValue={this.props.inputName} type='text' className={this.props.name} name='Name' onChange={this.props.onChange}></input><br></br>
            <label>Weight </label><br></br>
            <input defaultValue={this.props.inputValue} type='number' className={this.props.name} name='Weight' onChange={this.props.onChange}></input><br></br>
            </>
        );
    }
}

class LetterGrade extends React.Component {
    render() {
        return(
            <>
            <label>Letter Grade </label><br></br>
            <input defaultValue={this.props.inputName} type='text' className={this.props.name} name='Letter' onChange={this.props.onChange}></input><br></br>
            <label>Score </label><br></br>
            <input defaultValue={this.props.inputValue} type='number' className={this.props.name} name='Cutoff' onChange={this.props.onChange}></input><br></br>
            </>
        );
    }
}

export default schemeInterface