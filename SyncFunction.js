function sync_func(doc, oldDoc) {

  // ########################
  // ########################
  // ##                    ##
  // ##  CONST DEFINITION  ##
  // ##                    ##
  // ########################
  // ########################

  // TYPES CONST
  var TYPES_DRIVER = {
    "company"       : company,
    "device"        : device,
    "mission"       : mission,
    "mission_status": "",
    "track"         : "",
    "metadata"      : ""
  }

  // ACTIONS CONST
  var CREATING = "creating";
  var UPDATING = "updating";
  var DELETING = "deleting";
  var UNDELETING = "undeleting";
  var UPDATING_DELETED = "updating_deleted";

  // ############################
  // ############################
  // ##                        ##
  // ##  CALL THE MAIN ROOTER  ##
  // ##                        ##
  // ############################
  // ############################

  // **************************************************************************************************************************
  // * 'type', 'action' and 'role' are accessible for all the functions                                                       *
  // *  type   -> type is a string format extrat from doc.type, it is MANDATORY and it must be one of the key in TYPES_DRIVER *
  // *  action -> "action" is the current action perfomed by the user on the document                                         *
  // *  role   -> role is a string format as that "type:action" if the action needed a role to be performed it is this        *
  // **************************************************************************************************************************
  var params = {
    type:   "unknow", // The type of document
    action: "unknow", // The action being performed
    role:   "unknow" // The role need to perform the action
  }

  params.type = checkAndGetType(doc, oldDoc);
  params.action = checkAndGetAction(doc, oldDoc);
  params.role = getRole(params.type, params.action);

  TYPES_DRIVER[params.type](doc, oldDoc, params);

  // #######################################
  // #######################################
  // ##                                   ##
  // ##  TYPE DRIVER FUNCTION DEFINITION  ##
  // ##                                   ##
  // #######################################
  // #######################################

  // ###############
  // COMPANY MANAGER
  // ###############
  function company(doc, oldDoc, params) {
    //var owners = checkOwner(doc, oldDoc);
    //requireUser(owner);
    switch(params.action) {
      case CREATING:
        break;
      case UPDATING:
        break;
      case DELETING:
        break;
      case UNDELETING:
        break;
      case UPDATING_DELETED:
        break
      default:
    }
  }

  // ##############
  // DEVICE MANAGER
  // ##############
  function device(doc, oldDoc, params){  
    //var owner = checkOwner(doc, oldDoc);
    // FIXME We can't check owner, because in reality device will be create by
    // another user.
    //requireUser(owner);

    var channel = makeDeviceChannel(doc, oldDoc, owner, params.type);
    switch(params.action) {
      case CREATING:
        access([owner], [channel]);
        break;
      case UPDATING:
        break;
      case DELETING:
        break;
      case UNDELETING:
        break;
      case UPDATING_DELETED:
        break
      default:
    }
  }

  // ###############
  // MISSION MANAGER
  // ###############
  function mission(doc, oldDoc, params){
    var owners = checkOwners(doc, oldDoc);
    requireUser(owners);
    requireRole(params.role);
    var delivery_date = checkDeliveryDate(doc, oldDoc);
    var ownersChannels = makeMissionChannels(owners, params.type, delivery_date);
    requireAccess(ownersChannels);

    switch(params.action) {
      case CREATING:
      case UPDATING:
        checkLocation(doc, oldDoc);
        checkName(doc, oldDoc);
        checkDevice(doc, oldDoc);
      case DELETING:
      case UNDELETING:
      case UPDATING_DELETED:
      default:
        break
    }
  }

  // ###################################
  // ###################################
  // ##                               ##
  // ##  Function Checker definition  ##
  // ##                               ##
  // ###################################
  // ###################################

  // ####################
  // Check Document Field
  // ####################
  function checkOwners(doc, oldDoc) {
    // Make sure that the owner propery exists:
    var owners = oldDoc ? oldDoc.owners : doc.owners;
    if (!owners) {
      throw({forbidden : "Document must have owners"});
    }

    if (!owners.length > 0) {
      throw({forbidden : "Document must have at least one owner"});
    }
    return owners;
  }

  function checkDeliveryDate(doc, oldDoc) {
    // Make sure that the checkDeliveryDate propery exists:
    var delivery_date = doc.delivery_date ? doc.delivery_date: oldDoc.delivery_date;
    if (!delivery_date) {
      throw({forbidden : "Document must have a delivery_date"});
    }

    if(isNaN(Date.parse(delivery_date)))
      throw({forbidden : "Document must have a delivery_date ISO8601 valid format"});
    return delivery_date;
  }

  function checkDevice(doc, oldDoc) {
    // Make sure that the device propery exists:
    if (!doc.device) {
      throw({forbidden : "Document must have a device"});
    }
    return doc.device;
  }

  function checkLocation(doc, oldDoc) {
    // Make sure that the location propery exists:
    var location = doc.location;
    if (location) {
      if(isNaN(location.lon) || isNaN(location.lat))
        throw({forbidden : "location lat and lon must be a float values"});
      else
        return location;
    }
    else
      throw({forbidden : "Document must have a location"});
    return location;
  }

  function checkName(doc, oldDoc) {
    if (!doc.name || typeof(doc.name) !== "string") {
      throw({forbidden : "Document must have a name"});
    }
  }
  // ###############
  // Channel Factory
  // ###############
  function makeDeviceChannel(doc, oldDoc, owner, type) {
    var owner_channel = type + ":" + owner;
    channel([owner_channel]);
    return owner_channel;
  }

  function makeMissionChannels(owners, type, delivery_date) {
    // Date format yyyyMMdd for channel
    var timestamp = Date.parse(delivery_date);
    if(isNaN(timestamp))
      throw({forbidden : "Document must have a delivery_date ISO8601 valid format"});
    var date = new Date(timestamp);
    var channel_date = "" + date.getFullYear()
                  + ("0" + (date.getMonth() + 1)).slice(-2)
                  + ("0" + date.getDate()).slice(-2)

    var owner_channels = [];
    for(var i = 0; i < owners.length; i++) {
      // Create channel patern [type:owner:yyyyMMdd]
      owner_channels[i] = type + ":" + owners[i] + ":" + channel_date;
      // Adds an access to owner at his channel
      access([owners[i]], [owner_channels[i]]);
    }
    // Add current doc in all channels
    channel(owner_channels);
    return owner_channels;
  }

  // ######################
  // Action and Role Helper
  // ######################
  function checkAndGetType(doc, oldDoc) {
    var type = oldDoc ? oldDoc.type : doc.type;
    if (!type || !TYPES_DRIVER[type]) {
      throw({forbidden : "Unknown document type"});
    }
    if (oldDoc && doc) {
      if(oldDoc.type !== doc.type) {
        // Check is not a delete action
        if(doc._deleted !== true) {
          throw({forbidden : "Document \"type\" can't be modify"});
        }
      }
    }
    return type;
  }

  function checkAndGetAction(doc, oldDoc) {
    var action = CREATING;
    if(doc && !oldDoc) {
      action = CREATING;
    }
    else if(doc && oldDoc) {
      action = UPDATING;
      if(doc._deleted && !oldDoc._deleted)
        action = DELETING;
      else if(!doc._deleted && oldDoc._deleted)
        action = UNDELETING;
      else if(doc._deleted && oldDoc._deleted)
        action = UPDATING_DELETED
    }
    else {
      action = DELETING;
    }
    return action;
  }

  // ROLES
  function getRole(type, action) {
    return type + ":" + action;
  }
}

