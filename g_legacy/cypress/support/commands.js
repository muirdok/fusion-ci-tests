// ***********************************************
// This example commands.js shows you how to
// create various custom commands and overwrite
// existing commands.
//
// For more comprehensive examples of custom
// commands please read more here:
// https://on.cypress.io/custom-commands
// ***********************************************
//
//
// -- This is a parent command --
// Cypress.Commands.add("login", (email, password) => { ... })
//
//
// -- This is a child command --
// Cypress.Commands.add("drag", { prevSubject: 'element'}, (subject, options) => { ... })
//
//
// -- This is a dual command --
// Cypress.Commands.add("dismiss", { prevSubject: 'optional'}, (subject, options) => { ... })
//
//
// -- This is will overwrite an existing command --
// Cypress.Commands.overwrite("visit", (originalFn, url, options) => { ... })

// This will register a single node appliance - 10.3.70.97 NS-5117

Cypress.Commands.add('FusionRegisterAppliance', function () {
        cy.get('.site-logo').click()
        cy.get('.button-primary').contains('Register Appliance').click()
        cy.get("#nodeIp").type(Cypress.env('NS_SINGLE_IP'))
        cy.contains('Continue').click()
        cy.get("#username").clear().type("admin") //Valid username
        cy.get("#password").clear().type("Nexenta@1")
        cy.get('[type="checkbox"]').check({
                force: true
        })
        cy.contains('Continue').click()
        cy.contains('Confirm').click()
        cy.reload()
})

// This will register a single node appliance - 10.3.65.138 Cypress-Nexentastor-5x

Cypress.Commands.add('FusionRegisterApplianceCypressNexentastor5x', function () {
        cy.get('.site-logo').click()
        cy.get('.button-primary').contains('Register Appliance').click()
        cy.get("#nodeIp").type("10.3.65.138")
        cy.contains('Continue').click()
        cy.get("#username").clear().type("admin") //Valid username
        cy.get("#password").clear().type("Nexenta@1")
        cy.get('[type="checkbox"]').check({
                force: true
        })
        cy.contains('Continue').click()
        cy.contains('Confirm').click()
        cy.reload()
})



// This will register a clustered appliance - 10.3.65.8/10.3.65.9

Cypress.Commands.add('FusionRegisterClusteredAppliance', function () {
        cy.get('.site-logo').click()
        cy.get('.button-primary').contains('Register Appliance').click()
        cy.get("#nodeIp").type("10.3.65.8")
        cy.get('.button-primary').contains('Continue').click()
        cy.get("#username").clear().type("admin")
        cy.get("#password").clear().type("Nexenta@1")
        cy.get('[type="checkbox"]').check({
                force: true
        })
        cy.contains('Continue').click()
        cy.wait(2000)
        cy.get('[type="checkbox"]').check({
                force: true
        })
        cy.contains('Continue').click()
        cy.wait(3000)
        cy.get('.indicator').click()
        cy.wait(4000)
        cy.get('.button-primary').contains('Confirm').click()
        cy.wait(9000)
        cy.url().should('contain', 'list') //Ensure appliance list view 
})

// This will un-register a single node appliance

Cypress.Commands.add('FusionUnRegisterAppliance', function () {
        cy.get('.site-logo').click()
        cy.get('.button-icon').eq(0).click() // Need to figure out how to change depending on appliance registered
        cy.get('.button-link').eq(2).contains("Remove").click()
        cy.get('.button-danger').contains("Remove").click()
})


// This wil log into fusion using fusion GUI

Cypress.Commands.add('fusion_GUILogin', function () {
        cy.viewport(1200, 750)
        cy.visit('login') //contents of basURL are appended.  Refer to cypress.json file for complete URL
        cy.get("#username").type("admin")
        cy.get("#password").type("Nexenta@1")
        cy.get('button').click()
})


// This wil log into fusion using HTTPS POST

Cypress.Commands.add('fusion_httpsLogin', function () {
        sessionStorage.clear();
        return cy.request({
                        method: "POST",
                        url: 'https://fusion:8443/auth/login', //Need to use port 8443 for HTTPS calls
                        failOnStatusCode: false,
                        headers: {
                                'Content-type': 'application/json'
                        },
                        body: {
                                "username": "admin",
                                "password": "Nexenta@1"
                        }
                })
                .then((res) => {
                        sessionStorage['ngStorage-jwt'] = JSON.stringify(res.body.token);
                        sessionStorage['ngStorage-user'] = JSON.stringify({
                                "username": "admin",
                                "provider": "localUsers",
                                "name": "admin",
                                "level": "admin",
                                "groups": [],
                                "isGuest": false,
                                "changePassword": false
                        })
                })

})

// Routine to create a non-mirrored pool

Cypress.Commands.add('FusionCreateNonMirroredPool', function () {
        cy.get('.site-logo').click()
        cy.get('.appliance-title-link').contains(Cypress.env('NS_SINGLE_NAME')).click()
        cy.contains('Management').click()
        cy.get('.button-primary').contains('Create Pool').click()
        cy.get('#poolName').type("Pool1")
        cy.contains('Auto').click({
                force: true
        })
        //cy.wait(2000).get(':nth-child(1) > .text-center > .field-checkbox > .indicator').click()
        cy.get(':nth-child(1) > .text-center > .field-checkbox > .indicator')
        cy.get('.flex-col-4 > .field-wrapper > .field-switch > .indicator').click()
        cy.get('.button-select').eq(0).click()
        cy.get('.select-list-item').eq(0).click()
        cy.contains('Stripe').click({
                force: true
        })
        cy.get('#maxDevicesNumber').type("1")
        cy.get('.grid-col-2 > .button-primary').click()
        cy.contains('Next').click()
        cy.contains('Skip').click()
        cy.get('.button-primary').click({
                multiple: true,
                force: true
        })
        cy.get(':nth-child(3) > .button-primary').click({
                force: true
        })
        cy.wait(3000)
})

// Routine to edit Non_mirrored Pool1

Cypress.Commands.add('FusionEditNonMirroredPool', function () {
        cy.get('.site-logo').click()
        cy.get('.appliance-title-link').contains('NS-5117').click()
        cy.contains('Management').click()
        cy.get('.button-icon').eq(1).click()
        cy.get('.button-link').eq(1).contains("Edit").click()
        cy.wait(4000).get('.disk-icon-action').eq(0).click()
        cy.get('.dropdown').should('be.visible')
        cy.get('.button-link').eq(2).contains("Replace").click()
        // cy.get('.indicator').eq(0).click()
        cy.wait(4000).get('.disk-item-controls-action').eq(5).click({
                force: true
        })
        cy.get('.button-danger').contains("Yes").click()
        cy.get('.button-secondary').contains("Close").click()
})

// Routine to export existing pool1

Cypress.Commands.add('FusionExportNonMirroredPool', function () {
        cy.get('.button-icon').eq(5).click()
        cy.get('.button-link').contains('Export').click()
        cy.get('.modal-title').contains('Confirm Pool Export')
        cy.contains('Are you sure you want to export pool?')
        cy.contains('Note: Any active datasets contained within the pool will be unmounted.')
        cy.get('.button-secondary').contains('Cancel')
        cy.get('.button-danger').contains('Yes').click()
})

// Routine to destroy previously created pool1 from appliance

Cypress.Commands.add('FusionDestroyPool_Pool1', function () {
        cy.get('.site-logo').click()
        cy.get('.appliance-title-link').contains(Cypress.env('NS_SINGLE_NAME')).click()
        cy.contains('Management').click()
        cy.wait(2000)
        cy.get('.button-icon').eq(5).click() // perhaps should change
        cy.get('.button-link').contains("Destroy").click()
        cy.get('.modal-title').contains("Destroy Pool:")
        cy.get('.field-checkbox > .indicator').click()
        cy.get('.button-danger').click()
})

Cypress.Commands.add('FusionVDBenchTest', function () {
        cy.request(RunVDBench.sh)
})


Cypress.Commands.add('CLIPoolCreate_Pool1', function () {
        cy.exec('./CLIPoolCreate.sh $NS_IP admin Nexenta@1', {
                env: {
                        NS_IP: Cypress.env('NS_SINGLE_IP')
                }
        })
})

Cypress.Commands.add('CLIPoolEdit_Pool1', function () {
        cy.exec('./CLIPoolEdit.sh $NS_IP admin Nexenta@1', {
                env: {
                        NS_IP: Cypress.env('NS_SINGLE_IP')
                }
        })
})

Cypress.Commands.add('CLIPoolDestroy_Pool1', function () {
        cy.exec('./CLIPoolDestroy.sh $NS_IP admin Nexenta@1', {
                env: {
                        NS_IP: Cypress.env('NS_SINGLE_IP')
                }
        })
})

Cypress.Commands.add('CLIPoolExport_Pool1', function () {
        cy.exec('./CLIPoolExport.sh $NS_IP admin Nexenta@1', {
                env: {
                        NS_IP: Cypress.env('NS_SINGLE_IP')
                }
        })
})

Cypress.Commands.add('CLIPoolImport_Pool1', function () {
        cy.exec('./CLIPoolImport.sh $NS_IP admin Nexenta@1', {
                env: {
                        NS_IP: Cypress.env('NS_SINGLE_IP')
                }
        })
})

Cypress.Commands.add('RunVDBench', function () {
        cy.exec('./RunVDBench.sh 10.3.65.134 gnavarro password')
})

Cypress.Commands.add('CLIFilesystemCreateFilesystem1', function () {
        cy.exec('./CLICreateFilesystem1.sh $NS_IP admin Nexenta@1', {
                env: {
                        NS_IP: Cypress.env('NS_SINGLE_IP')
                }
        })
})

Cypress.Commands.add('CLIFilesystemDestroyFilesystem1', function () {
        cy.exec('./CLIDestroyFilesystem1.sh $NS_IP admin Nexenta@1', {
                env: {
                        NS_IP: Cypress.env('NS_SINGLE_IP')
                }
        })
})

//Setup for 10.3.65.138 to create/destroy Pool2 and Fileystem2 via CLI being used as part of 11_FusionProtectionSvcsScheduledReplicationRemote.spec.js

Cypress.Commands.add('CLIPool2Filesystem2Create10365138', function () {
        cy.exec('./CLIPool2Filesystem2Create10-3-65-138.sh 10.3.65.138 admin password')
})

Cypress.Commands.add('CLIPool2Filesystem2Destroy10365138', function () {
        cy.exec('./CLIPool2Filesystem2Destroy10-3-65-138.sh 10.3.65.138 admin password')
})

//Setup for 10.3.70.97 to create Pool1 and Fileystem1 via CLI

Cypress.Commands.add('CLIPool1Filesystem1Create', function () {
        cy.exec('./CLIPool1Filesystem1Create.sh $NS_IP admin Nexenta@1', {
                env: {
                        NS_IP: Cypress.env('NS_SINGLE_IP')
                }
        })
})