import { Component, Input, OnInit } from '@angular/core';
import { ChartOptions, ChartType, ChartDataSets } from 'chart.js';

@Component({
  selector: 'app-bar-chart',
  templateUrl: './bar-chart.component.html',
  styleUrls: ['./bar-chart.component.css']
})
export class BarChartComponent implements OnInit {

  public barChartOptions: ChartOptions = {
    responsive: true,
    scales: {
      xAxes: [{
          gridLines: {
              display:false
          },
          ticks: {
            stepSize: 1,
            beginAtZero: true
          }
      }],
      yAxes: [{
          gridLines: {
              display:false
          }
      }]
    }
  };

  @Input()
  public barChartLabels:string[];
  public barChartType: ChartType;
  public barChartLegend:boolean;
  @Input()
  public barChartData: ChartDataSets[];
  public chartColors: Array<object>= [
    {
      backgroundColor: '#01BAEF',
      borderColor: 'rgba(225,255,255,0.2)',
      pointBackgroundColor: 'rgba(225,10,24,0.2)',
      pointBorderColor: 'orange',
      pointHoverBackgroundColor: '#fff',
      pointHoverBorderColor: 'rgba(225,10,24,0.2)'
    }
  ];
  public showChart:boolean = false;

  constructor() { 
    this.barChartType ='horizontalBar';
    this.showChart = true;
    this.barChartLegend = true;
  }

  ngOnInit() {
  }

}
