@isTest
public with sharing class LeadManagerTest {
  @isTest
  static void testCreateLead() {
    RestRequest req = new RestRequest();
    req.requestURI = 'https://ensa-7b-dev-ed.develop.my.salesforce.com/services/apexrest/Leads/';
    req.httpMethod = 'POST';
    req.requestBody = Blob.valueOf(
      '{"Salutation":"Mr.","FirstName":"Test","LastName":"Lead","Company":"Test Company","Email":"test@company.com","Phone":"+21265809656","Status":"New","LeadSource":"Web","Type__c":"B2B"}'
    );
    RestContext.request = req;

    Id leadId = LeadManager.createLead();
    System.assert(leadId != null);
    System.assertEquals(
      'Test Lead',
      [SELECT Name FROM Lead WHERE Id = :leadId].Name
    );
  }
}