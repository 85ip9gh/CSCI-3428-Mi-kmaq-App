describe('Pesanth spec', () => {
  it('find audio', () => {
    cy.visit('http://ugdev.cs.smu.ca:1859/')
    cy.get('[alt="audio"]')
  })
})