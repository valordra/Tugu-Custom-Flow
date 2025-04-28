import { LightningElement } from 'lwc';
import LightningAlert from 'lightning/alert';

export default class QuickActionUploadPolis extends LightningElement {
    get acceptedFormats() {
        return ['.csv', '.xlsx'];
    }
    async handleFileUpload(event){
        const uploadedFile = event.detail.files;
        console.log(uploadedFile);
        await LightningAlert.open({
            message: 'File Uploaded: ' + uploadedFile[0].name,
            theme: 'success',
            label: 'File Uploaded!'
        })
    }
}