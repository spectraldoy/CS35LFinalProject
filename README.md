# Foxtrot

<img src="./public/logo.png" width=278 height=256>

Foxtrot is an app for university students, a platform for us to create and share grading schemes for exams, assignments and courses. Never again will you or your peers have to waste time and risk error calculating by hand what you need on your final to score that A+.

## How to run Foxtrot on your machine

### Get the code

Clone the repository, `cd` into it if necessary, and install the requirements (assuming you already have [npm](https://www.npmjs.com/get-npm) installed on your machine):
```shell
git clone https://github.com/spectraldoy/CS35LFinalProject
cd ./CS35LFinalProject
npm install
```

### Connect to the Database

If you do not already have a MongoDB Atlas account, create one [here](https://www.mongodb.com/).

Create a new project and navigate to the Clusters tab under DATA STORAGE. Click the "Create a New Cluster" button and choose a provider for your database (currently, the app has only been tested with AWS) and create your cluster.

Return to the Clusters page and click on the CONNECT button for your newly created cluster. 

On the "Setup connection security" step, you may want to specify 0.0.0.0/0 as a connection address to simplify access through various networks. Additionally, remember to save your username and password for the cluster.

Once on the "Choose a connection method" step, select the "Connect your application" option. From there, choose "Node.js" as the driver and "3.6 or later" as the version. Copy the provided connection string to your clipboard.

Now, within the root directory of the cloned repository, create a file called ".env". Within it, define the variable `DB_CONNECTION_STRING` to be the string you copied from MongoDB. An example .env file would look like this (all on one line):
```
DB_CONNECTION_STRING = "mongodb+srv://username:password@schemedata.zculb.mongodb.net/myFirstDatabase?retryWrites=true&w=majority"
```
Make sure to substitute in your cluster username and password into the string.

The database should now be ready for use.

### Run the app

In the root directory, simply run:
```bash
npm run dev
```
and you should be good to go (you may need to create an account). Note that it make take some time for npm start the server.

## Technology Stack
This project was bootstrapped with [Create React App](https://github.com/facebook/create-react-app), using [Express](https://expressjs.com/) to route GET and POST requests to our [MongoDB](https://www.mongodb.com/) collections. Our user interface was made possible by [Material UI](https://material-ui.com/), and special thanks to [a friend](https://www.instagram.com/zuu_xzsf/) for designing our logo.

## Creators
This CS35L Spring 2021 Final Project is brought to you by:

[Eric Gan](https://github.com/egan8888) \
[Aaron Isara](https://github.com/aaisara12) \
[Zehua Tan](https://github.com/zehuatan) \
[Steven Zhang](https://github.com/steveez123) \
[Aditya Gomatam](https://github.com/spectraldoy)
