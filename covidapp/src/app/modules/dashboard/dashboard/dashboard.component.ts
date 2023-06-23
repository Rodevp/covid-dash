import { Component, OnInit } from '@angular/core';
import * as XLSX from "xlsx";
import { DateObject, Sheet } from '../dashboard.t';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.scss']
})
export class DashboardComponent implements OnInit {

  constructor() { }

  dataSheets: Sheet[] = [];

  redCsv(event: any) {

    const file = event?.target?.files[0];

    const reader = new FileReader();
    reader.readAsBinaryString(file);


    reader.addEventListener('load', (e) => {

      const workbook = XLSX.read(reader.result, { type: "binary" });

      const sheetsNames: String[] = workbook.SheetNames;

      const sheet = sheetsNames[0];

      this.dataSheets = XLSX.utils.sheet_to_json(workbook.Sheets[`${sheet}`]);

      this.parseObjectForDateAndPopulation(this.dataSheets);

    })

  }

  parseObjectForDateAndPopulation(data: Sheet[]) {

    const dataOfPopulation = data.map(sheet => this.evaluateObjectKeys(sheet))

  }

  evaluateObjectKeys(object: Sheet) {

    const deathsByDate = this.getKeysForDates(object);
    const provinceAndPopulation = this.getPopulationAndState(object);

    const data = {
      deathsByDate,
      ...provinceAndPopulation
    }

    console.log(data)

  }


  getKeysForDates(object: Sheet) {

    const dates = Object.keys(object).slice(12, -1);
    const dateValues = Object.values(object).slice(12, -1);

    const arrayObjectsOfDate: DateObject[] = [];

    dates.forEach((date, i) => {

      const dateObject = {
        date: date,
        valueDate: dateValues[i]
      }

      arrayObjectsOfDate.push(dateObject);

    })


    return arrayObjectsOfDate

  }


  getPopulationAndState(object: Sheet) {
    
    const valuePopulation = Object.values(object).slice(11, 12);
    const provinceStateValue = Object.values(object).slice(6, 7);
    
    return {
      provinceState: provinceStateValue[0],
      population: valuePopulation[0]
    }
 
  }




  ngOnInit(): void {
  }

}
