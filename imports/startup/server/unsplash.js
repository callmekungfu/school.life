import {
    Meteor
} from 'meteor/meteor';
import Unsplash, {
    toJson
} from 'unsplash-js';

/** 
 * Meteor methods used to interact with Unsplash API
*/
Meteor.methods({
    'setupUnsplash': function () {
        unsplash = new Unsplash({
            applicationId: "MASKED",
            secret: "MASKED",
            callbackUrl: "localhost:3000"
        });
    },
    'searchKeyword': function (key) {
        return unsplash.search.photos(key, 1, 10)
            .then(toJson)
            .then(json => {
                return json;
            });
    },
    'getRandomPhoto': function () {
        return unsplash.photos.getRandomPhoto()
            .then(toJson)
            .then(json => {
                return json;
            });
    },
    'getPhoto': function (id) {
        return unsplash.photos.getPhoto(id)
            .then(toJson)
            .then(json => {
                return json;
            });
    }
});