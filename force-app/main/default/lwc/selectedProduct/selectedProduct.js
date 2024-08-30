import { LightningElement, wire, api, track } from "lwc";
import {
  subscribe,
  unsubscribe,
  APPLICATION_SCOPE,
  MessageContext
} from "lightning/messageService";
import myMessageChannel from "@salesforce/messageChannel/myMessageChannel__c";
import getProducts from "@salesforce/apex/ProductDataService.getProducts";
//import { publish} from 'lightning/messageService';
//import myMessageChannelSelect from '@salesforce/messageChannel/myMessageChannelSelect__c';

export default class SelectedProduct extends LightningElement {
  get backgroundStyle() {
    return "background-image:url(/resource/Bedrooms/bedroom/bedroom3.png)";
  }

  @api
  productRecordName = "";
  @track
  products;
  @track productsSelected = [];
  @track isCliked = false;
  listePoductSelected = [];
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

  message;
  subscription = null;

  @wire(MessageContext)
  messageContext;

  connectedCallback() {
    this.subscribeToMessageChannel();
  }

  disconnectedCallback() {
    this.unsubscribeToMessageChannel();
  }

  subscribeToMessageChannel() {
    if (!this.subscription) {
      this.subscription = subscribe(
        this.messageContext,
        myMessageChannel,
        (message) => this.handleMessage(message),
        { scope: APPLICATION_SCOPE }
      );
    }
  }

  unsubscribeToMessageChannel() {
    unsubscribe(this.subscription);
    this.subscription = null;
  }

  handleMessage(message) {
    this.message = message.selectedProductId;
    const addorremove = message.addOrRemove;
    const id = this.message;
    const produit = this.products.find((product) => product.Id === id);
    const newproduct = produit;
    if (newproduct && addorremove === "add") {
      this.productsSelected = [...this.productsSelected, newproduct];
    } else if (newproduct && addorremove === "remove") {
      this.productsSelected = this.productsSelected.filter(
        (product) => product.Id !== id
      );
    }
  }
  cancelAll() {
    location.reload();
    /*const value=false;
    const payload = {checkbox: value };
publish(this.messageContext, myMessageChannelSelect  , payload);
    */
  }
  handleChange(event) {
    const productchecboxed = event.target.id;
    this.isCliked = event.target.cheked;
    const check = this.isCliked;
    const produit = this.products.find(
      (product) => product.Id === productchecboxed
    );
    if (check && produit) {
      this.listePoductSelected = [...this.listePoductSelected, produit];
    } else if (!check && produit) {
      this.listePoductSelected = this.listePoductSelected.filter(
        (product) => product.Id !== productchecboxed
      );
    }
  }
}