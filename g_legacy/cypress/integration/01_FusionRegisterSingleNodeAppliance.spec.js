/**	

Author:  		George Navarro
Date: 			09/13/2018
Purpose: 		Register Nexentastor appliance using fusion GUI
Script:			01_FusioRegisterSingleNodeAppliance.spec.js

Execution Level: 	georgeee,smoke,functional,full
Component:		REGISTRATION
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
let NS_IP

describe('FusionUI - Register Appliance', function() {

/// <reference types="cypress" />
	
	before('Logs into fusion via HTPPS', function() {
			cy.fusion_httpsLogin();
	})
	before(() => {
		NS_IP = Cypress.env('NS_SINGLE_IP')
	  })

	it('SETUP-C709425 fusion https login', function() {  
	        cy.visit('list')    
	})	

	it('SETUP-Verifies if appliance is already registered', function() {  
		//cy.wait(2000).get('#fus-body.site-main-body').wait(2000).then(($body)=> {
		cy.wait(2000).get('#fus-body').wait(2000).then(($body)=> {
			if($body.text().includes(Cypress.env('NS_SINGLE_NAME'))){
			//if($body.text().includes('NS520EugeneI')){ 
				cy.FusionUnRegisterAppliance();  //This is needed to ensure that the register appliance in this script is followed
				cy.reload()
				cy.get('.button-primary').contains('Register Appliance').click()
			} else{
				cy.get('.button-primary').contains('Register Appliance').click()
			}
		})
	})

   	it("Should validate Register appliance button in main screen", function () {
		cy.get('.button-primary').first().should('be.disabled')   //Ensure Continue button is initially disabled when no entry has been made
   	 }) 
		
     it("Should not register appliance with incorrect IP format", function () {
 		cy.get("#nodeIp").type("0.0.0.0")
 		cy.get('.button-primary').contains('Continue').click()
		cy.get('.modal-body').should('be.visible')
		cy.wait(2000).get('.modal-title').contains("Unable to register appliance")
		cy.get('.modal-body').contains("Node with host url https://0.0.0.0:8443 is not found")
		//cy.get('.notifier-message-item').contains("Error occurred: Validate appliance connection for url: 0.0.0.0 failed: Failed to connect appliance http://0.0.0.0:2020:")
		//cy.get('.button-icon').eq(2).click()  //Click on the alert to dismiss. (NEED TO FIX)
		cy.get('.button-secondary').contains('Close').click()
     }) 
	
     it("Should not register appliance with invalid IP", function () {
		cy.contains('Register Appliance').click()  //Register appliance button
		cy.get("#nodeIp").type("10.3.70.99")
		cy.contains('Enter port if not using the default (8443)')
		cy.get('#nodePort').type("8080")
		cy.contains('Cancel') 
 		cy.get('.button-primary').contains('Continue').click()
		cy.wait(6000).get('.modal-title').contains("Unable to register appliance")
		cy.get('.modal-body').contains("Connection timeout. Please check appliance address.")
		//cy.get('.modal-body').contains("Validate appliance connection for url: 10.3.70.99:8080 failed: Failed to connect appliance http://10.3.70.99:8080: ETIMEDOUT")
		//cy.get('.notifier-message-item').contains("Error occurred: Validate appliance connection for url: 10.3.70.99 failed:")
		//cy.get('.button-icon').eq(2).click()  //Click on the alert to dismiss. (NEED TO FIX)
		cy.get('.button-secondary').contains('Close').click()
     }) 
	
    it("Should Register appliance with valid IP", function () {
		cy.contains('Register Appliance').click()  //Register appliance button
		//cy.get('h3').contains('Register appliance')
		//cy.contains('Enter IP address for one node of the cluster or for the single node')
		cy.get("#nodeIp").type( Cypress.env('NS_SINGLE_IP') )
		//cy.get("#nodeIp").type("10.3.199.247")
		cy.contains('Enter port if not using the default (8443)')
	  	cy.get('#nodePort').type("8443")
		cy.contains('Cancel')
		cy.contains('Continue').click()
    })
	
   	it("Should validate registering appliance with in-valid username/password", function () {
		cy.wait(6000).get('h3').contains('Connection to Appliance')  
		cy.get('b').should('not.be.empty')   //Verify IP of appliance shows up in this area
		//cy.contains('Please enter appliance login credentials for $NS_IP', { env: {NS_IP: Cypress.env('NS_SINGLE_IP')}})
		cy.contains('Please enter appliance login credentials for '+ NS_IP)
		cy.get("#username").type("adminn")  //Invalid username
		cy.get("#password").type("Nexenta@1")
		cy.get('[type="checkbox"]').check({force:true})
		cy.contains('Continue').click()
		//cy.get('.alert').should('be.visible').contains("Appliance authorization error: Error: Trying to logon appliance for url: https://$NS_IP:8443: Auth failed: https://$NS_IP:8443: Bad credentials", { env: {NS_IP: Cypress.env('NS_SINGLE_IP')}})
		cy.get('.alert').should('be.visible').contains("Appliance authorization error: Bad credentials")
   	}) 

   	it("Should validate not registering appliance with not checking trust this certificate", function () {
 		cy.get("#username").clear().type("admin")  //Valid username
 		cy.get("#password").clear().type("Nexenta@1")
		cy.get('[type="checkbox"]').uncheck({force:true})  //Needed here to "uncheck" previous checkmark done
 		cy.get('.button-primary').eq(0).should('be.disabled')
	}) 
	 
    it("Should validate Download certificate link", function () {
 		cy.contains('Download certificate')//.click()  //Need to figure out a why to click or have it not ask for the download confirmation
    })
	
   	it("Should validate registering appliance with valid username/password", function () {
		
		cy.get('h3').contains('Connection to Appliance')  
		cy.get('b').should('not.be.empty')   //Verify IP of appliance shows up in this area
		cy.get("#username").clear().type("admin")  //Valid username
		cy.get("#password").clear().type("Nexenta@1")
		//cy.contains('Please enter appliance login credentials for $NS_IP', { env: {NS_IP: Cypress.env('NS_SINGLE_IP')}})  //Username/pssword was entered in previous test
		cy.contains('Please enter appliance login credentials for '+ NS_IP)
		cy.contains('Do you trust the following certificate:')
		cy.contains('Serial Number')  //Verifies the content of the certificate
		cy.contains('I trust this certificate')
		cy.contains('Cancel')
		cy.get('[type="checkbox"]').check({force:true})
		cy.contains('Continue').click()
   	}) 

    it("Should validate final registration screen", function () {
		/*cy.get('.page-header-title').contains('Registration')  
		cy.contains('Success! The new appliance node was found. Now, verify and confirm the settings.')
		cy.contains('Appliance Info')
		cy.get('#applianceName0')
		cy.get('#applianceHost0')
		cy.get('#applianceSubnet0')
		cy.get('#applianceGateway0')
		cy.contains('Communication Settings')
		cy.get('#applianceSmtp0').clear().type("Smtp.gmail.com")
		cy.get('#applianceSmtpUser0').clear().type("fgcbnavarro1@gmail.com")
		cy.get('#applianceSmtpReturn0').clear().type("fgcbnavarro1@gmail.com")
		cy.get('#applianceSmtpPass0').clear().type("Almosthere2018")
		cy.get('#applianceSmtpPort0').clear().type("250")
		cy.contains('Cancel')
		cy.contains('Confirm').wait(4000).click()
		cy.wait(9000)*/
		cy.contains("New appliance has been registered!")
		cy.contains("All appliances").wait(4000).click()
		cy.wait(6000)
    }) 
	
		
    it("Should validate Appliance list view", function () {
		cy.reload()
		cy.contains('Appliances') // Verify the Appliances Header in the appliance list view
		cy.get('.img-appliance')  //Verify the appliance logo
		cy.get('.appliance-title-link').should('not.be.empty')   //Verify the appliance name is displayed
		//cy.get('.appliance-title-link').contains("NS-5117")
		cy.get('.appliance-title-link').contains( Cypress.env('NS_SINGLE_NAME') )
		cy.get('.appliance-status').contains('connected')  //Verify the status of appliance is "connected"
		cy.get('.status-icon-directive').should('not.be.empty')  //Verify Health status icon
		cy.get('.capacity-bar-allocated').should('be.visible')
		cy.get('[data-ng-if="!hideInstalled"] > :nth-child(2) > .ng-binding').should('not.be.empty')   //Verify the appliance configured information is displayed
		cy.get('[data-ng-if="!hideInstalled"] > .capacity-bar-padding-right5').contains('Configured')
		cy.get('[data-ng-if="!hideAllocated"] > :nth-child(2) > .ng-binding').should('not.be.empty')  //Verify the appliance allocated information is displayed
		cy.get('[data-ng-if="!hideAllocated"] > .capacity-bar-padding-right5').contains('Allocated')
		cy.get('.capacity-bar-free-position > .ng-binding').should('not.be.empty')  //Verify the appliance Free information is displayed
		cy.get('.capacity-bar-free-position > .capacity-bar-padding-right5').contains('Free')
	
	})
	
	it("Should validate Appliance List view column headers", function () {
		cy.get('th')
			.should(($th) => {
				expect($th.eq(0)).to.contain('Name')  
				expect($th.eq(1)).to.contain('Health')
				expect($th.eq(2)).to.contain('Alerts')
				expect($th.eq(3)).to.contain('Configured Capacity')
				expect($th.eq(4)).to.contain('Installed Capacity')
				expect($th.eq(5)).to.contain('Actions')
				//expect($th).to.have.length(6) //Verify 6 column headers are visible
		})
	})
		
	it("Should validate Configured/Total value", function () {
//Verify total configured/total installed info
		cy.get('.page-sub-header-controls > :nth-child(1)').contains('Total configured')
		cy.get('.page-sub-header-controls > :nth-child(2)').contains('Total installed')

	})
	
	it("Should validate if appliance is already registered", function () {
		cy.get('.site-logo').click()
		cy.contains('Register Appliance').click()
		cy.get("#nodeIp").type( Cypress.env('NS_SINGLE_IP') )
		cy.contains('Continue').click()
		cy.wait(1000)
		cy.get("#username").clear().type("admin")  
		cy.get("#password").clear().type("Nexenta@1")
		cy.get('[type="checkbox"]').check({force:true})
		cy.contains('Continue').click()	
		cy.wait(2000).get('.modal-body').should('be.visible')
		cy.get('.modal-title').contains("Unable to register appliance")
		cy.get('.button-secondary').contains("Close").click()
	})
	
	it("Should validate appliance cog wheel links", function () {
		cy.wait(2000).get('.button-icon').eq(0).click()  //NEED TO FIGURE OUT A WAY TO PICK THIS EQ SINCE IT WILL CHANGE
		cy.get('.dropdown-content > ul > li')
			.should(($li) => {
			expect($li.eq(0)).to.contain('License')  //Verify columns in Local UI user setup screen
			expect($li.eq(1)).to.contain('Rebind appliance')
			expect($li.eq(2)).to.contain('Remove')
			expect($li).to.have.length(3) //Verify 3 links are visible (one li element is the main menu cog wheel)
		})
	})
	
})
