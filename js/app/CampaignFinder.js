define(['app/CampaignResults']);

var CampaignFinder = {
  throttleTimeout: 1000,
  throttle: null,

  cssBreakpoint: 768,

  baseURL: 'http://192.168.1.139:8080/solr/',
  collection: 'collection1',

  // This would be awesome with an object key:value, but Solr allows multiple of the same key
  defaultQuery: [
    'fq=bundle:campaign',
    'wt=json',
    'indent=false',
    'facet=true',
    'facet.field=fs_field_active_hours',
    'facet.field=im_field_cause',
    'facet.field=im_field_action_type',
    'sort=bs_sticky+desc,bs_field_staff_pick+desc',
    'rows=10'
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
        if (document.body.clientWidth >= CampaignFinder.cssBreakpoint) {
          clearTimeout(CampaignFinder.throttle);
          CampaignFinder.throttle = setTimeout(CampaignFinder.query, CampaignFinder.throttleTimeout);
        }
      });
    }
  },

  query: function () {
    var query = CampaignFinder.defaultQuery.slice(0)
      , q = [];

    for (var i in CampaignFinder.$fields) {
      var checked = CampaignFinder.$fields[i].filter(':checked');

      if (checked.length > 0) {
        var join = [];
        checked.each(function (index, e) {
          join.push($(e).val());
        });

        param = '(' + join.join(') OR (') + ')';
        param += CampaignFinder.generatePowerset(join);

        q.push(CampaignFinder.fieldMap[i] + ':' + encodeURIComponent(param));
      }
    }

    CampaignResults.loading();
    if (CampaignFinder.xhr) {
      CampaignFinder.xhr.abort();
    }
    CampaignFinder.xhr = $.ajax({
      dataType: 'jsonp',
      url: CampaignFinder.buildQuery(query, q),
      success: CampaignResults.parseResults,
      jsonp: 'json.wrf'
    });
  },

  buildQuery: function (query, q) {
    var pos = query.push('q=') - 1;
    if (q.length > 0) {
      query[pos] = 'q=(' + q.join(') AND (') + ')';
    } else {
      query[pos] = 'q=*:*';
    }

    query = query.join('&');
    return CampaignFinder.baseURL + CampaignFinder.collection + '/select?' + query + '&rows=10&start=' + CampaignResults.start;
  },

  generatePowerset: function (params) {
    function powerset(ary) {
      var ps = [[]];
      for (var i=0; i < ary.length; i++) {
        for (var j = 0, len = ps.length; j < len; j++) {
          ps.push(ps[j].concat(ary[i]));
        }
      }
      return ps;
    }

    var variations = powerset(params),
        q = [];
    for (var i = 1; i < variations.length; i++) {
      if (variations[i].length > 1) {
        q.push('((' + variations[i].join(') AND (') + '))^' + (100*variations[i].length));
      }
    }

    return q.join(' OR ');
  }
};


