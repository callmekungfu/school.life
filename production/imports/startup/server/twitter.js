import { Meteor } from 'meteor/meteor';
import { Images } from '../../api/images/images.js'

Meteor.methods({
  //return the twitter api key
  'getTwitterAPIKey' : function() {
    return 'cwR4tCHFOTFRIyiLQVacIzns8';
  },
  //return the twitter api secret
  'getTwitterAPISecret' : function() {
    return 'MP0Pphmcp6HL0FF6WXYhZa2M8b8cTH297MNqRR7M6wwCOBxfwU';
  },
  //return the twitter access token
  'getTwitterAccessToken' : function() {
    return '882355763771043840-8uCzofs2q4HHE8m0GS2QZUxqNxzOvEG';
  },
  //return the twitter access token secret
  'getTwitterAccessTokenSecret' : function() {
    return 'vpw7YwWu9tic20VI2qDh8W73zJoROenAnDEQoh7PMlM5l';
  },
  //setup the twitter api
  'setupTwitterAPI' : function () {
    Meteor.call('getTwitterAccessToken', function(err, accessToken) {
      Meteor.call('getTwitterAccessTokenSecret', function(err, accessTokenSecret) {
        Meteor.call('getTwitterAPISecret', function(err, apiSecret) {
          Meteor.call('getTwitterAPIKey', function(err, apiKey) {
            //Initialize the twitter API
            T = new Twit({
                consumer_key:         apiKey,
                consumer_secret:      apiSecret,
                access_token:         accessToken,
                access_token_secret:  accessTokenSecret
            });
          });
        });
      });
    });
  },
  //post to twitter account
  'postTextAnnouncementTwitter' : function(obj) {
    let headline = obj.headline,
      content = obj.content;

    T.post('statuses/update', { status: headline + '\n' + content}, function(err, data, response) {
      console.log(data)
    });
  },
  'postImageAnnouncementTwitter' : function(obj) {
    let fs = require('fs');
    // post a tweet with media
    //let b64content = fs.readFileSync('/Documents/TestFacebookAPI/facebookapi/public/images/stock1.jpg', { encoding: 'base64' });

    let getBase64Data = function(doc, callback) {
       let buffer = new Buffer(0);
       // callback has the form function (err, res) {}
       let readStream = doc.createReadStream();
       readStream.on('data', function(chunk) {
           buffer = Buffer.concat([buffer, chunk]);
       });
       readStream.on('error', function(err) {
           callback(err, null);
       });
       readStream.on('end', function() {
           // done
           callback(null, buffer.toString('base64'));
       });
   };
   let getBase64DataSync = Meteor.wrapAsync(getBase64Data);

   let file = Images.findOne({'_id': obj.imgId});
   getBase64DataSync(file, function(err, b64content) {
      // first we must post the media to Twitter
      T.post('media/upload', { media_data: b64content }, function (err, data, response) {

        // now we can reference the media and post a tweet (media will attach to the tweet)
        let mediaIdStr = data.media_id_string
        let params = { status: obj.headline, media_ids: [mediaIdStr] }

        T.post('statuses/update', params, function (err, data, response) {
          console.log(data);
        });
      });
   })
  },
  'postTextImageAnnouncementTwitter' : function(obj) {
     let getBase64Data = function(doc, callback) {
       let buffer = new Buffer(0);
       // callback has the form function (err, res) {}
       let readStream = doc.createReadStream();
       readStream.on('data', function(chunk) {
            buffer = Buffer.concat([buffer, chunk]);
       });
       readStream.on('error', function(err) {
            callback(err, null);
       });
       readStream.on('end', function() {
            // done
            callback(null, buffer.toString('base64'));
       });
   };
   let getBase64DataSync = Meteor.wrapAsync(getBase64Data);

   let file = Images.findOne({'_id': obj.imgId});
   getBase64DataSync(file, function(err, b64content) {
      // first we must post the media to Twitter
      T.post('media/upload', { media_data: b64content }, function (err, data, response) {

         // now we can reference the media and post a tweet (media will attach to the tweet)
         let mediaIdStr = data.media_id_string
         let params = { status: obj.content, media_ids: [mediaIdStr] }

         T.post('statuses/update', params, function (err, data, response) {
          console.log(data);
         });
      });
   })
   }
})
