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
    //'fq=ss_field_search_image:[* TO *]',
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
    'action-type': 'im_field_action_type'
  },

  fieldMapInverse: {},

  lastChanged: null,

  init: function ($resultsDiv, $causeFields, $timeFields, $actionTypeFields) {
    CampaignFinder.invertFields();
    CampaignFinder.$fields.cause = $causeFields;
    CampaignFinder.$fields.time = $timeFields;
    CampaignFinder.$fields['action-type'] = $actionTypeFields;

    CampaignResults.init($resultsDiv);

    for (var i in CampaignFinder.$fields) {
      CampaignFinder.$fields[i].each(function (idx, element) {
        var field = CampaignFinder.fieldMap[$(element).prop('name')]
          , val = $(element).val()
        ;

        CampaignFinder.defaultQuery.push('facet.query=' + field + ':' + val);
      });

      CampaignFinder.$fields[i].change(function () {
        CampaignFinder.lastChanged = $(this).attr('name');
        if (document.body.clientWidth >= CampaignFinder.cssBreakpoint) {
          clearTimeout(CampaignFinder.throttle);
          CampaignFinder.throttle = setTimeout(CampaignFinder.query, CampaignFinder.throttleTimeout);
        }
      });
    }
  },

  invertFields: function () {
    for (var prop in CampaignFinder.fieldMap) {
      if(CampaignFinder.fieldMap.hasOwnProperty(prop)) {
        CampaignFinder.fieldMapInverse[CampaignFinder.fieldMap[prop]] = prop.replace(/(.)([A-Z])/g, '$1-$2').toLowerCase();
      }
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
      success: function (data) {
        console.log(data);
        CampaignResults.parseResults(data);
        CampaignFinder.disableFields(data.facet_counts.facet_queries);
      },
      jsonp: 'json.wrf'
    });
  },

  disableFields: function (results) {
    for (var key in results) {
      var keyArr = key.split(':');
      var field = keyArr[0]
        , value = keyArr[1];

      if (CampaignFinder.fieldMapInverse[field] !== CampaignFinder.lastChanged) {
        var $e = $('input[name="' + CampaignFinder.fieldMapInverse[field] + '"]')
          , $checkbox = $e.filter('[value="'+value+'"]'),
            disabled = results[key] == 0
        ;

        $checkbox.prop('disabled', disabled);
        if (disabled) {
          $checkbox.prop('checked', !disabled);
          $checkbox.parents('label').addClass('disabled');
        } else {
          $checkbox.parents('label').removeClass('disabled');
        }
      }
    }
  },

  buildQuery: function (query, q) {
    var pos = query.push('q=') - 1;
    if (q.length > 0) {
      query[pos] = 'q=(' + q.join(') AND (') + ')';
    } else {
      query[pos] = 'q=*:*';
    }

    query = query.join('&');
    return CampaignFinder.baseURL + CampaignFinder.collection + '/select?' + query + '&rows=10';
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


