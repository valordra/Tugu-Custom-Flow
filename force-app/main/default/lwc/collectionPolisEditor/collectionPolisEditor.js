import { api, LightningElement, wire } from 'lwc';
import getRelatedPolisFromCollection from '@salesforce/apex/CollectionPolisEditorController.getRelatedPolisFromCollection';
import deleteConnections from '@salesforce/apex/CollectionPolisEditorController.deleteConnections';
import { refreshApex } from '@salesforce/apex';
import CollectionPolisEditorAddPolisModal from 'c/collectionPolisEditorAddPolisModal';
import createConnections from '@salesforce/apex/CollectionPolisEditorController.createConnections';

export default class CollectionPolisEditor extends LightningElement {
    COMPONENT_NAME = 'collectionPolisEditor';
    // refreshHandlerID;

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

    selectedConnections;

    // async loadData(){
    //     try {
    //         this.polisCollectionConnections = await getRelatedPolisFromCollection({ collectionId: this.recordId });
    //     } catch (error) {
    //         console.log(error);
    //         throw new Error(error);
    //     }
        
    // }

    async handleDeleteConnections(){
        let connectionIds = this.selectedConnections.map(connection => connection.Id);
        console.log(connectionIds);
        deleteConnections({connectionIds: connectionIds}).then(() => {
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
        this.selectedConnections = event.detail.selectedRows;
        console.log('start');
        this.selectedConnections.forEach(connection => {
            console.log(connection.Id);
        });
        console.log('end');
    }

    connectedCallback(){
        // this.refreshHandlerID = registerRefreshHandler(
        //     this.template.host,
        //     this.CollectionPolisEditor.bind(this),
        // );
        // this.loadData().then(() => {
        //     this.prepareData(this.polisCollectionConnections);
        // });
        // this.preparedData = this.prepareData();
    }

    // disconnectedCallback() {
    //     unregisterRefreshHandler(this.refreshHandlerID);
    // }

    async beginRefresh() {
        console.log('Refreshing...');
        await refreshApex(this.rawConnections);
        console.log(this.rawConnections);
        // this.dispatchEvent(new RefreshEvent());
    }
    
    // refreshContainer(refreshPromise) {
    //     console.log("refreshing");
    //     return refreshPromise;
    // }
}