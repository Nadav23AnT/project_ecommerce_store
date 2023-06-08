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

  if (name === '') {
    alert('Please enter your name');
    return false;
  }

  if (email === '') {
    alert('Please enter your email');
    return false;
  }

  if (password === '') {
    alert('Please enter a password');
    return false;
  }

  if (confirmPassword === '') {
    alert('Please confirm your password');
    return false;
  }

  if (password !== confirmPassword) {
    alert('Passwords do not match');
    return false;
  }

  alert('Sign up successful!');
  return true;
}
