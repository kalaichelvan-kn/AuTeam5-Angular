import { FlightScheduledTableComponent } from './FlightScheduledTable/FlightScheduledTable.component';
import { FlightReleasedTableComponent } from './FlightReleasedTable/FlightReleasedTable.component';
import { TableApiService } from './../../services/tableApi.service';
import { Component, OnInit, ViewChild } from '@angular/core';
import { MatTableDataSource } from '@angular/material/table';
import {style, animate, transition, trigger} from '@angular/animations';

@Component({
  selector: 'app-datatable',
  templateUrl: './datatable.component.html',
  styleUrls: ['./datatable.component.css'],
  animations: [
    trigger('fadeInOut', [
      transition(':enter', [ 
        style({opacity:0}),
        animate('600ms ease-in', style({opacity:1}))
      ]),
      transition(':leave', [ 
        animate('600ms ease-in', style({opacity:0}))
      ])
    ])
  ]
})
export class DatatableComponent implements OnInit {

  // View childs of sub table components to set pagination and sorting to data source from here
  @ViewChild(FlightReleasedTableComponent) releasedTableChild: FlightReleasedTableComponent;
  @ViewChild(FlightScheduledTableComponent) scheduledTableChild: FlightScheduledTableComponent;
  @ViewChild('tabGroup') tabGroup;

  public dataSource;
  public tableColumns:string[];
  public rowPerPage:number[];

  public isTableDataLoading:boolean[];
  public isTableDataValid:boolean[];

  public showFilter:boolean;
  public selectedTabIndex:number;

  public filterOrigin:string;
  public filterDestination:string;
  public filterStartDate:Date;
  public filterEndDate:Date;
  public filterFlightNo:string;
  public filterLegNo:string;

  constructor(private _tableService:TableApiService) {
    this.rowPerPage = [5, 10, 20, 40, 80, 100];
    this.tableColumns = [
      'flightNo',
      'flightDate',
      'legNo',
      'origin',
      'destination',
      'releaseNumber',
      'releaseTime'
    ];
    this.dataSource = [];
    this.filterStartDate = new Date();
    this.filterEndDate = new Date();
    this.filterDestination = "";
    this.filterOrigin = "";
    this.filterFlightNo = "";
    this.filterLegNo = "";
    this.selectedTabIndex = 0;
    this.showFilter = true;
    this.isTableDataLoading = [true, true];
    this.isTableDataValid = [false, false];
  }

  ngOnInit() {
    // Initialize only table 1 with table index
    this.initTableData();
  }

  initTableData(id = this.selectedTabIndex){
    let promise;
    let filterObject;
    switch(id){
      case 0:
        filterObject = this.getFilterObject();
        promise = this._tableService.getFlightReleasedTableData(filterObject).toPromise();
        break;
      case 1:
        promise = this._tableService.getFlightScheduledTableData().toPromise();
        break;
      default:
        break;
    }
    promise.then(
      (data) => {
        console.log(data);
        this.resetTableData(data, id);
        this.isTableDataLoading[id] = false;
        this.isTableDataValid[id] = true;
      },
      (error) => {
        console.log(error);
        this.isTableDataLoading[id] = false;
        this.isTableDataValid[id] = false;
      }
    );
  }

  resetTableData(data, id:number){
    this.dataSource[id] = new MatTableDataSource(data);
    if(id==0){
      this.dataSource[id].sort = this.releasedTableChild.rfsort;
      this.dataSource[id].paginator = this.releasedTableChild.rfpaginator;
    }else if(id==1){
      this.dataSource[id].sort = this.scheduledTableChild.sfsort;
      this.dataSource[id].paginator = this.scheduledTableChild.sfpaginator;
    }
  } // resetTableDataEnd

  getFormattedDate(date:Date):string{
    let tMonth:any = date.getMonth()+1;
    tMonth = (tMonth < 10) ? "0"+ tMonth : tMonth+1;
    let tDate = (date.getDate() < 10) ? "0"+date.getDate(): date.getDate();
    return date.getFullYear()+"-"+tMonth+"-"+tDate;
  }

  // Prepare filterObject for API Call
  getFilterObject(){
    let tFlightNo = (this.filterFlightNo=="")? 0 : this.filterFlightNo;
    let tLegNo = (this.filterLegNo=="")? 0 : this.filterLegNo;
    return {
      "flightNo":tFlightNo,
      "legNo": tLegNo,
      "origin": this.filterOrigin,
      "destination":this.filterDestination,
      "startDate": this.getFormattedDate(this.filterStartDate),
      "endDate": this.getFormattedDate(this.filterEndDate)
    };
  }

  tabChanged(tabIndex:number): void {
    this.selectedTabIndex = tabIndex;
    this.initTableData(tabIndex);
    switch(tabIndex){
      case 0:
        this.showFilter = true;
        break;
      case 1:
        this.showFilter = false;
        break;
      default:
        this.tabChanged(0);
        break;
    }

  }

  resetFilter(){
    this.filterOrigin = "";
    this.filterDestination = "";
    this.filterFlightNo = "";
    this.filterLegNo = "";
    this.filterStartDate = new Date();
    this.filterEndDate = new Date();
    // call iff filterObject is set
    this.initTableData(0);
  }

}
