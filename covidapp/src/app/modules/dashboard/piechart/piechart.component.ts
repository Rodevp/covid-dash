import { Component, Input } from '@angular/core';
import { ChartOptions } from 'chart.js';

@Component({
  selector: 'app-pie-chart',
  templateUrl: './piechart.component.html',
  styleUrls: ['./piechart.component.scss']
})
export class PieChartComponent {

  @Input() label: string[] = [];
  @Input() values: number[] = [];

  pieChartOptions: ChartOptions<'pie'> = {
    responsive: true,
  };
  pieChartLegend = true;
  pieChartPlugins = [];

  constructor() {
  }

}