/**	
Author:  		George Navarro
Date: 			09/13/2018
Purpose:                Verify the pool status screen of fusion UI
Script Name:            11C_FusionPoolStatusScreen.spec.js

Execution Level:        functional,full
Component:              POOL
Sub-Component:          
Fusion version:         1.x
Nexentastor version:
Fusion type:            OVA
Priority:               Medium

--------Update the following section if updates are made to this script
Script revision:        1.0
Revised by:             George Navarro
Author_email:           George.navarro@nexenta.com
Rev_by_email:           George.navarro@nexenta.com


*/	
	
describe('FusionUI Pool status screen', function() {

/// <reference types="cypress" />
	
	before('Logs into fusion via HTPPS', function() {
			cy.fusion_httpsLogin();
	})

	    	it('SETUP-fusion https login', function() {  
	        	cy.visit('list')    
	    	})

	//SETUP - REGISTER APPLIANCE
	
		it('SETUP-Verifies if appliance is already registered', function() {  
	
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
	
		it('Verifies the pool status link in FusionUI', function() {
			cy.contains('Management').click()
			cy.get('.button-icon').eq(5).click()
			cy.contains('Status').click()
			cy.get('.modal-header').contains("Status of Pool:")
		
			cy.get('.tab-title').contains("Info")
			cy.get('.panel-body').should('be.visible')
			
			cy.get('.tab-title').contains('Disks').click()
			cy.get('[data-heading="Disks"]').should('be.visible')
			cy.contains("Show Indicators").click()
			cy.contains("Hide Indicators").click()
		
			cy.get('.tab-title').contains('Properties').click()
			//cy.get('[data-heading="Properties"]').should('be.visible')
			cy.get('.panel-heading').contains("Unmap Settings")
			cy.get('.panel-collapse').first().click()
			cy.get('.panel-expand').first().click()
			cy.get('.panel-heading').contains("Advanced Settings")
			cy.get('.panel-expand').last().click()
			cy.get('.panel-collapse').last().click()
			
			cy.get('.button-primary').contains('Close').click()
			 
		})
		
		it('Verifies the pool misc link in FusionUI', function() {
		
			cy.wait(2000)
			cy.get('.button-icon').eq(5).click()    //Verify the Properties
			cy.contains('Properties').click()
			cy.contains('Close').click()
			cy.wait(2000)
			cy.get('.button-icon').eq(5).click()     //Verify Clear errors
			cy.contains('Clear errors').click()
			cy.wait(2000)
			cy.get('.button-icon').eq(5).click()     //Edit Pool
			//cy.get(':nth-child(2) > .button-link > [translate=""] > .ng-scope')
			cy.contains('Edit').click()
			cy.contains('Close').click()
			cy.contains('Pools')    //Verify the pools list screen is displayed
		})

		it('CLEANUP--Destroys Pool1 via CLI', function() {
			cy.FusionDestroyPool_Pool1();
        	})
})
