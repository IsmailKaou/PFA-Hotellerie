import { api, LightningElement, track } from "lwc";
import submitReview from "@salesforce/apex/ProductDataService.submitReview";
import { ShowToastEvent } from "lightning/platformShowToastEvent";

const SUCCESS_TITLE = "Review Created!";
const SUCCESS_VARIANT = "success";

export default class ProductAddReviewForm extends LightningElement {
  @api testId;
  @track rating;
  @track reviewText = "";
  @track subjectReview = ""; 
  @api ProductReview__c;
  @api Name;
  @api Comment__c;
  @api Rating_c;

  handleRatingChanged(event) {
    this.rating = event.detail.rating;
  }

  handleReviewTextChange(event) {
    this.reviewText = event.target.value;
  }
  handleReviewSubjectChange(event) {
    this.subjectReview = event.target.value;
  }


  handleSubmit() {
    console.log("im in handleSubmit");
    console.log("Review Text:", this.reviewText);
    console.log("Product ID:", this.testId);
    console.log("Subject Review:",this.subjectReview);

    const data = new Map();
    data.set('Name','Review Name');
    data.set('productId',this.testId);
    data.set('comment',this.reviewText);
    data.set('subjectreview',this.subjectReview);
    data.set('rating',this.rating);
    console.log('Oussama is he');

    submitReview({comment : this.reviewText,rating:this.rating, subjectreview:this.subjectReview , productId:this.testId})
      .then(() => {
        console.log("im in succ");
        const toastEvent = new ShowToastEvent({
          title: SUCCESS_TITLE,
          message: "The review has been created successfully.",
          variant: SUCCESS_VARIANT
        });
        this.dispatchEvent(toastEvent);
        const reviewAddedEvent = new CustomEvent("reviewadded");
        this.dispatchEvent(reviewAddedEvent);
        this.resetFields();
      })
      .catch((error) => {
        console.error("Error while saving review:", error);
        const errorEvent = new ShowToastEvent({
          title: "Error",
          message:
            "An error occurred while saving the review. Please try again.",
          variant: "error"
        });
        this.dispatchEvent(errorEvent);
      });
    }

  resetFields() {
    this.reviewText = "";
  }
  handleReset() {
    const inputFields = this.template.querySelectorAll("lightning-input-field");
    if (inputFields) {
      inputFields.forEach((field) => {
        field.reset();
      });
    }
  }  
}