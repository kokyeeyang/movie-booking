const bookingController = require('../controllers/bookingController');
const Booking = require('../models/Booking');
const jwt = require('jsonwebtoken');
const axios = require('axios');
const { StatusCodes } = require('http-status-codes');
require('dotenv').config();

jest.mock("../models/Booking");
jest.mock('jsonwebtoken');
jest.mock('axios');

describe('bookingController', () => {
    let req, res;

    beforeEach(() => {
        req = {body: {}, params: {}, cookies: {}};
        res = {
            status: jest.fn().mockReturnThis(),
            json: jest.fn(),
        }

        // because mocks can 'remember' calls from previous tests, causing results to be unreliable, sort of stuck in memory
        Booking.create.mockReset();
        Booking.find.mockReset();
        Booking.findById.mockReset();
        jwt.verify.mockReset();
        axios.post.mockReset();
        jest.clearAllMocks();
    });

    describe('createBooking', () => {
        it('should create a booking and send notification', async() => {
            
            const bookingData = {
                userId: 'u1',
                movieListingId: 'ml1',
                movieTitle: 'Avengers',
                cinemaId: 'c1',
                hallName: 'Hall 1',
                seats: ['A1', 'A2'],
                bookingDate: '2025-05-19',
                timeSlot: '7:00PM',
                totalPrice: 20,
                studentSeat: 1,
                seniorSeat: 0,
                paymentId: 'p123',
            };
            req.body = bookingData;
            Booking.create.mockResolvedValue(bookingData);
            axios.post.mockResolvedValue({ status: 200});

            process.env.DISCORD_WEBHOOK_URL = "https://discordapp.com/api/webhooks/1373921775691370588/auonSV9RTEgTJ7CTQMl5fz7-W0ASy96l9ASAzPfnPPyVoG9D51R9CSzOly_IntDJSyfF";
            await bookingController.createBooking(req, res);
            expect(Booking.create).toHaveBeenCalledWith(bookingData);
            expect(axios.post).toHaveBeenCalledWith(
                process.env.DISCORD_WEBHOOK_URL,
                expect.objectContaining({
                    content: expect.stringContaining(`User ${bookingData.userId} just booked tickets for ${bookingData.movieTitle}`)
                })
            );
            expect(res.status).toHaveBeenCalledWith(StatusCodes.CREATED);
            // this should match the mock resolved booking object
            expect(res.json).toHaveBeenCalledWith(bookingData);
        });

        it('should return 400 on error', async() => {
            Booking.create.mockRejectedValue(new Error('DB Error'));

            await bookingController.createBooking(req,res);

            expect(res.status).toHaveBeenCalledWith(StatusCodes.BAD_REQUEST);
            expect(res.json).toHaveBeenCalledWith({error: 'DB Error'});
        });
    });

    describe('userBookings', () => {
        it('should return bookings for user', async () => {
            const fakeUser = { user: { userId: 'u1' } };
            jwt.verify.mockReturnValue(fakeUser);

            const fakeBookings = [
            {
                toObject: () => ({ _id: 'b1', cinemaId: { name: 'Cinema 1' } }),
            },
            ];
            Booking.find.mockReturnValue({
                populate: jest.fn().mockResolvedValue(fakeBookings),
            });

            req.cookies.accessToken = 'validtoken';

            await bookingController.userBookings(req, res);

            expect(jwt.verify).toHaveBeenCalledWith('validtoken', process.env.JWT_SECRET);
            expect(Booking.find).toHaveBeenCalledWith({ userId: 'u1' });
            expect(res.status).toHaveBeenCalledWith(StatusCodes.OK);
            expect(res.json).toHaveBeenCalledWith([
                { _id: 'b1', cinema: { name: 'Cinema 1' } }
            ]);
        });

        it('should return 400 on error', async () => {
            jwt.verify.mockReturnValue({ user: { userId: 'u1' } });
            Booking.find.mockImplementation(() => {
            throw new Error('DB find error');
            });
            req.cookies.accessToken = 'validtoken';

            await bookingController.userBookings(req, res);

            expect(res.status).toHaveBeenCalledWith(StatusCodes.BAD_REQUEST);
            expect(res.json).toHaveBeenCalledWith({ error: 'DB find error' });
        });
    });

    describe('fetchBookingDetails', () => {
        it('should fetch booking details and format cinema', async () => {
            const fakeBooking = {
            toObject: () => ({ _id: 'b1', cinemaId: { name: 'Cinema 1' } }),
            };
            Booking.findById.mockReturnValue({
            populate: jest.fn().mockResolvedValue(fakeBooking),
            });

            req.params.id = 'b1';

            await bookingController.fetchBookingDetails(req, res);

            expect(Booking.findById).toHaveBeenCalledWith('b1');
            expect(res.status).toHaveBeenCalledWith(StatusCodes.OK);
            expect(res.json).toHaveBeenCalledWith({
            _id: 'b1',
            cinema: { name: 'Cinema 1' },
            });
        });
    
        it('should return 400 on error', async () => {
          Booking.findById.mockImplementation(() => {
            throw new Error('DB findById error');
          });
    
          req.params.id = 'b1';
    
          await bookingController.fetchBookingDetails(req, res);
    
          expect(res.status).toHaveBeenCalledWith(StatusCodes.BAD_REQUEST);
          expect(res.json).toHaveBeenCalledWith({ error: 'DB findById error' });
        });
    });
})