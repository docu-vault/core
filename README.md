
## Functional
Assumption:
Security:
it is assumed that higer order component would take care of the security aspects of this.
Refer to XXX for more details.

This modules provides the below functional capability.
1. configuration of various storages
The following are the supported storages
AWS S3

# pre-setup
Name and Prefix of the S3 storage

2. upload document
3. download document
4. Others


## Docudata Config App Business Logic
This package contains the docudata configuration application business logic along with the
data source implmenetaton. It has

* business entity named "groups" defined in src-ts/core/models
* repository interface define in src-ts/core/repository
* business use cases implemenations in src-ts/core/services

Datasource adaptor for AWS dynamodB is implementd at src-ts/datasources/groups-dynamodb.ts

Application configuration is using utils/app-confis.ts. This is mainly used for integration testing purposes only.

## Building

npm run build

## Running unit test casses

npm run unit-test

## Integration testing 

This is mainly to test datasource implemenation with database.
set S3_BUCKET_NAME=dd-test-customer01-data
npm run integration-test

## Publishing the package
npm publish 

`NOTE`: by default, my npm repo is set to AWS Codeartifact. new packages would be published to AWS Codeartifact.





