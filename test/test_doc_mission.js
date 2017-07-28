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
  it("can create a mission document", function() {
    var doc = {
      "delivery_date": "2017-07-21T16:22:27.348Z",
      "company_id": "UIOAZHD4564DAZD",
      "location": {
        "lat": 45.0,
        "lon": 2.0
      },
      "name": "test",
      "owners": ["static", "superman"],
      "type": "mission",
      "_id": "Mission_1534a8de-b412-49bc-97a8-3b535d131406"
    }

    testHelper.verifyDocumentCreated(
      doc,
      {
        expectedRoles: ["UIOAZHD4564DAZD:mission:creating"],
        expectedUsers: ["static", "superman"],
        expectedChannels: ["mission:static:20170721", "mission:superman:20170721"]
      },
      [
        {
          expectedChannels: ["mission:static:20170721"],
          expectedUsers: ["static"]
        },
        {
          expectedChannels: ["mission:superman:20170721"],
          expectedUsers: ["superman"]
        }
      ]);
  });

  it("can't create a mission document with owners array empty", function() {
    var doc = {
      "delivery_date": "2017-07-21T16:22:27.348Z",
      "company_id": "UIOAZHD4564DAZD",
      "location": {
        "lat": 45.0,
        "lon": 2.0
      },
      "name": "test",
      "owners": [],
      "type": "mission",
      "_id": "Mission_1534a8de-b412-49bc-97a8-3b535d131406"
    }

    testHelper.verifyDocumentNotCreated(
      doc,
      "mission",
      "Document must have at least one owner",
      {
        expectedRoles: ["UIOAZHD4564DAZD:mission:creating"],
      }
    );
  });

  it("can't create a mission document without owners field", function() {
    var doc = {
      "delivery_date": "2017-07-21T16:22:27.348Z",
      "company_id": "UIOAZHD4564DAZD",
      "location": {
        "lat": 45.0,
        "lon": 2.0
      },
      "name": "test",
      // "owners": ["static", "superman"],
      "type": "mission",
      "_id": "Mission_1534a8de-b412-49bc-97a8-3b535d131406"
    }

    testHelper.verifyDocumentNotCreated(
      doc,
      "mission",
      "Document must have owners",
      {
        expectedRoles: ["UIOAZHD4564DAZD:mission:creating"],
      }
    );
  });

  it("can't create a mission document without delivery_date field", function() {
    var doc = {
      "delivery_date": "23 juin 1912",
      "company_id": "UIOAZHD4564DAZD",
      "location": {
        "lat": 45.0,
        "lon": 2.0
      },
      "name": "test",
      "owners": ["static", "superman"],
      "type": "mission",
      "_id": "Mission_1534a8de-b412-49bc-97a8-3b535d131406"
    }

    testHelper.verifyDocumentNotCreated(
      doc,
      "mission",
      "Document must have a delivery_date ISO8601 valid format",
      {
        expectedUsers: ["static", "superman"],
        expectedRoles: ["UIOAZHD4564DAZD:mission:creating"]
      }
    );
  });

  it("can't create a mission document with delivery_date field improperly formatted", function() {
    var doc = {
     // "delivery_date": "2017-07-21T16:22:27.348Z",
      "company_id": "UIOAZHD4564DAZD",
      "location": {
        "lat": 45.0,
        "lon": 2.0
      },
      "name": "test",
      "owners": ["static", "superman"],
      "type": "mission",
      "_id": "Mission_1534a8de-b412-49bc-97a8-3b535d131406"
    }

    testHelper.verifyDocumentNotCreated(
      doc,
      "mission",
      "Document must have a delivery_date",
      {
        expectedUsers: ["static", "superman"],
        expectedRoles: ["UIOAZHD4564DAZD:mission:creating"]
      }
    );
  });

  it("can't create a mission document whitout company_id", function() {
    var doc = {
      "delivery_date": "2017-07-21T16:22:27.348Z",
     // "company_id": "UIOAZHD4564DAZD",
      "location": {
        "lat": 45.0,
        "lon": 2.0
      },
      "name": "test",
      "owners": ["static"],
      "type": "mission",
      "_id": "Mission_1534a8de-b412-49bc-97a8-3b535d131406"
    }

    testHelper.verifyDocumentNotCreated(
      doc,
      "mission",
      "Document must have a company_id",
      {
        expectedRoles: ["undefined:mission:creating"],
      }
    );
  });

  it("can't create a mission document without location field", function() {
    var doc = {
      "delivery_date": "2017-07-21T16:22:27.348Z",
      "company_id": "UIOAZHD4564DAZD",
      /*"location": {
        "lat": 45.0,
        "lon": 2.0
      },*/
      "name": "test",
      "owners": ["static", "superman"],
      "type": "mission",
      "_id": "Mission_1534a8de-b412-49bc-97a8-3b535d131406"
    }

    testHelper.verifyDocumentNotCreated(
      doc,
      "mission",
      "Document must have a location",
      {
        expectedRoles: ["UIOAZHD4564DAZD:mission:creating"],
        expectedUsers: ["static", "superman"]
      });
  });

  it("can't create a mission document without name field", function() {
    var doc = {
      "delivery_date": "2017-07-21T16:22:27.348Z",
      "company_id": "UIOAZHD4564DAZD",
      "location": {
        "lat": 45.0,
        "lon": 2.0
      },
      // "name": "test",
      "owners": ["static", "superman"],
      "type": "mission",
      "_id": "Mission_1534a8de-b412-49bc-97a8-3b535d131406"
    }

    testHelper.verifyDocumentNotCreated(
      doc,
      "mission",
      "Document must have a name",
      {
        expectedRoles: ["UIOAZHD4564DAZD:mission:creating"],
        expectedUsers: ["static", "superman"]
      });
  });

  // ####################
  // TEST UPDATE
  // test detail : TODO
  // ######
  it("can update the delivery_date field mission document", function() {
    var oldDoc = {
      "delivery_date": "2017-07-21T16:22:27.348Z",
      "company_id": "UIOAZHD4564DAZD",
      "location": {
        "lat": 45.0,
        "lon": 2.0
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
      oldDoc,
      {
        expectedRoles: ["UIOAZHD4564DAZD:mission:updating"],
        expectedUsers: ["static", "superman"]
      },
      [
        {
          expectedUsers: ["static"],
          expectedChannels: ["mission:static:20170725"]
        },
        {
          expectedUsers: ["superman"],
          expectedChannels: ["mission:superman:20170725"]
        }
      ]);
  });

  it("can update the location field mission document", function() {
    var oldDoc = {
      "delivery_date": "2017-07-21T16:22:27.348Z",
      "company_id": "UIOAZHD4564DAZD",
      "location": {
        "lat": 45.0,
        "lon": 2.0
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
      oldDoc,
      {
        expectedRoles: ["UIOAZHD4564DAZD:mission:updating"],
        expectedUsers: ["static", "superman"]
      },
      [
        {
          expectedUsers: ["static"],
          expectedChannels: ["mission:static:20170721"]
        },
        {
          expectedUsers: ["superman"],
          expectedChannels: ["mission:superman:20170721"]
        }
      ]);
  });

  it("can update the name field mission document", function() {
    var oldDoc = {
      "delivery_date": "2017-07-21T16:22:27.348Z",
      "company_id": "UIOAZHD4564DAZD",
      "location": {
        "lat": 45.0,
        "lon": 2.0
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
      oldDoc,
      {
        expectedRoles: ["UIOAZHD4564DAZD:mission:updating"],
        expectedUsers: ["static", "superman"]
      },
      [
        {
          expectedUsers: ["static"],
          expectedChannels: ["mission:static:20170721"]
        },
        {
          expectedUsers: ["superman"],
          expectedChannels: ["mission:superman:20170721"]
        }
      ]);
  });

  it("can update the name field mission document", function() {
    var oldDoc = {
      "delivery_date": "2017-07-21T16:22:27.348Z",
      "company_id": "UIOAZHD4564DAZD",
      "location": {
        "lat": 45.0,
        "lon": 2.0
      },
      "name": "test",
      "owners": ["static", "superman"],
      "type": "mission",
      "_id": "Mission_1534a8de-b412-49bc-97a8-3b535d131406"
    }

    var doc = Object.assign({}, oldDoc);
    doc._id = "dzPOAZj";

    testHelper.verifyDocumentReplaced(
      doc,
      oldDoc,
      {
        expectedRoles: ["UIOAZHD4564DAZD:mission:updating"],
        expectedUsers: ["static", "superman"]
      },
      [
        {
          expectedUsers: ["static"],
          expectedChannels: ["mission:static:20170721"]
        },
        {
          expectedUsers: ["superman"],
          expectedChannels: ["mission:superman:20170721"]
        }
      ]);
  });

  it("can't update the company_id mission field", function() {
    var oldDoc = {
      "delivery_date": "2017-07-21T16:22:27.348Z",
      "company_id": "UIOAZHD4564DAZD",
      "location": {
        "lat": 45.0,
        "lon": 2.0
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
      "Document ID can't be modify",
      {
        expectedRoles: ["UIOAZHD4564DAZD:mission:updating"]
      });
  });

  // ####################
  // TEST DELETE
  // test detail : TODO
  // ######
  it("can delete a mission document", function() {
    var oldDoc = {
      "delivery_date": "2017-07-21T16:22:27.348Z",
      "company_id": "UIOAZHD4564DAZD",
      "location": {
        "lat": 45.0,
        "lon": 2.0
      },
      "name": "test",
      "owners": ["static", "superman"],
      "type": "mission",
      "_id": "Mission_1534a8de-b412-49bc-97a8-3b535d131406"
    }

    testHelper.verifyDocumentDeleted(
      oldDoc,
      {
        expectedRoles: ["UIOAZHD4564DAZD:mission:deleting"],
        expectedUsers: ["static", "superman"]
      });
  });
});



