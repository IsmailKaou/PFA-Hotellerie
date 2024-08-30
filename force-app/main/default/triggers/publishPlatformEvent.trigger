trigger publishPlatformEvent on WAMessage__c(after insert, after update) {
  List<WAMessageEvent__e> platformEvents = new List<WAMessageEvent__e>();
  for (WAMessage__c waMsg : Trigger.new) {
    if(waMsg.Outgoing__c) {
      continue;
    }
    WAMessageEvent__e platformEvent = new WAMessageEvent__e();
    platformEvent.MessageId__c = waMsg.MessageID__c;
    platformEvent.CustomerPhone__c = waMsg.CustomerPhone__c;
    platformEvents.add(platformEvent);
  }
  if (!platformEvents.isEmpty()) {
    EventBus.publish(platformEvents);
  }
}