var map;

function updateKartograph(data, selectedCountry, callback){
	//defines the Kartograph map
	map = $K.map('#map', 800, 520);

	var prop = "count",
		scale = "q";

	colorscale = new chroma.ColorScale({
		colors: ['#FFEFEE','#BE3526'],
		limits: [0,500]
	});

	//loads the SVG
	map.loadMap('img/eu_gka.svg', function() {
		map.loadStyles('css/map_styles.css', function() {
			map.addLayer({
				id: 'nuts0',
				key: 'nuts-id'
			});

			map.choropleth({
				data: function(d) {
					return d['nuts-id'];
				},
				key: 'id',
				colors: function(d) {
					if (d === null) return '#fff';
					console.log(d);
					console.log(selectedCountry);
					if (d === selectedCountry)
						return '#005580';
					console.log("FOO")
					var f = _.find(data, function(e) {
						if (e.id == d) {
							return true;
						}
						return false;
					});
					if (f===undefined) return '#fff';
					return colorscale.getColor(f.count);
				},
				duration: 20
			});

			map.onLayerEvent('click', function(d) {
				callback(d);
			});
		});
	});
}