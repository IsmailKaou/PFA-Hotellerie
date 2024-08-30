import { LightningElement } from "lwc";

export default class ProductSearch extends LightningElement {
  isLoading = false;

  handleLoading() {
    this.isLoading = true;
  }
  handleDoneLoading() {
    this.isLoading = false;
  }

  searchProducts(event) {
    let recordName = event.detail.recordName;
    this.template
      .querySelector("c-product-search-results")
      .searchProducts(recordName);
    this.handleDoneLoading();
  }
  handleCheckAvailability(event) {
    console.log("im hanling checking availability");
    let startDate = event.detail.startDate;
    let endDate = event.detail.endDate;
    // console.log("before calling search results");
    // console.log("startDate", startDate);
    // console.log("endDate", endDate);
    this.template
      .querySelector("c-product-search-results")
      .checkAvailability(startDate, endDate);
    this.handleDoneLoading();
  }
  handleMeetingRoomCheckAvailability(event) {
    console.log("im hanling meeting room checking availability");
    let meetingDate = event.detail.meetingDate;
    let meetingDuration = event.detail.meetingDuration;
    let meetingCapacity = event.detail.meetingCapacity;

    this.template
      .querySelector("c-product-search-results")
      .checkMeetingRoomAvailability(
        meetingDate,
        meetingDuration,
        meetingCapacity
      );
    this.handleDoneLoading();
  }
}