import { api, LightningElement } from 'lwc';

export default class CollectionAgentListItemCollectionTimer extends LightningElement {
    COMPONENT_NAME = 'collectionAgentListItemCollectionTimer';
    @api assignedAt;
    timeDifference;

    connectedCallback(){
        this.updateTimer();
        setInterval(() => {
            this.updateTimer();
        }, 1000);
    }

    updateTimer(){
        const now = new Date();
        const assignedAtDate = Date.parse(this.assignedAt);
        var seconds = Math.floor((now - assignedAtDate) / 1000);
        var minutes = Math.floor(seconds / 60);
        var hours = Math.floor(minutes / 60);
        var days = Math.floor(hours / 24);
        this.timeDifference = `${days} d, ${hours % 24} h, ${minutes % 60} min, ${seconds % 60} s`;
    }

}