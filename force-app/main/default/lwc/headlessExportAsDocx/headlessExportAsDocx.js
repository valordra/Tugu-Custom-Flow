import { LightningElement, api } from 'lwc';
import { loadScript } from "lightning/platformResourceLoader";
import docxImport from '@salesforce/resourceUrl/docxJS'; // use methods from docx (docx.method())
import filesaverImport from '@salesforce/resourceUrl/filesaverJS'; // use saveAs() directly
import { ShowToastEvent } from 'lightning/platformShowToastEvent';
import getCollectionForExport from '@salesforce/apex/HeadlessExportAsDocxController.getCollectionForExport';
import getBase64ImageFromFile from '@salesforce/apex/HeadlessExportAsDocxController.getBase64ImageFromFile';
import getOtherCollectionsFromContact from '@salesforce/apex/HeadlessExportAsDocxController.getOtherCollectionsFromContact';

export default class HeadlessExportAsDocx extends LightningElement {
    _recordId;
    isExecuting = false;

    collection;
    collectionName;
    collectionBayar;
    collectionLamp;
    collectionCATA;
    collectionContactName;
    collectionContactAddress;


    logoFileName = 'logo-dark.png'; // tugu logo file from ContentVersion/Files on SF
    base64Logo;

    todayDateIndonesian;
    IndonesianRupiah = new Intl.NumberFormat('id', {
        style: 'currency',
        currency: 'IDR',
        maximumFractionDigits: 0,
    });

    otherCollections;

    // get record Id, headless quick actions doesn't get it natively.
    @api
    get recordId() {
        return this._recordId;
    }
    set recordId(recordId) {
        if (recordId !== this._recordId) {
            this._recordId = recordId;
        }
    }

    // when quick action is clicked, invoke is called
    @api async invoke() {
        if (this.isExecuting){
            console.log('Still executing action!');
            return;
        }
        this.isExecuting = true;
        
        console.log("Loading scripts...")
        await this.loadScripts();

        console.log("Fetching collection data...");
        await this.fetchData();

        console.log("Creating DOCX file...");
        this.generateDocument();

        this.isExecuting = false;
    }

    async loadScripts(){
        try {
            await Promise.all([
                loadScript(this, docxImport),
                loadScript(this, filesaverImport)
            ]);
            console.log('Loaded docx and filesaver.');
        } catch (error) {
            this.dispatchEvent(
                new ShowToastEvent({
                    title: 'Error loading external JS library.',
                    message: error.message,
                    variant: 'error'
                })
            );
        }
    }
    
    async fetchData(){
        // this.collection = await getCollectionForExport({collection: this.recordId});
        try {
            this.collection = await getCollectionForExport({collectionId: this.recordId});
            this.collectionName = this.collection.Name ?? 'NULL';
            this.collectionBayar = this.collection.Jumlah_Bayar__c ?? 'NULL';
            this.collectionLamp = this.collection.Lamp__c ?? 'NULL';
            this.collectionCATA = this.collection.Nomor_CATA__c ?? 'NULL';
            this.collectionContactName = this.collection.Related_Contact__r?.Name ?? 'NULL';
            this.collectionContactAddress = this.collection.Related_Contact__r?.MailingStreet ?? 'NULL';

            this.base64Logo = await getBase64ImageFromFile({fileName: this.logoFileName});
            let today = new Date();
            let options = {
                day: "numeric",
                month: "long",
                year: "numeric",
            }
            this.todayDateIndonesian = today.toLocaleDateString("id", options);
            this.otherCollections = await getOtherCollectionsFromContact({contactName: this.collectionContactName, collectionId: this._recordId});
        } catch (error) {
            console.log(error);
            this.dispatchEvent(
                new ShowToastEvent({
                    title: 'Error fetching collection data.',
                    message: error.message,
                    variant: 'error'
                })
            );
        }
    }

    // recommend developing docx code from a typescript file on own machine for syntax checker.
    generateDocument(){
        let document = new docx.Document({
            sections: [{
                headers: {
                    default: this.generateHeader()
                },
                children: [
                    new docx.Paragraph({
                        alignment: 'left',
                        tabStops: [{
                            type: docx.TabStopType.RIGHT,
                            position: docx.TabStopPosition.MAX,
                        }],
                        children: [
                            new docx.TextRun({
                                size: `12pt`,
                                children: [String.prototype.concat('Nomor : ', this.collectionCATA)],
                            }),
                            new docx.TextRun({
                                size: `12pt`,
                                children: [new docx.Tab(), this.todayDateIndonesian],
                            }),
                        ]
                    }),
                    new docx.Paragraph({
                        alignment: 'left',
                        children: [
                            new docx.TextRun({
                                size: `12pt`,
                                children: ['Lamp', new docx.Tab(), String.prototype.concat(': ', this.collectionLamp)],
                            }),
                            new docx.TextRun({
                                size: `12pt`,
                                children: ['Hal', new docx.Tab(), ': Penagihan Pembayaran'],
                                break: 1,
                            }),
                        ],
                    }),
                    new docx.Paragraph({
                        alignment: 'left',
                        children: [
                            new docx.TextRun({
                                size: `12pt`,
                                children: ['Kepada'],
                                break: 1,
                            }),
                            new docx.TextRun({
                                size: `12pt`,
                                children: [this.collectionContactName],
                                break: 1,
                            }),
                            new docx.TextRun({
                                size: `12pt`,
                                children: [this.collectionContactAddress],
                                break: 1,
                            }),
                        ],
                    }),
                    new docx.Paragraph({
                        alignment: 'left',
                        children: [
                            new docx.TextRun({
                                size: `12pt`,
                                children: ['Dengan hormat, '],
                                break: 2,
                            }),
                            new docx.TextRun({
                                size: `12pt`,
                                children: [String.prototype.concat(
                                    'Melalui surat ini kami memberitahukan bahwa menurut pembukuan kami tertanggal ',
                                     this.todayDateIndonesian, 
                                     ', dengan asuransi t ride yang dibeli atas nama ', this.collectionContactName, 
                                     ' dengan Alamat ',
                                     this.collectionContactAddress,
                                     ', Saudara masih memiliki kewajiban yang belum dibayarkan sebesar ', this.IndonesianRupiah.format(this.collectionBayar), 
                                     ' (Dua Juta Lima Ratus Tujuh Ratus Delapan Puluh Satu Rupiah) sesuai faktur No. ', this.collectionCATA,
                                     ' yang salinannya kami sertakan pada lampiran surat ini.')],
                                break: 1,
                            }),
                            new docx.TextRun({
                                size: `12pt`,
                                children: ['Mengingat waktu pada saat ini telah satu bulan melewati batas waktu yang telah kita sepakati sebelumnya, maka melalui suarta ini kami sangat berharap bahwa Saudara dimohon dengan segera untuk melunasinya.'],
                                break: 2,
                            }),
                            this.generateTerlampirStringIfOtherCollectionsExist(),
                            new docx.TextRun({
                                size: `12pt`,
                                children: ['Demikian pemberitahuan ini kami sampaikan atas perhatian dan kerja sama dari Saudara kami ucapkan terima kasih.'],
                                break: 2,
                            }),
                            new docx.TextRun({
                                size: "12pt",
                                children: ['Hormat Kami.'],
                                break: 9,
                            }),
                            new docx.TextRun({
                                size: "12pt",
                                children: ['TUGU Insurance'],
                                break: 1,
                            }),
                            new docx.TextRun({
                                size: "12pt",
                                children: ['Ratih Esanawati'],
                                break: 3,
                                underline: {
                                    type: 'single',
                                    color: '000000',
                                }
                            }),
                            new docx.TextRun({
                                size: "12pt",
                                children: ['Stream Leader Collection Direct'],
                                break: 1,
                            }),
                            this.generatePageBreakIfOtherCollectionsExist(),
                        ],
                    }),
                    this.generateOtherCollectionsTable(),
                ],
            }]
        });

        console.log('Document created, downloading...');
        docx.Packer.toBlob(document).then((blob) => { 
            
            // Lightning Locker Service only allows certain Mime Types,
            // The one returned by DocX is not whitelisted, so this is the workaround. 
            let editBlob = new Blob([blob], { type: "application/zip" });

            saveAs(editBlob, String.prototype.concat(this.collectionName, '.docx'));
        }).then(() => {
            console.log('Docx downloaded.');
        });
    }

    generateHeader(){
        let img64 = String.prototype.concat('data:image/png;base64,', this.base64Logo);
        return new docx.Header({
            children: [
                new docx.Paragraph({
                    alignment: 'center',
                    children: [
                        new docx.ImageRun({
                            type: 'png',
                            data: img64,
                            transformation: {
                                width: 127,
                                height: 66,
                            },
                            floating: {
                                horizontalPosition: {
                                    relative: 'column',
                                    offset: 19
                                },
                                verticalPosition: {
                                    relative: 'paragraph',
                                    offset: 5
                                },
                                allowOverlap: true,
                            }
                        }),
                        new docx.TextRun({
                            text: 'TUGU Insurance',
                            bold: true,
                            size: `16pt`,
                        }),
                        new docx.TextRun({
                            text: 'Wisma Tugu I',
                            break: 1,
                            size: `12pt`,
                        }),
                        new docx.TextRun({
                            text: 'Jalan H.R. Rasuna Said',
                            break: 1,
                            size: `12pt`,
                        }),
                        new docx.TextRun({
                            text: 'Kav. C8-9, Jakarta 12920 Indonesia',
                            break: 1,
                            size: `12pt`,
                        }),
                        new docx.TextRun({
                            text: 'E: calltia@tugu.com | P: (021) 52961777',
                            break: 1,
                            size: `12pt`,
                        })
                    ],
                }),
                new docx.Paragraph({
                    border: {
                        bottom: {
                            style: "thick",
                            size: 12,
                            color: "000000",
                        }
                    }
                })
            ]
        })
    }

    generateTerlampirStringIfOtherCollectionsExist(){
        console.log(this.otherCollections.length);
        if(this.otherCollections.length > 0){
            return new docx.TextRun({
                size: "12pt",
                children: ['Terlampir pada halaman berikutnya adalah tagihan lainnya Saudara yang belum lunas.'],
                break: 2,
            });
        }
        return new docx.TextRun("");
    }

    generatePageBreakIfOtherCollectionsExist(){
        if(this.otherCollections.length > 0){
            return new docx.PageBreak();
        }
        return new docx.TextRun('');
    }

    generateOtherCollectionsTable(){
        if(this.otherCollections.length > 0){
            console.log('Trying to generate table...');
            return new docx.Table({
                    width: {
                        size: '100%'
                    },
                    rows: [
                        new docx.TableRow({
                            children: [
                                new docx.TableCell({
                                    children: [
                                        new docx.Paragraph({
                                            text: "Koleksi",
                                        })
                                    ],
                                }),
                                new docx.TableCell({
                                    children: [
                                        new docx.Paragraph({
                                            text: "Lampiran",
                                        })
                                    ],
                                }),
                                new docx.TableCell({
                                    children: [
                                        new docx.Paragraph({
                                            text: "Biaya",
                                        })
                                    ],
                                }),
                            ],
                        }),
                        ...this.generateOtherCollectionRows(),
                    ]
            });
        }
        return new docx.TextRun('');
    }

    generateOtherCollectionRows(){
        let rowArray = [];
        for (let collection of this.otherCollections) {
            console.log(collection.Jumlah_Bayar__c);
            rowArray.push(
                new docx.TableRow({
                    children: [
                        new docx.TableCell({
                            children: [
                                new docx.Paragraph({
                                    text: collection.Name ?? 'NULL',
                                })
                            ],
                        }),
                        new docx.TableCell({
                            children: [
                                new docx.Paragraph({
                                    text: collection.Lamp__c ?? 'NULL',
                                })
                            ],
                        }),
                        new docx.TableCell({
                            children: [
                                new docx.Paragraph({
                                    text: this.IndonesianRupiah.format(collection.Jumlah_Bayar__c),
                                })
                            ],
                        })
                    ],
                })
            )
        }
        return rowArray;

    }
}