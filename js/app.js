(function ($) {
    var ds = new Miso.Dataset({
      url : "data/full.csv",
      delimiter : ",",
      columns : [
      ]
    });

    colorscale = new chroma.ColorScale({
        colors: ['#FFEFEE','#BE3526'],
        limits: [0,500]
    });

    map = $K.map('#map', 800, 520);

    var selectedCategory = null, selectedCountry = null;

    var update = function() {
        updateSidebar(ds);
        updateMap(ds.where({
            rows: function(row) {
                return !selectedCategory || selectedCategory==row.descript_category;
            }
        }));
        updateList(ds);
    };

    var updateSidebar = function(ds) {
        var categories = ds.where({
            rows: function(row) {
                return !selectedCountry || selectedCountry==row.country_code;
            }
        }).countBy('descript_category');

        categories = categories.sort({comparator: function(e, a) {
            return -1 * (e.count - a.count);
        }});
        $("#nav li:has(a)").remove();
        categories.each(function(cat) {
            $("#nav").append("<li class='cat'><a href='#' data-name='"+cat.descript_category+"'>"+cat.descript_category+" (" +cat.count+ ")</a></li>");
        });
        
    };

    var updateMap = function(ds) {
        var countries = ds.countBy('country_code');
        var data = [];
        countries.each(function(country) {
            data.push({
                'id': country.country_code,
                'name': country.country_code,
                'count': country.count
            });
        });

        map.choropleth({
            data: function(d) {
                return d['nuts-id'];
            },
            key: 'id',
            colors: function(d) {
                if (d === null) return '#fff';
                if (d === selectedCountry)
                    return '#005580';
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
    };

    var updateList = function(ds) {
        if (!selectedCategory || !selectedCountry) {
            return;
        }
        $("#list").empty();
        
        ds.where({
            rows: function(row) {
                return selectedCategory==row.descript_category &&
                       selectedCountry==row.country_code;
            }
        }).each(function(row) {
            $("#list").append("<tr> \
                <td>"+row.descript_brand+"</td> \
                <td>"+row.descript_product+"</td> \
                <td>"+row.danger_short+"</td> \
                <td>"+row.countryoforigin+"</td> \
                <td>"+row.measures+"</td> \
                </tr>");
        });
    };

    ds.fetch({
      success: function() {
        console.log(ds.columnNames());

        //loads the SVG
        map.loadMap('img/eu_gka.svg', function() {
            map.addLayer({
                id: 'nuts0',
                key: 'nuts-id'
            });

            map.onLayerEvent('click', function(d) {
                selectedCountry = selectedCountry==d['nuts-id'] ? null : d['nuts-id'];
                update();
            });

            $("#nav").on('click', 'a', function(e) {
                var categoryName = $(e.currentTarget).data('name');
                if (selectedCategory == categoryName) {
                    selectedCategory = null;
                } else {
                    selectedCategory = categoryName;
                }
                update();    
                $("#nav li").removeClass('active');
                $("#nav li").each(function(i, e) {
                    if ($(e).find('a').data('name') == selectedCategory) {
                        $(e).addClass('active');
                    }
                });
                return false;
            });

            update();
        });

      }
    });
})(jQuery);