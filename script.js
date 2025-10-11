function calculateTax() {
  const income = parseFloat(document.getElementById("income").value);
  let tax = 0;

  if (isNaN(income) || income <= 0) {
    document.getElementById("result").innerText = "Please enter a valid amount!";
    return;
  }

  if (income <= 250000) tax = 0;
  else if (income <= 500000) tax = 0.05 * (income - 250000);
  else if (income <= 1000000) tax = 12500 + 0.2 * (income - 500000);
  else tax = 112500 + 0.3 * (income - 1000000);

  document.getElementById("result").innerText = `Estimated Tax: ₹${tax.toFixed(2)}`;
}

function submitForm() {
  const name = document.getElementById("name").value.trim();
  const email = document.getElementById("email").value.trim();
  const msg = document.getElementById("message").value.trim();

  if (name && email && msg) {
    alert(`Thank you ${name}! We’ll contact you soon.`);
    document.querySelector("form").reset();
  } else {
    alert("Please fill in all fields.");
  }
  return false;
}

function scrollToSection(id) {
  document.getElementById(id).scrollIntoView({ behavior: "smooth" });
}
