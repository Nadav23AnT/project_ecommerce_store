// validation.js

export function validateForm() {
  const name = document.forms.signupForm.name.value;
  const email = document.forms.signupForm.email.value;
  const password = document.forms.signupForm.password.value;
  const confirmPassword = document.forms.signupForm.confirmPassword.value;

  // Regular expressions
  const nameRegex = /^[a-zA-Z\s]+$/;
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  const passwordRegex = /^(?=.*\d)(?=.*[a-z])(?=.*[A-Z])(?=.*[!@#$%^&*]).{8,}$/;

  let isValid = true;

  if (!nameRegex.test(name)) {
    document.getElementById('nameError').textContent = 'Please enter a valid name';
    isValid = false;
  } else {
    document.getElementById('nameError').textContent = '';
  }

  if (!emailRegex.test(email)) {
    document.getElementById('emailError').textContent = 'Please enter a valid email address';
    isValid = false;
  } else {
    document.getElementById('emailError').textContent = '';
  }

  if (!passwordRegex.test(password)) {
    document.getElementById('passwordError').textContent =
      'Please enter a valid password. It must contain at least 8 characters, including at least one digit, one lowercase letter, one uppercase letter, and one special character (!@#$%^&*)';
    isValid = false;
  } else {
    document.getElementById('passwordError').textContent = '';
  }

  if (password !== confirmPassword) {
    document.getElementById('confirmPasswordError').textContent = 'Passwords do not match';
    isValid = false;
  } else {
    document.getElementById('confirmPasswordError').textContent = '';
  }

  if (isValid) {
    alert('Sign up successful!');
  }

  return isValid;
}
