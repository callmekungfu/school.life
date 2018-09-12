import {
    Images
} from '../../api/images/images.js';

/**
 * This library is not actively in use in the application due to school policies, 
 * it is designed to allow announcements posted on the app to be synced to Facebook
 * which ensures a more streamlined information management structure.
 * 
 * Author: Michael Jiang
 */

/**
 * Initialized the Facebook interface
 * 
 * @param callback A function executed after the 
 */
setupFacebook = function (callback) {
    Meteor.call('getFBAppId', function (err, result) { //get the app id from server
        if (err) {
            console.log("error retreiving FB App ID");
            callback(err, null);
        } else {
            //Initialize the facebook SDK

            FB.init({
                appId: result,
                status: true,
                xfbml: true,
                version: 'v2.9'
            }, function (err, response) {
                if (err) {
                    console.log(err);
                } else {
                    callback(null, response);
                }
            });
        }
    });
}
/**
 * This function is used to renew the token as Facebook sets a expiry date on all token it issues.
 * This is done through making REST oauth request to the graph.facebook.com access_token APIs.
 * 
 * @param accessToken The token that should be renewed
 */
extendToken = function (accessToken) {
    let appId, appSec;
    Meteor.call('getFBAppId', function (err, response) {
        appId = response;
        Meteor.call('getFBSecret', function (err, response2) {
            appSec = response2;
            $.get("https://graph.facebook.com/oauth/access_token", {
                    grant_type: 'fb_exchange_token',
                    client_id: appId,
                    client_secret: appSec,
                    fb_exchange_token: accessToken
                },
                function (data) {
                    console.log(data);
                })
        })
    });

}

/**
 * This function posts a text based announcement to the accessToken corresponding Facebook page.
 * 
 * @param obj 
 */
postTextFacebook = function (obj) {
    FB.login(function (response) {
        //use this to get access token for user
        //var token = response.authResponse.accessToken;
        let pageToken;
        let pageId;
        console.log(response)
        //make the API call to access pages
        FB.api('/me/accounts', function (response) {
            //console.log(response);

            //store the pageToken and pageId for the first entry.
            //This account is intended to only have one page as admin
            pageToken = response.data[0].access_token;
            pageId = response.data[0].id;
            //extendToken(pageToken);

            //make the API call to post as page
            FB.api('/' + pageId + '/feed', 'post', {
                access_token: pageToken,
                message: obj.headline + '\n' + obj.content
            }, function (response) {
                console.log(response);
            });

        });
    }, {
        scope: 'publish_actions,manage_pages,publish_pages'
    }); //permissions listed here
}

// This method is not actively maintained and is not working
postImageFacebook = function (obj) {
    console.log("posting to facebook");
    FB.login(function (response) {
        //use this to get access token for user
        //var token = response.authResponse.accessToken;
        var pageToken, pageId;

        //make the API call to access pages
        FB.api('/me/accounts', function (response) {
            console.log(response);

            //store the pageToken and pageId for the first entry.
            //This account is intended to only have one page as admin
            pageToken = response.data[0].access_token;
            pageId = response.data[0].id;

            //make the API call to post as page
            FB.api('/' + pageId + '/photos', 'post', {
                access_token: pageToken,
                message: obj.headline,
                picture: Images.findOne({
                    '_id': obj.imgId
                }).url(), //'http://www.somebodymarketing.com/wp-content/uploads/2013/05/Stock-Dock-House.jpg'
            }, function (response) {
                console.log(response);
            });
        });
    }, {
        scope: 'publish_actions,manage_pages,publish_pages'
    }); //permissions listed here
}

// This function is not actively maintained
postTextImageFacebook = function (obj) {
    FB.login(function (response) {
        //use this to get access token for user
        //var token = response.authResponse.accessToken;
        var pageToken, pageId;

        //make the API call to access pages
        FB.api('/me/accounts', function (response) {
            console.log(response);

            //store the pageToken and pageId for the first entry.
            //This account is intended to only have one page as admin
            pageToken = response.data[0].access_token;
            pageId = response.data[0].id;

            //make the API call to post as page
            FB.api('/' + pageId + '/photos', 'post', {
                access_token: pageToken,
                message: obj.headline + '\n' + obj.content,
                picture: Images.findOne({
                    '_id': obj.imgId
                }).url(),
            }, function (response) {
                console.log(response);
            });
        });
    }, {
        scope: 'publish_actions,manage_pages,publish_pages'
    });
}