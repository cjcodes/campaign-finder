define([
  'jquery',
  'app/Campaign'
], function ($) {

  $('[data-toggle]').click(function () {
    var toggleClass = $(this).data('toggle');

    $(this).parents('.' + toggleClass).toggleClass('open')
  });
});

