import { LightningElement,api,wire } from 'lwc';
import { ShowToastEvent } from 'lightning/platformShowToastEvent';
// import { getRecord } from 'lightning/uiRecordApi';
// import Id from '@salesforce/user/Id';
// import nomorCATA from '@salesforce/schema/Collections__c.Nomor_CATA__c';
// import collectionType from '@salesforce/schema/Collections__c.Type__c';

export default class Testing_component_lwc extends LightningElement {
    // userId = Id;
    
    // @api recordId;

    // wireResult;
    // collectionRecord;

    // @wire(getRecord, { recordId: "$recordId", fields: [nomorCATA, collectionType] })
    // collection(result){
    //     this.wireResult = result;
    //     if (result.data){
    //         console.log(result.data);
    //         this.collectionRecord = result.data;
    //     } else if (result.error){
    //         console.log(result.error);
    //     }
    // }

    exportToCSV() {
        // Prepare CSV content
        // let csvContent = 'Opportunity Id,Opportunity Name,Stage Name,Close Date,Opportunity Owner Id,Opportunity Owner Name, Account Id,Account Name, Account Owner Id,Account Owner Name\n';
        let csvContent = 'PolisNumber\nPolis Col 70-1\nPolis Col 70-2\nPolis Col 70-3';
        // this.records.forEach(record => {

        //     let opp_id = record.fields.Id.value;
        //     let opp_name = record.fields.Name.value;
        //     let stage_name = record.fields.StageName.value === null ? "" : record.fields.StageName.value;
        //     let close_date = record.fields.CloseDate.value === null ? "" : record.fields.CloseDate.value;
        //     let opp_owner_id = record.fields.OwnerId.value === null ? "" : record.fields.OwnerId.value;
        //     let opp_owner_name = record.fields.Owner.value.fields.Name.value === null ? "" : record.fields.Owner.value.fields.Name.value;
        //     let acc_id = record.fields.AccountId.value === null ? "" : record.fields.AccountId.value;
        //     let acc_name = record.fields.Account.value.fields.Name.value === null ? "" : record.fields.Account.value.fields.Name.value;
        //     let acc_owner_id = record.fields.Account.value.fields.OwnerId.value === null ? "" : record.fields.Account.value.fields.OwnerId.value;
        //     let acc_owner_name = record.fields.Account.value.fields.Owner.value.fields.Name.value === null ? "" : record.fields.Account.value.fields.Owner.value.fields.Name.value;
            
        //     csvContent += `"${opp_id}","${opp_name}","${stage_name}","${close_date}","${opp_owner_id}","${opp_owner_name}","${acc_id}","${acc_name}","${acc_owner_id}","${acc_owner_name}"\n`;
        // });

        // console.log('csvContent::', csvContent);

        // Create Blob and download CSV file

        // Creating anchor element to download
        let downloadElement = document.createElement('a');

        // This  encodeURI encodes special characters, except: , / ? : @ & = + $ # (Use encodeURIComponent() to encode these characters).
        downloadElement.href = 'data:text/csv;charset=utf-8,' + encodeURI(csvContent);
        downloadElement.target = '_self';
        // CSV File Name
        downloadElement.download = 'Template Import Polis for Auto Task Creation.csv';
        // below statement is required if you are using firefox browser
        document.body.appendChild(downloadElement);
        // click() Javascript function to download CSV file
        downloadElement.click();

        // Show success toast
        this.dispatchEvent(
            new ShowToastEvent({
                title: 'Success',
                message: 'CSV exported successfully',
                variant: 'success',
            })
        );
    }
}