/** 
 * Setup for use of search in algolia database.
 * 
 * Author: Daniel Wu
 * */

// api key that connects the client side to Algolia's server
const client = AlgoliaSearch("MASKED", "MASKED_KEY");

// select indice (collection) of data to be accesed. In this case it would be the announcements
const index = client.initIndex('announcement');

//function to search for announcements with a keyword
searchPost = function (keyword) {

    //performs the search in algolia database in indice announcement
    index.search(keyword, function searchDone(err, content) {

        //error catch (server down, or algolia issue)
        if (err) {
            console.error('Algolia returned an error', err);
        } else {

            //retrieves number of results in content.nbHits
            console.log('Received ' + content.nbHits + ' results.');

            //Spits out list of announcements with the keyword
            Session.set('searchContent', content);
        }
    });
}