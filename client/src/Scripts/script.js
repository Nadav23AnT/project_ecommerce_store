import $ from 'jquery';

$(function () {
  const bg = $('.bg');

  // assign event to all links
  $('.product-link').on('click', function () {
    const id = $(this).data('product-id');

    const productElement = $(`#${id}`);
    bg.eq(0).css('display', 'block');

    productElement.css('top', '50%');
  });

  $(document).on('keydown', function (event) {
    if (event.key === 'Escape') {
      bg.eq(0).css('display', 'none');
      $('.full-product').css('top', '-50%');
    }
  });
});

function validateForm() {
  var name = document.forms['signupForm']['name'].value;
  var email = document.forms['signupForm']['email'].value;
  var password = document.forms['signupForm']['password'].value;
  var confirmPassword = document.forms['signupForm']['confirmPassword'].value;

  // Regular expressions
  var nameRegex = /^[a-zA-Z\s]+$/;
  var emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  var passwordRegex = /^(?=.*\d)(?=.*[a-z])(?=.*[A-Z])(?=.*[!@#$%^&*]).{8,}$/;

  if (!nameRegex.test(name)) {
    alert('Please enter a valid name');
    return false;
  }

  if (!emailRegex.test(email)) {
    alert('Please enter a valid email address');
    return false;
  }

  if (!passwordRegex.test(password)) {
    alert(
      'Please enter a valid password. It must contain at least 8 characters, including at least one digit, one lowercase letter, one uppercase letter, and one special character (!@#$%^&*)'
    );
    return false;
  }

  if (password !== confirmPassword) {
    alert('Passwords do not match');
    return false;
  }

  alert('Sign up successful!');
  return true;
}
