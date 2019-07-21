/**	
Author:  		George Navarro
Date: 			09/13/2018
Purpose:		Verify the export functionality in fusion UI
Script Name:		11A_FusionExportPool.spec.js

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
	
describe('FusionUI Export Pool', function() {

/// <reference types="cypress" />
	
	before('Logs into fusion via HTPPS', function() {
			cy.fusion_httpsLogin();
	})

	it('fusion https login', function() {  
	     cy.visit('list')    
	})	
		
//SETUP - REGISTER APPLIANCE, VERIFY IF POOL1 IS CREATED
	
	it('SETUP - Verifies if appliance is already registered', function() {  
	
		cy.get('#fus-body.site-main-body').wait(2000).then(($body)=> {
			if($body.text().includes(Cypress.env('NS_SINGLE_NAME'))){
				cy.get('.appliance-title-link').contains(Cypress.env('NS_SINGLE_NAME')).click()
			} else{
				cy.FusionRegisterAppliance();
				cy.get('.appliance-title-link').contains(Cypress.env('NS_SINGLE_NAME')).click()
			}
		})
	})		
	
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
		})		


//SETUP - END OF SETUP 
		
			
 	it('Exports pool in FusionUI', function() {
		 cy.get('.button-icon').eq(5).click()
		 cy.get('.button-link').contains('Export').click()
		 cy.get('.modal-title').contains('Confirm Pool Export')
		 cy.contains('Are you sure you want to export pool?')
		 cy.contains('Note: Any active datasets contained within the pool will be unmounted.')
		 cy.get('.button-secondary').contains('Cancel')
		 cy.get('.button-danger').contains('Yes').click()
		
	})
	
	it('Verifies Pool1 is no longer displayed in pool screen', function() {
		cy.url().should('include', 'pools/list')
		cy.wait(2000).get('#fus-body.site-main-body').should('not.have','Pool1')
	})
	
	it('Verifies Pool1 is displayed if show exported pools is clicked', function() {
		cy.get('.field-switch').contains("No")
		cy.get('.indicator').eq(0).click()
		cy.get('.field-switch').contains("Yes")
		cy.get('#fus-body.site-main-body')
		cy.wait(5000).contains('Pool1').should('be.visible')
	})
	
	it('CLEANUP--Imports Pool1 and then destroys Pool1 via CLI', function() {
		//cy.CLIPoolImport_Pool1();
		//cy.CLIPoolDestroy_Pool1();
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
		cy.FusionDestroyPool_Pool1();
        })

})
