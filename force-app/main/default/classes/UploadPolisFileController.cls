public with sharing class UploadPolisFileController {

    @AuraEnabled
    public static string processPolisIdsFile(String documentId){
        try {
            ContentDocument uploadedDocument = [
                SELECT Id, FileExtension
                FROM ContentDocument
                WHERE Id = :documentId
                WITH USER_MODE
            ][0];

            List<String> polisIds;
            if (uploadedDocument.FileExtension == 'xlsx') {
                polisIds = processXLSX(documentId);
            } ifelse (uploadedDocument.FileExtension == 'csv'){
                polisIds = processCSV(documentId);
            }

            delete uploadedDocument;

        } catch (Exception e) {
            throw new AuraHandledException(e.getMessage());
        }
    }

    private static List<String> processXLSX(String documentId){
        try{
            Object cellData;
            Integer cellCounter = 0;
            List<String> polisIds = new List<String>();
        
            // As data array
            Object[][][] xlsxDataArray = xlsx.Parse.toArray(
                new Compression.ZipReader(
                    [SELECT VersionData FROM ContentVersion WHERE ContentDocumentId = :documentId AND IsLatest = true LIMIT 1]?.VersionData
                ).getEntriesMap()
            );
        
            // Loop through the worksheets, columns and rows to touch each cell
            for(Integer wi=0, wiMax=xlsxDataArray.size(); wi<wiMax; wi++){
                for(Integer ci=0, ciMax=xlsxDataArray[wi].size(); ci<ciMax; ci++){
                    for(Integer ri=0, riMax=xlsxDataArray[wi][ci].size(); ri<riMax; ri++){
        
                        // Do something with the cell data
                        cellData = xlsxDataArray[wi][ci][ri];
                        polisIds.add((String) cellData);
                        // Increment the cell counter
                        cellCounter++;
                    }
                }
            }
        
            // Output the data in a human readable format
            System.debug(JSON.serializePretty(xlsxDataArray));
        
            // Output the number of cells
            System.debug(cellCounter + ' cells processed');
        
        // Catch a Zip Specific Exception
        }catch(Compression.ZipException e){
            System.debug('ZIP EXCEPTION: ' + e.getMessage());
        
        // Catch an XLSX Parser Specific Exception
        }catch(xlsx.ParseException e){
            System.debug('PARSE EXCEPTION: ' + e.getMessage());
        
        // Catch and handle any other type of Exception
        }catch(Exception e){
            System.debug('UNKNOWN EXCEPTION: ' + e.getMessage());
        }
    }

    private static List<String> processCSV(){
        return new List<String>();
    }
}