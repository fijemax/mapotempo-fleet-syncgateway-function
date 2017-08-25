# Mapotempo Sync Function

---
## Description
The sync function ensure the security and manages users channels and roles.
This documentation describe the sync function behaviors that occurs on every Sync/Couchbase Document.
## Documents Base Format
#### Base
A base format is required for every document that analyzed by the sync function. All document who don't respect the base format will be rejecte.

```json
{ 
"_id": "type_hash", 
"type": "type",
"company_id": "company_hash"
}
```

#### Type
The type field is used to dispatch the document in the appropriate specific function.
The valide types accepted by the sync function are
>  - company
>  - user
>  - mission
>  - mission_status
>  - track
>  - metadata
This type is also used to verify role and build the channel, it's the base of channel formating.

#### Company ID
The `company_id` field is mandatory in every documents to ensure the property of all documents. The sync function require this field for dispatch all documents in their good channels.
The sync function can't verify if this `company_id` field is a valid document id in the nosql database, the creator should be assure the validity of this field.
Document `company` type is only one who is exempt because the sync function use his _id field.

#### Role
The role for the sync function is build with company_id type and action :
	[company_id-type-action]
for example the  role need for update a mission type document is :
		companyid.mission.updating

#### Base channel
TODO

## Documents Models
### Company
##### Model
```json
 { 
	"_id": "company_XXXXX_XXXXX_XXXX_XXXXX", 
	"type": "company",
	"name": "mapotempo"
 }
```
##### On Create
	RequireRole : company_id.company.creating
##### On Update
	RequireRole : company_id.company.updating
##### On Delete
	RequireRole : company_id.company.deleting

### User document
```json
{
  "company_id": "company_XXXXX_XXXXX_XXXX_XXXXX",
  "type": "user",
  "user": "chauffeur_1",
  "roles": ["mission-update", "mission-deleting", "mission-creating"],
  "_id": "user_de20ef854f96c00fe46089d16f0554be"
}
```
##### On Create
	RequireRole : company_id.user.creating
##### On Update
	RequireRole : company_id.user.updating
##### On Delete
	RequireRole : company_id.user.deleting
##### Generate and  assign channels
	`user` -> `user:[user]`
	`user` -> `company:[company_id]`
	`user` -> `mission_status_type:[company_id]`

### Mission document
```json
 {
  "address": {
    "city": "Bordeaux",
    "country": "France",
    "detail": "Pépinière éco-créative,",
    "postalcode": "33000",
    "state": "Gironde",
    "street": "9 Rue André Darbon"
  },
  "comment": "Mapotempo est une startup qui édite des solutions web d’optimisation de tournées, innovantes et libres.",
  "company_id": "company_XXXXX_XXXXX_XXXX_XXXXX",
  "delivery_date": "2017-08-23T18:43:56.150Z",
  "location": {
    "lat": "-0.5680988",
    "lon": "44.8547927"
  },
  "name": "Mission-48",
  "owners": [
    "chauffeur_1"
  ],
  "mission_status_type_id": "mission_status_type_id",
  "phone": "0600000001",
  "reference": "ABCDEF",
  "duration": 240,
  "type": "mission",
  "time_windows": [{
	  "start": "2017-08-23T8:00:00.000Z",
	  "end": "2017-08-23T12:00:00.000Z",
  }, {
	  "start": "2017-08-23T13:00:00.000Z",
	  "end": "2017-08-23T17:00:00.000Z",
  }
  ],
  "_id": "mission_fff3e0a2-d250-416e-badb-ded0252da4bd"
 }
```
##### On Create
	RequireRole : company_id.mission.creating
##### On Update
	RequireRole : company_id.mission.updating
##### On Delete
	RequireRole : company_id.mission.deleting
##### Generate and  assign channels
	`owners` -> `mission:[owner]:[yyyyMMdd]`
	note : yyyyMMdd is a date generate from delivery_date iso date

### Mission status type document
```json
{
  "color": "228b22",
  "commands": [
    {
      "group": "default",
      "label": "To pending",
      "mission_status_type_id": "status_pending:lalal"
    },
    {
      "group": "default",
      "label": "To Uncompleted",
      "mission_status_type_id": "status_uncompleted:XXXXX_XXXXX_XXXX"
    }
  ],
  "company_id": "RIOT",
  "label": "Completed",
  "type": "mission_status_type",
  "_rev": "2-91d463e366228c2ba5b8eadce2f0035a",
  "_id": "status_completed:lalal"
}
```
##### On Create
	RequireRole : company_id.mission_status_type.creating
##### On Update
	RequireRole : company_id.mission_status_type.updating
##### On Delete
	RequireRole : company_id.mission_status_type.deleting
##### Generate and  assign channels
	`owners` -> `mission_status_type:[company_id]`

