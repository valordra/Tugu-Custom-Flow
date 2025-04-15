import { LightningElement, wire } from 'lwc';
import { refreshApex } from "@salesforce/apex";
import getCollectionQueuesWithBacklog from '@salesforce/apex/CollectionQueueBacklogMonitorController.getCollectionQueuesWithBacklog';
import {
    subscribe,
    onError,
} from 'lightning/empApi';
import Toast from 'lightning/toast';

export default class CollectionQueueBacklogMonitor extends LightningElement {
    COMPONENT_NAME = 'collectionQueueBacklogMonitor';
    apexResponse;
    queueBacklogs;
    error;
    channelName = '/event/Collection_Assignment__e';

    @wire(getCollectionQueuesWithBacklog) // get from apex controller
        wiredQueueBacklogs(response){
            // Hold on to the provisioned value so we can refresh it later.
            this.apexResponse = response; // track the provisioned value
            const { data, error } = response; // destructure the provisioned value
            if (data){
                this.queueBacklogs = data;
                this.error = undefined;
                // console.log(this.COMPONENT_NAME + ' got data:')
                // console.log(this.queueBacklogs);
                this.handlePlatformEventSubscribe(this, this.apexResponse); // subscribe to platform event based on the data
            } else if (error){
                this.error = error;
                this.queueBacklogs = undefined;
                console.log(error);
            }
        }

        handlePlatformEventSubscribe(component, dataToRefresh){
            const messageCallback = function (response) {
                // console.log(component.COMPONENT_NAME + ' got event: ' + response['data']['payload']['message__c']);
                // console.log(component.COMPONENT_NAME + ' trying to refresh data...');
                refreshApex(dataToRefresh).then(() => { // refresh data each time a collection gets reassigned.
                    console.log(component.COMPONENT_NAME + ' data refreshed.');
                });
            };
            
            // Invoke subscribe method of empApi. Pass reference to messageCallback
            subscribe(this.channelName, -1, messageCallback).then((response) => {
                // Response contains the subscription information on subscribe call
                console.log(
                    'Subscription request from ' + component.COMPONENT_NAME + ' sent to: ',
                    JSON.stringify(response.channel)
                );
            });
        }

        registerErrorListener() {
            // Invoke onError empApi method
            onError((error) => {
                console.log(this.COMPONENT_NAME + ' received error from server: ', JSON.stringify(error));
                // Error contains the server-side error
            });
        }

}