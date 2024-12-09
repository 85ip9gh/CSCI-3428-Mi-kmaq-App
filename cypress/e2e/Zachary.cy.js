describe('Zachary\'s spec', () => {  
  it('find dedication to Angie', () => {
    cy.visit('http://ugdev.cs.smu.ca:1859/')
    cy.get('[alt="heart"]')
  })
})