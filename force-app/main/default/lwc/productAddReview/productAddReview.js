import { LightningElement } from "lwc";

export default class ProductAddReview extends LightningElement {
  reviewText = "";

  handleReviewTextChange(event) {
    this.reviewText = event.target.value;
  }

  handleSaveReview() {
    // ... Your existing code to save the review ...

    // Fire a custom event to notify the parent component
    const reviewAddedEvent = new CustomEvent("reviewadded");
    this.dispatchEvent(reviewAddedEvent);
    console.log("Review saved:", this.reviewText);

    // Clear the review text after saving (if needed)
    this.reviewText = "";
  }
}