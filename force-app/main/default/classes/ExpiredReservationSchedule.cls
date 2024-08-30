global class ExpiredReservationSchedule implements Schedulable {
   global void execute(SchedulableContext SC) {
     ExpiredReservationBatch expiredReservation = new ExpiredReservationBatch();
     Id batchId = Database.executeBatch(expiredReservation);
   }
}