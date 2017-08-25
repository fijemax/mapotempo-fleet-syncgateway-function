var testHelper = require("../node_modules/synctos/etc/test-helper.js");

var errorFormatter = testHelper.validationErrorFormatter;

describe("User create update delete test", function() {
    beforeEach(function() {
        testHelper.initSyncFunction("SyncFunction.js");
    });

    // ####################
    // TEST CREATE
    // test detail : TODO
    // ######

    it("Create : 1- can create a user document", function() {
        var doc = {
            "company_id": "company_xxxx",
            "type": "user",
            "user": "static",
            "roles": ["mission.creating", "mission.updating"],
            "_rev": "1-71021ef5332ba5419fb7d65cb46f4a9d",
            "_id": "static"
        }
        testHelper.verifyDocumentCreated(
            doc, {
                expectedRoles: ["company_xxxx.user.creating"],
            }, [{
                    expectedType: "channel",
                    expectedChannels: ["user:static"],
                    expectedUsers: ["static"]
                },
                {
                    expectedType: "channel",
                    expectedChannels: ["company:company_xxxx"],
                    expectedUsers: ["static"]
                },
                {
                    expectedType: "channel",
                    expectedChannels: ["mission_status_type:company_xxxx"],
                    expectedUsers: ["static"]
                },
                {
                    expectedType: "role",
                    expectedRoles: ["company_xxxx.mission.creating", "company_xxxx.mission.updating"],
                    expectedUsers: ["static"]
                },
            ]);
    })
})
