public with sharing class CreateOpportunity {
@AuraEnabled(cacheable=true) //cacheable=true est important au  cas ou lightnind data service (@wire) est utilisé 
public static Pricebook2 getPriceBook(){
    try {
        return [SELECT  Id , Name 
        FROM Pricebook2 
        WHERE Name ='Standard Price Book'
        LIMIT 1
        ];
    } catch (Exception e) {
        throw new AuraHandledException(e.getMessage());
    }
}
@AuraEnabled
public static Opportunity opportunitytRecMethod(Opportunity oppRec,String idContact ,String idpriceBook){
    try {
        oppRec.Contact__c=idContact;
        oppRec.Pricebook2Id=idpriceBook;
        insert oppRec;
        return oppRec;

    } catch (Exception e) {
        throw new AuraHandledException(e.getMessage());
    }
}
}