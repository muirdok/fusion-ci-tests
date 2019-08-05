/**
Author:  		Georgy Malakyan
Date: 			07/23/2019
Purpose:		Init Login with EULA etc.
Script Name:	01_Init_Login.spec.js

 Needed vars is described in cypress.json
**/

describe('FusionUI check, first login and change password', function() {
    beforeEach(()=>{
      cy.visit('')
    });

    it('C689659 First login redirect to EULA. EULA is OK and could be accepted', function () {
        cy.url().should('include', '#!/eula');
        cy.get('.img-login-logo').should("be.visible");
        cy.contains("Nexenta Fusion").should("be.visible");
        cy.contains('Last updated: April 26, 2018');
        cy.contains('Accept').should('not.be.disabled')
    });

    it('C689660 Accept EULA and check login', function () {
        cy.wait(2000);
        cy.get('.login-container').scrollTo('bottom');
        cy.contains('Accept').click();
        cy.url().should('include', '#!/login');
        cy.get('.img-login-logo').should("be.visible");
        cy.contains("Nexenta Fusion").should("be.visible");
    });

    it('C689661 Change default password and logout', function () {
        cy.contains('Login').should('be.disabled');
        cy.get('#username').type(Cypress.env("FUSION_ADMIN_USER")).should('have.value', Cypress.env("FUSION_ADMIN_USER"));
        cy.get('#password').type(Cypress.env("FUSION_DEFAULT_PASS"));
        cy.contains('Login').should('not.be.disabled').click();
        cy.contains('Save').should('be.disabled');
        cy.get('#old-pass').type(Cypress.env("FUSION_DEFAULT_PASS"));
        cy.contains('Save').should('be.disabled');
        cy.get('#new-pass').type(Cypress.env("FUSION_PASS"));
        cy.contains('Save').should('be.disabled');
        cy.get('#new-pass-repeat').type(Cypress.env("FUSION_PASS"));
        cy.contains('Save').should('not.be.disabled').click();
        cy.wait(2000);
        cy.get('.site-header-username').should('contain', Cypress.env("FUSION_ADMIN_USER"));
        cy.get('.site-nav-settings').click({force:true});
        cy.contains('Logout').click();
        cy.url().should('include', '#!/logout');
    });

    it('C689662 Login and Logout', function () {
        cy.get('.img-login-logo').should("be.visible");
        cy.contains("Nexenta Fusion").should("be.visible");
        cy.get('#username').type(Cypress.env("FUSION_ADMIN_USER")).should('have.value', Cypress.env("FUSION_ADMIN_USER"));
        cy.get('#password').type(Cypress.env("FUSION_PASS"));
        cy.contains('Login').should('not.be.disabled').click();
        cy.get('.site-header-username').should('contain', Cypress.env("FUSION_ADMIN_USER"));
        cy.get('.site-nav-settings').click({force:true});
        cy.contains('Logout').click();
        cy.url().should('include', '#!/logout');
    });
});