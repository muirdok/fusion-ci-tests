/**	
Author:			George Navarro
Date: 			10/23/2018
Purpose:		Verify the import pool functioanlity in fusion UI
Script Name:		11B_FusionImportPool.spec.js

Execution Level:	functional,full
Component:		POOL
Sub-Component:		
Fusion version:		1.x
Nexentastor version:	
Fusion type:		OVA
Priority:		High

--------Update the following section if updates are made to this script
Script revision:        1.0
Revised by:             George Navarro
Author_email:           George.navarro@nexenta.com
Rev_by_email:           George.navarro@nexenta.com

*/	


describe('FusionUI Import Pool', function() {

/// <reference types="cypress" />
	
	before('Logs into fusion via HTPPS', function() {
			cy.fusion_httpsLogin();
	})

	    it('fusion https login', function() {  
	        cy.visit('list')    
	    })	

	//SETUP - REGISTER APPLIANCE
	
		it('Verifies if appliance is already registered', function() {  
	
			cy.get('#fus-body.site-main-body').wait(2000).then(($body)=> {
				if($body.text().includes(Cypress.env('NS_SINGLE_NAME'))){
					cy.get('.appliance-title-link').contains(Cypress.env('NS_SINGLE_NAME')).click()
				} else{
					cy.FusionRegisterAppliance();
					cy.get('.appliance-title-link').contains(Cypress.env('NS_SINGLE_NAME')).click()
				}
			})
		})		
	//SETUP - POOL CHECK and EXPORT
		it('SETUP - Verifies if Pool1 is already created', function() {
			cy.contains('Management').click() 
			cy.get('#fus-body.site-main-body').wait(2000).then(($body)=> {
					if($body.text().includes('Pool1')){
					} else{
						cy.FusionCreateNonMirroredPool();
						cy.get('.button-secondary').contains("Refresh").click()
						cy.wait(2000)
					}
				})
				cy.FusionExportNonMirroredPool();
			})
	
	//SETUP - END OF SETUP
		
		it('Import pool in FusionUI', function() {
			 cy.contains('Management').click()
			 cy.wait(4000)
			 //cy.get('[type="checkbox"]').check({force:true})
			 cy.get('.field-switch > .indicator').click()
			 cy.wait(1000)
			 cy.contains('Refresh').click()
			 cy.wait(4000)
			 cy.get('.button-icon').eq(5).click()
			 cy.get('.button-link').contains('Import').click()
			 cy.get('.modal-title').contains('Import Pool')
			 cy.get('.field-label').contains('Pool name')
			 cy.get('#poolName').clear()
			 cy.get('#poolName').type("Pool1")
		 	 cy.get('.button-secondary').contains('Cancel')
			 cy.get('.button-primary').contains('Import').click()
			 cy.wait(4000)
			 //cy.get('[type="checkbox"]').check("Yes")
			 //cy.get('[type="checkbox"]').check({force:true})
			 //cy.get(':nth-child(2) > :nth-child(7) > .button-icon').click({force:true})
			 //cy.contains('Import').click()
		})
		
		it('Verify pool information is displayed in main pool screen', function() {
			cy.contains('Refresh').click()
			cy.wait(5000)
			//cy.get('.page-section').contains("Pool1")
			//cy.get('.page-section').contains("online")
			cy.get('td').eq(0).contains("Pool1")
			cy.get('td').eq(1).contains("online")
			cy.get('td').eq(2).should('not.be.empty')
			//cy.get('td').eq(10).expect('.capacity-bar-free').to.exist   //Need to figure out how to check for these bars
			//cy.get('td').eq(11).contains("")
			cy.get('td').eq(5).contains("none")
			cy.url().should('include','pools/list')  //Ensure pools list screen is displayed
			
		})
})
