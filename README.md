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
	RequireRole : [company_id].user_current_location.creating
##### On Update
	RequireRole : [company_id].user_current_location.updating
##### On Delete
	RequireRole : [company_id].user_current_location.deleting
##### Generate and  assign channels
	`sync_user` -> `user_current_location:[sync_user]`


### UserPreference type document
```json
{
  "type": "user_settings",
  "company_id": "company_XXXXX_XXXXX_XXXX_XXXXX",
  "sync_user": "static",
  "_rev": "2-91d463e366228c2ba5b8eadce2f0035a",
  "_id": "user_settings_xxxxxxx:xxxxxxx:xxxxxxx:lalal"
}
```
##### On Create
	RequireRole : [company_id].user_settings.creating
##### On Update
	RequireRole : [company_id].user_settings.updating
##### On Delete
	RequireRole : [company_id].user_settings.deleting
##### Generate and  assign channels
	`sync_user` -> `user_settings:[sync_user]`

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
  "svg_path": "M604.1,440.2h-19.1V333.2c0,-12.5 -3.8,-24.8 -10.8,-35.2l-47.9,-71c-11.7,-17.3 -31.2,-27.7 -52.2,-27.7h-74.3c-8.7,0 -15.7,7.1 -15.7,15.7v225H262.5c11.6,10 19.5,23.9 21.8,39.7H412.5c4.6,-31.2 31.5,-55.4 64,-55.4c32.5,0 59.3,24.2 63.9,55.4h63.7c4.3,0 7.9,-3.5 7.9,-7.9V448C612,443.7 608.5,440.2 604.1,440.2zM525.8,312.2h-98c-4.3,0 -7.9,-3.5 -7.9,-7.9v-54.4c0,-4.3 3.5,-7.9 7.9,-7.9h59.7c2.6,0 5,1.3 6.5,3.3l38.3,54.5C535.8,305.1 532.1,312.2 525.8,312.2zM476.5,440.2c-27.1,0 -48.9,22 -48.9,49c0,27 21.9,48.9 48.9,48.9c27,0 48.9,-22 48.9,-48.9C525.4,462.1 503.5,440.2 476.5,440.2zM476.5,513.7c-13.5,0 -24.5,-11 -24.5,-24.5c0,-13.5 10.9,-24.5 24.5,-24.5c13.5,0 24.5,10.9 24.5,24.5C501,502.6 490,513.7 476.5,513.7zM68.4,440.2c-4.3,0 -7.9,3.5 -7.9,7.9v23.9c0,4.3 3.5,7.9 7.9,7.9h88c2.3,-15.7 10.2,-29.7 21.7,-39.7H68.4V440.2zM220.3,440.2c-27,0 -48.9,22 -48.9,49c0,27 22,48.9 48.9,48.9c27.1,0 48.9,-22 48.9,-48.9C269.2,462.1 247.4,440.2 220.3,440.2zM220.3,513.7c-13.5,0 -24.5,-11 -24.5,-24.5c0,-13.5 10.9,-24.5 24.5,-24.5c13.5,0 24.5,10.9 24.5,24.5C244.8,502.6 233.8,513.7 220.3,513.7zM338,150.6h-91.2c4.5,13.3 6.8,27.5 6.8,42.3c0,74.3 -60.4,134.7 -134.7,134.7c-13.5,0 -26.7,-2 -39,-5.7v86.9c0,4.3 3.5,7.9 7.9,7.9h266c4.3,0 7.9,-3.5 7.9,-7.9V174.2C361.6,161.1 351.1,150.6 338,150.6zM119,73.9C53.3,73.9 0,127.1 0,192.8s53.3,119 119,119s119,-53.3 119,-119S184.7,73.9 119,73.9zM119,284.7c-50.8,0 -91.9,-41.1 -91.9,-91.9c0,-50.8 41.1,-91.9 91.9,-91.9c50.8,0 91.9,41.1 91.9,91.9C210.9,243.6 169.7,284.7 119,284.7zM154.1,212.2c-1,0 -2.1,-0.1 -3.1,-0.4L112.6,201.5c-5.1,-1.4 -8.7,-6.1 -8.7,-11.4v-59c0,-6.5 5.3,-11.8 11.8,-11.8c6.5,0 11.8,5.3 11.8,11.8v50l29.6,8c6.3,1.7 10,8.2 8.3,14.5C164,208.8 159.3,212.2 154.1,212.2z",
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

