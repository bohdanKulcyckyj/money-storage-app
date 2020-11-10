function createGraph(chart1) {
    chart1.data.datasets[0].data.pop();
    chart1.data.labels.pop();
    chart1.data.datasets[0].data = extractedOutcomeAmount;
    chart1.data.labels = extractedOutcomeNames;

    chart1.update();
}

Chart.defaults.global.defaultFontSize = 17;

//Graf výdajů
let ctx = document.getElementById('myFirstChart').getContext('2d');

let chart1 = new Chart(ctx, {
    type: 'pie',
    data: {
        labels: extractedOutcomeNames,
        datasets: [{
            label: 'Podíl jednotlivých výdajů na celku',
            backgroundColor: ['rgba(255, 99, 132, 0.7)',
            'rgba(54, 162, 235, 0.7)',
            'rgba(255, 206, 86, 0.7)',
            'rgba(250, 51, 204, 0.7)',
            'rgba(75, 192, 0, 0.7)',
            'rgba(153, 102, 255, 0.7)',
            'rgba(255, 159, 64, 0.7)',
            'rgba(153, 51, 255, 0.7)',
            'rgba(255, 51, 0, 0.7)',
            'rgba(25, 206, 186, 0.7)',
            'rgba(7, 92, 192, 0.7)',
            'rgba(0, 153, 51, 0.7)',
            'rgba(255, 255, 0, 0.7)',
            'rgba(255, 99, 132, 0.7)',
            'rgba(54, 162, 235, 0.7)',
            'rgba(255, 206, 86, 0.7)',
            'rgba(250, 51, 204, 0.7)',
            'rgba(75, 192, 0, 0.7)',
            'rgba(153, 102, 255, 0.7)'],
            borderColor: 'white',
            borderWidth: 1,
            data: extractedOutcomeAmount
        }]
    },
    options: {
        legend : {
            position : "right",
        },
        layout : {
            padding : {
                left : 10,
                right : 10,
                top : 0,
                bottom : 0
            }
        },
        responsive : true,
        maintainAspectRatio: false,
    }
});