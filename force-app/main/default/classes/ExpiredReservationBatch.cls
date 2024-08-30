public class ExpiredReservationBatch implements Database.Batchable<sObject>, Database.Stateful{
    public Database.QueryLocator  start(Database.BatchableContext bc) {
        Date dt = System.Today();
        return Database.getQueryLocator(
            'SELECT ID, StageName ' +
            'FROM Opportunity' +
            'Where StageName = \'New\'' +
            'AND CloseDate = ' + dt 
        );
           
        
    }
    public void execute(Database.BatchableContext BC, list<Opportunity> AllOpp){
        for (Opportunity opp : AllOpp){
            opp.StageName = 'Closed Lost';
        }
    update AllOpp;
        
        
        
    }
    public void finish(Database.BatchableContext BC){
        //send email and add post to chatter
    }

}