trigger TR_opportunity on Opportunity (after insert,after update) {
    if((Trigger.isinsert || trigger.isupdate) && Trigger.isafter){
        OpportunityTriggerHandler.afterinsert_afterupdate_handler(Trigger.new);
    }

}