import { LightningElement, api, track, wire } from "lwc";
import { getRecord } from "lightning/uiRecordApi";
import LEAD_PHONE_NUMBER from "@salesforce/schema/Lead.Phone";
import CONTACT_PHONE_NUMBER from "@salesforce/schema/Contact.Phone";
import LEAD_NAME_FIELD from "@salesforce/schema/Lead.Name";
import CONTACT_NAME_FIELD from "@salesforce/schema/Contact.Name";
import getMessagesByClientPhone from "@salesforce/apex/WhatsAppLWCService.getMessagesByClientPhone";
import sendTextMessage from "@salesforce/apex/WhatsAppLWCService.sendTextMessage";
import getSingleMessage from "@salesforce/apex/WhatsAppLWCService.getSingleMessage";
import generateDownloadUrl from "@salesforce/apex/WhatsAppLWCService.generateDownloadUrl";

import { subscribe, unsubscribe, onError } from "lightning/empApi";
import getContentVersions from "@salesforce/apex/ContentVersionController.getContentVersions";
import sendMediaMessage from "@salesforce/apex/WhatsAppLWCService.sendMediaMessage";
import getContentVersion from "@salesforce/apex/ContentVersionController.getContentVersion";

export default class WhatsAppChatComponent extends LightningElement {
  @api recordId;

  @api objectApiName;

  @track messages;
  @track showChat = false;
  phoneNumber;
  clientLogo;
  messageContent;
  phoneNumberExist = false;

  @track fields;

  // * File Send
  @track selectedFile;
  @track fileOptions;
  @track selectedFileDetails;
  @track file;
  @track downloadUrl;

  // * File icons
  get iconName() {
    return "doctype:pdf";
  }

  @track showFileOptions = false;
  toggleAttachFile() {
    this.showFileOptions = !this.showFileOptions;
    console.log("im here to handle scroll");
    let chatArea = this.template.querySelector(".chat-area");
    if (chatArea) {
      chatArea.scrollTop = chatArea.scrollHeight;
    }
  }

  // * Get the lead or client data

  @wire(getRecord, {
    recordId: "$recordId",
    fields: "$fields"
  })
  wiredLead({ error, data }) {
    if (data) {
      console.log("im getting lead data");
      console.log(data);
      if (data.fields.Phone.value != null) {
        this.phoneNumber = data.fields.Phone.value.replace(/\+/g, "");
        this.phoneNumberExist = true;
      }
      const Name = data.fields.Name.value.split(" ");
      this.clientLogo = (Name[0].charAt(0) + Name[1].charAt(0)).toUpperCase();
      console.log("Phone NUmber", this.phoneNumber);
    } else if (error) {
      console.log("error", error);
    }
  }

  @wire(getContentVersions)
  wireResult({ error, data }) {
    console.log("files");
    if (data) {
      console.log("im getting the files");
      console.log(data);
      this.fileOptions = data.map((file) => {
        return {
          label: file.Title,
          value: file.Id
        };
      });
    } else if (error) {
      console.log(error);
    }
  }

  handleFileChange(event) {
    this.selectedFile = event.detail.value;
    console.log("file selected" + this.selectedFile);
  }

  // * Get the messages
  @wire(getMessagesByClientPhone, { clientPhone: "$phoneNumber" })
  wiredMessages({ error, data }) {
    if (data) {
      console.log("messages data is getting");
      this.messages = data;
      if (this.messages.length > 0) {
        console.log(this.messages.length);
        this.showChat = true;
      }

      this.handleFormattedDate();
    } else if (error) {
      console.log("error", error);
      this.messages = undefined;
      this.showChat = false;
    }
  }

  // * handle event formattedDate and scroll

  handleInputEvent() {
    let chatInput = this.template.querySelector(".chat-input");
    if (chatInput) {
      chatInput.focus();
      chatInput.addEventListener("keydown", (event) => {
        if (event.key === "Enter") {
          this.sendMessage();
        }
      });
    }
  }

  handleFormattedDate() {
    console.log("im called");
    this.messages = this.messages.map((message) => {
      const date = new Date(message.CreatedDate);
      const formattedDate = date.toLocaleTimeString([], {
        hour: "2-digit",
        minute: "2-digit",
        hour12: true
      });
      return { ...message, formattedDate };
    });
  }
  handleChatAreaScroll() {
    console.log("im here to handle scroll");
    let chatArea = this.template.querySelector(".chat-area");
    if (chatArea) {
      chatArea.scrollTop = chatArea.scrollHeight - 20;
    }
  }

  // * We subscribe to the event fired from the apex class

  platformEventName = "/event/WAMessageEvent__e";
  subscription;

  connectedCallback() {
    console.log("cv");
    // this.handleChatAreaScroll();
    this.handleInputEvent();
    this.handleError();
    this.handleSubscribe();
    console.log("hello from connectedCallback");
    if (this.objectApiName === "Lead") {
      this.fields = [LEAD_PHONE_NUMBER, LEAD_NAME_FIELD];
    } else if (this.objectApiName === "Contact") {
      this.fields = [CONTACT_PHONE_NUMBER, CONTACT_NAME_FIELD];
    }
  }

  disconnectedCallback() {
    unsubscribe(this.subscription, (response) => {
      console.log("unsubscribe() response: ", JSON.stringify(response));
    });
  }

  handleError() {
    onError((error) => {
      console.error("Received error from server: ", JSON.stringify(error));
    });
  }

  handleSubscribe() {
    subscribe(
      this.platformEventName,
      -1,
      this.handleSubscribeResponse.bind(this)
    ).then((response) => {
      console.log("im in handleSubscribe");
      this.subscription = response;
      console.log("Subscribed", JSON.stringify(response));
    });
  }

  handleSubscribeResponse(response) {
    console.log("im handling response");

    const recievedMessageId = response.data.payload.MessageId__c;
    const recievedCustomerPhoneNumber = response.data.payload.CustomerPhone__c;
    console.log("messageId", recievedMessageId);
    console.log("customerPhoneNumber", recievedCustomerPhoneNumber);

    // here we import the message with the messageID included in the response
    if (recievedCustomerPhoneNumber === this.phoneNumber) {
      getSingleMessage({
        messageId: recievedMessageId,
        customerPhoneNumber: recievedCustomerPhoneNumber
      })
        .then((result) => {
          console.log("im getting and the message");
          console.log(result);
          this.messages.push(result);
          this.showChat = true;
          this.handleFormattedDate();
          console.log("message pushed");
        })
        .catch((error) => {
          console.log("im getting an error");
          console.log("im getting an error" + error.message);
        })
        .finally(() => {
          console.log("im here to handle scroll");
          let chatArea = this.template.querySelector(".chat-area");
          if (chatArea) {
            chatArea.scrollTop = chatArea.scrollHeight;
          }
        });
    }
  }

  // * Send message to the client
  sendMessage() {
    console.log("im here");
    // verify if the message is not empty
    let chatInput = this.template.querySelector(".chat-input");

    if (chatInput.value) {
      console.log("im here");
      sendTextMessage({
        toPhone: this.phoneNumber,
        messageContent: chatInput.value
      })
        // eslint-disable-next-line no-unused-vars
        .then((result) => {
          this.messages.push(result);
          // the messages are updated
          this.handleFormattedDate();
          this.showChat = true;
        })
        .catch((error) => {
          this.showChat = false;
          console.log(error);
        })
        .finally(() => {
          console.log("im here to handle scroll");
          let chatArea = this.template.querySelector(".chat-area");
          if (chatArea) {
            chatArea.scrollTop = chatArea.scrollHeight;
          }
          this.messageContent = "";
        });
    } else if (this.selectedFile !== undefined) {
      console.log("im handling sending file" + this.selectedFile);

      generateDownloadUrl({ fileId: this.selectedFile, fileName: "File Name" })
        .then((result) => {
          console.log("im getting the download url");
          this.downloadUrl = result;
          console.log("downloadUrl", this.downloadUrl);
        })
        .catch((error) => {
          console.log(error);
        });
      getContentVersion({
        contentVersionId: this.selectedFile
      })
        .then((result) => {
          console.log("details " + result);
          this.selectedFileDetails = result;
        })
        .catch((error) => {
          console.log(error);
        });

      this.file = {
        Id: this.selectedFileDetails.Id,
        Title: this.selectedFileDetails.Title,
        Extension: this.selectedFileDetails.FileExtension,
        ContentDocumentId: this.selectedFileDetails.ContentDocumentId,
        // ContentDocument: this.selectedFileDetails.ContentDocument,
        CreatedDate: this.selectedFileDetails.CreatedDate,
        thumbnailFileCard:
          "/sfc/servlet.shepherd/version/renditionDownload?rendition=THUMB720BY480&versionId=" +
          this.selectedFileDetails.Id +
          "&operationContext=CHATTER&contentId=" +
          this.selectedFileDetails.ContentDocumentId,
        downloadUrl:
          "/sfc/servlet.shepherd/document/download/" +
          this.selectedFileDetails.ContentDocumentId
      };

      sendMediaMessage({
        toPhone: this.phoneNumber,
        fileDownloadUrl: this.downloadUrl,
        fileName: this.selectedFileDetails.Title,
        extension: this.selectedFileDetails.FileExtension,
        thumbnailFileCard:
          "/sfc/servlet.shepherd/version/renditionDownload?rendition=THUMB720BY480&versionId=" +
          this.selectedFileDetails.Id +
          "&operationContext=CHATTER&contentId=" +
          this.selectedFileDetails.ContentDocumentId,
        downloadUrl:
          "/sfc/servlet.shepherd/document/download/" +
          this.selectedFileDetails.ContentDocumentId
      })
        .then((result) => {
          console.log("im sending the file and getting the message" + result);
          this.messages.push(result);

          // the messages are updated
          this.handleFormattedDate();
          this.showChat = true;
        })
        .catch((error) => {
          console.log("im getting an error" + error);
          this.showChat = false;
        })
        .finally(() => {
          console.log("im here to handle scroll");
          let chatArea = this.template.querySelector(".chat-area");
          if (chatArea) {
            chatArea.scrollTop = chatArea.scrollHeight;
          }
          this.messageContent = "";
        });
    } else {
      // eslint-disable-next-line no-useless-return
      return;
    }
  }

  handleChatInput(event) {
    this.messageContent = event.target.value;
  }

  navigateToPdfPreview() {
    console.log("file preview");
    window.open(
      "https://ensa-7b-dev-ed.develop.my.salesforce.com/sfc/p/8e000000SoQO/a/8e000000LYtt/Kq_Y.uboht2Nm.K9zxjU6puXZIEiohR.1Mly37M9h10"
    );
  }
}