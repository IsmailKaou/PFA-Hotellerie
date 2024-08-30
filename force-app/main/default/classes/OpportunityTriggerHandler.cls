public class OpportunityTriggerHandler {
    public static void afterinsert_afterupdate_handler(List<Opportunity> AllOpp){
        
        List<Sobject> ConList = New List<Sobject>();
    for(Opportunity opp : AllOpp){
        Contact temp = NEW Contact();
        temp.id = opp.Contact__c;
        ConList.add(temp);
    }

    for(SObject Con : ConList){
        List<AggregateResult> AggregateResultList = [select sum(amount) sum from opportunity where Contact__c = :Con.Id and StageName like 'Closed Won'];
        for(AggregateResult agg : AggregateResultList){
            if((Double) agg.get('sum') < 15000){
      				con.put('status__c', 'Bronze');
                
            }
            else{
                if((Double) agg.get('sum') <= 35000){
                    con.put('status__c', 'Silver');
                }
                else{
                    if((Double) agg.get('sum') <= 65000){
                        con.put('status__c', 'Gold');
                    }
                    else{
                        con.put('status__c', 'Platinum');
                    }
                }
            }
            
        }
        
        
    }
    update ConList;
    }

}