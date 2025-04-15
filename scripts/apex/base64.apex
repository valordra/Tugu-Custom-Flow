Blob imageBlob = [
    SELECT VersionData, PathOnClient, CreatedBy.Name
    FROM ContentVersion
    WHERE PathOnClient = 'logo-dark.png'
][0].VersionData;
System.debug(EncodingUtil.base64Encode(imageBlob));