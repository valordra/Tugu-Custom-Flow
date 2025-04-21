import { api, LightningElement, wire } from 'lwc';
import { refreshApex } from "@salesforce/apex";
import getCollectionAgentsWithWorkload from '@salesforce/apex/CollectionAgentMonitorController.getCollectionAgentsWithWorkload';
import {
    subscribe,
    onError,
} from 'lightning/empApi';
// import Toast from 'lightning/toast';
import { ShowToastEvent } from 'lightning/platformShowToastEvent';

export default class CollectionAgentMonitor extends LightningElement {
    COMPONENT_NAME = 'collectionAgentMonitor';
    @api maxAgentWorkload; // set from page editor
    apexResponse;
    agentWorkloads;
    error;
    channelName = '/event/Collection_Assignment__e';


    @wire(getCollectionAgentsWithWorkload) // get from apex controller
    wiredAgentWorkloads(response){
        // Hold on to the provisioned value so we can refresh it later.
        this.apexResponse = response; // track the provisioned value
        const { data, error } = response; // destructure the provisioned value
        if (data){
            this.agentWorkloads = data;
            this.error = undefined;
            console.log(this.COMPONENT_NAME + ' got data:')
            console.log(this.agentWorkloads);
            this.handlePlatformEventSubscribe(this, this.apexResponse); // subscribe to platform event based on the data
        } else if (error){
            this.error = error;
            this.agentWorkloads = undefined;
            console.log(error);
        }
    }

    handlePlatformEventSubscribe(component, dataToRefresh){ // use .bind(this) on subscribe to not do this workaround
        const messageCallback = function (response) {
            // console.log(this.COMPONENT_NAME + 'got event: ' + response['data']['payload']['message__c']); // this sometimes work, better use component
            // console.log(this.COMPONENT_NAME + ' trying to refresh data...');
            refreshApex(dataToRefresh).then(() => { // refresh data each time a collection gets reassigned.
                // console.log(this.COMPONENT_NAME + ' data refreshed!');
                const event = new ShowToastEvent({
                    title: 'A collection was reassigned.',
                    message: response['data']['payload']['message__c'],
                    mode: 'dismissible'
                });
                component.dispatchEvent(event);
            });
        };
        
        // Invoke subscribe method of empApi. Pass reference to messageCallback
        subscribe(this.channelName, -1, messageCallback).then((response) => {
            // Response contains the subscription information on subscribe call
            console.log(
                'Subscription request from ' + this.COMPONENT_NAME + ' sent to: ',
                JSON.stringify(response.channel)
            );
        });
    }

    // https://stackoverflow.com/questions/78260664/salesforce-lwc-that-is-subscribed-to-a-platform-event-doesnt-let-me-use-refresh
    connectedCallback(){ // runs whenever the component loads, don't use for self referencing code..?

    }

    registerErrorListener() {
        // Invoke onError empApi method
        onError((error) => {
            console.log(this.COMPONENT_NAME + ' received error from server: ', JSON.stringify(error));
            // Error contains the server-side error
        });
    }
}