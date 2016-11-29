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
		return top.slice(0,n);
	}

	function getCategories(o) {
		var result = new Array();
		for (var i = 0; i < o.length; i++) {
			result.push(o[i].sujet);
		}
		return result;
	}

	function getData(o) {
		var result = new Array();
		for (var i = 0; i < o.length; i++) {
			result.push(o[i].changes);
		}
		return result;
	}


	$.getJSON("data.json", function(json) {

	var n = 10;
	var y = ["2007", "2008"];
	var annees = "";
	for (var i = 0; i < y.length; i++) {
		annees = annees + " " + y[i];
	}

	var m = createMatrix(json);
	var top = getTop(n, m, y);

    Highcharts.chart('container', {
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
        /*legend: {
            layout: 'vertical',
            align: 'right',
            verticalAlign: 'top',
            x: -40,
            y: 80,
            floating: true,
            borderWidth: 1,
            backgroundColor: ((Highcharts.theme && Highcharts.theme.legendBackgroundColor) || '#FFFFFF'),
            shadow: true
        },*/
        credits: {
            enabled: false
        },
        series: [{
            name: 'Modification',
            data: getData(top)
        }]
    });
    });
});