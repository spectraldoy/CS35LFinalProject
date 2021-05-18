import './App.css';
import React from 'react';
import axios from 'axios';
import { render } from 'react-dom/cjs/react-dom.development';
//import Scheme from '../model/scheme.js'; // Error:  Module not found: You attempted to import ../model/scheme.js which falls outside of the project src/ directory. Relative imports outside of src/ are not supported.
//scheme.js must be within the same folder

class schemeInterface extends React.Component {
    
//TODO: delete button, reset button
//back button/homepage/dashboard button

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
    constructor(props) {
        super(props);
        this.state = {
            categories: []
        };
    }

    postScheme() {
        var university = document.getElementById('University').value;
        var course = document.getElementById('Course').value;
        var professor = document.getElementById('Professor').value;
        var categoryNames = document.getElementsByClassName('Name');
        var categoryWeights = document.getElementsByClassName('Weight');
        var categories = [];
        for (var i = 0; i < categoryNames.length; i++)
        {
            categories.push({name:categoryNames[i].value, weight:categoryWeights[i].value});
        }

        const scheme = { 
            uni:university,
            course:course,
            prof:professor,
            categories: categories
         }
         console.log(JSON.stringify(scheme));
         console.log('POST Called')
         axios.post('http://localhost:3001/create_scheme', scheme)
         .catch(error => {
            this.setState({ errorMessage: error.message });
            console.error('There was an error!', error);
        });
    }

    addCategory() {
        this.setState(() => ({
            categories: [...this.state.categories, <Category></Category>]
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
                        {this.state.categories}
                    </form>
                    
                    <button type="button" onClick={() => {this.addCategory()}}>
                    Add Category
                    </button>
                    <button type="button" onClick={() => {this.postScheme()}}>
                    Upload Scheme:
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
    //must set up these because categories have lifecycle
    componentDidMount() {
        
    }

    componentWillUnmount() {

    }
    //need to create keys
    render() {
        return(
            <>
            <label>Name: </label><br></br>
            <input type="text" class="Name" id="Name" name="Name"></input><br></br>
            <label>Weight: </label><br></br>
            <input type="number" class="Weight" id="Weight" name="Weight" min='0' max='100'></input><br></br>
            </>
        );
    }

}

export default schemeInterface