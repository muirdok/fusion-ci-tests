/**	
Author:  		George Navarro
Date: 			09/13/2018
Purpose:		Verify the create pool flow using fusion UI
Script name:		10A_FusionCreatePoolNon-Mirrored.spec.ms

Execution Level:	georgeee,smoke,functional,full
Component:		POOL
Sub-Component:		management
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

	
describe('FusionUI CreatePool', function() {

/// <reference types="cypress" />
	
	before('Logs into fusion via HTPPS', function() {
			cy.fusion_httpsLogin();
	})

	it('SETUP - fusion https login', function() {  
	    cy.visit('list')    
	})	

//SETUP - VERIFY IF APPLIANCE IS REGISTERED 

	it('SETUP - Verifies if appliance is already registered', function() {
		cy.get('#fus-body.site-main-body').wait(6000).then(($body)=> {
			if($body.text().includes(Cypress.env('NS_SINGLE_NAME'))){
				cy.get('.appliance-title-link').contains(Cypress.env('NS_SINGLE_NAME')).click()
			} else{
				cy.FusionRegisterAppliance();
				cy.get('.appliance-title-link').contains(Cypress.env('NS_SINGLE_NAME')).click()
			}
		})
	})


//END OF SETUP	 

	it('C714038 Verify navigation to Management tab in FusionUI', function() {
		cy.contains('Management').click()
	})

	it('Verify Pools screen information', function() {
		cy.get('.appliance-switch-selected-appliance').should('be.visible')
		cy.get('.img-appliance').should('be.visible')
		cy.get('h2').contains(Cypress.env('NS_SINGLE_NAME'))
		cy.get('.appliance-status').contains("connected")
		cy.get('.button-secondary').contains("Refresh").click()
		cy.get('.page-sub-header-title').contains('Pools')  // Verify Pool screen title
		cy.contains('Pool Name')
		cy.contains('Health')
		cy.get('.grid-col-4').contains('Configured Capacity')
		cy.get('.grid-col-7').contains('Allocated/Free')
		cy.get('.grid-col-2').contains('Raw % Utilized')
		cy.contains('Redundancy')
		cy.get('.grid-col-1')
	})
	
//SETUP - VERIFY IF POOL1 IS CREATED

	it('SETUP-Verifies if Pool1 is already created', function() {  
		
		cy.get('#fus-body.site-main-body').wait(2000).then(($body)=> {
			if($body.text().includes('Pool1')){
				cy.FusionDestroyPool_Pool1();  //Destroys existing Pool1 to and forces the pool creation flow
				cy.get('.button-primary').contains('Create Pool').click()
			} else{
				cy.get('.button-primary').contains('Create Pool').click()  //if Pool1 does not exist, create Pool1, skips to pool create flow
			}
		})
	})

//END OF SETUP

	it('Verify Create Pool flow', function() {		
		cy.get('.grid-col-17').should('be.visible')
		cy.contains('Pool name')     //Verify the pool creation screen column titles 
		cy.contains('Allow inactive devices')
		cy.contains('Build method')
		cy.get('.grid-col-9').contains('Drives')
		cy.contains('Total Installed')
		cy.contains('Allocated Space')
		cy.contains('Available Space')
		cy.contains('Total Drives')
		cy.contains('Available Drives')
		cy.get('#poolName').type("Pool1")  //Enter pool name
		cy.get(':nth-child(4) > .field-wrapper > .select > .select-controls > .button-select')
		cy.contains('Manual')
		cy.contains('Auto').click({force:true})
		cy.contains("Auto-Select Data vDevs for Pool: Pool1")
		cy.wait(2000)
		cy.get(':nth-child(1) > .text-center > .field-checkbox > .indicator')
		//cy.get(':nth-child(1) > .text-center > .field-checkbox > .indicator').click()
		cy.get('.flex-col-4 > .field-wrapper > .field-switch > .indicator').click()
		cy.get('.button-select').eq(0).click()
		cy.get('.select-list-item').eq(0).click()
		cy.get('#redundancy > .select-controls > .button-select')
		cy.contains('Stripe').click({force:true})
		cy.get('#maxDevicesNumber').type("1")
		cy.get('.grid-col-2 > .button-primary').click()
		cy.get('.disks-cart-options > .select > .select-controls > .button-select')
		cy.contains('Next').click()
		cy.get(':nth-child(2) > [data-ng-show="vm.pool.cache.skip"]')
		cy.contains('Skip').click()
		cy.get('.button-primary').click({multiple:true,force:true})
		//cy.get(':nth-child(2) > [data-ng-show="vm.appliance.versions.nef.gte('5.2.0') ? vm.pool.log[0].skip : vm.pool.log.skip"]').click()
		//cy.get(':nth-child(2) > [data-ng-show="vm.pool.cache.skip"]').click()
		//cy.get(':nth-child(2) > [data-ng-show="vm.pool.spare.skip"]').click()
		cy.get(':nth-child(3) > .button-primary').click({force:true})
		//cy.contains('Pools')  //Verify the pool list view is displayed after pool creation screen
		//cy.contains('Navarro')   //Verify pool Navarro was created
	})
		 
	it('Verify pool information is displayed in main pool screen', function() {
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
	
	it('Verify if pool exists proper message is displayed', function() {
		cy.get('.button-primary').contains('Create Pool').click()
		cy.get('#poolName').type("Pool1")  //Enter pool name
		cy.get(':nth-child(4) > .field-wrapper > .select > .select-controls > .button-select')
		cy.contains('Manual')
		cy.contains('Auto').click({force:true})
		cy.get('.modal-body').should('be.visible')
		cy.contains("Auto-Select Data vDevs for Pool: Pool1")
		//cy.get(':nth-child(1) > .text-center > .field-checkbox > .indicator').click()
		cy.get(':nth-child(1) > .text-center > .field-checkbox > .indicator')
		//cy.get('#size > .select-dropdown > .select-list > :nth-child(1) > .select-list-item > .ng-binding').click({force:true})
		//cy.get('#redundancy > .select-controls > .button-select')
		//cy.get('#redundancy > .select-controls > .button-select > .value')
		cy.get('.flex-col-4 > .field-wrapper > .field-switch > .indicator').click()
		cy.get('.button-select').eq(0).click()
		cy.get('.select-list-item').eq(0).click()
		cy.get('#redundancy > .select-controls > .button-select')
		cy.contains('Stripe').click({force:true})
		cy.get('#maxDevicesNumber').type("1")
		cy.get('.grid-col-2 > .button-primary').click()
		cy.get('.disks-cart-options > .select > .select-controls > .button-select')
		cy.contains('Next').click()
		cy.get(':nth-child(2) > [data-ng-show="vm.pool.cache.skip"]')
		cy.contains('Skip').click()
		cy.get('.button-primary').click({multiple:true,force:true})
		cy.get(':nth-child(3) > .button-primary').click({force:true})
		cy.contains("Error (EEXIST)")
		cy.contains("Pool Pool1 already exists")
		cy.get('.button-secondary').contains("Close").click()
	})
	
	it('Verify the Confirm Cancel screen is displayed', function() {
		cy.wait(2000).get('.button-secondary').contains("Cancel pool").click({force:true})
		cy.contains("Confirm Cancel")
		cy.contains("Are you sure you want to cancel pool creation?")
		cy.contains("No")
		cy.get('.button-danger').contains("Yes").click()
	})
		
	it('Verify the pools list screen is displayed', function() {
		cy.url().should('include','pools/list')
	})

	it('CLEANUP--Destroys Pool1 via UI/CLI', function() {
		cy.FusionDestroyPool_Pool1();
        })

})
