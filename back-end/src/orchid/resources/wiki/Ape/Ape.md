# Setup
APE queries are made by instantiating an ApeRequest object which handles interfacing with the APE API. An ApeRequest is created per user through the ApeRequestFactory, to prevent the system from keeping too many APE instances. 

All classes regarding APE functionality are at `backend > ape`.

## ApeRequest
Interface between APE and the web app. Handles a single APE object which can be updated for new queries. Functionalities from the APE API should only be called from here.

## ApeRequestFactory
Manages ApeRequests. Creating, retrieving and deleting an ApeRequest instance is done through this class. 

## Entities
The entities found under `backend > ape > entity > workflow` serve as medium for received (json) data from the end-points to ApeRequest, and vice versa.

Please look at the following classes in the API Docs for correct usage of the entities:
- Constraint
- Data
- InputData
- Ontology
- OntologyNode
- ParsedModuleNode
- ParsedTypeNode
- RunConfig
- TotalConfig
- WorkflowOutput