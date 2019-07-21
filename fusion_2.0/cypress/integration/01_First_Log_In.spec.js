/**
Author:  		George Navarro
Date: 			09/21/2018
Purpose:		Verifies the fusion GUI login/logout functionality
Script Name:		0_FusionLoginLogOut.spec.js

Execution Level:	georgeee,smoke,functional,full
Component:		GUI
Sub-Component:		login
Fusion version:		1.x
Nexentastor version:
    Fusion type:		OVA
Priority:		High
Description:		fusion GUI login/logout

--------Update the following section if updates are made to this script
Script revision:        1.0
Revised by:             George Navarro
Author_email:           George.navarro@nexenta.com
Rev_by_email:           George.navarro@nexenta.com


 Needed vars:
**/
var FUSION_ADMIN_USER = "admin";
var FUSION_DEFAULT_PASS = "nexenta";
var FUSION_PASS = "Nexenta@1";
var FUSION_IP = Cypress.env("FUSION_IP");
var FUSION_PORT = Cypress.env("FUSION_PORT");
var NS_APPLIANCE = Cypress.env("NS_APPLIANCE");


describe('FusionUI First Login and Change Password', function() {

    it('C709423 First Accept URL and login', function() {
        cy.wait(20000)  //SHOULD REMOVE IT IN FUTURE
        cy.visit('https://'+FUSION_IP+':'+FUSION_PORT)
        cy.get('.button-primary').click()
        cy.get('#username').type(FUSION_ADMIN_USER).should('have.value', FUSION_ADMIN_USER)
        cy.get('#password').type(FUSION_DEFAULT_PASS)
        cy.get('.button-login').click()

        cy.get('#old-pass').type(FUSION_DEFAULT_PASS)
        cy.get('#new-pass').type(FUSION_PASS)
        cy.get('#new-pass-repeat').type(FUSION_PASS)
        cy.get('.button-primary').click()
        cy.get('.site-header-username').should('contain', FUSION_ADMIN_USER)
    });
});