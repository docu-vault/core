import 'reflect-metadata';

/**
 * This defines the interface to fetch the application configuration from key-value vault. it is 
 * expected that values are key-value pairs. If a given key is already exposed as environment variable, 
 * then it would take it from the environment variable. if not, it would set key as environment 
 * varible with value as its value. 
 * 
 * Vault can be anything like AWS Seretsmanager or GCP or Azure or HashiCorp Vault.
 */
export interface ApplicationConfiguration {

    /**
     * This methods takes the access credentials to given vault implementation 
     * (1) fetchs the  application configuration configured as key-value pairs.
     * (2) exposes each key as environment variable with value as its value. if a given key
     *     is set as environment variable already, it would keep the existing value as is and
     *     ignores th value from Vault. Intention here is to provide the flexibility to change
     *     dynamically for testign and troubleshooting purposes.
     * 
     * Please refer to the documentation for key-value pairs requied by the implementation like 
     * AWS s3, GCP or Azure
     * 
     * @param ctx : ctx would have the credentails and other details to connect to a given vault
     *              implemenation. This is left losse as map to provide flexibility with loose coupling.
     * @returns   : nothing.
     */
    initialize : (ctx: Map<string, string>) => void;
    
    /**
     * 
     * @param key : key whose value is to be fetched
     * @returns   : value if exists or null if not.
     */
    get       : (key: string) => string;

    /**
     * This is handy interface if the application would like to dynamically set a key-value
     * pair to pass as environment variable to rest of the application. 
     * 
     * key would be exposed as environment variable. This interface assumes that implemenation
     * simply set the key , value without checking if there is any set prior.
     * 
     * @param key    : name of the config variable
     * @param value  : value of the config variable as specified in name
     * @returns      : None
     */
    put       : (key: string, value: string) => void ; 

}