"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var docx = require("docx");
var fs = require("fs");
var img64 = "data:image/png;base64,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";
var document = new docx.Document({
    sections: [{
            headers: {
                default: new docx.Header({
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
                                    size: "16pt",
                                }),
                                new docx.TextRun({
                                    text: 'Wisma Tugu I',
                                    break: 1,
                                    size: "12pt",
                                }),
                                new docx.TextRun({
                                    text: 'Jalan H.R. Rasuna Said',
                                    break: 1,
                                    size: "12pt",
                                }),
                                new docx.TextRun({
                                    text: 'Kav. C8-9, Jakarta 12920 Indonesia',
                                    break: 1,
                                    size: "12pt",
                                }),
                                new docx.TextRun({
                                    text: 'E: calltia@tugu.com | P: (021) 52961777',
                                    break: 1,
                                    size: "12pt",
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
                }),
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
                            size: "12pt",
                            children: ['Nomor : CATA/COL/MSG/2025/02/001'],
                        }),
                        new docx.TextRun({
                            size: "12pt",
                            children: [new docx.Tab(), '24 Maret 2025'],
                        }),
                    ]
                }),
                new docx.Paragraph({
                    alignment: 'left',
                    children: [
                        new docx.TextRun({
                            size: "12pt",
                            children: ['Lamp', new docx.Tab(), ': Faktur Pembelian'],
                        }),
                        new docx.TextRun({
                            size: "12pt",
                            children: ['Hal', new docx.Tab(), ': Penagihan Pembayaran'],
                            break: 1,
                        }),
                    ],
                }),
                new docx.Paragraph({
                    alignment: 'left',
                    children: [
                        new docx.TextRun({
                            size: "12pt",
                            children: ['Kepada'],
                            break: 1,
                        }),
                        new docx.TextRun({
                            size: "12pt",
                            children: ['Muhammad Wildan Balfas'],
                            break: 1,
                        }),
                        new docx.TextRun({
                            size: "12pt",
                            children: ['Jl. Kembang Terang 22'],
                            break: 1,
                        }),
                    ],
                }),
                new docx.Paragraph({
                    alignment: 'left',
                    children: [
                        new docx.TextRun({
                            size: "12pt",
                            children: ['Dengan hormat,'],
                            break: 2,
                        }),
                        new docx.TextRun({
                            size: "12pt",
                            children: ['Melalui surat ini kami memberitahukan bahwa menurut pembukuan kami tertanggal 24 Maret 2025, dengan asuransi t ride yang dibeli atas nama Muhammad Wildan Balfas dengan Alamat Jl. Kembang Terang 22, Saudara masih memiliki kewajiban yang belum dibayarkan sebesar Rp. 2.500.781 (Dua Juta Lima Ratus Tujuh Ratus Delapan Puluh Satu Rupiah) sesuai faktur No.CATA/COL/INV/2025/01/891 yang salinannya kami sertakan pada lampiran surat ini.'],
                            break: 1,
                        }),
                        new docx.TextRun({
                            size: "12pt",
                            children: ['Mengingat waktu pada saat ini telah satu bulan melewati batas waktu yang tgelah kita sepakati sebelumnya, maka melalui suarta ini kami sangat berharap bahwa Saudara dimohon dengan segera untuk melunasinya.'],
                            break: 2,
                        }),
                        new docx.TextRun({
                            size: "12pt",
                            children: ['Terlampir pada halaman berikutnya adalah tagihan lainnya Saudara yang belum lunas.'],
                            break: 2,
                        }),
                        new docx.TextRun({
                            size: "12pt",
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
                        new docx.PageBreak(),
                    ],
                }),
                new docx.Table({
                    width: {
                        size: '100%'
                    },
                    rows: [
                        new docx.TableRow({
                            children: [
                                new docx.TableCell({
                                    children: [new docx.Paragraph({
                                            text: "Koleksi",
                                        })],
                                }),
                                new docx.TableCell({
                                    children: [new docx.Paragraph({
                                            text: "Lampiran",
                                        })],
                                }),
                                new docx.TableCell({
                                    children: [new docx.Paragraph({
                                            text: "Biaya",
                                        })],
                                }),
                            ],
                        }),
                        new docx.TableRow({
                            children: [
                                new docx.TableCell({
                                    children: [new docx.Paragraph({
                                            text: "Collection-00391",
                                        })],
                                }),
                                new docx.TableCell({
                                    children: [new docx.Paragraph({
                                            text: "Faktur Pembelian",
                                        })],
                                }),
                                new docx.TableCell({
                                    children: [new docx.Paragraph({
                                            text: "6080400",
                                        })],
                                }),
                            ],
                        }),
                    ]
                })
            ],
        }]
});
console.log('Document created');
console.log(document);
docx.Packer.toBuffer(document).then(function (buffer) {
    fs.writeFileSync("MyDocumentTS.docx", buffer);
});
