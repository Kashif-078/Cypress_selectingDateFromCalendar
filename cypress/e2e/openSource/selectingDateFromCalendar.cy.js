/// <reference types="cypress" />

import { getMonthIndex } from './helpers'

describe('Selecting Date using Calendar', () => {
    
    let date = new Date();  
    
    /**
     * To set the date based on which the year, month, and day will be determined 
     * and selected from the calendar, with the number adding days to today's date
     */
    date.setDate(date.getDate() + 954);

    let expectedYear = date.getFullYear(), actualYear,
    expectedMonth = date.toLocaleString('En-Us', {month:'long'}), expectedMonthIndex,
    actualMonth, actualMonthIndex,
    expectedDate = date.getDate().toString(), 
    clicksNeeded = 0;

    before(() => {
        cy.intercept('https://demo.automationtesting.in/Datepicker.html').as('DP_Page') // Using Alias
        cy.visit('https://demo.automationtesting.in/Datepicker.html')
        cy.wait('@DP_Page') // Implicit Waiting
    })

    it('From Disabled Date Picker Calendar', () => {
        
        // To open Date Picker Calendar
        cy.get('div input#datepicker1').click()
        // For Navigating to Expected Year
        cy.log('EY \t' + expectedYear)
        cy.get('.ui-datepicker-year').invoke('text').then((AY) => 
        {
            cy.get('.ui-datepicker-month').invoke('text').then((AM) => 
            {
                actualMonth = AM.trim()
                actualYear = AY.trim()
                cy.log('AY' + actualYear)
                cy.log('EY \t' + expectedYear)
                
                if (actualYear > expectedYear) {
                    if(actualYear - expectedYear)
                    {
                        clicksNeeded = (12 - getMonthIndex(actualMonth))+(12*((actualYear - expectedYear)))
                        cy.log('ClicksNeeded \t' + clicksNeeded)
                        for (let i = 0; i < clicksNeeded; i++) {
                            cy.get('a[title="Prev"]').click();
                        }
                    }
                } 

                if (actualYear < expectedYear) {
                    if(expectedYear - actualYear)
                    {
                        clicksNeeded = (12 - getMonthIndex(actualMonth))+(12*((expectedYear - actualYear)-1))
                        cy.log('ClicksNeeded \t' + clicksNeeded)
                        for (let i = 0; i < clicksNeeded; i++) {
                            cy.get('a[title="Next"]').click();
                        }
                    }
                } 
            }) // 'AM' then Block
        }) // 'AY' then Block

        // For Navigating to Expected Month
        cy.get('.ui-datepicker-month').invoke('text').then((AM) => {
            actualMonth = AM.trim();
            actualMonthIndex = getMonthIndex(actualMonth), 
            expectedMonthIndex =  getMonthIndex(expectedMonth)

            cy.log('AMI \t' + actualMonthIndex)
            cy.log('EMI \t' + expectedMonthIndex)

            while (actualMonthIndex != expectedMonthIndex) {
                if (actualMonthIndex > expectedMonthIndex){
                    cy.get('a[title="Prev"]').click();
                    actualMonthIndex--;
                }else if (actualMonthIndex < expectedMonthIndex) {
                    cy.get('a[title="Next"]').click();
                    actualMonthIndex++;
                }
            } 
        }) // 'AM' then Block

        // For Selecting Expected Date
        cy.contains('div#ui-datepicker-div table tr td a', expectedDate).click();

        // To open Date Calendar
        cy.get('div input#datepicker1').click()

        // Assertions
        cy.get('.ui-datepicker-year').should('contain', Number(expectedYear))
        cy.get('.ui-datepicker-month').should('contain', expectedMonth)
        cy.get('td.ui-datepicker-current-day')
            .find('a.ui-state-active')
            .should('contain', Number(expectedDate))

    }) // End It Block

    it('From Enabled Date Picker', () => {
        
        // To open Date Calendar
        cy.get('div input#datepicker2').click()
        
        // For Navigating to Expected Year
        cy.log('EY \t' + expectedYear)
        cy.get('select.datepick-month-year[title="Change the year"]').find('option:selected')
        .invoke('text').then((AY) => 
        {
            cy.get('select.datepick-month-year[title="Change the month"]').find('option:selected')
            .invoke('text').then((AM) => 
            {
                actualMonth = AM.trim();
                actualYear = AY.trim();
                cy.log('AY' + actualYear)
                cy.log('EY \t' + expectedYear)
                
                if (actualYear > expectedYear) {
                    if(actualYear - expectedYear)
                    {
                        clicksNeeded = (12 - getMonthIndex(actualMonth))+(12*((actualYear - expectedYear)))
                        cy.log('ClicksNeeded \t' + clicksNeeded)
                        for (let i = 0; i < clicksNeeded; i++) {
                            cy.get('a[title="Show the previous month"]').click();
                        }
                    }
                } 

                if (actualYear < expectedYear) {
                    if(expectedYear - actualYear)
                    {
                        clicksNeeded = (12 - getMonthIndex(actualMonth))+(12*((expectedYear - actualYear)-1))
                        cy.log('ClicksNeeded \t' + clicksNeeded)
                        for (let i = 0; i < clicksNeeded; i++) {
                            cy.get('a[title="Show the next month"]').click();
                        }
                    }
                } 
            }) // 'AM' then Block
        }) // 'AY' then Block

        // For Navigating to Expected Month
        cy.get('select.datepick-month-year[title="Change the month"]').find('option:selected')
        .invoke('text').then((AM) => {
            actualMonth = AM.trim();
            actualMonthIndex = getMonthIndex(actualMonth), 
            expectedMonthIndex =  getMonthIndex(expectedMonth)

            cy.log('AMI \t' + actualMonthIndex)
            cy.log('EMI \t' + expectedMonthIndex)

            while (actualMonthIndex != expectedMonthIndex) {
                if (actualMonthIndex > expectedMonthIndex){
                    cy.ge('a[title="Show the previous month"]').click();
                    actualMonthIndex--;
                }else if (actualMonthIndex < expectedMonthIndex) {
                    cy.get('a[title="Show the next month"]').click();
                    actualMonthIndex++;
                }
            } 
            // Alternative Way 
            // while (actualMonthIndex > expectedMonthIndex) {
            //     cy.get('a[title="Show the previous month"]').click();
            //     actualMonthIndex--;
            // } 

            // while (actualMonthIndex < expectedMonthIndex) {
            //     cy.get('a[title="Show the next month"]').click();
            //     actualMonthIndex++;
            // }
        });

        cy.log(expectedDate + '\t ED')
        // For Selecting Expected Date
        cy.contains('div.datepick-month table tr td a', expectedDate).click();

        // To open Date Calendar
        cy.get('div input#datepicker2').click()

        // Assertions
        cy.get('.ui-datepicker-year').should('contain', Number(expectedYear))
        cy.get('.ui-datepicker-month').should('contain', expectedMonth)
        cy.get('td.ui-datepicker-current-day')
            .find('a.ui-state-active')
            .should('contain', Number(expectedDate))

    }) // End It Block

}) // End Describe Block