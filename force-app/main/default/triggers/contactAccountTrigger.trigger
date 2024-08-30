trigger contactAccountTrigger on Contact(before insert) {
  Account acc = [SELECT Id FROM Account WHERE Name = 'Odyssey Corp'];
  for (Contact c : Trigger.new) {
    if (c.Email.endsWith('odysseycorp.com')) {
      c.AccountId = acc.Id;
    }
  }
}