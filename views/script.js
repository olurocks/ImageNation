document.querySelector('.img__btn').addEventListener('click', function() {
  document.querySelector('.cont').classList.toggle('s--signup');
});
const passwordInput = document.getElementById("password-input");
const passwordStrengthIndicator = document.getElementById("password-strength");

function checkPasswordStrength(password) {
  var strengthIndicator = document.getElementById("password-strength");

  // Check password strength
  var strongRegex = /^(?=.*\d)(?=.*[A-Z])(?=.*[a-z]).{8,}$/;
  var mediumRegex = /^(?=.*\d)(?=.*[A-Z])(?=.*[a-z]).{6,}$/;
  var enoughRegex = /^(?=.*\d)(?=.*[a-z]).{6,}$/;

  if (strongRegex.test(password)) {
    strengthIndicator.innerHTML = "Strong";
    strengthIndicator.className = "strong";
  } else if (mediumRegex.test(password)) {
    strengthIndicator.innerHTML = "Medium";
    strengthIndicator.className = "medium";
  } else if (enoughRegex.test(password)) {
    strengthIndicator.innerHTML = "Weak";
    strengthIndicator.className = "weak";
  } else {
    strengthIndicator.innerHTML = "";
    strengthIndicator.className = "";
  }

  // Enable/disable submit button based on password length
  var submitButton = document.getElementById("submit-button");
  if (password.length < 8) {
    submitButton.disabled = true;
  } else {
    submitButton.disabled = false;
  }
}
const ws = new WebSocket('ws://localhost:8080');

ws.onmessage = (event) => {
  const message = JSON.parse(event.data).message;
  // Display the notification on the page
  const notification = document.createElement('div');
  notification.innerText = message;
  document.body.appendChild(notification);
};
