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
  "sync_user": "chauffeur_1",
  "roles": ["mission-update", "mission-deleting", "mission-creating"],
  "channels": [
     "XXXX",
     "XXXX",
  ],
  "roles": [
    "mission.creating",
    "mission.updating",
    "mission.deleting",
    "current_location.creating",
    "current_location.updating",
    "track.creating",
    "track.updating"
  ],
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

### UserCurrentLocation type document
```json
{
  "type": "user_current_location",
  "company_id": "company_XXXXX_XXXXX_XXXX_XXXXX",
  "sync_user": "static",
  "location": {
    "accuracy": 22.232999801635742,
    "altitude": 0,
    "bearing": 0,
    "cid": "1144834",
    "lac": "49908",
    "lat": "44.8270405",
    "lon": "-0.6232571",
    "mcc": "208",
    "mnc": "10",
    "signal_strength": 0,
    "speed": 0,
    "time": "2017-09-28T19:36:20.130Z"
  },
  "_rev": "2-91d463e366228c2ba5b8eadce2f0035a",
  "_id": "user_current_location_xxxxxxx:xxxxxxx:xxxxxxx:lalal"
}
```
##### On Create
	RequireRole : [company_id].user_curent_location.creating
##### On Update
	RequireRole : [company_id].user_curent_location.updating
##### On Delete
	RequireRole : [company_id].user_curent_location.deleting
##### Generate and  assign channels
	`sync_user` -> `user_curent_location:[sync_user]`


### UserPreference type document
```json
{
  "type": "user_preference",
  "company_id": "company_XXXXX_XXXXX_XXXX_XXXXX",
  "sync_user": "static",
  "_rev": "2-91d463e366228c2ba5b8eadce2f0035a",
  "_id": "user_preference_xxxxxxx:xxxxxxx:xxxxxxx:lalal"
}
```
##### On Create
	RequireRole : [company_id].curent_location.creating
##### On Update
	RequireRole : [company_id].curent_location.updating
##### On Delete
	RequireRole : [company_id].curent_location.deleting
##### Generate and  assign channels
	`sync_user` -> `user_preference:[sync_user]`

### UserTrack type document
```json
{
  "type": "user_track",
  "company_id": "company_XXXXX_XXXXX_XXXX_XXXXX",
  "sync_user": "static",
  "date": "2017-09-28T19:42:51.772Z",
  "locations": [
    {
      "accuracy": 22.232999801635742,
      "altitude": 0,
      "bearing": 0,
      "cid": "1144834",
      "lac": "49908",
      "lat": "44.8270405",
      "lon": "-0.6232571",
      "mcc": "208",
      "mnc": "10",
      "signal_strength": 0,
      "speed": 0,
      "time": "2017-09-28T19:36:20.130Z"
    },
    {
      "accuracy": 33.97600173950195,
      "altitude": 0,
      "bearing": 0,
      "cid": "1144834",
      "lac": "49908",
      "lat": "44.8260876",
      "lon": "-0.6236643",
      "mcc": "208",
      "mnc": "10",
      "signal_strength": 0,
      "speed": 0,
      "time": "2017-09-28T19:36:40.853Z"
    },
    {
      "accuracy": 50,
      "altitude": 0,
      "bearing": 0,
      "cid": "1144834",
      "lac": "49908",
      "lat": "44.8265026",
      "lon": "-0.6246636",
      "mcc": "208",
      "mnc": "10",
      "signal_strength": 0,
      "speed": 0,
      "time": "2017-09-28T19:37:03.854Z"
    }
  ],
  "_rev": "2-91d463e366228c2ba5b8eadce2f0035a",
  "_id": "user_track_xxxxxxx:xxxxxxx:xxxxxxx:lalal"
}
```

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
  "date": "2017-08-23T18:43:56.150Z",
  "location": {
    "lat": "-0.5680988",
    "lon": "44.8547927"
  },
  "name": "Mission-48",
  "sync_user": "chauffeur_1",
  "mission_status_type_id": "mission_status_type_id",
  "phone": "0600000001",
  "reference": "ABCDEF",
  "duration": 240,
  "type": "mission",
  "time_windows": [{
	  "start": "2017-08-23T8:00:00.000Z",
	  "end": "2017-08-23T12:00:00.000Z"
  }, {
	  "start": "2017-08-23T13:00:00.000Z",
	  "end": "2017-08-23T17:00:00.000Z"
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
	note : yyyyMMdd is a date generate from iso 8601 date

### Mission Placeholder document
The missions placeholder is used to maintain missions user's channel access even that it where are all removed.
See => https://github.com/couchbase/sync_gateway/issues/1484

```json
 {
  "company_id": "company_XXXXX_XXXXX_XXXX_XXXXX",
  "date": "2017-08-23T18:43:56.150Z",
  "sync_user": "chauffeur_1",
  "type": "missions_placeholder",
  "_id": "mission_fff3e0a2-d250-416e-badb-ded0252da4bd"
 }
```
##### On Create
	RequireRole : company_id.mission_placehoder.creating
##### On Update
	RequireRole : company_id.mission_placehoder.updating
##### On Delete
	RequireRole : company_id.mission_placehoder.deleting
##### Generate and  assign channels
	`sync_user` -> `mission:[sync_user]:[yyyyMMdd]`
	note : yyyyMMdd is a date generate from iso 8601 date

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
  "company_id": "company_XXXXX_XXXXX_XXXX_XXXXX",
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

