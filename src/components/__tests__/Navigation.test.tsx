import { render, screen } from "@testing-library/react";
import { Navigation } from "../Navigation";

describe("Navigation", () => {
  it("renders navigation links", () => {
    render(<Navigation />);

    expect(
      screen.getByRole("link", { name: /card generator/i }),
    ).toBeInTheDocument();
    expect(
      screen.getByRole("link", { name: /manufacturer/i }),
    ).toBeInTheDocument();
    expect(
      screen.getByRole("button", { name: /contact/i }),
    ).toBeInTheDocument();
  });

  it("has correct link destinations", () => {
    render(<Navigation />);

    const cardGeneratorLink = screen.getByRole("link", {
      name: /card generator/i,
    });
    const manufacturerLink = screen.getByRole("link", {
      name: /manufacturer/i,
    });

    expect(cardGeneratorLink).toHaveAttribute("href", "/");
    expect(manufacturerLink).toHaveAttribute("href", "/manufacturer");
  });

  it("shows brand name and logo", () => {
    render(<Navigation />);

    expect(screen.getByText("Techie Taboo")).toBeInTheDocument();
    expect(screen.getByLabelText("Techie Taboo")).toBeInTheDocument();
  });
});
