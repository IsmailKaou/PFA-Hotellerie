public with sharing class CreateOpportunityProduct {
  @AuraEnabled(cacheable=true)
  public static PricebookEntry getPricebookEntry(
    String productid,
    String priceBookId
  ) {
    return [
      SELECT Id, UnitPrice
      FROM PricebookEntry
      WHERE Product2Id = :productid AND Pricebook2Id = :priceBookId
      LIMIT 1
    ];
  }
  @AuraEnabled
  public static List<OpportunityLineItem> oppProductMethod(
    Product2[] products,
    String idOpportunity,
    String idPricebook
  ) {
    List<OpportunityLineItem> oppItems = new List<OpportunityLineItem>();

    try {
      for (Product2 product : products) {
        Double unitPrice = CreateOpportunityProduct.getUnitPrice(
          product.Id,
          idPricebook
        );

        if (unitPrice != null) {
          OpportunityLineItem oppItem = new OpportunityLineItem();
          oppItem.OpportunityId = idOpportunity;
          oppItem.Product2Id = product.Id;
          oppItem.Quantity = 1;
          oppItem.TotalPrice = unitPrice;

          oppItems.add(oppItem);
        }
      }

      insert oppItems;

      return oppItems;
    } catch (Exception e) {
      throw new AuraHandledException(e.getMessage());
    }
  }

  public static Double getUnitPrice(String productId, String priceBookId) {
    Double unitPrice = null;
    try {
      PricebookEntry unit = [
        SELECT UnitPrice
        FROM PricebookEntry
        WHERE Product2Id = :productId AND Pricebook2Id = :priceBookId
        WITH SECURITY_ENFORCED
        LIMIT 1
      ];
      unitPrice = unit.UnitPrice;
    } catch (QueryException e) {
      unitPrice = 0.0;
    }
    return unitPrice;
  }
}