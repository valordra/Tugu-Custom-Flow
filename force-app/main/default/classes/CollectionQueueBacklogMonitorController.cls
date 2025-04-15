public with sharing class CollectionQueueBacklogMonitorController {
    public static final String DIRECT_COLLECTION_TEAM_GROUP_NAME = 'Test Direct Collections';
    public static final String INDIRECT_COLLECTION_TEAM_GROUP_NAME = 'Test Indirect Collections';

    public class Response {
        @AuraEnabled
        public String queueName {get; set;}

        @AuraEnabled
        public Integer backlog {get; set;}
    }

    @AuraEnabled(cacheable=true)
    public static List<Response> getCollectionQueuesWithBacklog(){
        try {
            List<AggregateResult> queueBacklogResults = [
                SELECT Owner.Name, Count(OwnerId) Backlog
                FROM Collections__c
                WHERE Status__c != 'Closed' 
                    AND Owner.Type = 'Queue'
                WITH USER_MODE
                GROUP BY Owner.Name
            ];
            List<Group> collectionQueues = [
                Select Name
                FROM Group
                WHERE Type = 'Queue'
                AND Name LIKE '%Collection%'
                WITH USER_MODE
            ];
            Map<String, Integer> queueBacklogMap = new Map<String, Integer>();
            for (Group g: collectionQueues){
                queueBacklogMap.put(g.Name, 0);
            }
            for (AggregateResult result: queueBacklogResults){
                queueBacklogMap.put(String.valueOf(result.get('Name')), Integer.valueOf(result.get('Backlog')));
            }
            List<Response> responses = new List<Response>();
            for (String queueName: queueBacklogMap.keySet()){
                Response response = new Response();
                response.queueName = queueName;
                response.backlog = queueBacklogMap.get(queueName);
                responses.add(response);
            }
            return responses;
        } catch (Exception e){
            throw new AuraHandledException(e.getMessage());
        }     
    }
}