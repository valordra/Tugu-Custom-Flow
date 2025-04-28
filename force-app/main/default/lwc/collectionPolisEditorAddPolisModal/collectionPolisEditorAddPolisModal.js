import { api, wire } from 'lwc';
import LightningModal from 'lightning/modal';
import getAllPolis from '@salesforce/apex/CollectionPolisEditorController.getAllPolis';

export default class CollectionPolisEditorAddPolisModal extends LightningModal {
    COMPONENT_NAME = 'collectionPolisEditorAddPolisModal';
    selectedPolisIds = new Array();
    selectedPolisIdsSet = new Set();

    @api recordId;

    columns = [
        { 
            label: 'Polis', 
            fieldName: `NameUrl`,
            type: 'url',
            typeAttributes: {
                label: {
                    fieldName: `Name`
                },
                target: `_blank`,
            },
        },
        { label: 'Days Overdue', fieldName: `Days_Overdue__c`},
    ]

    dateFilterOptions = [ // Use strings because combobox does not like numbers
        { label: `All`, value: '0' },
        { label: `Not Overdue`, value: '-1' },
        { label: `1 - 31`, value: '1' },
        { label: `32 - 96`, value: '2' },
        { label: `97 - 365`, value: '3' },
        { label: `>365`, value: '-2' },
    ]
    dateFilterValue = '0'; // Used by the dateFilter combobox element

    rawPolisData;
    polisData;

    @wire(getAllPolis)
    wiredPolisData(result){
        this.rawPolisData = result;
        if (result.data){
            this.polisData = result.data.map(row => {
                let NameUrl = `/${row.Id}`;
                return {...row, NameUrl};
            });
            this.filteredPolisData = this.polisData;
        } else if (result.error){
            console.log(result.error);
            throw new Error(result.error);
        }
    }

    filteredPolisData;

    handleDateFilterClick(event){
        console.log(event);
        this.dateFilterValue = event.detail.value;
        this.filterData(this.polisData);
    }
    
    handleNameFilterClick(event){
        console.log(event);
        this.filterData(this.polisData);
    }

    filterData(data){
        let filteredData = data;
        let nameFilter = this.refs.nameFilter.value.toLowerCase();
        if (nameFilter){
            filteredData = filteredData.filter((polis) => polis.Name.toLowerCase().includes(nameFilter));
        }
        if (this.dateFilterValue){
            switch (this.dateFilterValue) {
                case "0":
                    break;
                case "-1":
                    filteredData = filteredData.filter((polis) => polis.Days_Overdue__c <= 0);
                    break;
                case "-2":
                    filteredData = filteredData.filter((polis) => polis.Days_Overdue__c >= 366);
                    break;
                case "1":
                    filteredData = filteredData.filter((polis) => polis.Days_Overdue__c >= 1 && polis.Days_Overdue__c <= 31);
                    break;
                case "2":
                    filteredData = filteredData.filter((polis) => polis.Days_Overdue__c >= 32 && polis.Days_Overdue__c <= 96);
                    break;
                case "3":
                    filteredData = filteredData.filter((polis) => polis.Days_Overdue__c >= 97 && polis.Days_Overdue__c <= 365);
                    break;
                default:
                    break;
            }
        }
        this.filteredPolisData = filteredData;
        this.selectedPolisIds = JSON.parse(JSON.stringify(this.selectedPolisIds)); // workaround to force re-render pre-selected columns
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