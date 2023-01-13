
import { Container} from 'typedi';
import {S3Storage}  from '@docu-vault/aws-s3-datasource';
import {ApplicationConfiguration} from '@docu-vault/contracts' ;
import {TestConfig} from './vault-services';
import {StorageService}  from './../src/storage-services'


var ctx : Map<string, string> = new Map<string, string>();
ctx.set('name', "Manual Entry")
var config : ApplicationConfiguration = new TestConfig();
config.initialize(ctx);

//var s3Storage = new S3Storage();

Container.set('vault', config);
Container.set('storageRepository', new S3Storage());
Container.set('storageService', new StorageService());


export default Container ;


