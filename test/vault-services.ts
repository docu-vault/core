
import { Logger } from '@docu-vault/logger';
import 'reflect-metadata';
import { Container, Service } from 'typedi';

import {ApplicationConfiguration} from '@docu-vault/contracts';

const logger = new Logger('TestConfig: ');

@Service({ transient: true })
export class TestConfig implements ApplicationConfiguration {

    // This variable contains information to access vault system 
    private vaultContext : Map<string, string> ;
    private config : Map<string, string> ;

    constructor ()
    {
        this.config = new Map<string, string>();
    }

    /** go fetch the config data from vault. it must be key-value pairs. 
     *  Vault access details are passed in parameter ctx 
    */
    initialize (ctx : Map<string, string>) : void
    {
        this.vaultContext = ctx ;
        const vaultName : string | undefined  = ctx.get('name') ? ctx.get('name') : 'Not Defined';
        logger.debug('Vault name is: ', vaultName);

        this.config.set('S3_BUCKET_NAME', 'dd-test-customer01-data');
        this.config.set('AWS_REGION', 'us-east-1');
        this.config.set('EXPIRY_IN_SECONDS', "60");
        this.exposeConfigAsEnvironmentVariables();
    }

    get (key: string) : string 
    {
        var tmpVal : string | undefined = this.config.get(key) ;
        const val : string = tmpVal ? tmpVal.toString() : '';
        return val;
    }

    put (key: string, value: string) : void
    {
        //handle null key or value 
        if (!key || !value) return ;
       
        // simply set the key , value. over writes the existing value if any.
        process.env.key = value;
        this.config.set(key, value);
        
    }

    // internal method
    private exposeConfigAsEnvironmentVariables ()
    {
        logger.debug('entere...');
        for (const [key, value] of this.config) 
        { 
            process.env.key ? logger.debug(`--> Existing value of ${key} is over-written with ${value}`) 
                : logger.debug(`set ${key} value to ${value} `);
            process.env[`${key}`] = value;
        }
    }

}