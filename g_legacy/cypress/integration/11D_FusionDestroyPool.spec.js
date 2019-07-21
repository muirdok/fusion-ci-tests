/**	
Author:			George Navarro
Date: 			09/15/2018
Purpose:                Verify the pool destroy functionality of fusion UI
Script Name:            11D_FusionDestroyPool.spec.js

Execution Level:        smoke,functional,full
Component:              POOL 
Sub-Component:          
Fusion version:         1.x
Nexentastor version:
Fusion type:            OVA
Priority:               High

--------Update the following section if updates are made to this script
Script revision:        1.0
Revised by:             George Navarro
Author_email:           George.navarro@nexenta.com
Rev_by_email:           George.navarro@nexenta.com


*/

describe('FusionUI Destroy Pool', function() {
		
/// <reference types="cypress" />
	
	before('Logs into fusion via HTPPS', function() {
			cy.fusion_httpsLogin();
	})

	    it('SETUP - fusion https login', function() {  
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


		it('C714064 Destroys pool in FusionUI', function() {
			cy.get('.button-icon').eq(5).click()
			cy.get('.button-link').contains("Destroy").click()
			cy.get('.modal-title').contains("Destroy Pool:")
			cy.get('.field-checkbox > .indicator').click()
			cy.contains('Are you sure you want to destroy pool')
			cy.contains('Force any active datasets contained within the pool to be unmounted')
			cy.get('.button-secondary').contains("Cancel") // Confirms the Cancel button is displayed
			cy.get('.button-danger').click() //confirm destroying pool
	})
	
		it('Verifies Pool1 is no longer displayed in pool screen', function() {
			cy.url().should('include', 'pools/list')
			cy.wait(2000).get('#fus-body.site-main-body').should('not.have','Pool1')
		})
})
