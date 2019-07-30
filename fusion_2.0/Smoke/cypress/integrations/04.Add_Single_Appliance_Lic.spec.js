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
        cy.get('[data-ng-click="register.showNodeAddressForm()"]').click();
        cy.get('#nodeIp').type(Cypress.env("NS_APPLIANCE"));
        cy.get('.grid-row > .text-right > .button-primary').click();
        cy.get('.button-danger').click();

        // Set username\pass etc.
        cy.get('#username').type(ADMIN_USER);
        cy.get('#password').type(DEFAULT_NS_PASS);
        cy.get('.indicator').click();
        cy.get('.grid-row > .text-right > .button-primary').click();

        // Activate appliance when GET GOLDEN KEY
        cy.get('.img-error-big').should('be.visible');
        cy.url().should('include','/license-invalid');
        cy.get('.button-primary').click();
        cy.get('.field-text').type(GOLDEN_KEY);
        cy.get('.text-right > .button-primary').click();
        cy.contains('License has been successfully activated')

    });


});