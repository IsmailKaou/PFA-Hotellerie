public with sharing class ContentVersionController {
  @AuraEnabled(cacheable=true)
  public static List<ContentVersion> getContentVersions() {
    return [
      SELECT Id, Title, FileExtension
      FROM ContentVersion
      WHERE FileExtension IN ('doc', 'pdf')
    ];
  }

  @AuraEnabled(cacheable=true)
  public static ContentVersion getContentVersion(Id contentVersionId) {
    return [
      SELECT
        Id,
        Title,
        ContentDocumentId,
        FileType,
        ContentSize,
        FileExtension,
        VersionNumber,
        CreatedDate,
        VersionData,
        FirstPublishLocationId
      FROM ContentVersion
      WHERE Id = :contentVersionId
    ];
  }
}