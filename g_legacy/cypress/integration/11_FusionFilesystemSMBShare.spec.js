/**	
Author:		 	George Navarro
Date: 			09/23/2018
Purpose:		Verify the fusion UI functionality for the filesystem SMB shares
Script Name:		11_FusionFilesystemSMBShare.spec.js

Execution Level:	functional,full
Component:		FILESYSTEMS
Sub-Component:		management
Fusion version:		1.x
Nexentastor version:	
Fusion type:		OVA
Priority:		High

--------Update the following section if updates are made to this script
Script revision:       	1.0
Revised by:     	George Navarro
Author_email:   	George.navarro@nexenta.com
Rev_by_email:   	George.navarro@nexenta.com



*/	
	
describe('FusionUI Create filesystem', function() {

/// <reference types="cypress" />
	
	before('Logs into fusion via HTPPS', function() {
			cy.fusion_httpsLogin();
	})

	it('SETUP-fusion https login', function() {  
	    cy.visit('list')    
	})
		
//SETUP - REGISTER APPLIANCE, CREATE NON MIRRORED POOL
		
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


	it('C714052 Verify navigation to Management/Filesystem in FusionUI', function() {
		cy.wait(2000).get('.side-menu').contains('Management').click()
		cy.get('.side-menu').contains('Filesystems').click()
	})
	
	it('Verify Filesystem screen table headers', function() {
		cy.get('th')
			.should(($th) => {
				expect($th.eq(1)).to.contain('Name')
				expect($th.eq(2)).to.contain('Available')
				expect($th.eq(3)).to.contain('Quota')
				expect($th.eq(4)).to.contain('Allocated')
				expect($th.eq(5)).to.contain('Used by Protection')
				expect($th.eq(6)).to.contain('Reduction Ratio')
				expect($th.eq(7)).to.contain('Rate Limit')
				expect($th.eq(8)).to.contain('NFS')
				expect($th.eq(9)).to.contain('SMB')
				expect($th.eq(10)).to.contain('Protection')
			})
	})
		
	it('Verify Filesystem cog wheel links', function() {
		//filesystem.tpl.dropdown
		//cy.get('.button-icon > [data-dropdown-template="filesystem.tpl.dropdown"]').click()  //Expands pool
		cy.get('[data-dropdown-template="filesystem.tpl.dropdown"]').first().click()
		cy.get('.button-link').eq(0).contains('Status')
		cy.get('.button-link').eq(2).contains('Properties')
		cy.get('.button-link').eq(1).contains('Add New Filesystem').click()
		
	})
	
	it('Verify Create Filesystem screen', function() {
		cy.contains('Create Filesystem in')
		cy.get('#name').type("Filesystem1")
		cy.get('#reservationSize')
		cy.get('.button-select').eq(0).click()  //Record size
			cy.contains("64.0 KiB").click()
		cy.get('#quotaSize')
		
		cy.get('.button-select').eq(1).click()  //Case sensitivity
			cy.get('.select-list-item').contains("sensitive")
			cy.get('.select-list-item').contains("insensitive")
			cy.get('.select-list-item').contains("mixed").click()
		
		cy.get('.button-select').eq(2).click()  //Unicode normalization mode
			cy.get('.select-list-item').contains("none")
			cy.get('.select-list-item').contains("formC")
			cy.get('.select-list-item').contains("formD")
			cy.get('.select-list-item').contains("formKC")
			cy.get('.select-list-item').contains("formKD").click()
		
		cy.get('.button-select').eq(3).click()  //Accept only UTF-8 characters
			cy.get('.select-list-item').contains("true")
			cy.get('.select-list-item').contains("false").click()
		
		cy.contains('Cancel')
		cy.get('.button-primary').contains("Create").click()
		
	})
	
	it('Verifies error message - utf8only must be set on if normalization chosen', function() {
		cy.get('.alert').contains("Failed to create dataset 'Pool1/Filesystem1': 'utf8only' must be set 'on' if normalization chosen")
	})
	
	it('Verifies error is cleared after normalization mode is set to none', function() {
		cy.get('.button-select').eq(2).click()  //Unicode normalization mode
		cy.get('.select-list-item').contains("none").click()
		cy.get('.button-primary').contains("Create").click()
	})
	
	it('Verify creation of share - SMB share link', function() {
		cy.wait(4000).get('.button-icon').eq(12).click()
			 cy.get('.dropdown-content').should('be.visible')
		cy.contains('Share Using SMB').click()
		
	})
	
	it('Verify create smb share screen', function() {
		cy.get('.modal-title').contains("Create SMB share for:")
		cy.get('#shareName').should('have.value', 'Pool1_Filesystem1')		
		cy.get('#shareDescription').type("SMB share")
		cy.contains('Share name')
		cy.contains('Description')
		cy.get('.button-primary').eq(0).contains('Show ACL')
		cy.get('.panel-title').contains("Advanced Options")  //Verify the advanced options screen
			cy.get('.button-icon.panel-expand').click()
			cy.get('.panel-body').should('be.visible')
			cy.get('.indicator-false').should('have.length',5)  //Verify the default values are off of all advanced options
			cy.get('.indicator').eq(1).click()  //Update option to On
			cy.get('.indicator').eq(2).click()  //Update option to On
			cy.get('.indicator').eq(3).click()  //Update option to On
			cy.get('.indicator').eq(4).click()  //Update option to On
			cy.get('.indicator').eq(5).dblclick()  //Update option to On, then off
			//cy.get('.indicator-false').should('have.length',1)  //Verify the that only 1 has a value of Off (index 5)  Need to fix this
			cy.get('.button-select').eq(0).click()
				cy.get('.select-dropdown').should('be.visible')  //Verify the client caching policy dropdown list
					cy.get('.select-list-item').eq(0).contains("manual")
					cy.get('.select-list-item').eq(1).contains("auto")
					cy.get('.select-list-item').eq(2).contains("vdo")
					cy.get('.select-list-item').eq(3).contains("disabled")
			//cy.get('.field-switch').eq(0).should('contain', 'On')
			//Allow guest access
			//Access-based enumeration
			//Encryption
			//Quota management
			//Continuous availability
			//Client caching policy
		cy.get('.button-secondary').contains('Cancel')
		cy.get('.button-primary').eq(1).contains('Save').click()
		
	})
	
	it('Verifes navigating to shares link', function() {
		cy.wait(4000)	
		cy.get('.page-header-nav-first').contains('Shared').click()
	})
	
	it('Verifes Shares table headers', function() {
		cy.get('th')
			.should(($th) => {
			expect($th.eq(0)).to.contain('Pool')
			expect($th.eq(1)).to.contain('Filesystem')
			expect($th.eq(2)).to.contain('Export Path')
			expect($th.eq(3)).to.contain('Share Name')
			expect($th.eq(4)).to.contain('Host Access List')
			expect($th.eq(5)).to.contain('NFS Status')
			expect($th.eq(6)).to.contain('SMB Status')
		})
	})
	
	it('Verifes share information is exposed in table', function() {
		cy.get('td')
			.should(($td) => {
			expect($td.eq(1)).to.contain('Pool1')
			expect($td.eq(2)).to.contain('Filesystem1')
			//expect($td.eq(3)).to.be.null  //NEED TO FIX
			expect($td.eq(4)).to.contain('Pool1_Filesystem1')
			//expect($td.eq(5)).to.be.null  //NEED TO FIX
			//expect($td.eq(6)).to.be.null  //NEED TO FIX
			expect($td.eq(7)).to.contain('online')
		})
	})
		
	it('Verifes editing SMB share link', function() {		
		cy.get('.button-secondary').click()
		cy.wait(3000).get('.button-icon').last().click()
		cy.get('.button-link').eq(1).contains('Edit SMB Share').click()
		
	})
	
	it('Verifes edit SMB share screen', function() {
		cy.get('.modal-title').contains('Edit SMB share for:')
		cy.get('.modal-body').should('be.visible')
		cy.contains('Share name')
		cy.contains('Description')
		cy.contains('Show ACL').should('be.enabled')  // Verify the Show ACL button
		cy.get('#shareName').clear().type('Pool1_Filesystem1')  //Edit and change share name
		cy.get('.panel-expand').click()  //Edit advanced options and change Allow guess access
		cy.get('.indicator').eq(1).click()  //Update option to OFF (previously it was set to ON)
	})
	
	it('Verifes Edit screen advanced options', function() {	
		cy.contains('Allow guest access')
		cy.contains('Access-based enumeration')
		cy.contains('Encryption')
		cy.contains('Quota management')
		cy.contains('Continuous availability')
		cy.contains('Client caching policy')
		cy.get('.button-secondary').eq(0).contains('Cancel')  // Verify cancel button
		cy.get('.button-primary').eq(1).contains('Save').click()
	})
		
		it('Verify after making changes navigate back to the shares screen', function() {
			//cy.get('.page-header-nav-secondary').contains('SHARES').click()
			cy.get('.page-header-nav-first').contains('Shared').click()
			cy.get('td')
				.should(($td) => {
				expect($td.eq(1)).to.contain('Pool1')
				expect($td.eq(2)).to.contain('Filesystem1')
				//expect($td.eq(3)).to.be.null  //NEED TO FIX
				expect($td.eq(4)).to.contain('Pool1_Filesystem1')
				//expect($td.eq(5)).to.be.null  //NEED TO FIX
				//expect($td.eq(6)).to.be.null  //NEED TO FIX
				expect($td.eq(7)).to.contain('online')
			})
			//cy.get('.button-icon').last().should('be.visible')
		})

		it('Verify filesystem screen displays SMB checkmark for SMB share', function() {
			//cy.get('.page-header-nav-secondary').contains('FILESYSTEMS').click()
			cy.get('.page-header-nav-first').contains('All').click()
			cy.wait(2000).get('.img-check').eq(3).should('have.attr', 'data-ng-show','fusCheckIcon')
			cy.get('.img-check').eq(3).should('be.visible')  //Verify that checkmark is visible under SMB column
			//cy.get('td')   //this verifies if checkmark is visible, different way from above.  look into this
			//	.should(($td) => {
			//		expect($td.eq(45)).to.have.attr('data-ng-show','fusCheckIcon')
			//	})
		})

		it('CLEANUP--Destroys Fileystem1 and then destroys Pool1 via CLI', function() {
			//cy.CLIFilesystemDestroyFilesystem1();
			cy.FusionDestroyPool_Pool1();
	        })

})
