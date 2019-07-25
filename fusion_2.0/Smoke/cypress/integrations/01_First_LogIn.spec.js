/**
Author:  		Georgy Malakyan
Date: 			07/23/2019
Purpose:		Verifies the fusion first GUI login
Script Name:	01_First_LogIn.spec.js

Execution Level:    smoke
Component:		    GUI
Sub-Component:		1st_login
Fusion version:		1.x
Nexentastor vers:   .x
usion type:         Any
Priority:           Hight
Description:		fusion GUI First Login with password changing from default

 Needed vars is described in ../support/commands.js
**/

var FUSION_ADMIN_USER = "admin";
var FUSION_DEFAULT_PASS = "fusion";
var FUSION_PASS = "Nexenta@1";

describe('FusionUI First Login and Change Password', function() {

    it('CXXXXXX First Accept URL and login', function() {
        cy.wait(20000); //SHOULD REMOVE IT IN FUTURE
        cy.visit('https://'+Cypress.env("FUSION_IP")+':'+Cypress.env("FUSION_PORT"));
        cy.get('.button-primary').click();
        cy.get('#username').type(FUSION_ADMIN_USER).should('have.value', FUSION_ADMIN_USER);
        cy.get('#password').type(FUSION_DEFAULT_PASS);
        cy.get('.button-login').click();

        cy.get('#old-pass').type(FUSION_DEFAULT_PASS);
        cy.get('#new-pass').type(FUSION_PASS);
        cy.get('#new-pass-repeat').type(FUSION_PASS);
        cy.get('.button-primary').click();
        cy.get('.site-header-username').should('contain', FUSION_ADMIN_USER)
    });
});