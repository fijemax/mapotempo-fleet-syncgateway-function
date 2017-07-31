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
      "name": "Mapotempo",
      "owners": ["superman", "static"]
    }

    testHelper.verifyDocumentCreated(
      doc,
      {
        expectedRoles: ["company_xxxxxxxx:company:creating"],
        expectedUsers: ["static", "superman"],
        expectedChannels: ["company:static", "company:superman"]
      },
      [
        {
          expectedChannels: ["company:static"],
          expectedUsers: ["static"]
        },
        {
          expectedChannels: ["company:superman"],
          expectedUsers: ["superman"]
        }
      ]);
  })
})
