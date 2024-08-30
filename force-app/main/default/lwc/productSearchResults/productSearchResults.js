import getProducts from "@salesforce/apex/ProductDataService.getProducts";
import getOppProd from "@salesforce/apex/OpportunityDataService.getOppProd";
import { LightningElement, api, track, wire } from "lwc";
import { publish, MessageContext } from "lightning/messageService";
import myMessageChannel from "@salesforce/messageChannel/myMessageChannel__c";
import productSelected from "@salesforce/messageChannel/ProductSelected__c";
import getOppMeetingRoom from "@salesforce/apex/OpportunityDataService.getOppMeetingRoom";
//import myMessageChannelSelect from '@salesforce/messageChannel/myMessageChannelSelect__c';
//import { subscribe, unsubscribe, APPLICATION_SCOPE} from 'lightning/messageService';

export default class ProductSearchResults extends LightningElement {
  @api
  selectedProductId;
  productRecordName = "";
  @track
  products;

  showSelect = false;

  @track
  productsToDisplay;
  isLoading = false;
  hideorvisible = "hidden";

  @track startDate = undefined;
  @track endDate = undefined;
  @track meetingDate = undefined;
  @track meetingDuration = undefined;
  @track meetingCapacity = undefined;

  @track availableProducts = [];

  @wire(getOppProd, {
    startDate: "$startDate",
    endDate: "$endDate"
  })
  opportunityLineItemsList;

  @wire(getOppMeetingRoom, {
    meetingDate: "$meetingDate",
    meetingDuration: "$meetingDuration"
  })
  opportunityLineItemsListMeetingRoom;

  // * function to get product list from productDataService
  @wire(getProducts, { productRecordName: "$productRecordName" })
  wiredProducts({ error, data }) {
    if (data) {
      console.log("im receiving data");
      console.log("im here no availablity check");
      this.products = data;
      this.productsToDisplay = data;
      console.log("data", this.products);
    } else if (error) {
      console.log(error);
    }
  }

  @api
  checkAvailability(startDate, endDate) {
    console.log("im changing dates values");
    this.startDate = startDate;
    this.endDate = endDate;
    // console.log("test : start date" + this.startDate);
    // console.log("test : end date" + this.endDate);
    console.log(this.opportunityLineItemsList.data);
    const productsIdInOpportunity = new Set();
    if (this.opportunityLineItemsList.data) {
      this.opportunityLineItemsList.data.forEach((item) => {
        productsIdInOpportunity.add(item.Product2Id);
      });
    }
    // console.log("productsIdInOpportunity", productsIdInOpportunity);
    this.productsToDisplay = this.products.filter((product) => {
      if (productsIdInOpportunity.has(product.Id)) {
        return false;
      }
      return true;
    });
    this.showSelect = true;

    console.log(this.productsToDisplay);
  }

  @api
  checkMeetingRoomAvailability(meetingDate, meetingDuration, meetingCapacity) {
    console.log("im in checkMeetingRoomAvailability");
    this.meetingDate = meetingDate;
    this.meetingDuration = meetingDuration;
    this.meetingCapacity = meetingCapacity;
    const productsIdInOpportunity = new Set();
    if (this.opportunityLineItemsListMeetingRoom.data) {
      console.log(
        "this.opportunityLineItemsListMeetingRoom.data",
        this.opportunityLineItemsListMeetingRoom.data
      );
      this.opportunityLineItemsListMeetingRoom.data.forEach((item) => {
        productsIdInOpportunity.add(item.Product2Id);
      });
    }

    this.productsToDisplay = this.products.filter((product) => {
      if (productsIdInOpportunity.has(product.Id)) {
        return false;
      }
      return true;
    });
    this.showSelect = true;

    console.log("done checkMeetingRoomAvailability");
  }

  @api
  searchProducts(productRecordName) {
    this.isLoading = true;
    this.notifyLoading(this.isLoading);
    this.productRecordName = productRecordName;
    console.log("im here");
  }
  @wire(MessageContext)
  messageContext;
  updateSelectedTile(event) {
    // eslint-disable-next-line @lwc/lwc/no-api-reassignments
    this.selectedProductId = event.detail.productId;
    const addorremove = event.detail.addorRemove;
    const idproduct = this.selectedProductId;
    const payload = { selectedProductId: idproduct, addOrRemove: addorremove };
    publish(this.messageContext, myMessageChannel, payload);
  }

  // Check the current value of isLoading before dispatching the doneloading or loading custom event
  notifyLoading(isLoading) {
    if (isLoading) {
      this.dispatchEvent(new CustomEvent("loading"));
    } else {
      this.dispatchEvent(new CustomEvent("doneloading"));
    }
  }

  handleClick() {
    this.hideorvisible = "visible";
  }
  selecteTile(event) {
    // eslint-disable-next-line @lwc/lwc/no-api-reassignments
    this.selectedProductId = event.detail.productId;
    const id = this.selectedProductId;
    const playload = {
      productID: id
    };
    publish(this.messageContext, productSelected, playload);
  }
}