/**	
Author:			George Navarro
Date:			09/21/2018
Purpose:		Verify the fusion UI functionality for the about screen
Script Name:		01_FusionAbooutScreen.spec.js

Execution Level:	smoke,geeorge,functional
Component:		COG-WHEEL
Sub-Component:		about-screen
Fusion version:		1.x
Nexentastor version:	
Fusion type:		Ova
Priority:		High
Description:		Fusion UI about screen

--------Update the following section if updates are made to this script
Script revision:       	1.0
Revised by:     	George Navarro
Author_email:   	George.navarro@nexenta.com
Rev_by_email:   	George.navarro@nexenta.com

*/


describe('FusionUI About Screen', function() {
	
/// <reference types="cypress" />
	
	before('Logs into fusion via HTPPS', function() {
			cy.fusion_httpsLogin();
	})

	it('C709424 fusion https login', function() {  
	        cy.visit('list')    
	})	

	it("Should validate the main menu cog wheel", function () {
		cy.get('.site-nav-settings').click({force:true})
	})
		
	
	it("Should validate the first section of About screen", function () {
		cy.get('.site-nav-child-item').eq(0).contains('About Fusion').click()
		cy.get('.modal-title').contains('About NexentaFusion')
		cy.contains('NexentaFusion Version 2.0.0.dev')
		cy.contains('Copyright 2014 - 2019 Ⓡ')
		cy.get(':nth-child(5)').contains("support@nexenta.com")
		
	})
	
	
	it("Should ping community.nexenta.com is alive and returns status code 200", function () {
		cy.get(':nth-child(6)').contains("http://community.nexenta.com").request('http://community.nexenta.com').then((response)=>
		{
			expect(response.status).to.eq(200)
		})
		
	})
	
	it("Should validate About screen expands", function () {
		var i=0;   // click the down arrow key 3 times
		for (i=0; i < 3 ; i++) {
		cy.get('.button-icon').eq(1).click()
		}
		
	})
	
	// Verify expanded section of EULA
	
	it("Should ping nexenta.com is alive and returns status code 200", function () {
		cy.contains("http://www.nexenta.com/").request("http://www.nexenta.com/").then((response)=>
		{
			expect(response.status).to.eq(200)
		})
		
	})
	
	it("Should verify expanded section of EULA", function () {
		cy.contains('Nexenta End User License Agreement (EULA')
		cy.contains('Last updated: April 26, 2018')
		cy.contains('Nexenta End User License Agreement © 2013 – 2018 Nexenta Systems, Inc. All rights reserved. Nexenta is a registered trademark of Nexenta Systems, Inc. in the US and other countries')
		cy.contains('Close').click()
	})	

})
