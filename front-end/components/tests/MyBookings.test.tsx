import React, { ReactNode } from "react";
import { render, screen, waitFor, fireEvent } from "@testing-library/react";
import "@testing-library/jest-dom";
// import { useAppContext, AppContextType } from "@/AppContext";
// import { useAppContext, AppContextType } from "../../appc";
import { useAppContext, AppContextType } from '../../src/AppContext';

interface MyBookingTestProps {
    children: ReactNode;
}
// ✅ MOCK FIRST

const mockUseAlert = jest.fn();

jest.mock("../../src/AppContext", () => {
    const mockAppContext = {
        backendDomain: "http://localhost:5000",
        setBackendDomain: jest.fn(),
        frontendDomain: "http://localhost:3000",
        setFrontendDomain: jest.fn(),
        isLoading: false,
        setIsLoading: jest.fn(),
        user: { _id: 123, name: "Test user" },
        setUser: jest.fn(),
        saveUser: jest.fn(),
    };
    const React = require("react");
    const AppContext = React.createContext(mockAppContext);

  return {
    useAppContext: () => mockAppContext, // 👈 this is the key fix
    AppProvider: ({ children } : MyBookingTestProps) => (
      <AppContext.Provider value={mockAppContext}>
        {children}
      </AppContext.Provider>
    ),
  };
});

jest.mock("../../src/AlertContext", () => {
  const React = require("react");
  const AlertContext = React.createContext({ showAlert: jest.fn() });

  return {
    __esModule: true,
    useAlert: () => ({ showAlert: jest.fn() }),
    default: ({ children } : MyBookingTestProps) => (
      <AlertContext.Provider value={{ showAlert: jest.fn() }}>
        {children}
      </AlertContext.Provider>
    ),
  };
});

import MyBookingsPage from "components/MyBookingsPage";

afterEach(() => {
  jest.clearAllMocks();
});

jest.mock("../../src/AppContext", () => ({
    ...jest.requireActual("../../src/AppContext"), // Ensure the rest of the AppContext is not mocked
    useAppContext: jest.fn(), // Mock the `useAppContext` hook
}));
  
describe('MyBookingsPage', () => {
    const mockBookings = [
      {
        _id: '1',
        movieTitle: 'Hotel Del Luna',
        bookingDate: '2025-05-25',
        timeSlot: '11:00 am',
        hallName: 'Hall 1',
        cinema: { _id: 'cinema1', capacity: 100, halls: ['Hall 1'], location: 'Location 1' },
        seats: [],
      },
      {
        _id: '2',
        movieTitle: 'Titanic',
        bookingDate: '2025-04-20',
        timeSlot: '1:30 pm',
        hallName: 'Hall 2',
        cinema: { _id: 'cinema2', capacity: 100, halls: ['Hall 2'], location: 'Location 2' },
        seats: [],
      },
    ];
  
    beforeEach(() => {
        // Mock the return value of useAppContext with the correct type
        (useAppContext as jest.Mock<AppContextType>).mockReturnValue({
            backendDomain: 'http://localhost', // Mock backend domain
            frontendDomain: 'http://localhost:3000', // Mock frontend domain
            setBackendDomain: jest.fn(),
            setFrontendDomain: jest.fn(),
            isLoading: false, // Mock loading state
            user: {
                userId: '121212',
                isVerified: true,
                role: 'user',
                firstname: 'John',
                lastname: 'Doe',
                email: 'john.doe@example.com',
            },
            setUser: jest.fn(), // Mock setUser function
            saveUser: jest.fn(), // Mock saveUser function
        });
    });
  
    test('filters bookings by current and past tabs', async () => {
        // 👇 Date and fetch must be mocked BEFORE render
        jest.spyOn(Date, 'now').mockReturnValue(new Date('2025-05-01T00:00:00Z').getTime());
        
        (global.fetch as jest.Mock) = jest.fn().mockResolvedValueOnce({
            json: async () => mockBookings,
        });
        
        render(<MyBookingsPage />);

        await screen.findByText('My Bookings'); // Wait for render
        
        // Click "Current" and expect future bookings
        fireEvent.click(screen.getByText('Current'));
        expect(screen.getByText('Hotel Del Luna')).toBeInTheDocument();
        expect(screen.queryByText('Titanic')).toBeNull();
        
        // Click "Past" and expect past bookings
        fireEvent.click(screen.getByText('Past'));
        expect(screen.getByText('Titanic')).toBeInTheDocument();
        expect(screen.queryByText('Hotel Del Luna')).toBeNull();
    });
  });
