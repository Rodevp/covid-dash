import { Component, OnInit } from '@angular/core';
import * as XLSX from "xlsx";

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.scss']
})
export class DashboardComponent implements OnInit {

  constructor() { }

  redCsv(event: any) {
    const file = event?.target?.files[0];

    const reader = new FileReader();
    reader.readAsBinaryString(file);
    

    reader.addEventListener('load', (e) => {

      const workbook = XLSX.read(reader.result, {type: "binary"});

      const sheetsNames: String[] = workbook.SheetNames;

      const sheet = sheetsNames[0];

      const data = XLSX.utils.sheet_to_json(workbook.Sheets[`${sheet}`]);

      console.log('data csv -> ', data);

    })


  }

  ngOnInit(): void {
  }

}
