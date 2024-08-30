trigger TR_OppCheckOutDate on Opportunity (before insert) {
    for(Opportunity opp : trigger.new){
        if(opp.Check_out_date__c == null && opp.Check_in_date__c != null && opp.Duration__c != null){
            opp.Check_out_date__c = opp.Check_in_date__c.addHours( (Integer) opp.Duration__c ) ;
        }
    }
}