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
