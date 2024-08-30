import { LightningElement } from "lwc";

export default class ProductSearchForm extends LightningElement {
  isBedroom = false;
  isMeetingRoom = false;
  // Bedroom form inputs
  startDate;
  endDate;

  // Meeting room form inputs
  meetingDate;
  meetingDuration;
  meetingCapacity;

  // Current dateTime
  currentDateTime;

  selectedProductRecordTypeName = "";
  error = undefined;
  productRecordTypeOptions = [
    { label: "All", value: "" },
    { label: "Bedroom", value: "Bedroom" },
    { label: "Meeting room", value: "Meeting room" }
    // { label: "Service", value: "Service" }
  ];
  handleProductRecordTypeChange(event) {
    switch (event.detail.value) {
      case "Bedroom":
        this.isBedroom = true;
        this.isMeetingRoom = false;
        break;
      case "Meeting room":
        this.isBedroom = false;
        this.isMeetingRoom = true;
        break;

      default:
        this.isBedroom = false;
        this.isMeetingRoom = false;
        break;
    }
    /*if (this.selectedProductRecordTypeName === "Bedroom") {
      this.isBedroom = true;
      this.isMeetingRoom = false;
    } else if (this.selectedProductRecordTypeName === "Meeting room") {
      this.isBedroom = false;
      this.isMeetingRoom = true;
    } else {
      this.isBedroom = false;
      this.isMeetingRoom = false;
    }*/
    const searchEvent = new CustomEvent("search", {
      detail: {
        recordName: event.detail.value
      }
    });
    this.dispatchEvent(searchEvent);
  }
  checkAvailability() {
    console.log("im checking availability");
    console.log("startDate first", this.startDate);
    console.log("endDate first", this.endDate);
    const availabilityEvent = new CustomEvent("checkavailability", {
      detail: {
        startDate: this.startDate,
        endDate: this.endDate
      }
    });
    this.dispatchEvent(availabilityEvent);
  }
  checkMeetingRoomAvailability() {
    console.log("im checking meeting room availability");
    console.log("meetingDate", this.meetingDate);
    console.log("meetingDuration", this.meetingDuration);
    console.log("meetingCapacity", this.meetingCapacity);
    const availabilityEvent = new CustomEvent("meetingroomcheckavailability", {
      detail: {
        meetingDate: this.meetingDate,
        meetingDuration: this.meetingDuration,
        meetingCapacity: this.meetingCapacity
      }
    });
    this.dispatchEvent(availabilityEvent);
  }

  connectedCallback() {
    const now = new Date();
    const timezoneOffset = now.getTimezoneOffset();
    const localDateTime = new Date(now - timezoneOffset * 60 * 1000);
    this.currentDateTime = localDateTime.toISOString().slice(0, 16);
  }

  // eslint-disable-next-line consistent-return
  get isButtonDisabled() {
    if (this.isBedroom) {
      return !(
        this.startDate !== undefined &&
        this.endDate !== undefined &&
        this.startDate >= this.currentDateTime &&
        this.endDate >= this.startDate
      );
    } else if (this.isMeetingRoom) {
      return !(
        this.meetingDate !== undefined &&
        this.meetingDuration !== undefined &&
        this.meetingCapacity !== undefined &&
        this.meetingDate >= this.currentDateTime
      );
    }
    return true;
  }
  // disabledButtonClass() {
  //   return this.isButtonDisabled ? "disabledButton" : "";
  // }

  handleStartDateChange(event) {
    console.log("changing start date");
    this.startDate = event.target.value;
  }
  handleEndDateChange(event) {
    console.log("changing end date");

    this.endDate = event.target.value;
  }

  handleMeetingDateChange(event) {
    console.log("changing meeting date");
    this.meetingDate = event.target.value;
  }
  handleMeetingDurationChange(event) {
    console.log("changing meeting duration");
    this.meetingDuration = event.target.value;
  }
  handleMeetingCapacityChange(event) {
    console.log("changing meeting capacity");
    this.meetingCapacity = event.target.value;
  }
}