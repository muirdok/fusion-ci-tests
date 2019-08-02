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
var POOL_NAME = "kek";
var FUSION_PASS = "Nexenta@1";

describe('FusionUI Login', function() {

    it('CXXXXXX Login to fusion with added NS appliance', function() {
        cy.visit('https://'+Cypress.env("FUSION_IP")+':'+Cypress.env("FUSION_PORT"))
        cy.get('#username').type(ADMIN_USER).should('have.value', ADMIN_USER);
        cy.get('#password').type(FUSION_PASS);
        cy.get('.button-login').click();

        cy.contains('NOS').should("be.visible");
        cy.contains('connected').should("be.visible")
    });

    it('CXXXXXX Open appliance and create a sripe pool "kek"', function() {
        cy.contains('NOS').click();
        cy.contains('Management').click();
        cy.contains('Pools').click();
        cy.get('.button-primary').click();
        cy.get('#poolName').type(POOL_NAME).should('have.value', POOL_NAME);
        cy.contains('Select build method').click();
        cy.contains('Manual').click();
        cy.get('.modal-title').should("be.visible");
        cy.get('.button-danger').should("be.visible").click();
        cy.contains('Select redundancy').click();
        cy.contains('Stripe').click();

        //Select disk
        cy.wait(4000)
        cy.get(':nth-child(3) > .disk-item > [data-ng-if="disk.viewMode === \'table\'"] > .disk-item-controls > .disk-item-controls-action').click()
        // Next
        cy.get('.button-primary').click();
        cy.get(':nth-child(2) > [data-ng-show="vm.pool.cache.skip"]').should("be.visible").click();
        cy.get(':nth-child(2) > [data-ng-show="vm.appliance.versions.nef.gte(\'5.2.0\') ? vm.pool.log[0].skip : vm.pool.log.skip"]').should("be.visible").click();
        cy.get(':nth-child(2) > [data-ng-show="vm.pool.spare.skip"]').should("be.visible").click();
        cy.get(':nth-child(3) > .button-primary').should("be.visible").click();

        cy.contains('kek');
        cy.get(':nth-child(1) > :nth-child(2) > .text-success > :nth-child(1) > .grid-col-18')
            .should("be.visible")
            .should('contain', "online");
        cy.contains('30.76 GiB').should("be.visible")
    });
});