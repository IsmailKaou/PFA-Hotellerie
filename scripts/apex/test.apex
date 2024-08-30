List<WAMessage__c> messages = [
  SELECT Id
  FROM WAMessage__c
];
delete messages;
