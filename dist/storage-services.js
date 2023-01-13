"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.StorageService = void 0;
require("reflect-metadata");
const typedi_1 = require("typedi");
const { Logger } = require('@docu-vault/logger');
const logger = new Logger('StorageService');
const DEFAULT_EXPIRY_TIME_IN_SECONDS = 30;
let StorageService = class StorageService {
    repository;
    config;
    constructor() {
        //this.repository = storageRepository;
        //this.config = ctx;
        //this.config.initialize(new Map<string, string>);
    }
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
    async getUploadSignedUrl(request) {
        var pathKey = request.pathKey;
        logger.debug('getUploadSignedurl: file name: ', pathKey);
        logger.debug('getUploadSignedurl: request: ', request);
        if (!request || !request.pathKey)
            throw Error("getUploadSignedUrl: File name is not specified.");
        const expiry = request.expiryInSeconds || DEFAULT_EXPIRY_TIME_IN_SECONDS;
        logger.debug('getUploadSignedUrl: expiry : ', expiry);
        const item = {
            pathKey: pathKey,
            expiryInSeconds: expiry
        };
        logger.debug('invoking repository.getSignedUrlForUpload: ', item);
        logger.debug('invoking repository.getSignedUrlForUpload with content type: ', request.contentType);
        return await this.repository.getSignedUrlForUpload(item, request.contentType);
    }
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
    async getDownloadSignedUrl(request) {
        var pathKey = request.pathKey;
        logger.debug('Service: getDownloadSignedUrl: file name: ', pathKey);
        logger.debug('Service: getDownloadSignedUrl: request: ', request);
        if (!request || !request.pathKey)
            throw Error("getDownloadSignedUrl: File name is not specified.");
        logger.debug('getDownloadSignedurl: file name: ', pathKey);
        const expiry = request.expiryInSeconds || DEFAULT_EXPIRY_TIME_IN_SECONDS;
        logger.debug('getDownloadSignedUrl: expiry : ', expiry);
        const s3Data = {
            pathKey: pathKey,
            expiryInSeconds: expiry
        };
        logger.debug('invoking this.repository.getDownloadURL with s3Data: ', s3Data);
        logger.debug('invoking this.repository.getDownloadURL with content type: ', request.contentType);
        return await this.repository.getSignedUrlForDownload(s3Data, request.contentType);
    }
    async fileToStorage(request) {
        if (!request)
            throw Error("fileToStorage: request parameter cannot be null");
        if (!request.localFilename)
            throw Error("fileToStorage: Local File name is not specified.");
        if (!request.destObjectName)
            throw Error("fileToStorage: Destination File name is not specified.");
        logger.debug('invoking this.repository.fileToStorage with request: ', request);
        return await this.repository.fileToStorage(request.localFilename, request.destObjectName);
    }
    async storageToFile(request) {
        if (!request)
            throw Error("storageToFile: request parameter cannot be null");
        if (!request.objectName)
            throw Error("storageToFile: Storage File name (source) is not specified.");
        if (!request.localFilename)
            throw Error("storageToFile: Destination File name is not specified.");
        logger.debug('invoking this.repository.storageToFile with request: ', request);
        return await this.repository.storageToFile(request.objectName, request.localFilename);
    }
}; /* end of class */
__decorate([
    (0, typedi_1.Inject)('storageRepository'),
    __metadata("design:type", Object)
], StorageService.prototype, "repository", void 0);
__decorate([
    (0, typedi_1.Inject)('vault'),
    __metadata("design:type", Object)
], StorageService.prototype, "config", void 0);
StorageService = __decorate([
    (0, typedi_1.Service)({ transient: true }),
    __metadata("design:paramtypes", [])
], StorageService);
exports.StorageService = StorageService;
