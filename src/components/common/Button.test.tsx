import { render, screen, fireEvent, cleanup } from "@testing-library/react";
import { describe, it, expect, vi, afterEach } from "vitest";
import Button from "./Button";

afterEach(() => {
  cleanup();
});

describe("Button", () => {
  it("renders children text", () => {
    render(<Button>Click me</Button>);
    expect(screen.getByRole("button", { name: /click me/i })).toBeInTheDocument();
  });

  it("defaults to primary variant styles", () => {
    render(<Button>Primary</Button>);
    const btn = screen.getByRole("button", { name: "Primary" });
    expect(btn.className).toContain("bg-primary-container");
    expect(btn.className).toContain("text-white");
  });

  it("applies secondary variant styles", () => {
    render(<Button variant="secondary">Secondary</Button>);
    const btn = screen.getByRole("button", { name: "Secondary" });
    expect(btn.className).toContain("bg-secondary-container");
    expect(btn.className).toContain("text-on-secondary-container");
  });

  it("applies outline variant styles", () => {
    render(<Button variant="outline">Outline</Button>);
    const btn = screen.getByRole("button", { name: "Outline" });
    expect(btn.className).toContain("bg-surface");
    expect(btn.className).toContain("border-outline");
    expect(btn.className).toContain("text-on-surface");
  });

  it("applies text variant styles", () => {
    render(<Button variant="text">Text btn</Button>);
    const btn = screen.getByRole("button", { name: "Text btn" });
    expect(btn.className).toContain("text-primary-container");
  });

  it("applies size classes correctly", () => {
    const { unmount } = render(<Button size="sm">Small</Button>);
    expect(screen.getByRole("button", { name: "Small" }).className).toContain("py-1.5");
    unmount();

    const { unmount: u2 } = render(<Button size="md">Medium</Button>);
    expect(screen.getByRole("button", { name: "Medium" }).className).toContain("py-2");
    u2();

    render(<Button size="lg">Large</Button>);
    expect(screen.getByRole("button", { name: "Large" }).className).toContain("py-3");
  });

  it("has minimum 44px touch target", () => {
    render(<Button>Touch</Button>);
    expect(screen.getByRole("button", { name: "Touch" }).className).toContain("min-h-[44px]");
  });

  it("renders icon on the left by default", () => {
    render(<Button icon="star">Starred</Button>);
    const btn = screen.getByRole("button", { name: "Starred" });
    const icon = btn.querySelector(".material-symbols-outlined");
    expect(icon).toBeInTheDocument();
    expect(icon?.textContent).toBe("star");
    // Icon should come before the text node
    const children = Array.from(btn.childNodes);
    const iconIndex = children.indexOf(icon as ChildNode);
    expect(iconIndex).toBeLessThan(children.length - 1);
  });

  it("renders icon on the right when iconPosition is right", () => {
    render(<Button icon="arrow_forward" iconPosition="right">Next</Button>);
    const btn = screen.getByRole("button", { name: "Next" });
    const icon = btn.querySelector(".material-symbols-outlined");
    expect(icon).toBeInTheDocument();
    // Icon should come after the text node
    const children = Array.from(btn.childNodes);
    const iconIndex = children.indexOf(icon as ChildNode);
    expect(iconIndex).toBeGreaterThan(0);
  });

  it("shows spinner and sets aria-busy when loading", () => {
    render(<Button loading>Loading</Button>);
    const btn = screen.getByRole("button", { name: "Loading" });
    expect(btn).toHaveAttribute("aria-busy", "true");
    expect(btn.querySelector("svg.animate-spin")).toBeInTheDocument();
    expect(btn).toBeDisabled();
  });

  it("hides icon when loading", () => {
    render(<Button loading icon="star">Saving</Button>);
    const btn = screen.getByRole("button", { name: "Saving" });
    expect(btn.querySelector(".material-symbols-outlined")).not.toBeInTheDocument();
  });

  it("does not set aria-busy when not loading", () => {
    render(<Button>Normal</Button>);
    expect(screen.getByRole("button", { name: "Normal" })).not.toHaveAttribute("aria-busy");
  });

  it("disables the button when disabled prop is true", () => {
    render(<Button disabled>Disabled</Button>);
    expect(screen.getByRole("button", { name: "Disabled" })).toBeDisabled();
  });

  it("applies disabled styling classes", () => {
    render(<Button disabled>No go</Button>);
    const btn = screen.getByRole("button", { name: "No go" });
    expect(btn.className).toContain("disabled:opacity-50");
    expect(btn.className).toContain("disabled:cursor-not-allowed");
  });

  it("applies focus-visible ring classes", () => {
    render(<Button>Focus</Button>);
    const btn = screen.getByRole("button", { name: "Focus" });
    expect(btn.className).toContain("focus-visible:ring-2");
    expect(btn.className).toContain("focus-visible:ring-primary");
  });

  it("forwards onClick handler", () => {
    const handleClick = vi.fn();
    render(<Button onClick={handleClick}>Clicker</Button>);
    fireEvent.click(screen.getByRole("button", { name: "Clicker" }));
    expect(handleClick).toHaveBeenCalledOnce();
  });

  it("does not fire onClick when disabled", () => {
    const handleClick = vi.fn();
    render(<Button disabled onClick={handleClick}>Nope</Button>);
    fireEvent.click(screen.getByRole("button", { name: "Nope" }));
    expect(handleClick).not.toHaveBeenCalled();
  });

  it("merges custom className", () => {
    render(<Button className="my-custom-class">Custom</Button>);
    expect(screen.getByRole("button", { name: "Custom" }).className).toContain("my-custom-class");
  });

  it("forwards additional HTML button attributes", () => {
    render(<Button type="submit" data-testid="submit-btn">Submit</Button>);
    const btn = screen.getByTestId("submit-btn");
    expect(btn).toHaveAttribute("type", "submit");
  });
});
