import { api, LightningElement, wire } from 'lwc';
import getRelatedPolisFromCollection from '@salesforce/apex/CollectionPolisEditorController.getRelatedPolisFromCollection';
import deleteConnections from '@salesforce/apex/CollectionPolisEditorController.deleteConnections';
import { refreshApex } from '@salesforce/apex';
import CollectionPolisEditorAddPolisModal from 'c/collectionPolisEditorAddPolisModal';
import createConnections from '@salesforce/apex/CollectionPolisEditorController.createConnections';

export default class CollectionPolisEditor extends LightningElement {
    COMPONENT_NAME = 'collectionPolisEditor';

    columns = [
        { label: 'Polis', fieldName: `polisName`},
    ]

    @api recordId;

    rawConnections;
    polisCollectionConnections;

    @wire(getRelatedPolisFromCollection, {
        collectionId: "$recordId"
    })
    wiredConnections(result){
        this.rawConnections = result;
        if (result.data){
            console.log(this.rawConnections.data);
            this.polisCollectionConnections = this.prepareData(this.rawConnections.data);
        } else if (result.error){
            console.log(result.error);
            throw new Error(result.error);
        }
    }

    selectedConnections = new Array();
    selectedConnectionsSet = new Set(); // Sets will always be empty when console logged, they work as normal though.

    async handleDeleteConnections(){
        deleteConnections({connectionIds: this.selectedConnections}).then(() => {
            this.beginRefresh();
        });
    }

    async handleAddConnections(){
        const result = await CollectionPolisEditorAddPolisModal.open({
            size: 'medium',
            recordId: this.recordId,
        });
        createConnections({collectionId: this.recordId, polisIds: result}).then(() => {
            console.log('Created Connections.')
            this.beginRefresh();
        });
    }

    prepareData(data){  
        if (data){
                let preparedData = data.map(connection => ({
                ...connection,
                polisName: connection.Related_Polis__r.Name,
                polisId: connection.Related_Polis__r.Id
            }));

            return preparedData;
        }
        return [];
    }

    handleRowSelection(event){
        console.log(event.detail.config.action);
        switch (event.detail.config.action) {
            case 'selectAllRows':
                this.selectedConnectionsSet = this.selectedConnectionsSet.union(new Set(this.polisCollectionConnections.map(connection => connection.Id)));
                break;
            case 'rowSelect':
                this.selectedConnectionsSet.add(event.detail.config.value);
                break;
            case 'rowDeselect':
                this.selectedConnectionsSet.delete(event.detail.config.value);
                break;
            case 'deselectAllRows':
                this.selectedConnectionsSet = this.selectedConnectionsSet.difference(new Set(this.polisCollectionConnections.map(connection => connection.Id)));
                break;
            default:
                break;
        }
        this.selectedConnections = Array.from(this.selectedConnectionsSet);
        console.log(this.selectedConnections);
    }

    connectedCallback(){
        // this.selectedConnections = ["a0YMR0000003SNy2AM", "a0YMR0000003SPZ2A2", "a0YMR0000003SNx2AM"];
        // console.log(this.selectedConnections)
    }

    async beginRefresh() {
        console.log('Refreshing...');
        await refreshApex(this.rawConnections);
        console.log(this.rawConnections);
    }
}