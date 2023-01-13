import * as assert from "assert";
import {expect} from 'chai' ;
import {fail} from "assert";
import {StorageItem} from '@docu-vault/contracts';

import 'reflect-metadata';
//import { Container, Inject, Service } from 'typedi';

import container from './app-init' ;

//import {StorageS3Repo}  from '../src-ts/storage/datasources/storage-s3';
import {StorageService} from  '../src/storage-services'

const {Logger} = require('@docu-vault/logger');
const logger = new Logger('S3-tests');
const dataHandler = require('@docu-vault/api-handler');
var fs = require('fs');
const axios = require('axios');

import { 
    GetObjectCommandOutput,
    PutObjectCommandOutput
  } from "@aws-sdk/client-s3";
  import { getSignedUrl } from "@aws-sdk/s3-request-presigner";

const testUpload1 : any = 
{
    pathKey: 'test-ss/test01.pdf',
    expiryInSeconds: 30*60,
    contentType : "application/octet-stream"
}

const testDownload1 : StorageItem = 
{
    pathKey: 'test-ss/12349876/test01.pdf',
    expiryInSeconds: 30*60,
    contentType : "application/octet-stream"
}

const testUpload2 : StorageItem = 
{
    pathKey: 'test-ss/12349876/table-1.jpg',
    expiryInSeconds: 30*60,
    contentType : 'application/octet-stream'
}

const testUpload3 : StorageItem = 
{
    pathKey: 'test-ss/12349876/test-02.png',
    expiryInSeconds: 30*60,
    contentType : 'image/png'
}

const testDownloadNotExists : StorageItem = 
{
    pathKey: 'test-ss/12349876/test-10000.png',
    expiryInSeconds: 30*60,
    contentType : 'application/octet-stream'
}

const testUploadParentDoesNotExist : StorageItem = 
{
    pathKey: 'test-ss/12340000/test01.pdf',
    expiryInSeconds: 60*60,
    contentType : 'application/octet-stream'
}

const pdfOptions : any = {
    'Content-Type' : 'application/pdf'
}

const jpgOptions : any = {
    'Content-Type' : 'image/jpg'
}

const pngOptions : any = {
    'Content-Type' : 'image/png'
}

const bucketName : string = "dd-test-customer01-data";
const AWSRegion : string = "us-east-1";


const { S3Client, PutObjectCommand , GetObjectCommand} = require("@aws-sdk/client-s3");
const path = require("path");

/* utility function to upload directly to S3 */
const uploadUsingS3Client = async ( pathName: string, fileName: string) =>
{

    const fileStream = fs.createReadStream(fileName);
    const objName : string = pathName + "/" + path.basename(fileName);
    logger.debug(`pathName: ${pathName} , filename: ${fileName} , obj full path: ${objName}`);

    // Set the parameters
    const uploadParams = {
        Bucket: bucketName,
        Key: objName,
        // Add the required 'Body' parameter
        Body: fileStream,
    };

    const s3 = new S3Client({ region: "us-east-1"});
    var data =null;
    try {
        data = await s3.send(new PutObjectCommand(uploadParams));    
    } catch (err: any) {
        //logger.debug("Error", err);
        throw err;
    }
}

/* utility function to download directly */
const downloadUsingS3Client = async ( objName: string, outFileName: string) =>
{

    // Set the parameters
    const uploadParams = {
        Bucket: bucketName,
        Key: objName,
    };

    //var data = null;
    //var fd = null;
    const s3 = new S3Client({ region: "us-east-1"});
    try {
        const data = await s3.send(new GetObjectCommand(uploadParams));
        const fd = await data.Body;
        var stream = fs.createWriteStream(outFileName);
        await fd.pipe(stream);
    } catch (err: any) {
        //logger.debug("Error", err);
        throw err;
    }

}

/*  upload file to S3 using signed url */
const upload = async (signedUrl: string, fileName: string) =>
{
    var handler = new dataHandler.APIHandler(signedUrl);
    const stats = fs.statSync(fileName);
    const len = stats.size;
    logger.debug('size is: ', len);

    const fileStream = fs.createReadStream(fileName);

    var data = null;
    try {
         const response = await axios({
                 url: signedUrl,
                 method: 'PUT',
                 data: fileStream,
                 headers : {'Content-Type' : "application/octet-stream",
                            'Content-Length' : len}
         });
         data = await response.data;
         return true;
    } catch (err: any)
    {
         //logger.debug('upload using signedurl failed..', err);
         throw err;
    }
}


/* download file from s3 using signed url */
const download = async (signedUrl: string, fileName: string) =>
{

   var data = null;
   try {
        logger.debug('before axios');
        const response = await axios({
                url: signedUrl,
                method: 'GET',
                responseType: 'stream'
        });

        logger.debug('afer axios');
        const data = await response.data;

        var stream = fs.createWriteStream(fileName);
        data.pipe(stream);
        return true;
    
   } catch (err: any)
   {
        logger.debug('download using signedurl failed..', err);
        throw err;
   }
}


describe('Storage Services Test Cases', () => {

    logger.debug('getting ss from container..');
    const ss : StorageService = container.get(StorageService);

    
    it('getUploadURL: updateload test01.pdf', async () => 
    {
      const signedUrl = await ss.getUploadSignedUrl(testUpload1);
      expect(signedUrl).not.equals(null);
      var status = await upload(signedUrl, 'test/data/test01.pdf');
      expect(status).to.equal(true);
    });
   
    it('Test-002: getUploadURL: JPG file table-1.jpg', async () => 
    {
      
      const cType = testUpload2.contentType ? testUpload2.contentType : "";
      const signedUrl = await ss.getUploadSignedUrl(testUpload2);
      expect(signedUrl).not.equals(null);
      var status = await upload(signedUrl, 'test/data/table-1.jpg');
      expect(status).to.equal(true);
    });


    it('Test-003: getUploadURL: PNG file test-02.png', async () => 
    {
      const cType = testUpload3.contentType ? testUpload3.contentType : "";
      const signedUrl = await ss.getUploadSignedUrl(testUpload3);
      expect(signedUrl).not.equals(null);
      var status = await upload(signedUrl, 'test/data/test-02.png');
      expect(status).to.equal(true);
    });

    

    it('Test-004: getDownloadURL: download PDF file test01.pdf ', async () =>
    {
        
        const signedUrl = await ss.getDownloadSignedUrl(testUpload1);
        expect(signedUrl).not.equals(null);
        var status = await download(signedUrl, 'test/download/test01.pdf');
        expect(status).to.equal(true);
    });

    
    it('Test-005: getDownloadURL: download JPG table-1.jpg ', async () =>
    {
        const cType = testUpload2.contentType ? testUpload2.contentType : "";
        const signedUrl = await ss.getDownloadSignedUrl(testUpload2);
        expect(signedUrl).not.equals(null);
        var status = await download(signedUrl, 'test/download/table-1.jpg');
        expect(status).to.equal(true);
    });


    it('Test-006: getDownloadURL: download PNG test-02.png ', async () =>
    {
        const cType = testUpload3.contentType ? testUpload3.contentType : "";
        const signedUrl = await ss.getDownloadSignedUrl(testUpload3);
        expect(signedUrl).not.equals(null);
        var status=await download(signedUrl, 'test/download/test-02.png');
        expect(status).to.equal(true);
    });

    it('Test-007: getDownloadURL: try to download a file that does not exists... ', async () =>
    {
        var status=true;
        const cType = testDownloadNotExists.contentType ? testDownloadNotExists.contentType : "";
        try {
            const signedUrl = await ss.getDownloadSignedUrl(testDownloadNotExists);
            expect(signedUrl).not.equals(null);
            status=await download(signedUrl, 'test/download/test-100000.png');
        } catch (err: any)
        {
            status=true;
            logger.error('Error and status is : ', err.response.status);
            logger.error('Error and statusText is : ', err.response.statusText);
        }
        expect(status).to.equal(true);
    });
    

    it('Test-008: getUploadURL: updateload <parent>/test01.pdf where parent does not exists', async () => 
    {
      const cType = testUploadParentDoesNotExist.contentType ? testUploadParentDoesNotExist.contentType : "";
      try {
        const signedUrl = await ss.getDownloadSignedUrl(testUploadParentDoesNotExist);
        logger.debug('signed ulr for upload is: ', signedUrl);
        expect(signedUrl).not.equals(null);
        var status= await upload(signedUrl, 'test/data/test01.pdf');
        expect(status).to.equal(true);
      } catch (err: any)
      {
        logger.error('Error and status is : ', err.response.status);
        logger.error('Error and statusTex is : ', err.response.statusText);
      }
    });
    

});
