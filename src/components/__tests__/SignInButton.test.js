import React from "react";
import { render, screen, fireEvent } from "@testing-library/react";
import SignInButton from "../SignInButton";

describe("SignInButton", () => {
  const userData = null;
  const handleSignIn = jest.fn();
  const handleSignOut = jest.fn();

  it("calls the handleSignIn function when the sign-in button is clicked", () => {
    render(
      <SignInButton
        handleSignIn={handleSignIn}
        handleSignOut={handleSignOut}
        userData={userData}
      />
    );

    const signInButton = screen.getByTestId("sign-in-button");
    fireEvent.click(signInButton);

    expect(handleSignIn).toHaveBeenCalled();
  });

  it("calls the handleSignOut function when the sign-out button is clicked", () => {
    const userData = { name: "John Doe" };

    render(
      <SignInButton
        handleSignIn={handleSignIn}
        handleSignOut={handleSignOut}
        userData={userData}
      />
    );

    const signOutButton = screen.getByTestId("sign-out-button");
    fireEvent.click(signOutButton);

    expect(handleSignOut).toHaveBeenCalled();
  });
});
