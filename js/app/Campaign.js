var Campaign = function (data) {
  var defaults = {
    title: 'New Campaign', // label
    description: 'Take your dad to get his blood pressure checked', // teaser
    url: '#', // url

    staffPick: false, // bs_field_staff_pick
    featured: false,
    image: 'http://lorempixel.com/600/600?' + Math.random() //
  };

  $.extend(this, defaults, this.convert(data));
};

Campaign.prototype.convert = function (data) {
  var newData = {};
  var map = {
    'label': 'title',
    'sm_field_call_to_action': 'description',
    'url': 'url',
    'bs_field_staff_pick': 'staffPick',
    'bs_sticky': 'featured',
    //'ss_field_search_image': 'image'
  };

  for (var i in data) {
    if (map[i] !== undefined) {
      newData[map[i]] = data[i];
    }
  }

  return newData;
};

Campaign.prototype.render = function () {
  var $wrapper = $('#campaign-finder-template>div').clone();

  $wrapper.css('background-image', 'url(' + this.image + ')');

  if (!this.staffPick) {
    $wrapper.find('.flag').remove();
  }

  if (this.featured) {
    $wrapper.addClass('big');
  }

  $wrapper.find('p').text(this.description);
  $wrapper.find('h4').text(this.title);
  if (false) {
    $wrapper.find('.powered-by img').prop('src', '');
  } else {
    $wrapper.find('.powered-by').remove();
  }

  return $wrapper;
};