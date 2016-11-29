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

	function Color(v) {
		if (v)
			return '#68A3EA';
		return '#333338';
	}

	function selectionYears(y, n) {
		switch(n) {
			case "2004":
				y[0] = (y[0] + 1)%2; 
			break;
			case "2005":
				y[1] = (y[1] + 1)%2; 
			break;
			case "2006":
				y[2] = (y[2] + 1)%2; 
			break;
			case "2007":
				y[3] = (y[3] + 1)%2; 
			break;
			case "2008":
				y[4] = (y[4] + 1)%2; 
			break;
		}
		return y;
	}

	function boolToString(y) {
		var result = new Array();
		for(var i = 0; i < y.length; i++) {
			if (y[i]) {
				switch(i) {
					case 0:
						result.push("2004");
					break;
					case 1:
						result.push("2005");
					break;
					case 2:
						result.push("2006");
					break;
					case 3:
						result.push("2007");
					break;
					case 4:
						result.push("2008");
					break;
				}
			}
		}
		return result;
	}

	function createTreemap(years, y, m) {

		Highcharts.chart('container', {
        series: [{
            type: 'treemap',
            layoutAlgorithm: 'squarified',
            data: [{
                name: '2004',
                value: years['2004'],
                color : Color(y[0])
            }, {
                name: '2005',
                value: years['2005'],
                color : Color(y[1])
            }, {
                name: '2006',
                value: years['2006'],
                color : Color(y[2])
            }, {
                name: '2007',
                value: years['2007'],
                color : Color(y[3])
            }, {
                name: '2008',
                value: years['2008'],
                color : Color(y[4])
            }]
        }],
        title: {
            text: 'Nombre de modification'
        },
        plotOptions : {
        	series : {
        		point : {
	        		events : {
	        			click : function (e) {
	        				y = selectionYears(y, this.name);
	        				createHisto(10, boolToString(y), m);
	        				createTreemap(years, y, m);
	        			}
	        		}
	        	}
        	}
        }
    });

	}



	$.getJSON("data.json", function(json) {
	var select = [1,1,1,1,1];
	//create histogramme
	var m = createMatrix(json);
	createHisto(10, boolToString(select), m);
	//create treemap
	var years = createMatrixYears(json);
	createTreemap(years, select, m);

    });
});