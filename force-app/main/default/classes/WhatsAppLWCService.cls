public with sharing class WhatsAppLWCService {
  @AuraEnabled(cacheable=true)
  public static List<WAMessage__c> getMessagesByClientPhone(
    String clientPhone
  ) {
    List<WAMessage__c> messages = [
      SELECT
        Id,
        isFile__c,
        MessageContent__c,
        CustomerName__c,
        Agent_Name__c,
        Outgoing__c,
        CreatedDate,
        downloadUrl__c,
        Extension__c,
        title__c,
        thumbnailFileCard__c
      FROM WAMessage__c
      WHERE CustomerPhone__c = :clientPhone
      ORDER BY CreatedDate ASC
    ];
    return messages;
  }

  @AuraEnabled
  public static WAMessage__c getSingleMessage(
    String messageId,
    String customerPhoneNumber
  ) {
    WAMessage__c message = [
      SELECT
        Id,
        MessageContent__c,
        CustomerName__c,
        Agent_Name__c,
        Outgoing__c,
        CreatedDate
      FROM WAMessage__c
      WHERE
        MessageId__c = :messageId
        AND CustomerPhone__c = :customerPhoneNumber
      ORDER BY CreatedDate ASC
    ];
    return message;
  }

  @AuraEnabled
  public static WAMessage__c sendTextMessage(
    String toPhone,
    String messageContent
  ) {
    WAMessage__c message = WhatsAppUtils.sendTextMessage(
      toPhone,
      messageContent
    );
    return [
      SELECT
        Id,
        MessageContent__c,
        CustomerName__c,
        Agent_Name__c,
        Outgoing__c,
        CreatedDate,
        isFile__c
      FROM WAMessage__c
      WHERE Id = :message.Id
    ];
  }

  @AuraEnabled
  public static WAMessage__c sendMediaMessage(
    String toPhone,
    String fileDownloadUrl,
    String fileName,
    String extension,
    String thumbnailFileCard,
    String downloadUrl
  ) {
    WAMessage__c message = WhatsAppUtils.sendMediaMessage(
      toPhone,
      fileDownloadUrl,
      fileName,
      extension,
      thumbnailFileCard,
      downloadUrl
    );

    return [
      SELECT
        Id,
        isFile__c,
        MessageContent__c,
        CustomerName__c,
        Agent_Name__c,
        Outgoing__c,
        CreatedDate,
        downloadUrl__c,
        Extension__c,
        title__c,
        thumbnailFileCard__c
      FROM WAMessage__c
      WHERE Id = :message.Id
    ];
  }

  @AuraEnabled
  public static String generateDownloadUrl(String fileId, String fileName) {
    ContentDistribution distribution = new ContentDistribution();
    distribution.ContentVersionId = fileId;
    distribution.Name = fileName;
    distribution.PreferencesAllowOriginalDownload = true;
    distribution.PreferencesAllowViewInBrowser = true;
    distribution.PreferencesNotifyOnVisit = true;

    insert distribution;
    ContentDistribution cd = [
      SELECT Id, ContentDownloadUrl
      FROM ContentDistribution
      WHERE Id = :distribution.Id
    ];
    String DownloadUrl = cd.ContentDownloadUrl;
    // String PublicUrl = cd.DistributionPublicUrl;
    // System.debug('DownloadUrl: ' + DownloadUrl);
    return DownloadUrl;
  }
}