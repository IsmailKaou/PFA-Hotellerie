public class WhatsAppUtils {
  public static WAMessage__c sendTextMessage(
    String toPhone,
    String messageContent
  ) {
    HttpRequest request = new HttpRequest();
    request.setEndpoint(
      'https://graph.facebook.com/v17.0/122098952930008063/messages'
    );
    request.setMethod('POST');
    request.setHeader('Content-Type', 'application/json');
    request.setHeader(
      'Authorization',
      'Bearer ' + System.Label.WHATSAPPACCESSTOKEN
    );

    String messageBody =
      '{' +
      '    "messaging_product": "whatsapp",    ' +
      '    "recipient_type": "individual",' +
      '    "to": "' +
      toPhone +
      '",' +
      '    "type": "text",' +
      '    "text": {' +
      '        "preview_url": false,' +
      '        "body": "' +
      messageContent +
      '"' +
      '    }' +
      '}';

    request.setBody(messageBody);

    Http http = new Http();
    WAMessage__c salesforceMessage = new WAMessage__c();

    try {
      HttpResponse response = http.send(request);
      if (response.getStatusCode() == 200) {
        // we will create a message into salesforce
        WhatsAppUtils responseFromWa = (WhatsAppUtils) JSON.deserialize(
          response.getBody(),
          WhatsAppUtils.class
        );

        /* Create record into Salesforce */
        salesforceMessage.MessageContent__c = messageContent;
        salesforceMessage.CustomerPhone__c = toPhone;
        salesforceMessage.MessageID__c = responseFromWA.messages.get(0).id;
        salesforceMessage.MessageType__c = 'text';
        salesforceMessage.Outgoing__c = true;
        salesforceMessage.Agent_Name__c =
          UserInfo.getName() +
          ' ' +
          UserInfo.getLastName();
        upsert salesforceMessage MessageID__c;
      }
    } catch (Exception e) {
      System.debug('The following exception has occurred: ' + e.getMessage());
    }
    return salesforceMessage;
  }

  public static WAMessage__c sendMediaMessage(
    String toPhone,
    String fileDownloadUrl,
    String fileName,
    String extension,
    String thumbnailFileCard,
    String downloadUrl
  ) {
    HttpRequest request = new HttpRequest();
    request.setEndpoint(
      'https://graph.facebook.com/v17.0/122098952930008063/messages'
    );
    request.setMethod('POST');
    request.setHeader('Content-Type', 'application/json');
    request.setHeader(
      'Authorization',
      'Bearer ' + System.Label.WHATSAPPACCESSTOKEN
    );

    String body =
      '{' +
      '    "messaging_product": "whatsapp",' +
      '    "recipient_type": "individual",' +
      '    "to": "' +
      toPhone +
      '",' +
      '    "type": "document",' +
      '    "document": {' +
      '        "link": "' +
      fileDownloadUrl +
      '",' +
      '        "caption" : "Here is the File",' +
      '        "filename" : "' +
      fileName +
      '"' +
      '    }' +
      '}';

    request.setBody(body);
    Http http = new Http();
    WAMessage__c salesforceMessage = new WAMessage__c();
    try {
      HttpResponse response = http.send(request);
      if (response.getStatusCode() == 200) {
        WhatsAppUtils responseFromWa = (WhatsAppUtils) JSON.deserialize(
          response.getBody(),
          WhatsAppUtils.class
        );

        salesforceMessage.MessageContent__c = 'file sent';
        salesforceMessage.CustomerPhone__c = toPhone;
        salesforceMessage.MessageID__c = responseFromWA.messages.get(0).id;
        salesforceMessage.MessageType__c = 'document';
        salesforceMessage.Outgoing__c = true;
        salesforceMessage.isFile__c = true;

        salesforceMessage.downloadUrl__c = downloadUrl;
        salesforceMessage.Extension__c = extension;
        salesforceMessage.title__c = fileName;
        salesforceMessage.thumbnailFileCard__c = thumbnailFileCard;

        salesforceMessage.Agent_Name__c =
          UserInfo.getName() +
          ' ' +
          UserInfo.getLastName();
        upsert salesforceMessage MessageID__c;
      }
    } catch (Exception e) {
      System.debug(e.getMessage());
    }
    return salesforceMessage;
  }

  public String messaging_product; //whatsapp
  public contacts[] contacts;
  public messages[] messages;
  public class contacts {
    public String input; //212605809656
    public String wa_id; //212605809656
  }
  public class messages {
    public String id; //wamid.HBgMMjEyNjA1ODA5NjU2FQIAERgSOThDMUQ2QzcwMjA5QzEyM0YzAA==
  }
}