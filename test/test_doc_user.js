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
            "_rev": "1-71021ef5332ba5419fb7d65cb46f4a9d",
            "_id": "static"
        }

        testHelper.verifyDocumentCreated(
            doc, {
                expectedRoles: ["company_xxxx:user:creating"],
            }, [{
                    expectedChannels: ["user:static"],
                    expectedUsers: ["static"]
                },
                {
                    expectedChannels: ["company:company_xxxx"],
                    expectedUsers: ["static"]
                }
            ]);
    })
})