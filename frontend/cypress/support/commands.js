// ***********************************************
// This example commands.js shows you how to
// create various custom commands and overwrite
// existing commands.
//
// For more comprehensive examples of custom
// commands please read more here:
// https://on.cypress.io/custom-commands
// ***********************************************
//
//
// -- This is a parent command --
// Cypress.Commands.add('login', (email, password) => { ... })
//
//
// -- This is a child command --
// Cypress.Commands.add('drag', { prevSubject: 'element'}, (subject, options) => { ... })
//
//
// -- This is a dual command --
// Cypress.Commands.add('dismiss', { prevSubject: 'optional'}, (subject, options) => { ... })
//
//
// -- This will overwrite an existing command --
// Cypress.Commands.overwrite('visit', (originalFn, url, options) => { ... })

// import firebase from "firebase/compat/app";
// import "firebase/compat/auth";
// import "firebase/compat/database";
// import "firebase/compat/firestore";
// import { attachCustomCommands } from "cypress-firebase";

// const firebaseConfig = {
//   apiKey: "AIzaSyAjRtHES5VJEZ-3gcGXdnO9bFHraNZA5kU",
//   authDomain: "weather-app-dp-fc92c.firebaseapp.com",
//   projectId: "weather-app-dp-fc92c",
//   storageBucket: "weather-app-dp-fc92c.appspot.com",
//   messagingSenderId: "1095726876056",
//   appId: "1:1095726876056:web:a9f2f26a0b14ae31c3d7ed",
//   serviceAccount: require("../serviceAccount.json"),
// };

// firebase.initializeApp(firebaseConfig);

// attachCustomCommands({ Cypress, cy, firebase });
