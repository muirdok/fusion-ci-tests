/**
 Author:  		Georgy Malakyan
 Date: 			07/23/2019
 Purpose:       All Global vars should be stored here
                same for reusable functions
 Script Name:	commands.js

 **/

Cypress.Commands.add('login', function () {
    cy.visit('');
    cy.get('.img-login-logo').should("be.visible");
    cy.contains("Nexenta Fusion").should("be.visible");
    cy.get('#username').type(Cypress.env("FUSION_ADMIN_USER")).should('have.value', Cypress.env("FUSION_ADMIN_USER"));
    cy.get('#password').type(Cypress.env("FUSION_PASS"));
    cy.contains('Login').should('not.be.disabled').click();
    cy.get('.site-header-username').should('contain', Cypress.env("FUSION_ADMIN_USER"));
});

