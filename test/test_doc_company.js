var testHelper = require("../node_modules/synctos/etc/test-helper.js");

var errorFormatter = testHelper.validationErrorFormatter;

describe("Company create update delete test", function() {
    beforeEach(function() {
        testHelper.initSyncFunction("SyncFunction.js");
    });

    // ####################
    // TEST CREATE
    // test detail : TODO
    // ######

    it("Create : 1- can create a company document", function() {
        var doc = {
            "_id": "company_xxxxxxxx",
            "type": "company",
            "name": "Mapotempo"
        }

        testHelper.verifyDocumentCreated(
            doc, {
                expectedRoles: ["company_xxxxxxxx.company.creating"],
                // expectedChannels: ["company:company_xxxxxxxx"]
            });
    })
})
