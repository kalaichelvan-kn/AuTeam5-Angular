import { CardTaskService } from './../../services/cardTask.service';
import { Component, OnInit } from '@angular/core';
import { CardApiService } from 'src/app/services/cardApi.service';

@Component({
  selector: 'app-card-list',
  templateUrl: './card-list.component.html',
  styleUrls: ['./card-list.component.css']
})
export class CardListComponent implements OnInit {

// cardDataId and api response data id should match
public cardHint:string = "Last Hour";
public cardStaticData = [
  {
    cardTitle:"Domestic",
    cardHint: this.cardHint,
    cardDataId : "domesticCount",
    cardContent:'-1',
    cardIcon:"flight"
  },
  {
    cardTitle:"International",
    cardHint: this.cardHint,
    cardDataId : "internationalCount",
    cardContent:'-1',
    cardIcon:"flight_takeoff"
  },
  {
    cardTitle:"Iterations",
    cardHint: this.cardHint,
    cardDataId : "iterationCount",
    cardContent:'-1',
    cardIcon:"loop",
  }
];

constructor(private _cardService: CardApiService, private _cardTask: CardTaskService) { }

ngOnInit() {
  this.initCardContent();
}

// initialize card contents on page load
initCardContent(){
  let promise = this._cardService.getCardContent().toPromise();
  promise.then( 
    (data) => {
      Object.keys(data).forEach(key => { this._cardTask.assignCount(this.cardStaticData, key, data[key]); });
      this._cardTask.assignDefault(this.cardStaticData);
    },
    (error) => {
      console.log("card data Fetch error:"+error);
      this._cardTask.assignDefault(this.cardStaticData);
    }
  );
} // initCardContentEnd

}
