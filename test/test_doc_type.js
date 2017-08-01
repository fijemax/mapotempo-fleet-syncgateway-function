var testHelper = require('../node_modules/synctos/etc/test-helper.js');

var errorFormatter = testHelper.validationErrorFormatter;

describe('Document create update delete test', function() {
    beforeEach(function() {
        testHelper.initSyncFunction('SyncFunction.js');
    });

    // ####################
    // TEST 1
    // test detail : 
    // ######
    it('can\'t create a document without incorect type', function() {
        var doc = {
            "type": "test",
            "delivery_date": "2017-07-21T16:22:27.348Z",
            "device": "unknow",
            "location": {
                "lat": 45.0,
                "lon": 2.0
            },
            "name": "test",
            "owner": "static",
            "_id": "Mission_1534a8de-b412-49bc-97a8-3b535d131406"
        }

        testHelper.verifyUnknownDocumentType(doc);
    });

    // ####################
    // TEST 2
    // test detail : 
    // ######
    it('can\'t create a document without type', function() {
        var doc = {
            //"type": "test",
            "delivery_date": "2017-07-21T16:22:27.348Z",
            "device": "unknow",
            "location": {
                "lat": 45.0,
                "lon": 2.0
            },
            "name": "test",
            "owner": "static",
            "_id": "Mission_1534a8de-b412-49bc-97a8-3b535d131406"
        }

        testHelper.verifyUnknownDocumentType(doc);
    });
});