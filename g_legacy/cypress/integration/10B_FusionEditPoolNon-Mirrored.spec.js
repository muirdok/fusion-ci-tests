/**    	
Author:  		George Navarro
Date: 			2/27/2019
Purpose:		Verify the edit pool flow in fusion UI
Script Name:		10B_FusionEditPoolNon-Mirrored.spec.js

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
    

describe('FusionUI Edit Pool', function() {

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
                cy.get('.appliance-title-link').contains(Cypress.env('NS_SINGLE_NAME')).click({force:true})
            } else{
                cy.FusionRegisterAppliance();
                cy.get('.appliance-title-link').contains(Cypress.env('NS_SINGLE_NAME')).click({force:true})
            }
        })
    })    

	/*it('SETUP - Verifies if Pool1 is already created', function() {
		cy.contains('Management').click() 
		cy.get('#fus-body.site-main-body').wait(2000).then(($body)=> {
				if($body.text().includes('Pool1')){
				} else{
					cy.CLIPoolCreate_Pool1();
					cy.get('.button-secondary').contains("Refresh").click()
					cy.wait(2000)
				}
			})
	})*/

//END OF SETUP    

    	it('C714051 Verify navigation to Management tab in FusionUI', function() {
        	cy.contains('Management').click()
    	})

    it('Verify Pools screen information', function() {
        cy.get('h2').contains(Cypress.env('NS_SINGLE_NAME'))
        cy.get('.appliance-status').contains("connected")
        cy.url().should('include', '/pools/list')
    })
    
    
    it('Verifies if Pool1 is already created', function() {  
        
        cy.get('#fus-body.site-main-body').wait(2000).then(($body)=> {
            if($body.text().includes('Pool1')){
                cy.FusionDestroyPool_Pool1();  //Destroys existing Pool1 to and creates a new pool
                cy.FusionCreateNonMirroredPool()
            } else{
                cy.FusionCreateNonMirroredPool() //if Pool1 does not exist, create Pool1
            }
        })
    })
    
    
    it('Verify Pool edit flow', function() {        
        cy.get('.button-icon').eq(5).click()
        cy.get('.button-link').eq(1).contains("Edit").click()
        //cy.get('.page-sub-header-title').contains("EDIT POOL:")
        cy.wait(4000).get('.disk-icon-action').eq(0).click()
        cy.get('.dropdown').should('be.visible')
        cy.get('.button-link').eq(2).contains("Replace").click()
       // cy.get('.indicator').eq(0).click()
        cy.wait(4000).get('.disk-item-controls-action').eq(5).click({force:true})
        cy.get('.modal-title').contains("Confirm")
        cy.contains("Are you sure you want to replace")
        cy.get('.button-secondary').contains("Cancel")
        cy.get('.button-danger').contains("Yes").click()
    })

    it('Verify pool information is displayed in main pool screen', function() {
        cy.wait(2000).url().should('include', 'poolName=Pool1')
        cy.get('.button-secondary').contains("Close").click()
        cy.url().should('include','pools/list')  //Ensure pools list screen is displayed
        cy.get('td').eq(0).contains("Pool1")
        cy.get('td').eq(1).contains("online")
        cy.get('td').eq(2).should('not.be.empty')
        cy.get('td').eq(5).contains("none")
        cy.url().should('include','pools/list')  //Ensure pools list screen is displayed
    })

//CLEANUP

	it('CLEANUP-Destroy Pool1', function() {
            //cy.CLIPoolDestroy_Pool1();
            cy.FusionDestroyPool_Pool1();
    	})
})
