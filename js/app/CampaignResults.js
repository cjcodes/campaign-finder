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

  checkInit: function () {
    if (CampaignResults.$div === null) {
      throw 'Error: CampaignResults tracker is not initialized.';
    }
  },

  clear: function () {
    CampaignResults.$div.empty();
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