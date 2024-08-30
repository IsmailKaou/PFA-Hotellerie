public with sharing class ContactSearch {
    @AuraEnabled(cacheable=true)
    public static Contact getContact(
        String idCard,
        String idNumber
      ) {
        return [
          SELECT
            Id,
            FirstName,
            LastName
           FROM Contact 
          WHERE
          ID_card__c =:idCard
            AND ID_number__c = :idNumber
         
        ];
      }
      @AuraEnabled
      public static void getOpportunityToDelete(String idOpportunity) {
   
          Opportunity  unit = [
            SELECT Id
            FROM Opportunity 
            WHERE Id = :idOpportunity 
            WITH SECURITY_ENFORCED
            LIMIT 1
          ];
          delete unit;  
      
    }
}