GlobalThermonuclearWar.Controller.Geolocation = Marionette.Controller.extend({

  initialize: function(options) {
    this.map = options.map;
    this.overlay = options.overlay;
    this.player = options.player;

    this.listenTo(this.player, 'located', this.centerMapOnPlayer);

    this.fallbackLocations = {
      havana: [23.133333, -82.383333],
      moscow: [55.751244, 37.618423],
      norad: [38.744332, -104.82772]
    };
  },

  locateUser: function() {
    navigator.geolocation.getCurrentPosition(
      this.geolocationSuccess.bind(this),
      this.geolocationFailure.bind(this),
      { timeout: 4000 }
    );
  },

  geolocationSuccess: function(position) {
    var that = this;
    this.player.locate(position.coords.latitude, position.coords.longitude);
    setTimeout(function() {
      that.overlay.fadeOut()
    }, 500);
  },

  geolocationFailure: function(error) {
    var that = this;
    var coords = _.sample(_.values(this.fallbackLocations));
    this.player.locate(coords[0], coords[1]);
    setTimeout(function() {
      that.overlay.fadeOut();
    }, 500);
  },

  centerMapOnPlayer: function() {
    this.map.map.setCenter(
      new google.maps.LatLng(
        this.player.get('latitude'),
        this.player.get('longitude')
      )
    );
    this.map.map.setZoom(3);
  }

});
