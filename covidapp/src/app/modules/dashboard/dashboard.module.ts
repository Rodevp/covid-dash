import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { DashboardRoutingModule } from './dashboard-routing.module';
import { DashboardComponent } from './dashboard/dashboard.component';
import { PieChartComponent } from './piechart/piechart.component';
import { NgChartsModule} from "ng2-charts"; 


@NgModule({
  imports: [
    CommonModule,
    DashboardRoutingModule,
    NgChartsModule
  ],
  declarations: [
    DashboardComponent,
    PieChartComponent
  ]
})
export class DashboardModule { }
