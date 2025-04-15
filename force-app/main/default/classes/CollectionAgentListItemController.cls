public with sharing class CollectionAgentListItemController {
    @AuraEnabled
    public static List<Collections__c> getAgentOpenCollections(String agentName){
        try {
            List<Collections__c> agentCollections = [
                Select Id, Name, Status__c, Assigned_at__c
                FROM Collections__c
                WHERE Owner.Name = :agentName
                AND Status__c != 'Closed'
                WITH USER_MODE
            ];
            return agentCollections;
        } catch (Exception e) {
            System.debug(e);
            throw new AuraHandledException(e.getMessage());
        }
    }
}