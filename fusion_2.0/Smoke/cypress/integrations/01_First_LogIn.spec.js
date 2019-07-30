/**
Author:  		Georgy Malakyan
Date: 			07/23/2019
Purpose:		Verifies the fusion first GUI login
Script Name:	01_First_LogIn.spec.js

 Needed vars is described in ../support/commands.js
**/

var ADMIN_USER = "admin";
var DEFAULT_PASS = "fusion";
var FUSION_PASS = "Nexenta@1";

describe('FusionUI First Login and Change Password', function() {

    it('CXXXXXX First Accept EULA and login', function () {

        cy.visit('https://' + Cypress.env("FUSION_IP") + ':' + Cypress.env("FUSION_PORT"));
        cy.get('.img-login-logo').should("be.visible")
        cy.contains("Nexenta Fusion").should("be.visible")

        // Change default password to new one
        cy.get('.button-primary').click();
        cy.get('#username').type(ADMIN_USER).should('have.value', ADMIN_USER);
        cy.get('#password').type(DEFAULT_PASS);
        cy.get('.button-login').click();
        cy.get('#old-pass').type(DEFAULT_PASS);
        cy.get('#new-pass').type(FUSION_PASS);
        cy.get('#new-pass-repeat').type(FUSION_PASS);
        cy.get('.button-primary').click();

        // Check logged user
        cy.get('.site-header-username').should('contain', ADMIN_USER);
    })
});