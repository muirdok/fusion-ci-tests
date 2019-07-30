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

    it('CXXXXXX Check fusion default interfaces', function() {
        //Login
        cy.visit('https://'+Cypress.env("FUSION_IP")+':'+Cypress.env("FUSION_PORT"))
        cy.get('#username').type(ADMIN_USER).should('have.value', ADMIN_USER);
        cy.get('#password').type(FUSION_PASS);
        cy.get('.button-login').click()

        // Check logged user
        cy.get('.site-header-username').should('contain', ADMIN_USER);

        //Check appliances page
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

    it("Should validate the main menu cog wheel", function () {
        cy.get('.site-nav-settings').click({force:true})
    });


    it("Should validate the first section of About screen", function () {
        cy.get('.site-nav-child-item').eq(0).contains('About Fusion').click()
        cy.get('.modal-title').contains('About NexentaFusion')
        cy.contains('NexentaFusion Version 2.0.0.dev')
        cy.contains('Copyright 2014 - 2019 Ⓡ')
        cy.get(':nth-child(5)').contains("support@nexenta.com")

    });


  /*  it("Should ping community.nexenta.com is alive and returns status code 200", function () {
        cy.get(':nth-child(6)').contains("http://community.nexenta.com").request('http://community.nexenta.com').then((response)=>
        {
            expect(response.status).to.eq(200)
        })

    });*/

    it("Should validate About screen expands", function () {
        var i=0;   // click the down arrow key 3 times
        for (i=0; i < 3 ; i++) {
            cy.get('.button-icon').eq(1).click()
        }

    });

    // Verify expanded section of EULA

/*    it("Should ping nexenta.com is alive and returns status code 200", function () {
        cy.contains("http://www.nexenta.com/").request("http://www.nexenta.com/").then((response)=>
        {
            expect(response.status).to.eq(200)
        })

    });*/

    it("Should verify expanded section of EULA", function () {
        cy.contains('Nexenta End User License Agreement (EULA')
        cy.contains('Last updated: April 26, 2018')
        cy.contains('Nexenta End User License Agreement © 2013 – 2018 Nexenta Systems, Inc. All rights reserved. Nexenta is a registered trademark of Nexenta Systems, Inc. in the US and other countries')
        cy.contains('Close').click()
    })

});