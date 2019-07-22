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

var FUSION_ADMIN_USER = "admin";
var FUSION_DEFAULT_PASS = "nexenta";
var FUSION_PASS = "Nexenta@1";

describe('FusionUI Login', function() {

    it('CXXXXXX Login to fusion', function() {
        cy.visit('https://'+Cypress.env("FUSION_IP")+':'+Cypress.env("FUSION_PORT"))
        cy.get('#username').type(FUSION_ADMIN_USER).should('have.value', FUSION_ADMIN_USER);
        cy.get('#password').type(FUSION_PASS);
        cy.get('.button-login').click()
    });

    it('CXXXXXX Add Appliance', function() {
        cy.get('[data-ng-click="register.showNodeAddressForm()"]').click();
        cy.get('#nodeIp').type(Cypress.env("NS_APPLIANCE"));
        cy.get('.grid-row > .text-right > .button-primary').click();
        cy.get('#username').type(FUSION_ADMIN_USER);
        cy.get('#password').type(FUSION_DEFAULT_PASS);
        cy.get('.indicator').click()
        cy.get('.grid-row > .text-right > .button-primary').click()
        cy.get('.button-danger').click()
    });


});