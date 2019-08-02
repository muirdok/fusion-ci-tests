/**
 Author:  		Georgy Malakyan
 Date: 			07/23/2019
 Purpose:		Verifies the fusion first GUI login
 Script Name:	02_Fusion_Interfaces.spec.js

 Needed vars is described cypress.json
 **/

describe('FusionUI Login', function() {

    before(()=>{
        cy.login()
    });

    it('CXXXXXX Login to fusion with added NS appliance', function() {
    cy.get('body').wait(2000).then(($body)=> {
        if($body.text().includes(Cypress.env("NS_ADMIN_USER"))){
            cy.get('.appliance-title-link').contains(Cypress.env("NS_HOSTNAME")).click()
        } else{
            cy.get('.appliance-title-link').contains(Cypress.env("NS_HOSTNAME")).click()
        }})
    })
});