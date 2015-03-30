module.exports = {
  value: 'harmony',
  effect: function (world, i) {
    world.societies[i].adaptations++;
    world.biodiversity++;
  }
};
