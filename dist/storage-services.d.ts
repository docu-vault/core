import 'reflect-metadata';
export declare class StorageService {
    private repository;
    private config;
    constructor();
    /**
     *
     * @param request  : Parameter is an object with the below key  and values.
     *                   "Key"  -- This is mandatory parameter, specifying containing storage
     *                             filename or storage object name.
     *                   "expiray" -- This is optional parameter. Time in sec. Berhond this time, url
     *                                expires and not usable. If not passed, the value is taken
     *                                from confguration. if configuration does not have it, then 30sec
     *                                the value.
     *                  "content-type" -- This is optional parameter indicating the content type of the
     *                                   storage object.
     * @returns     string : signed url path to directly download the file from storage provider.
     */
    getUploadSignedUrl(request: any): Promise<string>;
    /**
     * @param request  : Parameter is an object with the below key  and values.
     *                   "Key"  -- This is mandatory parameter, specifying containing storage
     *                             filename or storage object name.
     *                   "expiray" -- This is optional parameter. Time in sec. Berhond this time, url
     *                                expires and not usable. If not passed, the value is taken
     *                                from confguration. if configuration does not have it, then 30sec
     *                                the value.
     *                  "content-type" -- This is optional parameter indicating the content type of the
     *                                   storage object.
     * @returns     string : signed url path to directly upload the file to storage provider.
     */
    getDownloadSignedUrl(request: any): Promise<string>;
    fileToStorage(request: any): Promise<boolean>;
    storageToFile(request: any): Promise<boolean>;
}
