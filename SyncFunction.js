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
    type:       "unknow", // The type of document
    action:     "unknow", // The action being performed
    role:       "unknow", // The role need to perform the action
    company_id: "unknow"  // The role need to perform the action
  }
  params.type = checkAndGetType(doc, oldDoc);
  params.action = checkAndGetAction(doc, oldDoc);
  params.company_id = getCompanyID(doc, oldDoc);
  params.role = getRole(params.company_id, params.type, params.action);

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
    switch(params.action) {
      case CREATING:
        break;
      case UPDATING:
        break;
      case DELETING:
        break
      default:
    }
  }

  // ##############
  // DEVICE MANAGER
  // ##############
  function device(doc, oldDoc, params){
    switch(params.action) {
      case CREATING:
        break;
      case UPDATING:
        break;
      case DELETING:
        break;
      default:
    }
  }

  // ###############
  // MISSION MANAGER
  // ###############
  function mission(doc, oldDoc, params){
    requireRole(params.role);
    checkCompanyID(doc, oldDoc);

    // Check owners
    var owners = checkOwners(doc, oldDoc);
    requireUser(owners);

    // Check delivery date and make channels
    var delivery_date = checkDeliveryDate(doc, oldDoc);
    var ownersChannels = makeMissionChannels(owners, params.type, delivery_date);

    switch(params.action) {
      case CREATING:
      case UPDATING:
        checkLocation(doc, oldDoc);
        checkName(doc, oldDoc);
        // Adds an access to owner at his specific channel
        for(var i = 0; i < ownersChannels.length; i++)
          access([owners[i]], [ownersChannels[i]]);
        break
      case DELETING:
      default:
    }
    // Add current doc in all channels
    channel(ownersChannels);
    requireAccess(ownersChannels);
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
    var delivery_date = doc ? doc.delivery_date : oldDoc.delivery_date;
    // On test le cas ou delivery_date est null pour prendre celui du oldDoc (pour la suppression)
    delivery_date = (!delivery_date &&  oldDoc) ? oldDoc.delivery_date : delivery_date;

    if (!delivery_date) {
      throw({forbidden : "Document must have a delivery_date"});
    }
    if(isNaN(Date.parse(delivery_date)))
      throw({forbidden : "Document must have a delivery_date ISO8601 valid format"});
    return delivery_date;
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
    }
    return owner_channels;
  }

  // ##############################
  // Action Company and Role Helper
  // ##############################
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
    if(!oldDoc)
      return CREATING;
    else if(doc._deleted)
      return DELETING;
    else
      return UPDATING;
  }

  function getCompanyID(doc, oldDoc) {
    return oldDoc ? oldDoc.company_id: doc.company_id;
  }

  function checkCompanyID(doc, oldDoc) {
    var company_id = oldDoc ? oldDoc.company_id: doc.company_id;
    if (!company_id) {
      throw({forbidden : "Document must have a company_id"});
    }

    // Make sure that nobody can modify company id.
    if(doc && oldDoc)
      if(doc.company_id && oldDoc.company_id)
        if(doc.company_id != oldDoc.company_id) {
          throw({forbidden : "Document ID can't be modify"});
    }
  }

  // ROLES
  function getRole(company, type, action) {
    return company + ":" + type + ":" + action;
  }
}

