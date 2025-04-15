import { api, LightningElement } from 'lwc';
import getAgentOpenCollections from '@salesforce/apex/CollectionAgentListItemController.getAgentOpenCollections';
import {
    subscribe,
    onError,
} from 'lightning/empApi';
import { NavigationMixin } from 'lightning/navigation';
export default class CollectionAgentListItem extends NavigationMixin(LightningElement)  {
    COMPONENT_NAME = 'collectionAgentListItem';
    @api agentName;
    @api agentType;
    @api agentWorkload;
    @api maxAgentWorkload;
    collections;
    showCollections = false;
    channelName = '/event/Collection_Assignment__e';
    
    async handleHrefAssignedCollectionsClick(event){
        event.preventDefault();
        if (!this.collections){
            this.collections = await getAgentOpenCollections({agentName: this.agentName});
            // Invoke subscribe method of empApi. Pass reference to messageCallback
            // use .bind(this) to ensure this keyword points to our component on message callback
            subscribe(this.channelName, -1, this.messageCallback.bind(this)).then((response) => {
                // Response contains the subscription information on subscribe call
                console.log(
                    'Subscription request from ' + this.COMPONENT_NAME + ' sent to: ',
                    JSON.stringify(response.channel)
                );
            });
            console.log(this.COMPONENT_NAME + ' subscribed.')
        }
        this.showCollections = !this.showCollections;
    }

    async messageCallback(response){
        console.log(this.COMPONENT_NAME + ' got event: ' + response['data']['payload']['message__c']); // this sometimes work, better use component
        if (this.collections){
            this.collections = await getAgentOpenCollections({agentName: this.agentName});
            console.log('Refreshed data for: ' + this.COMPONENT_NAME);
            console.log(this.collections);
        }
    }

    async registerErrorListener() {
        // Invoke onError empApi method
        onError((error) => {
            console.log('Received erro  r from server: ', JSON.stringify(error));
            // Error contains the server-side error
        });
    }

    navigateToCollection(event){
        console.log(event.target.dataset.collectionId);
        this[NavigationMixin.GenerateUrl]({
            type: 'standard__recordPage',
            attributes: {
                recordId: event.target.dataset.collectionId,
                objectApiName: 'Collections__c',
                actionName: 'view'
            }
        }).then(url => {
            window.open(url, "_blank");
        });
    }
}