var testHelper = require("../node_modules/synctos/etc/test-helper.js");

var errorFormatter = testHelper.validationErrorFormatter;

describe("my example document definitions", function() {
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
      "device_id": "UIOAZHD4564DAZD",
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
        expectedRoles: ["mission:creating"],
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

  it("can't create a mission document without owners field", function() {
    var doc = {
      "delivery_date": "2017-07-21T16:22:27.348Z",
      "device_id": "UIOAZHD4564DAZD",
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
          expectedRoles: ["mission:creating"]
      }
    );
  });

  it("can't create a mission document with owners array empty", function() {
    var doc = {
      "delivery_date": "2017-07-21T16:22:27.348Z",
      "device_id": "UIOAZHD4564DAZD",
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
          expectedRoles: ["mission:creating"]
      }
    );
  });

  it("can't create a mission document without device_id field", function() {
    var doc = {
      "delivery_date": "2017-07-21T16:22:27.348Z",
      //"device_id": "UIOAZHD4564DAZD",
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
      "Document must have a device_id",
      {
        expectedRoles: ["mission:creating"],
        expectedUsers: ["static", "superman"]
      });
  });

  it("can't create a mission document without location field", function() {
    var doc = {
      "delivery_date": "2017-07-21T16:22:27.348Z",
      "device_id": "UIOAZHD4564DAZD",
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
        expectedRoles: ["mission:creating"],
        expectedUsers: ["static", "superman"]
      });
  });

  it("can't create a mission document without name field", function() {
    var doc = {
      "delivery_date": "2017-07-21T16:22:27.348Z",
      "device_id": "UIOAZHD4564DAZD",
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
        expectedRoles: ["mission:creating"],
        expectedUsers: ["static", "superman"]
      });
  });

  // ####################
  // TEST UPDATE
  // test detail : TODO
  // ######
  it("can update a mission document", function() {
    var oldDoc = {
      "delivery_date": "2017-07-21T16:22:27.348Z",
      "device_id": "UIOAZHD4564DAZD",
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
        expectedRoles: ["mission:updating"],
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

  // ####################
  // TEST DELETE
  // test detail : TODO
  // ######
  it("can delete a mission document", function() {
    var oldDoc = {
      "delivery_date": "2017-07-21T16:22:27.348Z",
      "device_id": "UIOAZHD4564DAZD",
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
        expectedRoles: ["mission:deleting"],
        expectedUsers: ["static", "superman"]
      });
  });
});




