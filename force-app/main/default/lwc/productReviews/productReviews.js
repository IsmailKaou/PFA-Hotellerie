import { api, LightningElement, wire } from "lwc";
import getAllReviews from "@salesforce/apex/ProductDataService.getAllReviews";
import { NavigationMixin } from "lightning/navigation";

export default class ProductReviews extends NavigationMixin(LightningElement) {
  @api
  testId;
  error;
  productReviews;
  isLoading;
  isProductReviews = false;

  @wire(getAllReviews, { productId: "$testId" })
  wiredReviews({ data, error }) {
    if (data) {
      this.productReviews = data;
      console.log("product review" + this.productReviews);
      error = undefined;
      console.log(data.length);
      if (data.length > 0) {
        this.isProductReviews = true;
      }
    } else {
      error = error;
      console.log("no product reviews");
      this.productReviews = undefined;
      this.isProductReviews = false;
    }
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

  get reviewsToShow() {
    return (
      this.productReviews !== undefined &&
      this.productReviews != null &&
      this.productReviews.length > 0
    );
  }

  navigateToRecord(event) {
    event.preventDefault();
    event.stopPropagation();
    let recordId = event.target.dataset.recordId;
    this[NavigationMixin.Navigate]({
      type: "standard__recordPage",
      attributes: {
        recordId: recordId,
        objectApiName: "User",
        actionName: "view"
      }
    });
  }
  handleSaveReview() {
    this.template.querySelector("c-product-add-review-form").handleSubmit();
  }
}