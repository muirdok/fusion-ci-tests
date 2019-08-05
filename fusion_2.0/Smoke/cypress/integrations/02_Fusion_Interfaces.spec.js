/**
 Author:  		Georgy Malakyan
 Date: 			07/23/2019
 Purpose:		Verifies the fusion first GUI login
 Script Name:	02_Fusion_Interfaces.spec.js

 Needed vars is described cypress.json
 **/

describe('FusionUI Default interfaces', function() {

    before(()=>{
        cy.login()
    });

    it('C756031 Check fusion default interfaces', function() {

        //Check appliances pages
        cy.url().should('include','/list')
        cy.get('.heading3 > span').should('contain', "Appliances");

        cy.visit('alerts/alerts');
        cy.url().should('include','/alerts/alerts')

        cy.visit('logs/logs');
        cy.url().should('include','/logs/logs')

        cy.visit('analytics');
        cy.url().should('include','/analytics')

        cy.visit('list');
        cy.url().should('include','/list')
    });

    it("C756032 Should validate the main menu cog wheel", function () {
        cy.get('.site-nav-settings').click({force:true})
    });

    it("C756033 Should validate the first section of About screen", function () {
        cy.get('.site-nav-child-item').eq(0).contains('About Fusion').click()
        cy.get('.modal-title').contains('About NexentaFusion')
        cy.contains('NexentaFusion Version 2.0.0.dev')
        cy.contains('Copyright 2014 - 2019 Ⓡ')
        cy.get(':nth-child(5)').contains("support@nexenta.com")

    });

    it("C756034 Should validate About screen expands", function () {
        var i=0;   // click the down arrow key 3 times
        for (i=0; i < 3 ; i++) {
            cy.get('.button-icon').eq(1).click()
        }

    });

    it("C756035 Should verify expanded section of EULA", function () {
        cy.contains('Nexenta End User License Agreement (EULA')
        cy.contains('Last updated: April 26, 2018')
        cy.contains('Nexenta End User License Agreement © 2013 – 2018 Nexenta Systems, Inc. All rights reserved. Nexenta is a registered trademark of Nexenta Systems, Inc. in the US and other countries')
        cy.contains('Close').click()
    })

});