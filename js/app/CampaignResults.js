define('jquery');

var CampaignResults = {
  $div: null,
  $multirow: $('<div class="multirow">'),
  lastMultirow: null,

  init: function ($div) {
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

    if (campaign.featured) {
      CampaignResults.$div.append(campaign.render());
    } else {
      if (CampaignResults.lastMultirow !== null) {
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