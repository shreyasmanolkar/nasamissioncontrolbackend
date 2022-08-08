const request = require('supertest');
const app = require('../../app');
const { mongoConnect, mongoDisconnect } = require('../../services/mongo');

describe('Launch API', ()=>{
    beforeAll( async()=>{
        await mongoConnect();
    });

    afterAll(async()=>{
        await mongoDisconnect();
    })

    describe('Test GET /launches', ()=>{
        test('It should respond with 200 success', async()=>{
            const response = await request(app)
            .get('/v1/launches')
            .expect('Content-Type', /json/)
            .expect(200);
        });
    });
    
    describe('Test POST /launch', ()=>{
        const completeLaunchData = {
            "mission": "ZTM155",
            "rocket": "ZTM Experimental IS 1",
            "target": "Kepler-62 f",
            "launchDate": "1 july 2028"
        }
    
        const launchDataWithInvalidDate = {
            "mission": "ZTM155",
            "rocket": "ZTM Experimental IS 1",
            "target": "Kepler-62 f",
            "launchDate": "zoot"
        }
    
        const launchDataWithoutDate = {
            "mission": "ZTM155",
            "rocket": "ZTM Experimental IS 1",
            "target": "Kepler-62 f",
        }
    
        test('It should respond with 201 success', async()=>{
            const response = await request(app)
            .post('/v1/launches')
            .send(completeLaunchData)
            .expect("Content-Type", /json/) 
            .expect(201);
    
            const requestDate = new Date(completeLaunchData.launchDate).valueOf();
            const responseDate = new Date(response.body.launchDate).valueOf();
            expect(responseDate).toBe(requestDate);
    
            expect(response.body).toMatchObject(launchDataWithoutDate);
        });
    
        test('It should catch missing required properties', async()=>{
            const response = await request(app)
            .post('/v1/launches')
            .send(launchDataWithoutDate)
            .expect('Content-Type', /json/)
            .expect(400);
    
            expect(response.body).toStrictEqual({
                error: 'Missing required launch property',
            })
        });
    
        test('It should catch invalid dates', async()=> {
            const response = await request(app)
            .post('/v1/launches')
            .send(launchDataWithInvalidDate)
            .expect('Content-Type', /json/)
            .expect(400);
    
            expect(response.body).toStrictEqual({
                error: "Invalid launch date",
            })
        });
    })
});