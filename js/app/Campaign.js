var Campaign = function (data) {
  var defaults = {
    name: 'New Campaign',
    description: 'Take your dad to get his blood pressure checked',
    url: '#',

    featured: false,
    flags: ['Staff Pick'],
    image: 'http://placepuppy.it/300/300',
  };

  $.extend(this, defaults);

  console.log(this);
};
