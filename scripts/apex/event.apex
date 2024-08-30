WAMessageEvent__e platformEvent = new WAMessageEvent__e();
platformEvent.MessageId__c = 'hello';
platformEvent.CustomerPhone__c = '212605809656';
Eventbus.publish(platformEvent);
