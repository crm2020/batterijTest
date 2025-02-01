import {AfterViewInit, Component, ElementRef, OnInit, ViewChild} from '@angular/core';
import { NavbarComponent } from "../navbar/navbar.component";
import { SharedService } from "../services/shared.service";
import { NgxChartsModule } from "@swimlane/ngx-charts";
import {FormsModule} from "@angular/forms";
import {Chart} from 'chart.js';
import {ApiService} from "../services/api.service";
import {Observable} from "rxjs";
import {SensorData} from "../models/sensordata.model";
import {Measurements} from "../models/measurments.model";

@Component({
  selector: 'app-measurements',
  standalone: true,
  imports: [
    NavbarComponent,
    NgxChartsModule,
    FormsModule
  ],
  templateUrl: './measurements.component.html',
  styleUrl: './measurements.component.css'
})
export class MeasurementsComponent implements OnInit, AfterViewInit{

  sensorData: Measurements[] = [];
  isExpanded: boolean = true;
  defaultNow: Date = new Date;
  localDefaultDate: string;
  default10MinutesAgo: Date;
  batteryChart: any;

  constructor(private shared: SharedService, private api: ApiService) {
    this.localDefaultDate = this.defaultNow.toISOString();
    this.default10MinutesAgo = new Date();
    this.default10MinutesAgo.setMinutes(this.default10MinutesAgo.getMinutes() - 10)
  }

  ngOnInit(): void {
    this.shared.sidebarExpanded$.subscribe(expanded => {
      this.isExpanded = expanded
    });
    this.subscribeNavbarTransitionEnd();
    // this.api.getDummyData().subscribe(data => {
    //   this.sensorData = data;
    //   console.log(this.sensorData);
    //   this.reloadChart();
    // })

    this.api.getMeasurementByID(1).subscribe(data => {
      this.sensorData = data;
      console.log(this.sensorData);
      this.reloadChart();
      }
    )

    this.api.getAllMeasurements()
  }

  ngAfterViewInit() {
    this.createLineChart();
  }

  toggleSidebar() {
    this.isExpanded = !this.isExpanded;
    this.shared.setSidebarExpanded(this.isExpanded);
  }

  createLineChart() {
    const context = document.getElementById('lineChart') as HTMLCanvasElement;
    const temperatureData = this.sensorData.map(data => data.temperature);
    const voltageData = this.sensorData.map(data => data.voltage);
    const amperageData = this.sensorData.map(data => data.amperage);

    const timestamps = this.sensorData.map(data => {
      if (data.time) {
        const date = new Date(data.time);
        return date.toLocaleString(); // Adjust locale and format as needed
      } else {
        return ""; // Or provide a default value
      }
    });
    console.log(timestamps);
    this.batteryChart = new Chart(context!, {
      type: 'line',
      data: {
        labels: timestamps,
        datasets: [
          {
            label: 'Temperature',
            data: temperatureData,
            fill: false,
            borderColor: 'rgb(255, 99, 132)',
            lineTension: 0.1
          },
          {
            label: 'Voltage',
            data: voltageData,
            fill: false,
            borderColor: 'rgb(255, 205, 86)',
            lineTension: 0.1
          },
          {
            label: 'Amperage',
            data: amperageData,
            fill: false,
            borderColor: 'rgb(75, 192, 192)',
            lineTension: 0.1
          }
        ]
      }
    });
  }

  reloadChart() {
    this.batteryChart.destroy();
    this.createLineChart();
  }

  subscribeNavbarTransitionEnd() {
    const navbar = document.querySelector('app-navbar');
    if(navbar) {
      navbar.addEventListener('sidebarTransitionEnd', () => {
        this.reloadChart();
      })
    }
  }
}
