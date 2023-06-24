import { Component, OnInit } from '@angular/core';
import * as XLSX from "xlsx";
import { DataParse, DateObject, Sheet } from '../dashboard.t';

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

    const dataParsed = data.map(sheet => this.parseDataOfCSV(sheet)).flatMap(item => ({
      state: item.provinceState,
      countDeaths: item.deathsByDate.valueDate
    })).reduce((prev, current) => {

      if (current.state in prev) {
        prev[current.state] = prev[current.state] + current.countDeaths
      }
      else {
        prev[current.state] = current.countDeaths
      }

      return prev

    }, {} as Record<string, number>);

    console.log(dataParsed);

  }


  parseDataOfCSV(object: Sheet) {

    const deathsByDate = this.getDataForDates(object);
    const provinceAndPopulation = this.getPopulationAndState(object);

    const data = {
      deathsByDate,
      ...provinceAndPopulation
    }


    return data

  }


  getDataForDates(object: Sheet) {

    const dates = Object.keys(object).slice(12, -1);
    const dateValues = Object.values(object).slice(12, -1);

    const lastDate = dates.at(-1);
    const totalDeaths = dateValues.reduce((current, acc) => current + acc, 0);

    const objectsOfDate: DateObject = {
      date: lastDate,
      valueDate: totalDeaths
    };

    return objectsOfDate

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
