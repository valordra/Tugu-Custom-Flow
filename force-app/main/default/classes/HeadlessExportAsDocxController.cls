public with sharing class HeadlessExportAsDocxController {
    @AuraEnabled(cacheable=true)
    public static Collections__c getCollectionForExport(String collectionId) {
        System.debug('Got id: ' + collectionId);
        try {
            Collections__c fetchedCollection = [
                SELECT Id, Name, Jumlah_Bayar__c, Lamp__c, Nomor_CATA__c, 
                    Related_Contact__r.Name, Related_Contact__r.MailingStreet
                FROM Collections__c
                WHERE Id = :collectionId
                WITH USER_MODE
            ][0];
            return fetchedCollection;
        } catch (Exception e) {
            System.debug(e);
            throw new AuraHandledException(e.getMessage());
        }
    }

    @AuraEnabled(cacheable=true)
    public static string getBase64ImageFromFile(String fileName){
        try {
            Blob imageBlob = [
                SELECT VersionData, PathOnClient, CreatedBy.Name
                FROM ContentVersion
                WHERE PathOnClient = :fileName
            ][0].VersionData;
            String base64Image = EncodingUtil.base64Encode(imageBlob);
            return base64Image;
        } catch (Exception e) {
            System.debug(e);
            throw new AuraHandledException(e.getMessage());
        }
    }

    @AuraEnabled(cacheable=true)
    public static List<Collections__c> getOtherCollectionsFromContact(String contactName, String collectionId){
        try {
            List<Collections__c> contactCollections = [
                SELECT Name, Lamp__c, Jumlah_Bayar__c
                FROM Collections__c
                WHERE Related_Contact__r.Name = :contactName
                AND Id != :collectionId
                WITH USER_MODE
            ];
            return contactCollections;
        } catch (Exception e) {
            throw new AuraHandledException(e.getMessage());
        }
    }
}