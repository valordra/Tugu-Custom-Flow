public with sharing class CollectionAgentMonitorController {
    public static final String DIRECT_COLLECTION_TEAM_GROUP_NAME = 'Test Direct Collections';
    public static final String INDIRECT_COLLECTION_TEAM_GROUP_NAME = 'Test Indirect Collections';
    
    public class Response {
        @AuraEnabled
        public String agentName {get; set;}

        @AuraEnabled
        public String agentType {get; set;}

        @AuraEnabled
        public Integer agentWorkload {get; set;}
    }

    @AuraEnabled(cacheable=true)
    public static List<Response> getCollectionAgentsWithWorkload(){
        try {
            List<GroupMember> collectionAgents = [
                SELECT UserOrGroupId, UserOrGroup.Name, Group.Name
                FROM GroupMember
                WHERE Group.Name = :DIRECT_COLLECTION_TEAM_GROUP_NAME 
                    OR Group.Name = :INDIRECT_COLLECTION_TEAM_GROUP_NAME
                WITH USER_MODE
            ];
            List<AggregateResult> workloads = [
                SELECT count(Owner.Name) Workload, OwnerId
                FROM Collections__c
                WHERE Status__c != 'Closed'
                WITH USER_MODE
                GROUP BY OwnerId
            ];
            Map<Id, GroupMember> userAgentMap = new Map<ID, GroupMember>();
            Map<Id, Integer> agentWorkloadMap = new Map<ID, Integer>();
            for (GroupMember member: collectionAgents) {
                userAgentMap.put(member.UserOrGroupId, member);
                agentWorkloadMap.put(member.UserOrGroupId, 0);
            }
            for (AggregateResult workload: workloads) {
                agentWorkloadMap.put((Id) workload.get('OwnerId'), Integer.valueOf(workload.get('Workload')));
            }
            List<Response> responses = new List<Response>();
            for (Id agentId: userAgentMap.keySet()) {
                Response response = new Response();
                GroupMember currentAgent = userAgentMap.get(agentId);
                response.agentName = currentAgent.UserOrGroup.Name;
                response.agentType = 'Direct';
                if (currentAgent.Group.Name == INDIRECT_COLLECTION_TEAM_GROUP_NAME){
                    response.agentType = 'Indirect';
                }
                response.agentWorkload = agentWorkloadMap.get(agentId);
                responses.add(response);
            }
            return responses;
        } catch (Exception e) {
            throw new AuraHandledException(e.getMessage());
        }
    }
}