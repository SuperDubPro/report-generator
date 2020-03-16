const createReport = require('docx-templates');

try {
    const readXlsxFile = require('read-excel-file/node');

// File path.
    readXlsxFile('smeta.xlsx').then((rows) => {
        console.log(rows);
    })



    // createReport({
    //     template: 'template.docx',
    //     output: 'reports/myReport.docx',
    //     data: {
    //         equipmentName: 'Супер-пупер оборудование',
    //         objectAddress: 'Москва, Ереванская 24',
    //         consumerOrganization: 'ООО Рога и копыта',
    //         contract:{
    //             name:'Самый лучший номер договора',
    //             person: 'Иванов Петр Кузьмич'
    //         }
    //
    //
    //     },
    // }).catch(e=>
    // console.log(e));
}
catch (e) {
    console.log(e);
}

