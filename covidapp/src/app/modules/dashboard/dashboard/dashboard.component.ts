import { Component, OnInit } from '@angular/core';
import * as XLSX from "xlsx";
import { DateObject, Sheet } from '../dashboard.t';
import { Type } from '@angular/compiler';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.scss']
})
export class DashboardComponent implements OnInit {


  constructor() { }

  dataSheets: Sheet[] = [];

  maxTotalDeaths = {
    state: "",
    value: 0,
    population: 0
  };

  minTotalDeaths = {
    state: "",
    value: 0
  }

  populationMod: {
    state: string,
    total: number
  } = {
      state: "",
      total: 0
    };

  dataFlatten: {
    state: string;
    countDeaths: number;
    population: number;
  }[] = [];

  labelsData: string[] = [];
  valuesDataPie: number[] = [];

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

    let maximunDeaths = {
      state: "",
      value: 0,
      population: 0
    };

    let minDeaths = {
      state: "",
      value: 0
    };


    const dataParsed = data.map(sheet => this.parseDataOfCSV(sheet)).flatMap(item => {
      return {
        state: item.provinceState as string,
        countDeaths: item.deathsByDate.valueDate,
        population: item.population as number
      }
    });


    let dataChart: {
      state: string;
      countDeaths: number;
      population: number;
    }[] = [];

    const dataFlattenParsed = dataParsed.reduce((prev, current) => {

      if (current.state in prev) {
        prev[current.state] = {
          population: current.population,
          total: prev[current.state].total + current.countDeaths
        }
      }
      else {
        prev[current.state] = {
          population: current.population,
          total: current.countDeaths
        }
      }

      if (prev[current.state].total > maximunDeaths.value) {
        maximunDeaths = {
          state: current.state,
          value: prev[current.state].total,
          population: prev[current.state].population
        }
      } else if (prev[current.state].total < maximunDeaths.value) {
        minDeaths = {
          state: current.state,
          value: prev[current.state].total
        }
      }


      let isExists = dataChart.find(item => item.state === current.state);


      if (isExists) {
        isExists = {
          ...isExists,
          countDeaths: isExists.countDeaths + current.countDeaths,
          population: current.population + isExists.population
        }
      } else {
        dataChart.push({
          state: current.state,
          population: current.population,
          countDeaths: current.countDeaths
        });
      }

      return prev

    }, {} as Record<string, {
      population: number;
      total: number
    }>);

    
    this.maxTotalDeaths = maximunDeaths;
    this.minTotalDeaths = minDeaths;
    this.dataFlatten = dataChart;
    this.labelsData = [...dataChart.values()].map(item => item.state);
    this.valuesDataPie = [...dataChart.values()].map(item => item.countDeaths);
    
    const name = this.maxTotalDeaths.state
    const countTotalDeaths = this.maxTotalDeaths.value

    let population = this.maxTotalDeaths.population
    const mod = (population * (countTotalDeaths / 100)) % 100
    this.populationMod = {
      state: name,
      total: mod
    }

    console.log('mod -> ', mod);


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
