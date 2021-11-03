const app = require('../src/index')
const request = require('')

test("Requisitar rota '/' ", async () => {
    const response = await request(app).get('/todos')
    expect(response.body.length).toEqual(6)
})
