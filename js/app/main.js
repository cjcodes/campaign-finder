define([
  'jquery',
  'app/Campaign',
  'app/CampaignResults'
], function ($) {

  $('[data-toggle]').click(function () {
    var toggleClass = $(this).data('toggle');
    $(this).parents('.' + toggleClass).toggleClass('open')
  });

  CampaignResults.init($('#campaign-results'));

  // http://192.168.1.139:8080/solr/collection1/select?q=*:*&fq=fs_field_active_hours:[*%20TO%202]&fq=bundle:campaign&wt=json&indent=true&facet=true&facet.field=fs_field_active_hours&facet.field=im_field_cause&facet.field=im_field_action_type
  $.get('http://192.168.1.139:8080/solr/collection1/select?q=*%3A*&fq=bundle%3Acampaign&wt=json&indent=true', function (data) {
    console.log(data);
  });

  var c = new Campaign(testData);

  CampaignResults.add(c);
});

