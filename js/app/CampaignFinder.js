define(['app/CampaignResults']);

var CampaignFinder = {
  throttleTimeout: 1000,
  throttle: null,

  baseURL: 'http://192.168.1.139:8080/solr/',
  collection: 'collection1',

  // This would be awesome with an object key:value, but Solr allows multiple of the same key
  defaultQuery: [
    'q=*:*',
    'fq=bundle:campaign',
    'wt=json',
    'indent=false',
    'facet=true',
    'facet.field=fs_field_active_hours',
    'facet.field=im_field_cause',
    'facet.field=im_field_action_type'
  ],

  $fields: {},
  fieldMap: {
    'cause': 'im_field_cause',
    'time': 'fs_field_active_hours',
    'actionType': 'im_field_action_type'
  },

  init: function ($resultsDiv, $causeFields, $timeFields, $actionTypeFields) {
    CampaignFinder.$fields.cause = $causeFields;
    CampaignFinder.$fields.time = $timeFields;
    CampaignFinder.$fields.actionType = $actionTypeFields;

    CampaignResults.init($resultsDiv);

    for (var i in CampaignFinder.$fields) {
      CampaignFinder.$fields[i].change(function () {
        clearTimeout(CampaignFinder.throttle);
        CampaignFinder.throttle = setTimeout(CampaignFinder.query, CampaignFinder.throttleTimeout);
      });
    }
  },

  query: function () {
    /*
    fs_field_active_hours
    im_field_cause
    im_field_action_type
    */
    var query = [];
    for (var i in CampaignFinder.$fields) {
      var checked = CampaignFinder.$fields[i].filter(':checked');

      if (checked.length > 0) {
        var q = [];
        checked.each(function (index, e) {
          q.push($(e).val());
        });

        param = '(' + q.join(') OR (') + ')';

        query.push('fq=' + CampaignFinder.fieldMap[i] + ':' + encodeURIComponent(param));
      }
    }

    CampaignResults.loading();
    if (CampaignFinder.xhr) {
      CampaignFinder.xhr.abort();
    }
    CampaignFinder.xhr = $.ajax({
      dataType: 'jsonp',
      url: CampaignFinder.buildQuery(query),
      success: CampaignResults.parseResults,
      jsonp: 'json.wrf'
    });
  },

  buildQuery: function (params) {
    var query = CampaignFinder.defaultQuery.join('&');

    if (typeof params == 'object') {
      query = query + '&' + params.join('&');
    }

    return CampaignFinder.baseURL + CampaignFinder.collection + '/select?' + query;
  }
};
