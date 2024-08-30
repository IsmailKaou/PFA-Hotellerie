public with sharing class ProductDataService {
  @AuraEnabled(cacheable=true)
  public static List<Product2> getProducts(string productRecordName) {
    try {
      String query =
        'SELECT ' +
        'Name, category__c,free__c,type_of_criteria__c,ProductCode,Options_available__c,ProductClass ,views__c,RecordType.Name, Picture__c, capacity__c FROM Product2 ';
      if (String.isNotBlank(productRecordName)) {
        query += 'WHERE RecordType.Name = :productRecordName';
      }
      return Database.query(query);
    } catch (Exception e) {
      throw new AuraHandledException(e.getMessage());
    }
  }

  @AuraEnabled(cacheable=true)
  public static List<ProductReview__c> getAllReviews(String productId) {
    return [
      SELECT
        Id,
        Name,
        Comment__c,
        LastModifiedDate,
        CreatedBy.Name,
        OwnerId,
        Review_Subject__c,
        Rating__c,
        LastModifiedById
      FROM ProductReview__c
      WHERE Product__c = :productId
      WITH SECURITY_ENFORCED
    ];
  }
  @AuraEnabled
  public static void submitReview(
    String subjectreview,
    Integer rating,
    String comment,
    String productId
  ) {
    try {
      ProductReview__c newReview = new ProductReview__c();
      newReview.Comment__c = comment;
      // Product2 pr = [SELECT Id FROM Product2 WHERE Id = :productId  WITH SECURITY_ENFORCED ];
      // System.debug(pr);
      newReview.Product__c = productId;
      newReview.Review_Subject__c = subjectreview;
      newReview.Rating__c = rating;

      insert newReview;
    } catch (Exception e) {
      throw new AuraHandledException(e.getMessage());
    }
  }
}