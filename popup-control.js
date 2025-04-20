document.addEventListener("DOMContentLoaded", function () {
  const isVariantB = document.body.classList.contains("variant-b");
  const popup = document.getElementById("leadPopup");

  // Cookie helpers
  function setCookie(name, value, days) {
    const date = new Date();
    date.setTime(date.getTime() + days * 24 * 60 * 60 * 1000);
    document.cookie = `${name}=${value};expires=${date.toUTCString()};path=/;SameSite=Lax`;
  }

  function getCookie(name) {
    const value = `; ${document.cookie}`;
    const parts = value.split(`; ${name}=`);
    if (parts.length === 2) return parts.pop().split(";").shift();
  }

  // Toon popup na 30 seconden als cookie niet bestaat
  if (!getCookie("popupShown")) {
    setTimeout(() => {
      popup.classList.add("active");
      setCookie("popupShown", "true", 1); // Cookie geldig voor 1 dag

      // Track in Google Analytics (via GTM)
      if (window.dataLayer) {
        window.dataLayer.push({
          event: "popupShown",
          popupVariant: "control",
        });
      }
    }, 30000);
  }

  // Sluit functionaliteit
  closeBtn.addEventListener("click", () => {
    popup.classList.remove("active");
  });

  document
    .querySelector(".popup-form")
    .addEventListener("submit", async function (e) {
      e.preventDefault();
      const email = this.querySelector('input[type="email"]').value;

      // Check if email is already submitted
      const submitted = JSON.parse(
        localStorage.getItem("subscribedEmails") || "[]"
      );
      if (submitted.includes(email)) {
        alert("Je bent al ingeschreven!");
        return;
      }

      try {
        const response = await fetch(
          "https://script.google.com/macros/s/AKfycbwKBoHqOjKmL2ncLmyUpd-VIG99ovCVMPxoFsIannANZE2IpLPSliA1IqYV-0EZk8-CIA/exec",
          {
            method: "POST",
            mode: "no-cors", // Add this to handle CORS
            body: JSON.stringify({ email: email }),
            headers: {
              "Content-Type": "application/json",
              Accept: "application/json",
            },
          }
        );

        // Since we're using no-cors, we can't read the response
        // So we'll assume success and update local storage
        setSubmittedEmail(email);
        alert("Bedankt voor je inschrijving!");
        popup.classList.remove("active");

        if (window.dataLayer) {
          window.dataLayer.push({
            event: "popupConversion",
            popupVariant: "control",
          });
        }
      } catch (error) {
        console.error("Error:", error);
        alert("Oeps! Er ging iets mis. Probeer het later opnieuw.");
      }
    });

  function setSubmittedEmail(email) {
    const submitted = JSON.parse(
      localStorage.getItem("subscribedEmails") || []
    );
    if (!submitted.includes(email)) {
      submitted.push(email);
      localStorage.setItem("submittedEmails", JSON.stringify(submitted));
    }
  }
});
