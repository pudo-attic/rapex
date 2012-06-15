(function ($) {
    var ds = new Miso.Dataset({
      url : "data/full.csv",
      delimiter : ",",
      columns : [
      ]
    });

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
                return !selectedCountry || selectedCountry==row.country;
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
        var countries = ds.countBy('country');
        countries.each(function(country) {
            //console.log(country);
        });
    };

    var updateList = function(ds) {
        $("#list").empty();
        if (!selectedCategory || !selectedCountry) {
            return;
        }
        ds.where({
            rows: function(row) {
                return selectedCategory==row.descript_category &&
                       selectedCountry==row.country;
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
        //ds.countBy('country').each(function(e) {
        //    console.log(e.country + ',' + e.count);
        //});
        $("#nav").on('click', 'a', function(e) {
            var categoryName = $(e.currentTarget).data('name');
            if (selectedCategory == categoryName) {
                selectedCategory = null;
            } else {
                selectedCategory = categoryName;
            }
            selectedCountry = 'Belgium';
            update();    
            $("#nav li").removeClass('active');
            $("#nav li").each(function(i, e) {
                if ($(e).find('a').data('name') == selectedCategory) {
                    $(e).addClass('active');
                }
            });
        });
        update();
      }
    });
})(jQuery);