# TrackItUp Proposal

## Team Workflow Strategy

We will be using the methodology of Feature Branching wherein the master branch will be updated when the corresponding feature branch is tested and is ready without any errors.

## General Responsibilities


Each member of the team is responsible for working on a individual feature or functionality

#### **TEAM:**
1. Will B. - Backend Framework
2. Monisha S. - Frontend Framework
3. Yashwanth T. - Frontend Framework

## Development Tools:
* IDE - Visual Studio Code
* Frontend - HTML5, CSS3,
* Backend - Node.js (Server-side language), SQLite (Database), passport.js(Authentication)
* Infrastructure - Docker, arbitrary cloud provider

## Entity Relation Diagram
![ER Diagram](./assets/er-diagram.png)

## How to Build / Run Development Server
```bash
#clone repository
git clone https://github.com/UIC-CS484/assignment-2---final-project-repository-team17.git
cd assignment-2---final-project-repository-team17

##  install dependencies
npm i

## run dev Server
nodemon npm start
```

## Charting
Chart is generated using data from [imdb-api.com](imdb-api.com) while using [chart.js](https://www.chartjs.org/docs/latest/) to render the chart

This chart shows the top 250 popular movies a long with their rankings so user can discover a new movie to watch.

You can view this chart at /chart or http://localhost:3000/chart when running in development mode.
