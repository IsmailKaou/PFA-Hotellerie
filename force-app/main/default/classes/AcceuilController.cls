public class AcceuilController {
public  static Datetime startDate{get;set;}
public  static Datetime endDate{get;set;}
public  static Datetime meetingDate{get;set;}
public  static Integer meetingDuration{get;set;}
public  static Integer Capacity{get;set;}
public  static List<OpportunityLineItem> prodResList{get;set;}
public  static List<Product2> prodList{get;set;}
public  static List<Product2> prodNonResList{get;set;}
public  static List<Id> idProdResList{get;set;}
public  static String selectedType{get;set;}

public static boolean showResult{get;set;}
public static boolean blnNoResultFound{get;set;}
public static boolean showSearch{get;set;}
public static boolean showBedroomCheck{get;set;}
public static boolean showMeetingCheck{get;set;}


    public AcceuilController() {
        showResult = false;
        blnNoResultFound = false;
        showBedroomCheck = false;
        showMeetingCheck = false;
        prodResList = new List<OpportunityLineItem>();
        prodList= new List<Product2>();
        prodNonResList= new List<Product2>();
        idProdResList=new List<Id>();
        selectedType='';

   }
    public PageReference searchtest(){
        prodList = [SELECT Id,Name, category__c,free__c,type_of_criteria__c,ProductCode,Options_available__c,ProductClass ,views__c,RecordType.Name, Picture__c, capacity__c FROM Product2 ];
        if(prodList.size() > 0){
            showResult = true;
            blnNoResultFound = false;
           }
           else{
            blnNoResultFound = true;
            showResult = false;
            }
        return null;
    }

    public PageReference searchBedroom(){
        System.debug('je suis dans check diponibilité');
        System.debug('startDate:'+startDate);
        System.debug('endDate:'+endDate);
        System.debug('capacity:'+Capacity);
        System.debug('selectedType:'+selectedType);

       if(startDate != NULL && endDate != NULL){
            prodResList = [
                SELECT
                Product2.Id
                FROM OpportunityLineItem 
                WHERE
                Opportunity.Check_in_date__c <= :startDate
                AND Opportunity.Check_out_date__c >= :endDate
              ];
            } 
        if(prodResList.size() > 0 ){
            System.debug('LA LISTE reservée:'+prodResList);
            idProdResList=idproductfunct(prodResList);
            Set<Id> idSet = new Set<Id>(idProdResList);
            System.debug('LA LISTE des ids EST:'+idSet);
            if(!idSet.isEmpty()){
            prodList = [
                SELECT Id,
                Name, 
                category__c,
                free__c,
                type_of_criteria__c,
                ProductCode,
                Options_available__c,
                ProductClass ,
                views__c,
                RecordType.Name, 
                Picture__c, 
                capacity__c 
                FROM Product2 
                WHERE Id NOT IN :idSet 
                AND RecordType.Name= :selectedType
                AND capacity__c= :Capacity];}
            System.debug('LA LISTE non reservée:'+prodList);
            showResult = true;
            blnNoResultFound = false;
            }
            else{
             blnNoResultFound = true;
             showResult = false;
             }
             return null;        
          }
          public List<Id> idproductfunct(List<OpportunityLineItem> liste) {
            List<Id> listeIdproRese = new List<Id>();
            
            for (OpportunityLineItem elem : liste) {
                if (elem.Product2Id != null) {
                    listeIdproRese.add(elem.Product2Id);
                }
            }
            
            return listeIdproRese;
        }
        
        public PageReference test() {
            if (selectedType == 'Bedroom') {
                System.debug('showBedroomCheck before:'+showBedroomCheck);
                showBedroomCheck = true;
                System.debug('showBedroomCheck after :'+showBedroomCheck);
                showMeetingCheck = false; // Ensure the other flag is set to false
            } else if (selectedType == 'Meeting room') {
                showBedroomCheck = false; // Ensure the other flag is set to false
                showMeetingCheck = true;
            } else {
                showBedroomCheck = false; // Ensure both flags are set to false
                showMeetingCheck = false;
            }
        
            showSearch = false; // This line can be placed outside the if-else block if it applies in all cases.
        
            return null;
        }
 
    public List<SelectOption> getItems() {
        List<SelectOption> options = new List<SelectOption>();
        options.add(new SelectOption('Bedroom','Bedroom'));
        options.add(new SelectOption('Meeting room','Meeting room'));

        return options;
    }
    public PageReference searchMeetingRoom(){
    System.debug('JE SUIS DANS searchMeetingRoom ');
    return null;
    }
        
}