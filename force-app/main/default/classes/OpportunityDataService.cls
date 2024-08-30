public with sharing class OpportunityDataService {
  @AuraEnabled(cacheable=true)
  public static List<OpportunityLineItem> getOppProd(
    Date startDate,
    Date endDate
  ) {
    return [
      SELECT
        Id,
        Name,
        Product2Id,
        Product2.Name,
        OpportunityId,
        Opportunity.Name,
        Opportunity.Check_in_date__c,
        Opportunity.Check_out_date__c
      FROM OpportunityLineItem
      WHERE
        Opportunity.Check_in_date__c >= :startDate
        AND Opportunity.Check_out_date__c <= :endDate
    ];
  }

  @AuraEnabled(cacheable=true)
  public static List<OpportunityLineItem> getOppMeetingRoom(
    Datetime meetingDate,
    Double meetingDuration
  ) {
    Datetime meetingEndDate = meetingDate.addHours((Integer) meetingDuration);
    return [
      SELECT
        Id,
        Name,
        Product2Id,
        Product2.Name,
        OpportunityId,
        Opportunity.Name,
        Opportunity.Check_in_date__c,
        Opportunity.Check_out_date__c
      FROM OpportunityLineItem
      WHERE
        Opportunity.Check_in_date__c >= :meetingDate
        AND Opportunity.Check_out_date__c <= :meetingEndDate
    ];
  }
}