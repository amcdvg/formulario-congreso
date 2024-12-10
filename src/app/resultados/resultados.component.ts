
import { Component, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Chart, registerables } from 'chart.js';
import ChartDataLabels from 'chartjs-plugin-datalabels';

@Component({
  selector: 'app-resultados',
  templateUrl: './resultados.component.html',
  styleUrls: ['./resultados.component.scss']
})
export class ResultadosComponent implements OnInit {
  respuestas: any[] = [];
  currentQuestionIndex: number = 0;

  barChart: any;
  pieChart: any;
  questions: string[] = [
    '¿Cuáles son las debilidades de su sector?',
    '¿Cuáles son las oportunidades en su sector?',
    '¿Cuáles son las fortalezas de su sector?',
    '¿Cuáles son las amenazas en su sector?'
  ];
  constructor(private http: HttpClient) {
    Chart.register(...registerables, ChartDataLabels);
  }

  ngOnInit() {
    this.loadRespuestas();
  }

  loadRespuestas() {
    this.http.get('https://back-formulario-congreso.onrender.com/respuestas').subscribe((data: any) => {
      this.respuestas = data;
      this.renderCharts();
    });
  }

  renderCharts() {
    const respuestasActuales = this.respuestas.find(
      r => r._id === this.currentQuestionIndex
    )?.respuestas || [];

    const conteoRespuestas = this.contarRespuestas(respuestasActuales);

    // Calcular porcentajes
    const totalRespuestas = respuestasActuales.length;
    const porcentajes = Object.keys(conteoRespuestas).reduce((acc: { [key: string]: number }, key: string) => {
      acc[key] = parseFloat(((conteoRespuestas[key] / totalRespuestas) * 100).toFixed(2)); // Convertir a número
      return acc;
    }, {});

    // Crear un arreglo de colores para las barras
    const colors = [
      '#FF6384', '#36A2EB', '#FFCE56', '#4BC0C0', '#9966FF', '#FF9F40', '#FFCD56', '#C9CBCF'
    ];

    // Crear gráfico de barras
    if (this.barChart) this.barChart.destroy();
    this.barChart = new Chart('barChart', {
      type: 'bar',
      data: {
        labels: Object.keys(porcentajes),
        datasets: [
          {
            label: 'Porcentaje',
            data: Object.values(porcentajes),
            backgroundColor: Object.keys(porcentajes).map((_, index) => colors[index % colors.length]),
          },
        ],
      },
      options: {
        plugins: {
          datalabels: {
            anchor: 'end',
            align: 'top',
            formatter: (value: number) => value + '%',
            font: {
              weight: 'bold',
            },
          },
          legend: {
            display: false // Ocultar la leyenda que muestra la etiqueta de 'label'
          }
        },
        scales: {
          y: {
            beginAtZero: true,
            ticks: {
              callback: function (tickValue: string | number) {
                if (typeof tickValue === 'number') {
                  return tickValue + '%'; // Mostrar porcentaje
                }
                return tickValue;
              },
            },
          },
        },
      },
      plugins: [ChartDataLabels],
    });

    // Crear gráfico de pastel
    if (this.pieChart) this.pieChart.destroy();
    this.pieChart = new Chart('pieChart', {
      type: 'pie',
      data: {
        labels: Object.keys(porcentajes),
        datasets: [
          {
            data: Object.values(porcentajes),
            backgroundColor: Object.keys(porcentajes).map((_, index) => colors[index % colors.length]),
          },
        ],
      },
      options: {
        plugins: {
          datalabels: {
            formatter: (value: number, context: any) => {
              const label = context.chart.data.labels[context.dataIndex];
              return `${value}%`;
            },
            color: '#fff',
            font: {
              weight: 'bold',
            },
          },
        },
      },
      plugins: [ChartDataLabels],
    });
  }


  contarRespuestas(respuestas: string[]) {
    return respuestas.reduce((acc: { [key: string]: number }, respuesta: string) => {
      acc[respuesta] = (acc[respuesta] || 0) + 1;
      return acc;
    }, {});
  }

  preguntaAnterior() {
    if (this.currentQuestionIndex > 0) {
      this.currentQuestionIndex--;
      this.renderCharts();
    }
  }

  siguientePregunta() {
    if (this.currentQuestionIndex < this.respuestas.length - 1) {
      this.currentQuestionIndex++;
      this.renderCharts();
    }
  }
}
