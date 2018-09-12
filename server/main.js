import {
    Meteor
} from 'meteor/meteor';
import {
    Posts
} from '../imports/api/posts/posts.js';

import '/imports/startup/server';

/**
 * Due to limitations create by the meteor Google login library; everytime the server starts,
 * it is required to remove and insert the google login service config from the mongo database.
 * After re-configuring the login, the schedule announcement api is called to ensure all approved
 * posts are scheduled for publishing as the chron system is not continued after a server shutdown.
 */

Meteor.startup(() => {
    Accounts.loginServiceConfiguration.remove({
        service: "google"
    });
    Accounts.loginServiceConfiguration.insert({
        service: "google",
        clientId: "MASKED_DUE_TO_PUBLIC_REPO",
        secret: "MASKED_DUE_TO_PUBLIC_REPO"
    });
    //on server restart, always re-run scheduler to reschedule all announcements
    Posts.find({
        'meta.approved': true,
        'meta.screeningStage': 3
    }).forEach(function (obj) {
        Meteor.call('scheduleAnnouncement', obj._id, function (err) {
            if (err) {
                console.log(err);
            }
        });
    });
});