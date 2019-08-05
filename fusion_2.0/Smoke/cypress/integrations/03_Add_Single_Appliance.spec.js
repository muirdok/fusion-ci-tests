/**
 Author:  		Georgy Malakyan
 Date: 			07/23/2019
 Purpose:		Verifies the fusion first GUI login
 Script Name:	03_Add_Single_Appliance.spec.js

 Needed vars is described cypress.json
 **/

describe('FusionUI Login', function() {

    before(()=>{
        cy.login()
    });

    it('C756036 Add appliance without license', function() {
        cy.contains('You currently have no registered appliances').should("be.visible");
        cy.contains('Register Appliance').click();
        cy.get('#nodeIp').type(Cypress.env("NS_APPLIANCE"));
        cy.contains('Continue').click();
        //NS Creds and certificate
        cy.get('#username').type(Cypress.env("NS_ADMIN_USER"));
        cy.get('#password').type(Cypress.env("NS_ADMIN_PASS"));
        cy.get('.indicator').click();
        cy.contains('Continue').click();
        // License error
        cy.contains('License Error').should("be.visible");
        cy.contains('Go to appliance').click();
        // Checking statuses
        cy.contains(Cypress.env("NS_HOSTNAME"));
        cy.contains('connected');
        cy.get('.appliance-license > span').should('contain', "License invalid!");
        // Unregister appliance
        cy.get('.button-icon').click();
        cy.get('.text-error > span').click();
        cy.get('.button-danger').click();
        cy.contains('You currently have no registered appliances').should("be.visible")
    });

    it('C756037 Add appliance and license it', function() {
        cy.contains('You currently have no registered appliances').should("be.visible");
        cy.contains('Register Appliance').click();
        cy.get('#nodeIp').type(Cypress.env("NS_APPLIANCE"));
        cy.contains('Continue').click();
        // time issue
        //cy.contains('Yes').click();
        //NS Creds and certificate
        cy.get('#username').type(Cypress.env("NS_ADMIN_USER"));
        cy.get('#password').type(Cypress.env("NS_ADMIN_PASS"));
        cy.get('.indicator').click();
        cy.contains('Continue').click();
        // License error
        cy.contains('License Error').should("be.visible");
        // License it!
        cy.contains('Update license').click();
        cy.get('.field-text').type(Cypress.env("KEY"));
        cy.contains('OK').click();
        // Check it
        cy.contains('License has been successfully activated').should("be.visible")
    })
});