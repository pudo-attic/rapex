var map;

function updateMap(json){

	//defines the Kartograph map
	map = $K.map('#map', 520, 620);

	//loads the SVG
	map.loadMap('assets/map-fr.svg', function() {
		map.loadStyles('css/map_styles.css', function() {
			map.addLayer({
				id: 'countries',
				key: 'id'
			});
			colorizeMap(json);
		})
	});
}

function colorizeMap(json){

	var prop = "datapoint",
		scale = "q";

	colorscale = new chroma.ColorScale({
		colors: ['#fafafa','#0083C9'],
		limits: chroma.limits(json, scale, 2, prop)
	});

	map.choropleth({
		data: json,
		key: 'id',
		colors: function(d) {
			if (d == null) return '#fff';
			return colorscale.getColor(d[prop]);
		},
		duration: 0
	});

}