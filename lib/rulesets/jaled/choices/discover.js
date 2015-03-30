module.exports = {
  value: 'knowledge',
  effect: function (world, i) {
    // increase these attributes
    var attrs = ['might', 'wealth', 'subtlety', 'infrastructure'];
    var society = world.societies[i];
    // gain resources for each attribute raised
    society.resources += attrs.length;
    // increase the attributes by 1 each
    attrs.forEach(function (attr) {
      society[attr] += 1;
    });
  }
};
