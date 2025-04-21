import { api } from 'lwc';
import LightningModal from 'lightning/modal';
import getPolis from '@salesforce/apex/CollectionPolisEditorController.getPolis';

const toPolisPill = (polis) => ({
    name: polis.Id,
    label: polis.Name,
    iconName: 'standard:billing',
    type: 'icon'
});

export default class CollectionPolisEditorAddPolisModal extends LightningModal {
    selectedPolisIds = [];
    selectedPolisRecords;
    pillItems = [];

    polisApiName = 'Polis__c';

    @api recordId;

    // Converts a list a IDs to lightning-record-picker filter
    
    get recordPickerFilter() {
        // Convert selectedRecords to a list of IDs
        let filter = {
            criteria: [
                {
                    fieldPath: 'Id',
                    operator: 'nin', // "not in" operator
                    value: this.selectedPolisIds,
                }
            ]
        }
        return filter;
    }

    // use lwc:ref in HTML for JS to be able to select element
    clearRecordPickerSelection() {
        this.refs.recordPicker.clearSelection();
    }

    async loadPolis(){
        this.selectedPolisRecords = await getPolis({polisIds: this.selectedPolisIds});
        this.pillItems = this.selectedPolisRecords.map(toPolisPill);
    }

    handlePolisSelect(event) {
        let selectedPolisId = event.detail.recordId;
        this.selectedPolisIds.push(selectedPolisId);
        this.loadPolis();
        this.clearRecordPickerSelection();
    }

    handlePillRemove(event) {
        const polisId = event.detail.item.name;

        // Remove `polisId` from `selectedPolisIds`
        this.selectedPolisIds = this.selectedPolisIds.filter(
            (polis) => polis !== polisId
        );
        this.loadPolis();
    }

    handleAddPolis() {
        this.close(this.selectedPolisIds);
    }
}