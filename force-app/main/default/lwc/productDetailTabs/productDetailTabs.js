/* eslint-disable @lwc/lwc/no-api-reassignments */
/* eslint-disable no-unused-vars */
import { getRecord } from "lightning/uiRecordApi";
import { LightningElement, wire, api, track } from "lwc";
import {
  subscribe,
  unsubscribe,
  APPLICATION_SCOPE,
  MessageContext
} from "lightning/messageService";
import getProducts from "@salesforce/apex/ProductDataService.getProducts";
import productSelected from "@salesforce/messageChannel/ProductSelected__c";

import { NavigationMixin } from "lightning/navigation";
const FIELDS = [
  "Product2.ProductCode",
  "Product2.Price",
  "Product2.Description"
];

export default class ProductDetailTabs extends NavigationMixin(
  LightningElement
) {
  @api productId;
  @track selectedProduct;
  @track products;
  productName;
  detailsTabIconName;
  message;
  subscription = null;
  @track showFullDetails = false;
  label = {
    labelDetails: "Details",
    labelReviews: "Reviews",
    labelAddReview: "Add Review",
    labelFullDetails: "Full Details",
    labelPleaseSelectAProduct: "Please select a product"
  };

  activeTabValue = "details";

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
        productSelected,
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
    this.message = message.productID;

    const id = this.message;
    console.log("Selected Product ID:", id);
    this.selectedProduct = this.products.find((product) => product.Id === id);
    this.setProductId(id);
    const reviewForm = this.template.querySelector("c-product-add-review-form");
    reviewForm.productId = id;

    console.log("Selected Product:", this.selectedProduct);
  }

  handleTabChange(event) {
    this.activeTabValue = event.target.value;
  }

  @wire(getRecord, { recordId: "$productId", fields: FIELDS })
  wiredRecord;

  @api
  productRecordName = "";
  @wire(getProducts, { productRecordName: "$productRecordName" })
  wiredProducts({ error, data }) {
    if (data) {
      this.products = data;
      console.log("data", data);
    } else if (error) {
      console.log(error);
    }
  }

  handleReviewSubmit(event) {
    const productId = this.productId;
    const reviewForm = this.template.querySelector("c-product-add-review-form");
    reviewForm.handleSubmit(productId);
  }
  handleReviewAdded() {
    this.template.querySelector("c-product-reviews").refresh();
  }

  toggleFullDetails() {
    this.showFullDetails = !this.showFullDetails;
  }
  get recordId() {
    return this.productId;
  }
  @api
  set recordId(value) {
    this.setAttribute("productId", value);
    this.productId = value;
    this.getReviews();
  }
  setProductId(productId) {
    this.productId = productId;
  }

  navigateToViewRecordPage() {
    console.log("Record Id ==> " + this.recordId);
    this[NavigationMixin.Navigate]({
      type: "standard__recordPage",
      attributes: {
        recordId: this.recordId,
        actionName: "view"
      }
    });
  }

  navigateToEditRecordPage() {
    this[NavigationMixin.Navigate]({
      type: "standard__recordPage",
      attributes: {
        recordId: this.recordId,
        actionName: "edit"
      }
    });
  }
}