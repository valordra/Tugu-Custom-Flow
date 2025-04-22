import { api, wire } from 'lwc';
import LightningModal from 'lightning/modal';
import getAllPolis from '@salesforce/apex/CollectionPolisEditorController.getAllPolis';

export default class CollectionPolisEditorAddPolisModal extends LightningModal {
    COMPONENT_NAME = 'collectionPolisEditorAddPolisModal';
    selectedPolisIds = new Array();
    selectedPolisIdsSet = new Set();

    @api recordId;

    columns = [
        { label: 'Polis', fieldName: `Name`},
    ]

    rawPolisData;
    polisData;

    @wire(getAllPolis)
    wiredPolisData(result){
        this.rawPolisData = result;
        if (result.data){
            this.polisData = result.data;
            this.filteredPolisData = this.polisData;
        } else if (result.error){
            console.log(result.error);
            throw new Error(result.error);
        }
    }

    filteredPolisData;
    
    handleFilterClick(){
        this.filteredPolisData = this.filterData(this.polisData);
        this.selectedPolisIds = JSON.parse(JSON.stringify(this.selectedPolisIds)); // workaround to force re-render pre-selected columns
    }

    filterData(data){
        let filteredData = data;
        let nameFilter = this.refs.nameFilter.value.toLowerCase();
        if (nameFilter){
            filteredData = filteredData.filter((polis) => polis.Name.toLowerCase().includes(nameFilter));
        }
        return filteredData;
    }

    handleRowSelection(event){
        switch (event.detail.config.action) {
            case 'selectAllRows':
                this.selectedPolisIdsSet = this.selectedPolisIdsSet.union(new Set(this.filteredPolisData.map(polis => polis.Id)));
                break;
            case 'rowSelect':
                this.selectedPolisIdsSet.add(event.detail.config.value);
                break;
            case 'rowDeselect':
                this.selectedPolisIdsSet.delete(event.detail.config.value);
                break;
            case 'deselectAllRows':
                this.selectedPolisIdsSet = this.selectedPolisIdsSet.difference(new Set(this.filteredPolisData.map(polis => polis.Id)));
                break;
            default:
                break;
        }
        this.selectedPolisIds = Array.from(this.selectedPolisIdsSet);
        console.log(this.selectedPolisIds);
    }

    handleAddPolis() {
        this.close(this.selectedPolisIds);
    }
}