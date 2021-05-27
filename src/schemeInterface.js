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
            university: '',
            course: '',
            professor: '',
        };

        this.handleChange = this.handleChange.bind(this);
    }
    
    handleChange(event) {
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
                var i = 0;
                while (i < this.state.ids.length)
                {
                    if (this.state.ids[i] === parseInt(event.target.className))
                    {
                        break;
                    }
                    i++
                }
                var newCategories = this.state.categories.slice();
                newCategories.splice(i, 1, {name:event.target.value, weight:this.state.categories[i]['weight']});
                this.setState({categories:newCategories});
                break;
            case 'Weight':
                var i = 0;
                while (i < this.state.ids.length)
                {
                    if (this.state.ids[i] === parseInt(event.target.className))
                    {
                        break;
                    }
                    i++
                }
                var newCategories = this.state.categories.slice();
                newCategories.splice(i, 1, {name:this.state.categories[i]['name'], weight:event.target.value});
                this.setState({categories:newCategories});
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
        if (valid && notEmpty && hasCategories && sumTo100){
        const scheme = { 
            owner:sessionStorage.getItem('user').split(',')[0],
            university:this.state.university,
            professor:this.state.professor,
            class:this.state.course,
            categories:this.state.categories
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

    reset() {
        this.setState(() => ({
            categories: [],
            ids: []
        })); 
    }

    render() {
        return(
            <div>
                <h1>
                    Build Your Scheme:
                    <div>
                    </div>
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
                        <>
                        <Category onChange={this.handleChange} inputName={element['name']} inputWeight={element['weight']} key={'Category' + this.state.ids[index]} name={this.state.ids[index]}></Category>
                         <button type='button' key={'Button' + this.state.ids[index]} name={'Button' + this.state.ids[index]} onClick={() => {this.removeCategory(this.state.ids[index])}}>
                        Delete Category
                        </button><br></br> </>
                        )
                        })}
                    </form>

                    <button type='button' onClick={() => {this.addCategory()}}>
                    Add Category
                    </button>
                    <button type='button' onClick={() => {this.reset()}}>
                    Reset
                    </button>
                    <button type='button' onClick={() => {this.postScheme()}}>
                    Upload Scheme
                    </button>
                </h1>
            </div>
        );
    }
}

class Category extends React.Component {
    constructor(props) {
        super(props);        
    }

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

export default schemeInterface