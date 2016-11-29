$(function () {

	function getYear(o) {
		var result = o["User;Name;Date;changes"];
		result = result.split(";")[2];
    	result = result.split(" ")[0];
    	result = result.split("/")[2];
    	return result;
	}

	function getName(o) {
		var result = o["User;Name;Date;changes"];
		result = result.split(";")[1];
    	return result;
	}

	function getChange(o) {
		var result = o["User;Name;Date;changes"];
		result = result.split(";")[3];
    	return parseInt(result);
	}

	function createMatrix(o) {
		var matrix = new Array();
		matrix.push();
		var name, year, change, present;
		for (var i = 0; i < o.length; i++) {
			name = getName(o[i]);
			year = getYear(o[i]);
			change = getChange(o[i]);
			present = false;

			var j = 0;
			while ((j < matrix.length)&&(!present)) {
				//si le sujet est présent
				if (name == matrix[j].sujet) {
					present = true;
					matrix[j].changes[year] = matrix[j].changes[year] + change;
				}
				j++;
			}
			//le sujet n'est pas dans la matrix
			if(!present) {
				var struct = {
					sujet : name,
					changes : {
						2004 : 0,
						2005 : 0,
						2006 : 0,
						2007 : 0,
						2008 : 0,
					}
				};
				struct.changes[year] = change;
				matrix.push(struct);
			}
		}
		return matrix;
	}

	function compare(a,b) {
		if (a.changes < b.changes)
			return 1;
		if (a.changes > b.changes)
			return -1;
		return 0;
	}

	function getTop(n, m, y) {
		var top = new Array();
		var somme;
		for (var i = 0; i < m.length; i++) {
			//calcul de somme des années selectionnées
			somme = 0;
			for (var j = 0; j < y.length; j++) {
				somme = somme + m[i].changes[y[j]];
			}
			top.push({
				sujet : m[i].sujet,
				changes : somme
			});
		}
		top.sort(compare);
		return top.slice(0,n);;
	}

	function getCategories(o) {
		var result = new Array();
		for (var i = 0; i < o.length; i++) {
			if (o[i].changes != 0)
			result.push(o[i].sujet);
		}
		return result;
	}

	function getData(o) {
		var result = new Array();
		for (var i = 0; i < o.length; i++) {
			if (o[i].changes != 0)
				result.push(o[i].changes);
		}
		return result;
	}

	function createMatrixYears(o) {
		var result = {
			2004 : 0,
			2005 : 0,
			2006 : 0,
			2007 : 0,
			2008 : 0
		}
		var y, c;
		for (var i = 0; i < o.length; i++) {
			y = getYear(o[i]);
			c = getChange(o[i]);
			result[y] = result[y] + c;
		}
		return result;
	}

	function createHisto(n, y, m) {
		var top = getTop(n, m, y);
		var annees = "";
		for (var i = 0; i < y.length; i++) {
			annees = annees + " " + y[i];
		}

        Highcharts.chart('container2', {
        chart: {
            type: 'bar'
        },
        title: {
            text: 'Les ' + n +' sujets les plus modifiés'
        },
        subtitle: {
            text: 'Pour les années :' + annees
        },
        xAxis: {
            categories: getCategories(top),
            title: {
                text: null
            }
        },
        yAxis: {
            min: 0,
            title: {
                text: 'Modification',
                align: 'high'
            },
            labels: {
                overflow: 'justify'
            }
        },
        tooltip: {
            valueSuffix: ''
        },
        plotOptions: {
            bar: {
                dataLabels: {
                    enabled: true
                }
            }
        },
        credits: {
            enabled: false
        },
        series: [{
            name: 'Modification',
            data: getData(top)
        }]
    });
	}



	$.getJSON("data.json", function(json) {
	var m = createMatrix(json);
	//create histogramme
	createHisto(10, ["2004", "2005", "2006", "2007", "2008"], m);

	var years = createMatrixYears(json);

	


    var dataviz1 = Highcharts.chart('container', {
        series: [{
            type: 'treemap',
            layoutAlgorithm: 'squarified',
            data: [{
                name: '2004',
                value: years['2004']
            }, {
                name: '2005',
                value: years['2005']
            }, {
                name: '2006',
                value: years['2006']
            }, {
                name: '2007',
                value: years['2007']
            }, {
                name: '2008',
                value: years['2008']
            }]
        }],
        title: {
            text: 'Highcharts Treemap'
        },
        plotOptions : {
        	treemap : {
        		events : {
        			click : function (e) {
        				createHisto(10, ["2004", "2008"], m);
        			}
        		}
        	}
        }
    });

    });
});