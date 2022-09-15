import { newItem, prisma } from './factories/items-factory';
import supertest from 'supertest';
import app from '../src/app';

beforeEach(async () => {
  await prisma.$executeRaw`TRUNCATE TABLE items;`;
});

afterAll(async () => {
  await prisma.$disconnect();
});

describe('Testa POST /items ', () => {

  it('Deve retornar 201, se cadastrado um item no formato correto', async ()=> {

    const item = await newItem(false);

    const response = await supertest(app).post('/items').send(item);

    expect(response.status).toBe(201);

  });

  it('Deve retornar 409, ao tentar cadastrar um item que exista', async ()=> {
      
    const item = await newItem(true);

    delete item.id;

    const response = await supertest(app).post('/items').send(item);
  
    expect(response.status).toBe(409);
  
  });

});

describe('Testa GET /items ', () => {

  it('Deve retornar status 200 e o body no formato de Array', async () => {

    await newItem(true);
    await newItem(true);

    const response = await supertest(app).get('/items');

    expect(response.status).toBe(200);
    expect(response.body).toBeInstanceOf(Array);
    expect(response.body).toHaveLength(2);

  });

});

describe('Testa GET /items/:id ', () => {

  it('Deve retornar status 200 e um objeto igual a o item cadastrado', async () => {
      
    const item = await newItem(true);

    const response = await supertest(app).get(`/items/${item.id}`);

    expect(response.status).toBe(200);
    expect(response.body).toEqual(item);

  });

  it('Deve retornar status 404 caso não exista um item com esse id', async () => {

    const item = await newItem(true);
        
    const response = await supertest(app).get(`/items/${item.id + 1}`);
  
    expect(response.status).toBe(404);

  });

});
