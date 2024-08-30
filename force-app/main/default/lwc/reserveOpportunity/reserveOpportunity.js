import { LightningElement, track, wire, api } from "lwc";
import getContact from "@salesforce/apex/ContactSearch.getContact";
import contactRecMethod from "@salesforce/apex/CreateContact.contactRecMethod";
import FIRSTNAME_FIELD from "@salesforce/schema/Contact.FirstName";
import LASTNAME_FIELD from "@salesforce/schema/Contact.LastName";
import IDIDENTIFIER_FIELD from "@salesforce/schema/Contact.ID_card__c";
import IDNUMBER_FIELD from "@salesforce/schema/Contact.ID_number__c";
import { ShowToastEvent } from "lightning/platformShowToastEvent";
import getPriceBook from "@salesforce/apex/CreateOpportunity.getPriceBook";
import RESERVATIONNAME_FIELD from "@salesforce/schema/Opportunity.Name";
import TIMERESERVATION_FIELD from "@salesforce/schema/Opportunity.time_of_reservation__c";
import STARTDATE_FIELD from "@salesforce/schema/Opportunity.Start_date__c";
import ENDDATE_FIELD from "@salesforce/schema/Opportunity.End_Date__c";
import CHECKIN_FIELD from "@salesforce/schema/Opportunity.Check_in_date__c";
import CHECKOUT_FIELD from "@salesforce/schema/Opportunity.Check_out_date__c";

import CLOSEDATE_FIELD from "@salesforce/schema/Opportunity.CloseDate";
import STAGE_FIELD from "@salesforce/schema/Opportunity.StageName";
import opportunitytRecMethod from "@salesforce/apex/CreateOpportunity.opportunitytRecMethod";
import {
  subscribe,
  unsubscribe,
  APPLICATION_SCOPE,
  MessageContext
} from "lightning/messageService";
import myMessageChannel from "@salesforce/messageChannel/myMessageChannel__c";
import getProducts from "@salesforce/apex/ProductDataService.getProducts";
import getOpportunityToDelete from "@salesforce/apex/ContactSearch.getOpportunityToDelete";
import oppProductMethod from "@salesforce/apex/CreateOpportunityProduct.oppProductMethod";

export default class ReserveOpportunity extends LightningElement {
  //visibility tags
  visibilityCont = false;
  visibilityRes = false;
  visibilityCheck = true;
  visibilityConfirm = false;
  visibilityReturn = false;
  visibilityButtoncreCon = false;

  nombreProduit;
  reservationName = "";
  contactName = "";
  messageErreur = "";
  currentDateTime;
  currentDateTime2;
  minEnddate;
  minClosedate;
  mindateClose;
  restime;
  resclose;
  //Id utilisé pour insérer une opportunity
  idContact = "";
  idPriceBook = "";
  idOpportunity = "";
  reservationdate = "";
  idNumberOptions = [
    { label: "ID card", value: "ID card" },
    { label: "Passeport", value: "Passeport" }
  ];
  stageOptions = [
    { label: "New", value: "New" },
    { label: "Confirmed", value: "Confirmed" }
  ];

  @track firstName = FIRSTNAME_FIELD;
  @track lastName = LASTNAME_FIELD;
  @track idIdentifier = IDIDENTIFIER_FIELD;
  @track idValue = IDNUMBER_FIELD;
  @track reservationName = RESERVATIONNAME_FIELD;
  @track reservationTime = TIMERESERVATION_FIELD;
  @track startDate = STARTDATE_FIELD;
  @track checkInDate = CHECKIN_FIELD;
  @track endDate = ENDDATE_FIELD;
  @track checkOutDate = CHECKOUT_FIELD;
  @track closeDate = CLOSEDATE_FIELD;
  @track Stage = STAGE_FIELD;

  recOppo = {
    Name: this.reservationName,
    time_of_reservation__c: this.reservationTime,
    Start_date__c: this.startDate,
    End_Date__c: this.endDate,
    Check_in_date__c: this.checkInDate,
    Check_out_date__c: this.checkOutDate,
    CloseDate: this.closeDate,
    StageName: this.Stage
  };

  recContact = {
    FirstName: this.firstName,
    LastName: this.lastName,
    ID_card__c: this.idIdentifier,
    ID_number__c: this.idValue
  };

  idCard = "";
  idNumber = "";
  @wire(getContact, { idCard: "$idCard", idNumber: "$idNumber" })
  wiredContacts;

  handelChangeIDnumber(event) {
    console.log("la valeur de idnumber est changée");
    this.idNumber = event.target.value;
  }
  handelChangeIDcard(event) {
    console.log("la valeur de idcard est changée");
    this.idCard = event.target.value;
  }
  handelFirstNamechange(event) {
    this.recContact.FirstName = event.target.value;
    console.log("firstname", this.recContact.FirstName);
  }
  handelLasteNamechange(event) {
    this.recContact.LastName = event.target.value;
    console.log("lastname", this.recContact.LastName);
  }

  handelIdIentifierchange(event) {
    this.recContact.ID_card__c = event.target.value;
    console.log("identifier", this.recContact.ID_card__c);
  }

  handelIdNumberchannge(event) {
    this.recContact.ID_number__c = event.target.value;
    console.log("identifierValue", this.recContact.ID_number__c);
  }

  handelReservationNamechange(event) {
    this.recOppo.Name = event.target.value;
    console.log("reservation Name", this.recOppo.Name);
  }

  handelResevationTimechange(event) {
    this.recOppo.time_of_reservation__c = event.target.value;
    this.restime = this.recOppo.time_of_reservation__c;
    console.log("reservation Time", this.recOppo.time_of_reservation__c);
  }

  handelStartDatechange(event) {
    this.recOppo.Start_date__c = event.target.value;
    this.recOppo.Check_in_date__c = event.target.value;
    this.minEnddate = this.recOppo.Start_date__c;
    console.log("start Date", this.recOppo.Start_date__c);
  }
  handelEndDatechange(event) {
    this.recOppo.End_Date__c = event.target.value;
    this.recOppo.Check_out_date__c = event.target.value;
    this.minClosedate = this.recOppo.End_Date__c;
    console.log("end Date", this.recOppo.End_Date__c);
    const parts = this.minClosedate.split("-");
    const year = parseInt(parts[0], 10);
    const month = parseInt(parts[1], 10) - 1; // Les mois dans les objets Date sont indexés à partir de 0
    const day = parseInt(parts[2], 10);
    const minClosedateObj = new Date(year, month, day);
    // Ajouter 72 heures à la date
    const newDate = new Date(minClosedateObj.getTime() + 120 * 60 * 60 * 1000);
    this.mindateClose = newDate.toISOString().slice(0, 16);
    console.log("minDate Close", this.mindateClose);
  }

  handelCloseDatechange(event) {
    this.recOppo.CloseDate = event.target.value;
    this.resclose = this.recOppo.CloseDate;
    console.log("close Date", this.recOppo.CloseDate);
  }

  handelStageChange(event) {
    this.recOppo.StageName = event.target.value;
    console.log("stage", this.recOppo.StageName);
  }
  //Check if contact exists
  handelClickChecking() {
    if (this.idCard === "" || this.idNumber === "") {
      this.messageErreur = "You must complete all fields after checking.";
    } else {
      // !!! data est de type array
      this.messageErreur = "";
      console.log("data affichés", this.wiredContacts.data);
      const contact = this.wiredContacts.data;
      if (contact) {
        console.log("je suis dans le if ");
        this.contactName = contact.FirstName + " " + contact.LastName;
        console.log("contactName", this.contactName);
        this.idContact = contact.Id;
        console.log("idContact", this.idContact);
        this.visibilityRes = true;
        this.visibilityCheck = false;
        this.visibilityButtoncreCon = false;
        this.visibilityCont = false;
      } else {
        console.log("je suis dans le else");
        this.contactName = "Not Found";
        this.visibilityButtoncreCon = true;
      }
    }
  }
  handelButtonCreateContact() {
    this.visibilityCont = true;
    this.visibilityButtoncreCon = false;
  }
  //Create Contact Record
  createConRec() {
    debugger;
    contactRecMethod({ conRec: this.recContact })
      .then((result) => {
        this.message = result;
        this.error = undefined;
        if (this.message !== undefined) {
          this.recContact.FirstName = "";
          this.recContact.LastName = "";
          this.recContact.ID_card__c = "";
          this.recContact.ID_number__c = "";
          this.visibilityCont = false;
          this.visibilityRes = true;
          this.visibilityCheck = false;
          this.dispatchEvent(
            new ShowToastEvent({
              title: "Success",
              message: "The Contact has been created successfully",
              variant: "success"
            })
          );
        }
        this.idContact = this.message.Id;
        this.contactName = this.message.FirstName + " " + this.message.LastName;
        console.log(JSON.stringify(result));
        console.log("result message ", this.message);
        console.log("result id ", this.idContact);
        console.log("result contact Name ", this.contactName);
      })
      .catch((error) => {
        this.message = undefined;
        this.error = error;
        this.dispatchEvent(
          new ShowToastEvent({
            title: "Error creating record",
            message: error.body.message,
            variant: "error"
          })
        );
        console.log("error", JSON.stringify(this.error));
      });
  }

  errors;
  @wire(getPriceBook)
  wiredPriceBook({ error, data }) {
    if (data) {
      const book = data;
      this.idPriceBook = book.Id;
      console.log("id book", this.idPriceBook);
      this.errors = undefined;
    } else if (error) {
      this.errors = error;
      this.contacts = undefined;
    }
  }
  // create Reservation
  createOppRec() {
    debugger;
    opportunitytRecMethod({
      oppRec: this.recOppo,
      idContact: this.idContact,
      idpriceBook: this.idPriceBook
    })
      .then((result) => {
        this.message = result;
        this.error = undefined;
        if (this.message !== undefined) {
          this.recOppo.Name = "";
          this.recOppo.time_of_reservation__c = "";
          this.recOppo.Start_date__c = "";
          this.recOppo.End_Date__c = "";
          this.recOppo.CloseDate = "";
          this.recOppo.StageName = "";
          this.visibilityRes = false;
          this.visibilityConfirm = true;
          this.dispatchEvent(
            new ShowToastEvent({
              title: "Success",
              message: "The Reservation has been created successfully",
              variant: "success"
            })
          );
        }
        this.idOpportunity = this.message.Id;
        this.reservationName = this.message.Name;

        //test
        console.log(JSON.stringify(result));
        console.log("result message ", this.message);
        console.log("result id opportunity ", this.idOpportunity);
      })
      .catch((error) => {
        this.message = undefined;
        this.error = error;
        this.dispatchEvent(
          new ShowToastEvent({
            title: "Error creating record",
            message: error.body.message,
            variant: "error"
          })
        );
        console.log("error", JSON.stringify(this.error));
      });
  }
  //creation de opportunity product
  clickConfim() {
    this.idCard = "";
    this.idNumber = "";
    this.idContact = "";
    this.contactName = "";

    debugger;
    oppProductMethod({
      products: this.productsSelected,
      idOpportunity: this.idOpportunity,
      idPricebook: this.idPriceBook
    })
      .then((result) => {
        this.message = result;
        this.error = undefined;
        if (this.message !== undefined) {
          this.visibilityConfirm = false;
          this.visibilityReturn = true;

          this.dispatchEvent(
            new ShowToastEvent({
              title: "Success",
              message: "The Reservation has been created successfully",
              variant: "success"
            })
          );
        }

        const nbr = this.productsSelected.length;
        this.nombreProduit = nbr;
        console.log(JSON.stringify(result));
        console.log("result message ", this.message);
      })
      .catch((error) => {
        this.message = undefined;
        this.error = error;
        this.dispatchEvent(
          new ShowToastEvent({
            title: "Error creating record",
            message: error.body.message,
            variant: "error"
          })
        );
        console.log("error", JSON.stringify(this.error));
      });
  }

  @api
  productRecordName = "";
  @track
  products;
  @track productsSelected = [];
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
    const now = new Date();
    const timezoneOffset = now.getTimezoneOffset();
    const localDateTime = new Date(now - timezoneOffset * 60 * 1000);
    this.currentDateTime = localDateTime.toISOString().slice(0, 16);
    this.currentDateTime2 = localDateTime.toISOString().slice(0, 10);
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
  clickReturn() {
    location.reload();
  }
  //creation de opportunity product
  clickCancel() {
    debugger;
    getOpportunityToDelete({ idOpportunity: this.idOpportunity })
      .then(() => {
        this.error = undefined;
        this.dispatchEvent(
          new ShowToastEvent({
            title: "Success",
            message: "The Reservation has been canceled",
            variant: "success"
          })
        );
      })
      .catch((error) => {
        this.message = undefined;
        this.error = error;
        this.dispatchEvent(
          new ShowToastEvent({
            title: "Error canceling record",
            message: error.body.message,
            variant: "error"
          })
        );
        console.log("error", JSON.stringify(this.error));
      });
    location.reload();
  }
  //message à afficher en cas de mauvaise saisie
  get actualDate() {
    const parts = this.currentDateTime2.split("-");
    const year = parseInt(parts[0], 10);
    const month = parseInt(parts[1], 10); // Les mois dans les objets Date sont indexés à partir de 0
    const day = parseInt(parts[2], 10);
    const date = day + "/" + month + "/" + year;
    return "value must be" + " " + date;
  }
  date1;
  date2;
  //à utilisée dans le min et le max à la fois
  get dateCurrentmoins() {
    const parts = this.currentDateTime.split("-");
    const year = parseInt(parts[0], 10);
    const month = parseInt(parts[1], 10) - 1; // Les mois dans les objets Date sont indexés à partir de 0
    const day = parseInt(parts[2], 10);
    const minClosedateObj = new Date(year, month, day);
    // Ajouter 72 heures à la date
    const newDate = new Date(minClosedateObj.getTime() - 24 * 60 * 60 * 1000);
    this.date1 = newDate.toISOString().slice(0, 16);

    return this.date1;
  }
  get dateCurrentPlus() {
    const parts = this.currentDateTime.split("-");
    const year = parseInt(parts[0], 10);
    const month = parseInt(parts[1], 10) - 1; // Les mois dans les objets Date sont indexés à partir de 0
    const day = parseInt(parts[2], 10);
    const minClosedateObj = new Date(year, month, day);
    // Ajouter 72 heures à la date
    const newDate = new Date(minClosedateObj.getTime() + 24 * 60 * 60 * 1000);
    this.date2 = newDate.toISOString().slice(0, 16);
    return this.date2;
  }
}