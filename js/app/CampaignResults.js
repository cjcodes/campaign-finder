define(['jquery']);

var CampaignResults = {
  $div: null,
  $multirow: null,
  $singlerow: null,

  lastMultirow: null,
  items: 0,
  max: 4,

  init: function ($div) {
    CampaignResults.$multirow = $('<div class="multirow">');
    CampaignResults.$singlerow = $('<div class="single-result">');
    CampaignResults.$div = $div;
  },

  parseResults: function (data) {
    CampaignResults.clear();

    for (var i in data.response.docs) {
      CampaignResults.add(new Campaign(data.response.docs[i]));
    }

    CampaignResults.loading(false);
  },

  loading: function (setTo) {
    if (setTo == undefined) {
      setTo = true;
    }

    if (setTo === true) {
      CampaignResults.$div.addClass('loading');
    } else {
      CampaignResults.$div.removeClass('loading');
    }
  },

  checkInit: function () {
    if (CampaignResults.$div === null) {
      throw 'Error: CampaignResults tracker is not initialized.';
    }
  },

  clear: function () {
    CampaignResults.checkInit();
    CampaignResults.$div.empty();

    CampaignResults.items = 0;
    CampaignResults.lastMultirow = null;
  },

  add: function (campaign) {
    CampaignResults.checkInit();

    if (campaign.featured && CampaignResults.items + 2 > CampaignResults.max) {
      return;
    } else if (CampaignResults.items == CampaignResults.max){
      return;
    }

    if (campaign.featured) {
      CampaignResults.$div.append(CampaignResults.$singlerow.clone().append(campaign.render()));
      CampaignResults.items += 2;
    } else {
      if (CampaignResults.lastMultirow !== null) {
        CampaignResults.items += 1;
        CampaignResults.lastMultirow.append(campaign.render());
        CampaignResults.lastMultirow = null;
      } else {
        CampaignResults.lastMultirow = CampaignResults.$multirow.clone();
        CampaignResults.$div.append(CampaignResults.lastMultirow);
        CampaignResults.lastMultirow.append(campaign.render());
      }
    }
  }
};