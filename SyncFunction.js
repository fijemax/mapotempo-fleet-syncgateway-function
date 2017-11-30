/*
 * Copyright © Mapotempo, 2017
 *
 * This file is part of Mapotempo.
 *
 * Mapotempo is free software. You can redistribute it and/or
 * modify since you respect the terms of the GNU Affero General
 * Public License as published by the Free Software Foundation,
 * either version 3 of the License, or (at your option) any later version.
 *
 * Mapotempo is distributed in the hope that it will be useful, but WITHOUT
 * ANY WARRANTY; without even the implied warranty of MERCHANTABILITY
 * or FITNESS FOR A PARTICULAR PURPOSE.  See the Licenses for more details.
 *
 * You should have received a copy of the GNU Affero General Public License
 * along with Mapotempo. If not, see:
 * <http://www.gnu.org/licenses/agpl.html>
 */

// #############################################################################
// #############################################################################
// ##     ____                      ____                                      ##
// ##    / ___| _   _ _ __   ___   / ___| __ _| |_ _____      ____ _ _   _    ##
// ##    \___ \| | | | '_ \ / __| | |  _ / _` | __/ _ \ \ /\ / / _` | | | |   ##
// ##     ___) | |_| | | | | (__  | |_| | (_| | ||  __/\ V  V / (_| | |_| |   ##
// ##    |____/ \__, |_| |_|\___|  \____|\__,_|\__\___| \_/\_/ \__,_|\__, |   ##
// ##           |___/                                                |___/    ##
// ##               _____                 _   _                               ##
// ##              |  ___|   _ _ __   ___| |_(_) ___  _ __                    ##
// ##              | |_ | | | | '_ \ / __| __| |/ _ \| '_ \                   ##
// ##              |  _|| |_| | | | | (__| |_| | (_) | | | |                  ##
// ##              |_|   \__,_|_| |_|\___|\__|_|\___/|_| |_|                  ##
// ##                                                                         ##
// ##                               ______                                    ##
// ##                            .-"      "-.                                 ##
// ##                           /            \                                ##
// ##                          |              |                               ##
// ##                          |,  .-.  .-.  ,|                               ##
// ##                          | )(__/  \__)( |                               ##
// ##                          |/     /\     \|                               ##
// ##                          (_     ^^     _)                               ##
// ##                            \__|IIIIII|__/                               ##
// ##                            | \IIIIII/ |                                 ##
// ##                            \          /                                 ##
// ##                             `--------`                                  ##
// ##                                                                         ##
// #############################################################################
// ##   DESCRIPTION : The sync Gateway function ensure the document           ##
// ##   synchronisation managment.                                            ##
// ##                                                                         ##
// ##                         FIXME: TO COMPLETED                             ##
// ##                                                                         ##
// ##                                                                         ##
// #############################################################################
// #############################################################################


function sync_func(doc, oldDoc) {
    // FIXME some time _deleted doc havn't type
    // For the moment only return and don't process this case
    if(doc._deleted && !doc.type && !oldDoc) {
        return;
    }

    // ########################
    // ########################
    // ##                    ##
    // ##  CONST DEFINITION  ##
    // ##                    ##
    // ########################
    // ########################
    // TYPES CONST
    var COMPANY = 'company';
    var USER = 'user';
    var MISSION = 'mission';
    var MISSIONS_PLACEHOLDER = 'missions_placeholder';
    var MISSION_STATUS_TYPE = 'mission_status_type';
    var MISSION_STATUS_ACTION = 'mission_status_action';
    var MISSION_STATUS = 'mission_status';
    var TRACK = 'track';
    var CURRENT_LOCATION = 'current_location';
    var METADATA = 'metadata';

    // TYPES DRIVER
    var TYPES_DRIVER = {
        company: company,
        user: user,
        mission: mission,
        missions_placeholder: missions_placeholder,
        mission_status_type: mission_status_type,
        mission_status_action: mission_status_action,
        mission_status: '',
        track: track,
        current_location: current_location,
        metadata: ''
    }

    // ACTIONS CONST
    var CREATING = 'creating';
    var UPDATING = 'updating';
    var DELETING = 'deleting';

    // SEPARATOR
    var ROLE_SEPARATOR = '.';
    var CHANNEL_SEPARATOR = ':';

    // ######################
    // ######################
    // ##                  ##
    // ##  PREPARE PARAMS  ##
    // ##                  ##
    // ######################
    // ######################

    // *****************************************************************************************************************************************
    // * params : 'type', 'action' and 'role' are accessible for all the functions                                                             *
    // *  type       -> type is a string format extrat from doc.type, it is MANDATORY and it must be one of the key in TYPES_DRIVER            *
    // *  action     -> 'action' is the current action perfomed by the user on the document                                                    *
    // *  company_id -> company_id is a id string format, we can't assure in the sync function that the company really exist in the bucket ... *
    // *  role       -> role is a string format as that 'company_id:type:action' if the action needed a role to be performed it is this        *
    // *****************************************************************************************************************************************

    var params = {
        type: 'unknow',      // The type of document
        action: 'unknow',    // The action being performed
        role: 'unknow',      // The role need to perform the action
        company_id: 'unknow' // The company id
    }

    params.type = checkAndGetType(doc, oldDoc);
    params.action = checkAndGetAction(doc, oldDoc);
    params.company_id = getCompanyID(doc, oldDoc, params.type);
    params.role = getRoleNeed(params.company_id, params.type, params.action);

    // #######################
    // #######################
    // ##                   ##
    // ##  CALL THE DRIVER  ##
    // ##                   ##
    // #######################
    // #######################

    // Check role and company
    requireRole(params.role);
    checkCompanyID(doc, oldDoc, params.type);
    TYPES_DRIVER[params.type](doc, oldDoc, params);

    // #######################################
    // #######################################
    // ##                                   ##
    // ##  TYPE DRIVER FUNCTION DEFINITION  ##
    // ##                                   ##
    // #######################################
    // #######################################

    // ###############
    // COMPANY MANAGER
    // ###############
    function company(doc, oldDoc, params) {
        var companyChannel = makeCompanyChannel(params.company_id);
        switch (params.action) {
            case CREATING:
            case UPDATING:
                checkName(doc, oldDoc);
                break;
            case DELETING:
                break;
            default:
        }
        // Add current doc in all channels
        channel([companyChannel]);
    }
    // ##############
    // USER MANAGER
    // ##############
    function user(doc, oldDoc, params) {
        var sync_user = checkSyncUser(doc, oldDoc);
        doc.channels = [];
        var channelUser = makeUserChannel(sync_user);
        doc.channels.push(channelUser);
        var companyChannel = makeCompanyChannel(params.company_id);
        doc.channels.push(companyChannel);
        var missionStatusTypeChannel = makeMissionStatusTypeChannel(params.company_id);
        doc.channels.push(missionStatusTypeChannel);
        var missionStatusActionChannel = makeMissionStatusActionChannel(params.company_id);
        doc.channels.push(missionStatusActionChannel);
        switch (params.action) {
            case CREATING:
            case UPDATING:
                var userRoles = makeUserRoles(doc, oldDoc, params.company_id);
                role([sync_user], userRoles);
                    access([sync_user], [channelUser]);
                access([sync_user], [companyChannel]);
                access([sync_user], [missionStatusTypeChannel]);
                access([sync_user], [missionStatusActionChannel]);
                break;
            case DELETING:
                break;
            default:
        }
        channel([channelUser]);
    }

    // ###############
    // MISSION MANAGER
    // ###############
    function mission(doc, oldDoc, params) {
        // Check owners
        var sync_user = checkSyncUser(doc, oldDoc);
        requireUser(sync_user);
        // Check date and make channels
        var date = checkDate(doc, oldDoc);
        var syncUserChannels = makeMissionChannels(sync_user, date);
            switch (params.action) {
            case CREATING:
            case UPDATING:
                checkLocation(doc, oldDoc);
                checkName(doc, oldDoc);
                access([sync_user], [syncUserChannels]);
                break
            case DELETING:
            default:
        } 
        // Add current doc in all channels
        channel([syncUserChannels]);
    }

    // ###########################
    // MISSION PLACEHOLDER MANAGER
    //
    // The missions placeholder is used to maintain missions user's channel
    // access even that it where are all removed.
    // See => https://github.com/couchbase/sync_gateway/issues/1484
    // ###########################
    function missions_placeholder(doc, oldDoc, params) {
        // Check owners
        var sync_user = checkSyncUser(doc, oldDoc);
        requireUser(sync_user);
        // Check date and make channels
        var date = checkDate(doc, oldDoc);
        var syncUserChannels = makeMissionChannels(sync_user, date);
            switch (params.action) {
            case CREATING:
            case UPDATING:
                access([sync_user], [syncUserChannels]);
                break
            case DELETING:
            default:
        }
        // Add current doc in all channels
        channel([syncUserChannels]);
    }

    // ######################
    // MISSION STATUS TYPE MANAGER
    // ######################
    function mission_status_type(doc, oldDoc, params) {
        var missionStatusTypeChannel = makeMissionStatusTypeChannel(params.company_id);
        // Add current doc in all channels
        channel([missionStatusTypeChannel]);
    }

    // ######################
    // MISSION STATUS ACTION MANAGER
    // ######################
    function mission_status_action(doc, oldDoc, params) {
        var missionStatusActionChannel = makeMissionStatusActionChannel(params.company_id);
        // Add current doc in all channels
        channel([missionStatusActionChannel]);
    }

    // ######################
    // TRACK MANAGER
    // ######################
    function track(doc, oldDoc, params) {
    }

    // ######################
    // CURRENT LOCATION MANAGER
    // ######################
    function current_location(doc, oldDoc, params) {
      var sync_user = checkSyncUser(doc, oldDoc);
      switch (params.action) {
          case UPDATING:
          case CREATING:
            var channelUser = makeUserChannel(sync_user);
            channel([channelUser]);
          case DELETING:
          default:
      }
    }
    // ######################
    // DEFAULT MANAGER
    // ######################
    function default_manager(doc, oldDoc, params) {
      // TODO
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
    function checkSyncUser(doc, oldDoc) {
        // Make sure that the user propery exists:
        var sync_user = oldDoc ? oldDoc.sync_user : doc.sync_user;
        if (!sync_user) {
            throw ({
                forbidden: 'Document must have user'
            });
        }
        if (Array.isArray(user)) {
            throw ({
                forbidden: 'It can only have one user'
            });
        }
        return sync_user;
    }
    function checkOwners(doc, oldDoc) {
        // Make sure that the owner propery exists:
        var owners = oldDoc ? oldDoc.owners : doc.owners;
        if (!owners) {
            throw ({
                forbidden: 'Document must have owners'
            });
        }
        if (!owners.length > 0) {
            throw ({
                forbidden: 'Document must have at least one owner'
            });
        }
        return owners;
    }
    function checkDate(doc, oldDoc) {
        // Make sure that the checkDeliveryDate propery exists:
        var date = doc ? doc.date : oldDoc.date;
        // On test le cas ou date est null pour prendre celui du oldDoc (pour la suppression)
        date = (!date && oldDoc) ? oldDoc.date : date;
        if (!date) {
            throw ({
                forbidden: 'Document must have a date'
            });
        }
        if (isNaN(Date.parse(date)))
            throw ({
                forbidden: 'Document must have a date ISO8601 valid format'
            });
        return date;
    }
    function checkLocation(doc, oldDoc) {
        // Make sure that the location propery exists in the new doc :
        var location = doc.location;
        if (location) {
            if (isNaN(location.lon) || isNaN(location.lat))
                throw ({
                    forbidden: 'location lat and lon must be a float values'
                });
            else
                return location;
        } else
            throw ({
                forbidden: 'Document must have a location'
            });
        return location;
    }
// REMOVE checkAddress function, this isn't mandatory
/*
    function checkAddress(doc, oldDoc) {
        // Make sure that the address propery exists in the new doc :
        var address = doc.address;
        if (address) {
            if (!address.street)
                throw ({
                    forbidden: 'street field in address is mandatory'
                });
            if (!address.postalcode)
                throw ({
                    forbidden: 'postalcode field in address is mandatory'
                });
            if (!address.city)
                throw ({
                    forbidden: 'city field in address is mandatory'
                });
            if (!address.state)
                throw ({
                    forbidden: 'state field in address is mandatory'
                });
            if (!address.country)
                throw ({
                    forbidden: 'country field in address is mandatory'
                });
        } else
            throw ({
                forbidden: 'Document must have an address'
            });
        return address;
    }
*/
    function checkName(doc, oldDoc) {
        if (!doc.name ||  typeof(doc.name) !== 'string') {
            throw ({
                forbidden: 'Document must have a name'
            });
        }
    }

    // ###############
    // Channel Factory
    // ###############
    function makeCompanyChannel(company_id) {
        return COMPANY + CHANNEL_SEPARATOR + company_id;
    }
    function makeMissionStatusTypeChannel(company_id) {
        return MISSION_STATUS_TYPE + CHANNEL_SEPARATOR + company_id;
    }
    function makeMissionStatusActionChannel(company_id) {
        return MISSION_STATUS_ACTION + CHANNEL_SEPARATOR + company_id;
    }
    function makeUserChannel(user) {
        return USER + CHANNEL_SEPARATOR + user;
    }
    function makeCurrentLocationChannel(owner) {
        return CURRENT_LOCATION + CHANNEL_SEPARATOR + owner;
    }
    function makeMissionChannels(sync_user, date) {
        // Date format yyyyMMdd for channel
        var timestamp = Date.parse(date);
        if (isNaN(timestamp))
            throw ({
                forbidden: 'Document must have a date ISO8601 valid format'
            });
        var date = new Date(timestamp);
        var channel_date = '' + date.getFullYear() +
            ('0' + (date.getMonth() + 1)).slice(-2) +
            ('0' + date.getDate()).slice(-2)
        // Create channel patern [type:owner:yyyyMMdd]
        var sync_user_channel = MISSION + CHANNEL_SEPARATOR + sync_user + CHANNEL_SEPARATOR + channel_date;
        return sync_user_channel;
    }

   // ######################
    // Action and Type Helper
    // ######################
    function checkAndGetType(doc, oldDoc) {
        var type = oldDoc ? oldDoc.type : doc.type;
    
        if (!type || !TYPES_DRIVER[type]) {
            throw ({
                forbidden: 'Unknown document type'
            });
        }
        if (oldDoc && doc) {
            if (oldDoc.type !== doc.type) {
                // Check is not a delete action
                if (doc._deleted !== true) {
                    throw ({
                        forbidden: 'Document type cannot be modify'
                    });
                }
            }
        }
        return type;
    }
    function checkAndGetAction(doc, oldDoc) {
        if (!oldDoc)
            return CREATING;
        else if (doc._deleted)
            return DELETING;
        else
            return UPDATING;
    }

    // #################
    // company_id Helper
    // #################
    function getCompanyID(doc, oldDoc, type) {
        if (type === 'company')
            return oldDoc ? oldDoc._id : doc._id;
        else
            return oldDoc ? oldDoc.company_id : doc.company_id;
    }
    function checkCompanyID(doc, oldDoc, type) {
        if (type === 'company')
            return;
        var company_id = oldDoc ? oldDoc.company_id : doc.company_id;
        if (!company_id) {
            throw ({
                forbidden: 'Document must have a company_id'
            });
        }
        // Make sure that nobody can modify company id.
        if (doc && oldDoc)
            if (doc.company_id && oldDoc.company_id)
                if (doc.company_id != oldDoc.company_id) {
                    throw ({
                        forbidden: 'Document ID cannot be modify'
                    });
                }
    }

    // ###########
    // Role Helper
    // ###########
    function getRoleNeed(company_id, type, action) {
        return company_id + ROLE_SEPARATOR + type + ROLE_SEPARATOR + action;
    }
    function makeUserRoles(doc, oldDoc, company_id) {
        var roles = oldDoc ? oldDoc.roles : doc.roles;
        var res = [];
        if(roles && Array.isArray(roles)) {
          for (var i = 0; i < roles.length; i++) {
              res[i] = 'role:' + company_id + ROLE_SEPARATOR + roles[i];
          }
        } else {
            res[0] = 'role:default';
        }
        return res;
    }
}
