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
 Priority:           Hyght
 Description:		fusion GUI First Login with password changing from default

 Needed vars is described in ../support/commands.js
 **/

var ADMIN_USER = "admin";
var DEFAULT_NS_PASS = "nexenta";
var FUSION_PASS = "Nexenta@1";
var GOLDEN_KEY = Cypress.env("KEY");

describe('FusionUI Login', function() {

    it('CXXXXXX Login to fusion', function() {
        cy.visit('https://'+Cypress.env("FUSION_IP")+':'+Cypress.env("FUSION_PORT"))
        cy.get('#username').type(ADMIN_USER).should('have.value', ADMIN_USER);
        cy.get('#password').type(FUSION_PASS);
        cy.get('.button-login').click()
    });

    it('CXXXXXX Add Appliance', function() {
        cy.contains('You currently have no registered appliances').should("be.visible")
        cy.contains('Register Appliance').click();
        cy.get('#nodeIp').type(Cypress.env("NS_APPLIANCE"));
        cy.contains('Continue').click();
        // time issue
        //cy.contains('Yes').click();
        //NS Creds and certificate
        cy.get('#username').type(ADMIN_USER);
        cy.get('#password').type(DEFAULT_NS_PASS);
        cy.get('.indicator').click();
        cy.contains('Continue').click();
        // License error
        cy.contains('License Error').should("be.visible");
        // License it!
        cy.contains('Update license').click();
        cy.get('.field-text').type(GOLDEN_KEY);
        cy.contains('OK').click()
        // Check it
        cy.contains('License has been successfully activated').should("be.visible")

    });


});