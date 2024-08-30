public with sharing class CreateContact {
    @AuraEnabled
    public static Contact contactRecMethod(Contact conRec){
        try {
            insert conRec;
            return conRec;

        } catch (Exception e) {
            throw new AuraHandledException(e.getMessage());
        }
}
}