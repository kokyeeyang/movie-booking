const cinemaController = require('../controllers/cinemaController');
const Cinema = require('../models/Cinema');
const jwt = require('jsonwebtoken');
const axios = require('axios');
const { StatusCodes } = require('http-status-codes');
require('dotenv').config();

jest.mock("../models/Cinema");
jest.mock('jsonwebtoken');
jest.mock('axios');

describe('cinemaController', () => {
    let req, res;

    beforeEach(() => {
        req = {body: {}, params: {}, cookies: {}};
        res = {
            status: jest.fn().mockReturnThis(),
            json: jest.fn()
        }

        Cinema.create.mockReset();
        Cinema.find.mockReset();
        Cinema.findById.mockReset();
        jwt.verify.mockReset();
        axios.post.mockReset();
        jest.clearAllMocks();
    });

    describe('createCinema', () => {
        it('should create a cinema', async() => {
            req.body = {
                location: 'Sunway Velocity',
                operator: 'GSC',
                capacity: 260,
                halls: JSON.stringify(['Hall 1', 'Hall 2']),
                image: ''
            };
            const cinemaData = {
                location: 'Sunway Velocity',
                operator: 'GSC',
                capacity: 260,
                halls: ['Hall 1', 'Hall 2'],
                image: ''
            };
            Cinema.create.mockResolvedValue(cinemaData);
            await cinemaController.createCinema(req, res);

            expect(Cinema.create).toHaveBeenCalledWith(cinemaData);
            expect(res.status).toHaveBeenCalledWith(StatusCodes.CREATED);
            expect(res.json).toHaveBeenCalledWith(cinemaData);
        });
        it('should return 400 on error', async() => {
            Cinema.create.mockRejectedValue(new Error('DB Error'));
    
            await cinemaController.createCinema(req, res);
    
            expect(res.status).toHaveBeenCalledWith(StatusCodes.BAD_REQUEST);
            expect(res.json).toHaveBeenCalledWith({error: 'DB Error'});
        });
    });

})