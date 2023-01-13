import 'reflect-metadata';
import * as assert from "assert";
import {expect} from 'chai' ;
import {fail} from "assert";

import { Container, Inject, Service } from 'typedi';

import {ApplicationConfiguration} from '@docu-vault/contracts' ;
const container = require('./app-init');
const {Logger} = require('@docu-vault/logger');
const logger = new Logger('vault tests');


describe('Configuration Test Cases', () => {

   
  var vault : ApplicationConfiguration = Container.get('vault'); ;

    
    it('Vault: inser values ', async () => 
    {
      const name : string = vault.get('S3_BUCKET_NAME');
      logger.debug('key: S3_BUCKET_NAME & value: ', name);
      expect(name).to.equal("dd-test-customer01-data");
    });


});
