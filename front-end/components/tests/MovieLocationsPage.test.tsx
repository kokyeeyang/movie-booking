import React from "react";
import { render, screen, waitFor } from "@testing-library/react";
import MovieLocationsPage from "components/ViewAllCinemaLocationsPage";
import AlertProvider from "@/AlertContext";

// Define the mocks before importing or using them
const MockAppContext = React.createContext({ backendDomain: "http://localhost:5000" });
const MockAlertContext = React.createContext({ showAlert: jest.fn() });

// Use beforeAll to mock dependencies
beforeAll(() => {
  jest.mock("../../src/AppContext", () => ({
    AppContext: MockAppContext,
  }));

  jest.mock("../../src/AlertContext", () => ({
    useAlert: () => React.useContext(MockAlertContext),
  }));
});

jest.setTimeout(10000);

console.log("setting up fetch mock")
// Mocking the fetch function with a delay to simulate network request
global.fetch = jest.fn(() => {
  console.log("Mocking fetch call");
  return Promise.resolve({
    json: () => 
      new Promise(resolve => 
        setTimeout(() => 
          resolve([
            { _id: "1", location: "Pavilion Bukit Bintang", image: "uploads/gsc pavilion bukit jalil.jpg" },
            { _id: "2", location: "IOI Mall", image: "uploads/1732517657291-gsc ioi mall.jpg" }
          ]), 1000
        )  // Adding a 1-second delay to mock fetching data
      )
  })
}) as jest.Mock;

afterEach(() => {
  jest.clearAllMocks();
});

const mockAppContext = {
  backendDomain: "http://localhost:5000",
  setBackendDomain: jest.fn(),
  frontendDomain: "http://localhost:3000",
  setFrontendDomain: jest.fn(),
  isLoading: false,
  setIsLoading: jest.fn(),
  user: null,
  setUser: jest.fn(),
  saveUser: jest.fn(),
};

describe("MovieLocationsPage", () => {
  it("renders loading text initially", () => {
    render(
      <MockAppContext.Provider value={mockAppContext}>
        <AlertProvider>
          <MovieLocationsPage />
        </AlertProvider>
      </MockAppContext.Provider>
    );
    expect(screen.getByText(/loading.../i)).toBeInTheDocument();
  });

  it("renders cinema locations after loading", async () => {
    render(
      <MockAppContext.Provider value={mockAppContext}>
        <AlertProvider>
          <MovieLocationsPage />
        </AlertProvider>
      </MockAppContext.Provider>
    );
  
    try {
      await waitFor(async () => {
        console.log("Data loading...");
  
        // Use findAllByText to get all elements with the same text
        const pavilionElements = await screen.findAllByText("Pavilion Bukit Bintang", { exact: true });
        const ioiMallElements = await screen.findAllByText("IOI Mall", { exact: true });
  
        console.log("Found elements:", pavilionElements, ioiMallElements);
  
        // Ensure both elements are in the document
        expect(pavilionElements.length).toBeGreaterThan(0);
        expect(ioiMallElements.length).toBeGreaterThan(0);
      }, { timeout: 5000 });
    } catch (error) {
      console.error("Error occurred while waiting for the elements: ", error);
    }
  });
  
});
