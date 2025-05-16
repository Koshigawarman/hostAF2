/* eslint-disable no-undef */
import React from "react";
import { render, screen, waitFor, fireEvent } from "@testing-library/react";
import { MemoryRouter, useParams, useNavigate } from "react-router-dom";
import CountryDetails from "../CountryDetails";
import { getCountryByCode } from "../services/api";

// Mock dependencies
jest.mock("../services/api");
jest.mock("../components/Header", () => ({ onSearch, onFilter }) => (
  <div data-testid="header">
    <button onClick={() => onSearch("test-query")}>Search</button>
    <button onClick={() => onFilter("test-region")}>Filter</button>
  </div>
));
jest.mock("../components/Footer", () => () => (
  <div data-testid="footer">Footer</div>
));
jest.mock("../components/NewsComponent", () => ({ country }) => (
  <div data-testid="news-component">News for {country}</div>
));
jest.mock("react-router-dom", () => ({
  ...jest.requireActual("react-router-dom"),
  useParams: jest.fn(),
  useNavigate: jest.fn(),
}));

describe("CountryDetails component", () => {
  // Mock data for a successful API response
  const mockCountry = {
    name: {
      common: "France",
      official: "French Republic",
    },
    flags: {
      png: "https://flagcdn.com/fr.png",
    },
    capital: ["Paris"],
    region: "Europe",
    subregion: "Western Europe",
    population: 67391582,
    area: 551695,
    languages: { fra: "French" },
    currencies: { EUR: { name: "Euro" } },
  };

  // Setup mocks before each test
  beforeEach(() => {
    jest.clearAllMocks();
    useParams.mockReturnValue({ code: "FR" });
    useNavigate.mockReturnValue(jest.fn());
    getCountryByCode.mockReset();
  });

  test("renders loading state initially", () => {
    getCountryByCode.mockReturnValue(new Promise(() => {})); // Pending promise
    render(
      <MemoryRouter>
        <CountryDetails />
      </MemoryRouter>
    );

    expect(
      screen.getByRole("status", { name: /loading/i })
    ).toBeInTheDocument();
    expect(screen.getByTestId("header")).toBeInTheDocument();
    expect(screen.getByTestId("footer")).toBeInTheDocument();
    expect(screen.getByTestId("news-component")).toHaveTextContent(
      "News for FR"
    );
  });

  test("renders error state when API call fails", async () => {
    getCountryByCode.mockRejectedValue(new Error("API error"));
    render(
      <MemoryRouter>
        <CountryDetails />
      </MemoryRouter>
    );

    await waitFor(() => {
      expect(screen.getByRole("alert")).toBeInTheDocument();
      expect(
        screen.getByText("Failed to load country details")
      ).toBeInTheDocument();
      expect(screen.getByTestId("header")).toBeInTheDocument();
      expect(screen.getByTestId("footer")).toBeInTheDocument();
      expect(screen.getByTestId("news-component")).toHaveTextContent(
        "News for FR"
      );
    });
  });

  test("renders country details when API call succeeds", async () => {
    getCountryByCode.mockResolvedValue(mockCountry);
    render(
      <MemoryRouter>
        <CountryDetails />
      </MemoryRouter>
    );

    await waitFor(() => {
      expect(
        screen.getByRole("heading", { name: "France" })
      ).toBeInTheDocument();
      expect(screen.getByAltText("Flag of France")).toHaveAttribute(
        "src",
        "https://flagcdn.com/fr.png"
      );
      expect(screen.getByText("French Republic")).toBeInTheDocument();
      expect(screen.getByText("Paris")).toBeInTheDocument();
      expect(screen.getByText("Europe")).toBeInTheDocument();
      expect(screen.getByText("Western Europe")).toBeInTheDocument();
      expect(screen.getByText("67,391,582")).toBeInTheDocument();
      expect(screen.getByText("551,695 km²")).toBeInTheDocument();
      expect(screen.getByText("French")).toBeInTheDocument();
      expect(screen.getByText("Euro")).toBeInTheDocument();
      expect(screen.getByTestId("header")).toBeInTheDocument();
      expect(screen.getByTestId("footer")).toBeInTheDocument();
      expect(screen.getByTestId("news-component")).toHaveTextContent(
        "News for FR"
      );
    });
  });

  test("navigates back when back button is clicked", async () => {
    getCountryByCode.mockResolvedValue(mockCountry);
    const mockNavigate = jest.fn();
    useNavigate.mockReturnValue(mockNavigate);
    render(
      <MemoryRouter>
        <CountryDetails />
      </MemoryRouter>
    );

    await waitFor(() => {
      expect(
        screen.getByRole("heading", { name: "France" })
      ).toBeInTheDocument();
    });

    const backButton = screen.getByRole("button", {
      name: /go back to previous page/i,
    });
    fireEvent.click(backButton);
    expect(mockNavigate).toHaveBeenCalledWith(-1);
  });

  test("calls onSearch when search is triggered in Header", async () => {
    getCountryByCode.mockResolvedValue(mockCountry);
    const consoleSpy = jest.spyOn(console, "log").mockImplementation();
    render(
      <MemoryRouter>
        <CountryDetails />
      </MemoryRouter>
    );

    await waitFor(() => {
      expect(
        screen.getByRole("heading", { name: "France" })
      ).toBeInTheDocument();
    });

    const searchButton = screen.getByText("Search");
    fireEvent.click(searchButton);
    expect(consoleSpy).toHaveBeenCalledWith("Search:", "test-query");
    consoleSpy.mockRestore();
  });

  test("calls onFilter when filter is triggered in Header", async () => {
    getCountryByCode.mockResolvedValue(mockCountry);
    const consoleSpy = jest.spyOn(console, "log").mockImplementation();
    render(
      <MemoryRouter>
        <CountryDetails />
      </MemoryRouter>
    );

    await waitFor(() => {
      expect(
        screen.getByRole("heading", { name: "France" })
      ).toBeInTheDocument();
    });

    const filterButton = screen.getByText("Filter");
    fireEvent.click(filterButton);
    expect(consoleSpy).toHaveBeenCalledWith("Filter:", "test-region");
    consoleSpy.mockRestore();
  });
});
