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
// Cypress.Commands.add("login", (email, password) => { ... })
//
//
// -- This is a child command --
// Cypress.Commands.add("drag", { prevSubject: 'element'}, (subject, options) => { ... })
//
//
// -- This is a dual command --
// Cypress.Commands.add("dismiss", { prevSubject: 'optional'}, (subject, options) => { ... })
//
//
// -- This is will overwrite an existing command --
// Cypress.Commands.overwrite("visit", (originalFn, url, options) => { ... })

Cypress.Commands.add('fusion_httpsLogin', function () {
    sessionStorage.clear();
    return cy.request({
        method: "POST",
        url: 'https://fusion:8443/auth/login', //Need to use port 8443 for HTTPS calls
        failOnStatusCode: false,
        headers: {
            'Content-type': 'application/json'
        },
        body: {
            "username": "admin",
            "password": "Nexenta@1"
        }
    })
        .then((res) => {
            sessionStorage['ngStorage-jwt'] = JSON.stringify(res.body.token);
            sessionStorage['ngStorage-user'] = JSON.stringify({
                "username": "admin",
                "provider": "localUsers",
                "name": "admin",
                "level": "admin",
                "groups": [],
                "isGuest": false,
                "changePassword": false
            })
        })

});