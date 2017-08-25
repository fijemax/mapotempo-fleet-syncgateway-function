var testHelper = require("../node_modules/synctos/etc/test-helper.js");

var errorFormatter = testHelper.validationErrorFormatter;

describe("Mission create update delete test", function() {
    beforeEach(function() {
        testHelper.initSyncFunction("SyncFunction.js");
    });

    // ####################
    // TEST CREATE
    // test detail : TODO
    // ######
    it("Create : 1- can create a mission document", function() {
        var doc = {
            "address": {
              "city": "Paris",
              "country": "France",
              "detail": "Pépinière éco-créative",
              "postalcode": "33000",
              "state": "Gironde",
              "street": "9 Rue André Darbon"
            },
            "comment": "laisser le colis au gardein",
            "company_id": "mapotempo_company",
            "delivery_date": "2017-07-21T16:22:27.348Z",
            "duration": 50,
            "location": {
              "lat": "40.0",
              "lon": "-1.0"
            },
            "mission_status_type_id": "Pending:7Cito9g5g5-defd-4b40-58g-9e33abg57185",
            "name": "test",
            "owners": ["static", "superman"],
            "phone": "0600010203",
            "reference": "ABCDEF",
            "time_windows": [
              {
                "end": "2017-08-21T010:00:00Z",
                "start": "2017-08-21T08:00:00Z"
              },
              {
                "end": "2017-08-21T013:00:00Z",
                "start": "2017-08-21T14:00:00Z"
              }
            ],
            "type": "mission",
            "_rev": "74-5dafed6558915c015ac98f338382067a",
            "_id": "Mission_68g95ac3-da6d-4b40-973b-9e3341879085"
        }

        testHelper.verifyDocumentCreated(
            doc, {
                expectedRoles: ["mapotempo_company.mission.creating"],
                expectedUsers: ["static", "superman"]
            }, [{
                    expectedType: "channel",
                    expectedChannels: ["mission:static:20170721"],
                    expectedUsers: ["static"]
                },
                {
                    expectedType: "channel",
                    expectedChannels: ["mission:superman:20170721"],
                    expectedUsers: ["superman"]
                }
            ]);
    });

    it("Create : 2- can't create a mission document with owners array empty", function() {
        var doc = {
            "address": {
              "city": "Paris",
              "country": "France",
              "detail": "Pépinière éco-créative",
              "postalcode": "33000",
              "state": "Gironde",
              "street": "9 Rue André Darbon"
            },
            "comment": "laisser le colis au gardein",
            "company_id": "mapotempo_company",
            "delivery_date": "2017-07-21T16:22:27.348Z",
            "duration": 50,
            "location": {
              "lat": "40.0",
              "lon": "-1.0"
            },
            "mission_status_type_id": "Pending:7Cito9g5g5-defd-4b40-58g-9e33abg57185",
            "name": "test",
            "owners": [],
            // "owners": ["static", "superman"],
            "phone": "0600010203",
            "reference": "ABCDEF",
            "time_windows": [
              {
                "end": "2017-08-21T010:00:00Z",
                "start": "2017-08-21T08:00:00Z"
              },
              {
                "end": "2017-08-21T013:00:00Z",
                "start": "2017-08-21T14:00:00Z"
              }
            ],
            "type": "mission",
            "_rev": "74-5dafed6558915c015ac98f338382067a",
            "_id": "Mission_68g95ac3-da6d-4b40-973b-9e3341879085"
        }

        testHelper.verifyDocumentNotCreated(
            doc,
            "mission",
            "Document must have at least one owner", {
                expectedRoles: ["mapotempo_company.mission.creating"],
            }
        );
    });

    it("Create : 3- can't create a mission document without owners field", function() {
        var doc = {
            "address": {
              "city": "Paris",
              "country": "France",
              "detail": "Pépinière éco-créative",
              "postalcode": "33000",
              "state": "Gironde",
              "street": "9 Rue André Darbon"
            },
            "comment": "laisser le colis au gardein",
            "company_id": "mapotempo_company",
            "delivery_date": "2017-07-21T16:22:27.348Z",
            "duration": 50,
            "location": {
              "lat": "40.0",
              "lon": "-1.0"
            },
            "mission_status_type_id": "Pending:7Cito9g5g5-defd-4b40-58g-9e33abg57185",
            "name": "test",
            // "owners": ["static", "superman"],
            "phone": "0600010203",
            "reference": "ABCDEF",
            "time_windows": [
              {
                "end": "2017-08-21T010:00:00Z",
                "start": "2017-08-21T08:00:00Z"
              },
              {
                "end": "2017-08-21T013:00:00Z",
                "start": "2017-08-21T14:00:00Z"
              }
            ],
            "type": "mission",
            "_rev": "74-5dafed6558915c015ac98f338382067a",
            "_id": "Mission_68g95ac3-da6d-4b40-973b-9e3341879085"
        }

        testHelper.verifyDocumentNotCreated(
            doc,
            "mission",
            "Document must have owners", {
                expectedRoles: ["mapotempo_company.mission.creating"],
            }
        );
    });

    it("Create : 4- can't create a mission document with delivery_date field improperly formatted", function() {
        var doc = {
            "address": {
              "city": "Paris",
              "country": "France",
              "detail": "Pépinière éco-créative",
              "postalcode": "33000",
              "state": "Gironde",
              "street": "9 Rue André Darbon"
            },
            "comment": "laisser le colis au gardein",
            "company_id": "mapotempo_company",
            "delivery_date": "23 juin 1912",
            // "delivery_date": "2017-07-21T16:22:27.348Z",
            "duration": 50,
            "location": {
              "lat": "40.0",
              "lon": "-1.0"
            },
            "mission_status_type_id": "Pending:7Cito9g5g5-defd-4b40-58g-9e33abg57185",
            "name": "test",
            "owners": ["static", "superman"],
            "phone": "0600010203",
            "reference": "ABCDEF",
            "time_windows": [
              {
                "end": "2017-08-21T010:00:00Z",
                "start": "2017-08-21T08:00:00Z"
              },
              {
                "end": "2017-08-21T013:00:00Z",
                "start": "2017-08-21T14:00:00Z"
              }
            ],
            "type": "mission",
            "_rev": "74-5dafed6558915c015ac98f338382067a",
            "_id": "Mission_68g95ac3-da6d-4b40-973b-9e3341879085"
        }

        testHelper.verifyDocumentNotCreated(
            doc,
            "mission",
            "Document must have a delivery_date ISO8601 valid format", {
                expectedUsers: ["static", "superman"],
                expectedRoles: ["mapotempo_company.mission.creating"]
            }
        );
    });

    it("Create : 5- can't create a mission document without delivery_date field", function() {
        var doc = {
            "address": {
              "city": "Paris",
              "country": "France",
              "detail": "Pépinière éco-créative",
              "postalcode": "33000",
              "state": "Gironde",
              "street": "9 Rue André Darbon"
            },
            "comment": "laisser le colis au gardein",
            "company_id": "mapotempo_company",
            // "delivery_date": "2017-07-21T16:22:27.348Z",
            "duration": 50,
            "location": {
              "lat": "40.0",
              "lon": "-1.0"
            },
            "mission_status_type_id": "Pending:7Cito9g5g5-defd-4b40-58g-9e33abg57185",
            "name": "test",
            "owners": ["static", "superman"],
            "phone": "0600010203",
            "reference": "ABCDEF",
            "time_windows": [
              {
                "end": "2017-08-21T010:00:00Z",
                "start": "2017-08-21T08:00:00Z"
              },
              {
                "end": "2017-08-21T013:00:00Z",
                "start": "2017-08-21T14:00:00Z"
              }
            ],
            "type": "mission",
            "_rev": "74-5dafed6558915c015ac98f338382067a",
            "_id": "Mission_68g95ac3-da6d-4b40-973b-9e3341879085"
        }

        testHelper.verifyDocumentNotCreated(
            doc,
            "mission",
            "Document must have a delivery_date", {
                expectedUsers: ["static", "superman"],
                expectedRoles: ["mapotempo_company.mission.creating"]
            }
        );
    });

    it("Create : 6- can't create a mission document whitout company_id", function() {
        var doc = {
            "address": {
              "city": "Paris",
              "country": "France",
              "detail": "Pépinière éco-créative",
              "postalcode": "33000",
              "state": "Gironde",
              "street": "9 Rue André Darbon"
            },
            "comment": "laisser le colis au gardein",
            // "company_id": "mapotempo_company",
            "delivery_date": "2017-07-21T16:22:27.348Z",
            "duration": 50,
            "location": {
              "lat": "40.0",
              "lon": "-1.0"
            },
            "mission_status_type_id": "Pending:7Cito9g5g5-defd-4b40-58g-9e33abg57185",
            "name": "test",
            "owners": ["static", "superman"],
            "phone": "0600010203",
            "reference": "ABCDEF",
            "time_windows": [
              {
                "end": "2017-08-21T010:00:00Z",
                "start": "2017-08-21T08:00:00Z"
              },
              {
                "end": "2017-08-21T013:00:00Z",
                "start": "2017-08-21T14:00:00Z"
              }
            ],
            "type": "mission",
            "_rev": "74-5dafed6558915c015ac98f338382067a",
            "_id": "Mission_68g95ac3-da6d-4b40-973b-9e3341879085"
        }

        testHelper.verifyDocumentNotCreated(
            doc,
            "mission",
            "Document must have a company_id", {
                expectedRoles: ["undefined.mission.creating"],
            }
        );
    });

    it("Create : 7- can't create a mission document without location field", function() {
        var doc = {
            "address": {
              "city": "Paris",
              "country": "France",
              "detail": "Pépinière éco-créative",
              "postalcode": "33000",
              "state": "Gironde",
              "street": "9 Rue André Darbon"
            },
            "comment": "laisser le colis au gardein",
            "company_id": "mapotempo_company",
            "delivery_date": "2017-07-21T16:22:27.348Z",
            "duration": 50,
            //"location": {
            //  "lat": "40.0",
            //  "lon": "-1.0"
            // },
            "mission_status_type_id": "Pending:7Cito9g5g5-defd-4b40-58g-9e33abg57185",
            "name": "test",
            "owners": ["static", "superman"],
            "phone": "0600010203",
            "reference": "ABCDEF",
            "time_windows": [
              {
                "end": "2017-08-21T010:00:00Z",
                "start": "2017-08-21T08:00:00Z"
              },
              {
                "end": "2017-08-21T013:00:00Z",
                "start": "2017-08-21T14:00:00Z"
              }
            ],
            "type": "mission",
            "_rev": "74-5dafed6558915c015ac98f338382067a",
            "_id": "Mission_68g95ac3-da6d-4b40-973b-9e3341879085"
        }

        testHelper.verifyDocumentNotCreated(
            doc,
            "mission",
            "Document must have a location", {
                expectedRoles: ["mapotempo_company.mission.creating"],
                expectedUsers: ["static", "superman"]
            });
    });

    it("Create : 8- can't create a mission document without name field", function() {
        var doc = {
            "address": {
              "city": "Paris",
              "country": "France",
              "detail": "Pépinière éco-créative",
              "postalcode": "33000",
              "state": "Gironde",
              "street": "9 Rue André Darbon"
            },
            "comment": "laisser le colis au gardein",
            "company_id": "mapotempo_company",
            "delivery_date": "2017-07-21T16:22:27.348Z",
            "duration": 50,
            "location": {
              "lat": "40.0",
              "lon": "-1.0"
            },
            "mission_status_type_id": "Pending:7Cito9g5g5-defd-4b40-58g-9e33abg57185",
            // "name": "test",
            "owners": ["static", "superman"],
            "phone": "0600010203",
            "reference": "ABCDEF",
            "time_windows": [
              {
                "end": "2017-08-21T010:00:00Z",
                "start": "2017-08-21T08:00:00Z"
              },
              {
                "end": "2017-08-21T013:00:00Z",
                "start": "2017-08-21T14:00:00Z"
              }
            ],
            "type": "mission",
            "_rev": "74-5dafed6558915c015ac98f338382067a",
            "_id": "Mission_68g95ac3-da6d-4b40-973b-9e3341879085"
        }

        testHelper.verifyDocumentNotCreated(
            doc,
            "mission",
            "Document must have a name", {
                expectedRoles: ["mapotempo_company.mission.creating"],
                expectedUsers: ["static", "superman"]
            });
    });

    it("Create : 9- can create a mission document without address field", function() {
        var doc = {
            "company_id": "mapotempo_company",
            "delivery_date": "2017-07-21T16:22:27.348Z",
            "location": {
              "lat": "40.0",
              "lon": "-1.0"
            },
            "mission_status_type_id": "Pending:7Cito9g5g5-defd-4b40-58g-9e33abg57185",
            "name": "test",
            "owners": ["static", "superman"],
            "type": "mission",
            "_rev": "74-5dafed6558915c015ac98f338382067a",
            "_id": "Mission_68g95ac3-da6d-4b40-973b-9e3341879085"
        }

        testHelper.verifyDocumentCreated(
            doc, {
                expectedRoles: ["mapotempo_company.mission.creating"],
                expectedUsers: ["static", "superman"]
            }, [{
                    expectedType: "channel",
                    expectedChannels: ["mission:static:20170721"],
                    expectedUsers: ["static"]
                },
                {
                    expectedType: "channel",
                    expectedChannels: ["mission:superman:20170721"],
                    expectedUsers: ["superman"]
                }
            ]);
    });

    // ####################
    // TEST UPDATE
    // test detail : TODO
    // ######
    it("Update : 1- can update the delivery_date field mission document", function() {
        var oldDoc = {
            "delivery_date": "2017-07-21T16:22:27.348Z",
            "company_id": "mapotempo_company",
            "location": {
                "lat": 45.0,
                "lon": 2.0
            },
            "address":  {
                "street": "9 Rue André Darbon", // character varying(255),
                "postalcode": "33000", // character varying(255),
                "city": "Bordeaux", // character varying(255),
                "state": "Gironde", // character varying
                "country": "France", // character varying
                "detail": "Pépinière éco-créative" // text
            },
            "name": "test",
            "owners": ["static", "superman"],
            "type": "mission",
            "_id": "Mission_1534a8de-b412-49bc-97a8-3b535d131406"
        }

        var doc = Object.assign({}, oldDoc);
        doc.delivery_date = "2017-07-25T16:22:27.348Z";

        testHelper.verifyDocumentReplaced(
            doc,
            oldDoc, {
                expectedRoles: ["mapotempo_company.mission.updating"],
                expectedUsers: ["static", "superman"]
            }, [{
                    expectedType: "channel",
                    expectedUsers: ["static"],
                    expectedChannels: ["mission:static:20170725"]
                },
                {
                    expectedType: "channel",
                    expectedUsers: ["superman"],
                    expectedChannels: ["mission:superman:20170725"]
                }
            ]);
    });

    it("Update : 2- can update the location field mission document", function() {
        var oldDoc = {
            "delivery_date": "2017-07-21T16:22:27.348Z",
            "company_id": "mapotempo_company",
            "location": {
                "lat": 45.0,
                "lon": 2.0
            },
            "address":  {
                "street": "9 Rue André Darbon", // character varying(255),
                "postalcode": "33000", // character varying(255),
                "city": "Bordeaux", // character varying(255),
                "state": "Gironde", // character varying
                "country": "France", // character varying
                "detail": "Pépinière éco-créative" // text
            },
            "name": "test",
            "owners": ["static", "superman"],
            "type": "mission",
            "_id": "Mission_1534a8de-b412-49bc-97a8-3b535d131406"
        }

        var doc = Object.assign({}, oldDoc);
        doc.location.lat = 48.0;
        doc.location.lat = 2.0;

        testHelper.verifyDocumentReplaced(
            doc,
            oldDoc, {
                expectedRoles: ["mapotempo_company.mission.updating"],
                expectedUsers: ["static", "superman"]
            }, [{
                    expectedType: "channel",
                    expectedUsers: ["static"],
                    expectedChannels: ["mission:static:20170721"]
                },
                {
                    expectedType: "channel",
                    expectedUsers: ["superman"],
                    expectedChannels: ["mission:superman:20170721"]
                }
            ]);
    });

    it("Update : 3- can update the name field mission document", function() {
        var oldDoc = {
            "delivery_date": "2017-07-21T16:22:27.348Z",
            "company_id": "mapotempo_company",
            "location": {
                "lat": 45.0,
                "lon": 2.0
            },
            "address":  {
                "street": "9 Rue André Darbon", // character varying(255),
                "postalcode": "33000", // character varying(255),
                "city": "Bordeaux", // character varying(255),
                "state": "Gironde", // character varying
                "country": "France", // character varying
                "detail": "Pépinière éco-créative" // text
            },
            "name": "test",
            "owners": ["static", "superman"],
            "type": "mission",
            "_id": "Mission_1534a8de-b412-49bc-97a8-3b535d131406"
        }

        var doc = Object.assign({}, oldDoc);
        doc.name = "la tete à toto";

        testHelper.verifyDocumentReplaced(
            doc,
            oldDoc, {
                expectedRoles: ["mapotempo_company.mission.updating"],
                expectedUsers: ["static", "superman"]
            }, [{
                    expectedType: "channel",
                    expectedUsers: ["static"],
                    expectedChannels: ["mission:static:20170721"]
                },
                {
                    expectedType: "channel",
                    expectedUsers: ["superman"],
                    expectedChannels: ["mission:superman:20170721"]
                }
            ]);
    });

    it("Update : 4- can't update the company_id mission field", function() {
        var oldDoc = {
            "delivery_date": "2017-07-21T16:22:27.348Z",
            "company_id": "mapotempo_company",
            "location": {
                "lat": 45.0,
                "lon": 2.0
            },
            "address":  {
                "street": "9 Rue André Darbon", // character varying(255),
                "postalcode": "33000", // character varying(255),
                "city": "Bordeaux", // character varying(255),
                "state": "Gironde", // character varying
                "country": "France", // character varying
                "detail": "Pépinière éco-créative" // text
            },
            "name": "test",
            "owners": ["static", "superman"],
            "type": "mission",
            "_id": "Mission_1534a8de-b412-49bc-97a8-3b535d131406"
        }

        var doc = Object.assign({}, oldDoc);
        doc.company_id = "TEST_COUCOU";

        testHelper.verifyDocumentNotReplaced(
            doc,
            oldDoc,
            "mission",
            "Document ID can't be modify", {
                expectedRoles: ["mapotempo_company.mission.updating"]
            });
    });

    it("Update : 5- can update the owners field mission document", function() {
        var oldDoc = {
            "delivery_date": "2017-07-21T16:22:27.348Z",
            "company_id": "mapotempo_company",
            "location": {
                "lat": 45.0,
                "lon": 2.0
            },
            "address":  {
                "street": "9 Rue André Darbon", // character varying(255),
                "postalcode": "33000", // character varying(255),
                "city": "Bordeaux", // character varying(255),
                "state": "Gironde", // character varying
                "country": "France", // character varying
                "detail": "Pépinière éco-créative" // text
            },
            "name": "test",
            "owners": ["static", "superman"],
            "type": "mission",
            "_id": "Mission_1534a8de-b412-49bc-97a8-3b535d131406"
        }

        var doc = Object.assign({}, oldDoc);
        doc.ownrs = ["statoc", "superman"];

        testHelper.verifyDocumentReplaced(
            doc,
            oldDoc, {
                expectedRoles: ["mapotempo_company.mission.updating"],
                expectedUsers: ["static", "superman"]
            }, [{
                    expectedType: "channel",
                    expectedUsers: ["static"],
                    expectedChannels: ["mission:static:20170721"]
                },
                {
                    expectedType: "channel",
                    expectedUsers: ["superman"],
                    expectedChannels: ["mission:superman:20170721"]
                }
            ]);
    });

    it("Update : 6- can update the address field mission document", function() {
        var oldDoc = {
            "delivery_date": "2017-07-21T16:22:27.348Z",
            "company_id": "mapotempo_company",
            "location": {
                "lat": 45.0,
                "lon": 2.0
            },
            "address":  {
                "street": "9 Rue André Darbon",
                "postalcode": "33000",
                "city": "Bordeaux",
                "state": "Gironde",
                "country": "France",
                "detail": "Pépinière éco-créative"
            },
            "name": "test",
            "owners": ["static", "superman"],
            "type": "mission",
            "_id": "Mission_1534a8de-b412-49bc-97a8-3b535d131406"
        }

        var doc = Object.assign({}, oldDoc);
        doc.address.street = "1 Rue de la soif";
        doc.address.postalcode = "33800";
        doc.address.city = "UnkowCity";
        doc.address.state = "Heeeeeeeeeeey";
        doc.address.country = "Je test et j'écris ce que je veux de toute facon, puisque c'est juste pour tester donc cette ligne elle peut etre trés longue !";

        testHelper.verifyDocumentReplaced(
            doc,
            oldDoc, {
                expectedRoles: ["mapotempo_company.mission.updating"],
                expectedUsers: ["static", "superman"]
            }, [{
                    expectedType: "channel",
                    expectedUsers: ["static"],
                    expectedChannels: ["mission:static:20170721"]
                },
                {
                    expectedType: "channel",
                    expectedUsers: ["superman"],
                    expectedChannels: ["mission:superman:20170721"]
                }
            ]);
    });

    // ####################
    // TEST DELETE
    // test detail : TODO
    // ######
    it("Delete : 1- can delete a mission document", function() {
        var oldDoc = {
            "delivery_date": "2017-07-21T16:22:27.348Z",
            "company_id": "mapotempo_company",
            "location": {
                "lat": 45.0,
                "lon": 2.0
            },
            "address":  {
                "street": "9 Rue André Darbon", // character varying(255),
                "postalcode": "33000", // character varying(255),
                "city": "Bordeaux", // character varying(255),
                "state": "Gironde", // character varying
                "country": "France", // character varying
                "detail": "Pépinière éco-créative" // text
            },
            "name": "test",
            "owners": ["static", "superman"],
            "type": "mission",
            "_id": "Mission_1534a8de-b412-49bc-97a8-3b535d131406"
        }

        testHelper.verifyDocumentDeleted(
            oldDoc, {
                expectedRoles: ["mapotempo_company.mission.deleting"],
                expectedUsers: ["static", "superman"]
            });
    });
});
