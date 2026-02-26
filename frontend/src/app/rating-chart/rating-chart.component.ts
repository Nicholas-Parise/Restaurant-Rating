import { Component, Input, ViewChild } from '@angular/core';
import { CommonModule } from '@angular/common';
import { BaseChartDirective } from 'ng2-charts';
/*
import { ChartConfiguration, ChartOptions, ChartType, ChartDataset, Chart } from 'chart.js';
import { CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend } from 'chart.js';
Chart.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend);
*/
import { Chart, ChartConfiguration, ChartType, registerables } from 'chart.js';
Chart.register(...registerables);

@Component({
    selector: 'app-rating-chart',
    imports: [CommonModule, BaseChartDirective],
    templateUrl: './rating-chart.component.html',
    styleUrl: './rating-chart.component.css',
    standalone: true
})
export class RatingChartComponent {

  @Input() histogram: { [key: string]: number } = {};

  @ViewChild(BaseChartDirective) chart?: BaseChartDirective;

  average: string;

  public barChartType: ChartType = 'bar';

  public barChartOptions: ChartConfiguration['options'] = {
    responsive: true,
    plugins: {
      legend: { display: false },
      tooltip: {
        displayColors: false,
        callbacks: {
          title: () => '',
          label: (ctx) => {
            const ratingValue = Number(ctx.label);
            const count = ctx.raw as number;
            const total = Object.values(this.histogram).reduce((a, b) => a + b, 0);

            const percentage = total ? Math.round((count / total) * 100) : 0;

            const fullStars = Math.floor(ratingValue / 2);

            let stars = '★'.repeat(fullStars);
            if (ratingValue % 2 === 1) stars += '½';

            return `${count.toLocaleString()} ${stars} ratings (${percentage}%)`;
          }
        }
      }
    },
    scales: {
      x: { display: true, title: { display: false, text: 'Rating' },
      
      ticks: {
        callback: function(value) {
          // Convert x-axis value to half
          return (0.5 + Number(value) / 2);
        }
      }
    
    },
      y: { beginAtZero: true, display: false }
    }
  };

  public barChartData: ChartConfiguration['data'] = {
    labels: [],
    datasets: [
      {
        data: [],
        label: 'Number of Ratings',
        backgroundColor: '#4f46e5'
      }
    ]
  };

  ngOnChanges() {

    if (this.histogram) {
      const labels = Object.keys(this.histogram);
      const values = Object.values(this.histogram);

      this.barChartData.labels = labels;
      this.barChartData.datasets[0].data = values;
      this.chart?.update();

      const totalRatings = 2 * Object.values(this.histogram).reduce((a: number, b: number) => a + (b as number), 0);
      const weightedSum = Object.entries(this.histogram).reduce((sum: number, [stars, count]: [string, any]) => {
        return sum + (parseInt(stars) * (count as number));
      }, 0);
      this.average = (weightedSum / totalRatings).toFixed(1);


    }
  }

}
