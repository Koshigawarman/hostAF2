/* eslint-disable no-undef */
import React from "react";
import { render, screen } from "@testing-library/react";
import Footer from "../../components/Footer"; // Adjust path as necessary

describe("Footer Component", () => {
  test("renders without crashing", () => {
    render(<Footer />);
    expect(screen.getByRole("contentinfo")).toBeInTheDocument();
  });

  test("displays copyright text", () => {
    render(<Footer />);
    expect(screen.getByText("© 2024 WORLDieee Inc.")).toBeInTheDocument();
  });

  test("displays built with text", () => {
    render(<Footer />);
    expect(
      screen.getByText("Built with React and Tailwind CSS")
    ).toBeInTheDocument();
  });

  test("has correct footer className", () => {
    render(<Footer />);
    const footer = screen.getByRole("contentinfo");
    expect(footer).toHaveClass(
      "bg-black max-w-full text-white p-6 shadow-inner"
    );
  });
});
