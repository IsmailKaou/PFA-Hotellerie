import { LightningElement ,api,wire,track } from 'lwc';
import getProducts from "@salesforce/apex/ProductDataService.getProducts";
import { subscribe, MessageContext } from 'lightning/messageService';
import COUNT_UPDATED_CHANNEL from '@salesforce/messageChannel/Count_Updated__c';

export default class SelectedTile extends LightningElement {
  product;
  @api selectedProductId;
  productRecordName = "";
  @track
  products;
  @wire(MessageContext)
  messageContext;
  // * function to get product list from productDataService
  @wire(getProducts, { productRecordName: "$productRecordName" })
  wiredProducts({ error, data }) {
    if (data) {
      this.products = data;
      console.log("data", data);
    } else if (error) {
      console.log(error);
    }
  }
   subscription = null;
   @wire(MessageContext)
   messageContext;
   subscribeToMessageChannel() {
    this.subscription = subscribe(
      this.messageContext,
      COUNT_UPDATED_CHANNEL,
      (message) => this.handleMessage(message)
    );
  }
  handleMessage(message) {
    const id=message.productid
    this.selectedProductId=id;
    this.product = this.products.find(product=> product.fields.Id.value === id );
  }

}