import './App.css';
import React from 'react';
import axios from 'axios';
import { render } from 'react-dom/cjs/react-dom.development';

class schemeInterface extends React.Component {
    
    componentDidMount() {
        console.log('Component Mounted');
    }

    render() {
        console.log('Render Called')
        return(
            <div>
                <Scheme></Scheme>
            </div>
        );
    }

}

class Scheme extends React.Component {
    //Used as a key for categories
    categoriesCreated = 0;
    
    //May be better to not have button in categories, and instead use the map() function when rendering
    //May be better to use controlled components instead of DOM
    constructor(props) {
        super(props);
        this.state = {
            categories: [],
            ids: []
        };
    }

    postScheme() {
        var university = document.getElementById('University').value;
        var professor = document.getElementById('Professor').value;
        var course = document.getElementById('Course').value;
        var categoryNames = document.getElementsByClassName('Name');
        var categoryWeights = document.getElementsByClassName('Weight');
        var categories = [];
        for (var i = 0; i < categoryNames.length; i++)
        {
            categories.push({name:categoryNames[i].value, weight:categoryWeights[i].value});
        }

        const scheme = { 
            university:university,
            professor:professor,
            class:course,
            categories: categories
         }
         console.log(JSON.stringify(scheme));
         console.log('POST Called')
         axios.post('http://localhost:3001/grading_schemes', scheme)
         .catch(error => {
            this.setState({ errorMessage: error.message });
            console.error('There was an error!', error);
        });
    }

    addCategory() {
        var num = this.categoriesCreated++;
        this.setState(() => ({
            categories: [...this.state.categories, <Category key={'Category' + num}></Category>, 
            <> <button type="button" key={'Button' + num} onClick={() => {this.removeCategory(num)}}>
            Delete Category
            </button><br></br> </>],
            ids: [...this.state.ids, num, num]
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
        newCategories.splice(i, 2);
        var newIds = this.state.ids.slice();
        newIds.splice(i, 2);
        
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
                        <label htmlFor="University">University</label><br></br>
                        <input type="text" id="University" name="University"></input><br></br>
                        <label htmlFor="Course">Course</label><br></br>
                        <input type="text" id="Course" name="Course"></input><br></br>
                        <label htmlFor="Professor">Professor</label><br></br>
                        <input type="text" id="Professor" name="Professor"></input><br></br>
                        Categories:<br></br>
                        {this.state.categories}
                    </form>
                    
                    <button type="button" onClick={() => {this.addCategory()}}>
                    Add Category
                    </button>
                    <button type="button" onClick={() => {this.reset()}}>
                    Reset
                    </button>
                    <button type="button" onClick={() => {this.postScheme()}}>
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

    componentDidMount() {
        
    }

    componentWillUnmount() {

    }
    
    render() {
        return(
            <>
            <label>Name </label><br></br>
            <input type="text" className="Name" id="Name" name="Name"></input><br></br>
            <label>Weight </label><br></br>
            <input type="number" className="Weight" id="Weight" name="Weight" min='0' max='100'></input><br></br>
            </>
        );
    }
}


export default schemeInterface