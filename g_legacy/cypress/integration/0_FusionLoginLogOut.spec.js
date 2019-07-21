/**	
Author:  		George Navarro
Date: 			09/21/2018
Purpose:		Verifies the fusion GUI login/logout functionality
Script Name:		0_FusionLoginLogOut.spec.js

Execution Level:	georgeee,smoke,functional,full
Component:		GUI
Sub-Component:		login
Fusion version:		1.x
Nexentastor version:	
Fusion type:		OVA
Priority:		High
Description:		fusion GUI login/logout

--------Update the following section if updates are made to this script
Script revision:        1.0
Revised by:             George Navarro
Author_email:           George.navarro@nexenta.com
Rev_by_email:           George.navarro@nexenta.com

*/


describe('FusionUI Logon Screen as admin', function() {

    it('C709423 Verifies fusion URL', function() {  
          cy.visit('https://fusion:8457')    
    })
            
    it('Verify the Nexenta logo', function() {    
          cy.get('.img-login-logo').should("be.visible")
        cy.contains("Nexenta Fusion").should("be.visible")
    })    
/**    
    it("Should validate Forgot Username/password link", function () {
        cy.get('.login-container').should('be.visible')
        cy.contains("Forgot your local account username or password?").click()  
        cy.get('.button-secondary').contains("Cancel").click()  //Verifies the Cancel button
        cy.url().should('include','/login')  //Should return user back to main login page
        
        cy.contains("Forgot your local account username or password?").should('be.visible').click()
        cy.get('.login-container-recover').should('be.visible')
        cy.get('h4').contains("Forgot your local account username or password?").should("be.visible")
        cy.contains("Enter the email address for your local user account.")
        cy.contains("Your username and instructions for resetting your password will be sent to you.")
        cy.get('.field-label').contains("Email address")
        cy.get('#email').should("be.empty")  //ensure email address field is initially empty
        cy.get('#email').type("blablabla")
        cy.get('.button-primary').should('be.disabled')  //Verify that entering an invalid email format, the Submit button is disabled
        cy.get('#email').clear().type("george.navarro@nexenta.com")
        cy.get('.button-primary').contains("Submit").click()
    })
        
    it("Should validate confirmation screen", function () {    
        cy.wait(2000).get('.modal-header').should('be.visible').contains("Information")
        cy.get('.modal-body').contains("Account recovery instructions has been sent to george.navarro@nexenta.com").should("be.visible")
        cy.get('.button-secondary').contains("Ok").click()
        cy.url().should('include','/login')  //Should return user back to main login page
    })
*/
    it("Should validate that you can't log in without username/password", function () {
        cy.get('.button-login').contains("Login")
        cy.get('.button-login').should('be.disabled')
        cy.url().should('not.include','/list')
    })
    
    it("Should validate when username is invalid", function () {
          cy.get("#username").should('be.empty').clear().type("adminn")
          cy.get("#password").should('be.empty').clear().type("Nexenta@1")
        cy.get('.button-login').contains("Login").should("be.visible").click()
        cy.get('.alert').contains("Bad credentials").should("be.visible")    
    })
        
    it("Should validate when password is invalid", function () {
          cy.get("#username").clear().type("admin")
          cy.get("#password").clear().type("Nexenta@11")
        cy.get('.button-login').contains("Login").should("be.visible").click()
        cy.get('.alert').contains("Bad credentials").should('be.visible')    
    })
    
    it("Should validate when only password is entered", function () {
        cy.get("#username").clear()
          cy.get("#password").clear().type("Nexenta@11")
        cy.get('.button-login').should('be.disabled')    
    })
    
    it("Should validate when only username is entered", function () {
        cy.get("#password").clear()
          cy.get("#username").clear().type("admin")
        cy.get('.button-login').should('be.disabled')    
    })
        
    it("Should validate when login and password are valid", function () {
        cy.get("#username").clear().type( Cypress.env( "FUSION_ADMIN_USER" ) );  //refer to cypress.json file
          cy.get("#password").clear().type( Cypress.env( "FUSION_PASS" ) );  //refer to cypress.json file
        cy.get('.button-login').contains("Login").should('be.visible').click()        
      })

    it("Should validate successful login into appliance list", function () {
        cy.url().should('include','/list')
          cy.get('h2').contains("Appliances").should("be.visible")
      })

    it("Should validate logged in username is displayed", function () {
        cy.get('.site-header-username').should("be.visible").contains("admin")
    })

    it("Should validate cog wheel menu displays logged in as admin", function () {
        cy.get('.site-nav-item-link.site-nav-settings').click({force:true})
        cy.get('.dropdown-header').contains("Logged in as admin")
    })

    it("Should validate logging out of fusion GUI", function () {
        cy.get('.dropdown-footer').contains("Logout").click()
        cy.url().should('include','/login')
        cy.get('.button-login').should('be.disabled')
    })

})
