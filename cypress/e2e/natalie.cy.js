describe('natalie spec', () => {
  it('find dictionary', () => {
    cy.visit('http://ugdev.cs.smu.ca:1859')
    cy.get('[alt="Dictionary"]')
  })
})