// This function will be called when a user successfully signs in.
function handleCredentialResponse(response) {
  // The 'response.credential' is the ID token (a JWT).
  const id_token = response.credential;

  // Send this token to your Flask backend.
  fetch("http://localhost:5000/tokensignin", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ id_token: id_token }), // Send the token in the request body
  })
    .then((response) => response.json())
    .then((data) => {
      if (data.status === "success") {
        console.log("Login successful:", data.user);
        // Update the UI with user info
        document.getElementById("g_id_button").classList.add("hidden");
        document.getElementById("signed-in").classList.remove("hidden");

        document.getElementById("name").innerText = data.user.name;
        document.getElementById("email").innerText = data.user.email;
        document.getElementById("avatar").src = data.user.picture;
      } else {
        console.error("Login failed:", data.error);
      }
    })
    .catch((error) => {
      console.error("Error during fetch:", error);
    });
}

// This function handles the sign-out process.
function handleSignOut() {
    // We don't need to notify Google of sign-out for this flow.
    // Just reset the UI.
    document.getElementById("g_id_button").classList.remove("hidden");
    document.getElementById("signed-in").classList.add("hidden");

    document.getElementById("name").innerText = "";
    document.getElementById("email").innerText = "";
    document.getElementById("avatar").src = "";
}


// This function runs when the page is loaded.
window.onload = function () {
  google.accounts.id.initialize({
    // Replace with your actual Google Client ID
    client_id: "362952582119-n3pib5i1qe57tvv9ksh574uoo9rnf0cf.apps.googleusercontent.com", 
    callback: handleCredentialResponse, // The function to call after sign-in
  });

  google.accounts.id.renderButton(
    document.getElementById("g_id_button"),
    { theme: "outline", size: "large" } // Customize the button
  );

  // Add a click listener to the sign-out button
  document.getElementById("signout").addEventListener("click", handleSignOut);
};