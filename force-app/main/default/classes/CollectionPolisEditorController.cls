public with sharing class CollectionPolisEditorController {
    @AuraEnabled(cacheable=true)
    public static List<Polis_Collection_Connection__c> getRelatedPolisFromCollection(id collectionId){
        try {
            List<Polis_Collection_Connection__c> relatedPolis = [
                SELECT Id, Related_Polis__r.Id, Related_Polis__r.Name
                FROM Polis_Collection_Connection__c
                WHERE Related_Collection__r.Id = :collectionId
                WITH USER_MODE
            ];
            return relatedPolis;
        } catch (Exception e) {
            throw new AuraHandledException(e.getMessage());
        }
    }

    @AuraEnabled
    public static void createConnections(Id collectionId, List<Id> polisIds){
        System.debug('Trying to create connections with:' + collectionId + polisIds);
        try {
            List<Polis_Collection_Connection__c> existingConnections = [
                SELECT Id, Related_Polis__c
                FROM Polis_Collection_Connection__c
                WHERE Related_Collection__c = :collectionId
                WITH USER_MODE
            ];
            List<Id> existingPolisIds = new List<Id>();
            for (Polis_Collection_Connection__c connection: existingConnections) {
                existingPolisIds.add(connection.Related_Polis__c);
            }
            
            List<Polis_Collection_Connection__c> connectionsToCreate = new List<Polis_Collection_Connection__c>();
            for (Id polisId : polisIds) {
                if (existingPolisIds.contains(polisId)) {
                    continue;
                }
                Polis_Collection_Connection__c newConnection = new Polis_Collection_Connection__c();
                newConnection.Related_Collection__c = collectionId;
                newConnection.Related_Polis__c = polisId;
                connectionsToCreate.add(newConnection);
            }
            insert connectionsToCreate;

        } catch (Exception e) {
            throw new AuraHandledException(e.getMessage());
        }
    }

    @AuraEnabled
    public static void deleteConnections(List<Id> connectionIds){
        try {
            List<Polis_Collection_Connection__c> connectionsToDelete = [
                SELECT Id
                FROM Polis_Collection_Connection__c
                WHERE Id IN :connectionIds
                WITH USER_MODE
            ];
            if (Polis_Collection_Connection__c.SObjectType.getDescribe().isDeletable()){
                delete connectionsToDelete;
            }
        } catch (Exception e) {
            throw new AuraHandledException(e.getMessage());
        }
    }

    @AuraEnabled(cacheable=true)
    public static List<Polis__c> getPolis(List<Id> polisIds){
        try {
            List<Polis__c> polis = [
                SELECT Id, Name
                FROM Polis__c
                WHERE Id IN :polisIds
                WITH USER_MODE
            ];
            return polis;
        } catch (Exception e) {
            throw new AuraHandledException(e.getMessage());
        }
    }

    @AuraEnabled(cacheable=true)
    public static List<Polis__c> getAllPolis(){
        try {
            List<Polis__c> allPolis = [
                SELECT Id, Name
                FROM Polis__c
                WITH USER_MODE
            ];
            return allPolis;
        } catch (Exception e) {
            throw new AuraHandledException(e.getMessage());
        }
    }
}