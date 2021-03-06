/**
 * This file provides definitions for client layout routing. 
 * */

const loggedIn = FlowRouter.group({
    triggersEnter: [
        function () {
            let route;
            Session.set("DocumentTitle","UHS Life - Crafted By Students, For Everyone");
            if (!(Meteor.loggingIn() || Meteor.userId())){
                route = FlowRouter.current();
                Session.set('redirectAfterLogin', route.path);
                console.log(Session.get('redirectAfterLogin'));
                FlowRouter.go('/login');
            }else{
                Tracker.autorun(function () {
                    let userSub = Meteor.subscribe('allUsers');
                    let thisUser = Meteor.subscribe('theUser');
                    if(thisUser.ready() && userSub.ready()){
                        let user = Meteor.user();
                        Session.setPersistent('inDash', false);
                        if(!user.profile.init){
                            Meteor.call('accounts.initRoles');
                            FlowRouter.go('/welcome');
                        }else{
                            Session.setPersistent('name', user.services.google.name);
                            Session.setPersistent('accessToken', user.services.google.accessToken);
                            Session.setPersistent('refreshToken', user.services.google.refreshToken);
                            if(Roles.userIsInRole(Meteor.userId(),'student')){
                                try{
                                    Session.setPersistent('courses',user.private.courses);
                                    Session.setPersistent('token',user.private.token);
                                    Session.setPersistent('tokenExpiry',user.private.tokenDate);
                                }catch(e){
                                    console.log('Teach Assist Credentials Not Yet Added');
                                }
                            }
                            Session.set('user_img', user.services.google.picture);
                        }
                    }
                });
            }
        }
    ]
});

let admin = FlowRouter.group({
    triggersEnter: [
        function () {
            let route;
            if (!(Meteor.loggingIn() || Meteor.userId())){
                route = FlowRouter.current();
                Session.set('redirectAfterLogin', route.path);
                console.log(Session.get('redirectAfterLogin'));
                FlowRouter.go('/login');
            }else{
                Session.setPersistent('inDash', true);
                Tracker.autorun(function () {
                    let userSub = Meteor.subscribe('allUsers');
                    let user = Meteor.user();
                    let thisUser = Meteor.subscribe('theUser');
                    if(user && userSub.ready()){
                        if(!user.profile.init){
                            Meteor.call('accounts.initRoles');
                            FlowRouter.go('/welcome');
                        }else{
                            Session.setPersistent('name', user.services.google.name);
                            Session.setPersistent('accessToken', user.services.google.accessToken);
                            Session.setPersistent('refreshToken', user.services.google.refreshToken);
                            if(Roles.userIsInRole(Meteor.userId(),'student')){
                                try{
                                    Session.setPersistent('courses',user.private.courses);
                                    Session.setPersistent('token',user.private.token);
                                    Session.setPersistent('tokenExpiry',user.private.tokenDate);
                                }catch(e){
                                    console.log('Teach Assist Credentials Not Yet Added');
                                }
                            }
                            Session.set('user_img', user.services.google.picture);
                        }
                        if(!Roles.userIsInRole(user._id, 'admin')){
                            alertError('Sorry', "You do not have access to this area.");
                            FlowRouter.go('/');
                        }
                    }
                });
            }
        }
    ]
});

admin.route('/dashboard/users', {
    action: function () {
        Session.set("DocumentTitle","Users - Administrative Dashboard | uhs.life");
        BlazeLayout.render('dashboard',{dash: 'dashUsers'});
    }
});

admin.route('/dashboard/announcements', {
    action: function () {
        Session.set("DocumentTitle","All Announcements - Administrative Dashboard | uhs.life");
        BlazeLayout.render('dashboard',{dash: 'dashAnnouncements'});
    }
});

admin.route('/dashboard/categories', {
    action: function () {
        Session.set("DocumentTitle","Categories - Administrative Dashboard | uhs.life");
        BlazeLayout.render('dashboard',{dash: 'dashCategories'});
    }
});

admin.route('/dashboard/organizations', {
    action: function () {
        Session.set("DocumentTitle","Organizations - Administrative Dashboard | uhs.life");
        BlazeLayout.render('dashboard',{dash: 'dashOrganizations'});
    }
});

admin.route('/dashboard/suggestions', {
    action: function () {
        Session.set("DocumentTitle","Suggestions - Administrative Dashboard | uhs.life");
        BlazeLayout.render('dashboard',{dash: 'dashSuggestions'});
    }
});

FlowRouter.route('/login',{
    waitOn: function(){
        setTimeout(function() {
            Accounts.loginServicesConfigured();
        },500);
    },
    action: function(){
        if(!Meteor.userId()){
            Session.set('redirectAfterLogin', '/');
            Session.set("DocumentTitle","Please Login | uhs.life");
            BlazeLayout.render('applicationLayout', {main: 'login'});
        }else{
            FlowRouter.go('/');
        }
    },
    name: 'login'
});

FlowRouter.route('/privacy', {
    action: function () {
        Session.set('DocumentTitle', 'Privacy Policy of Uhs.life');
        BlazeLayout.render('applicationLayout', {main: 'legal'});
    }
});

FlowRouter.route('/android', {
    action: function () {
        window.location = 'https://play.google.com/store/apps/details?id=com.life.uhs&hl=en';
    }
});

loggedIn.route('/stories',{
    action: function () {
        BlazeLayout.render('applicationLayout',{main: 'blogs'});
    }
});

loggedIn.route('/sandbox',{
    action: function () {
        BlazeLayout.render('applicationLayout',{main: 'sandbox'});
    },
    name: 'sandbox'
});

loggedIn.route('/show-checkout',{
    action: function () {
        BlazeLayout.render('applicationLayout',{main: 'showCheckout'});
    },
});

loggedIn.route('/booking-admin',{
    action: function () {
        Session.set("DocumentTitle","Booking Dashboard | uhs.life");
        BlazeLayout.render('bookingAdminMain',{booking: 'bookingHome'});
    },
    name: 'Booking Admin'
});
loggedIn.route('/booking-admin/sellers',{
    action: function () {
        Session.set("DocumentTitle","Booking Dashboard | uhs.life");
        BlazeLayout.render('bookingAdminMain',{booking: 'bookingSellers'});
    },
    name: 'Booking Admin'
});

loggedIn.route('/booking-admin/:showID',{
    action: function (params) {
        Session.set("DocumentTitle","Booking Dashboard | uhs.life");
        Session.set('workingShow', params.showID);
        BlazeLayout.render('bookingAdminMain', {booking: 'bookingDetails'});
    },
    name: 'Booking Admin'
});

loggedIn.route('/profile',{
    action: function () {
        Session.set('DocumentTitle', 'Your Profile | uhs.life');
        BlazeLayout.render('applicationLayout',{main: 'profile'});
    },
    name: 'profile'
});

loggedIn.route('/calendar',{
    action: function() {
        Session.set('DocumentTitle','School Calendar');
        BlazeLayout.render('applicationLayout', {
            main: 'calendar'
        });
    },
    name: 'calendar'
});

loggedIn.route('/blog/:postId',{
    action: function (params) {
        if(params.postId === 'preview'){
            Session.setPersistent('post_data', Session.get('preview_json'));
        }else{
            Tracker.autorun(function () {
                let post = Posts.findOne({_id: params.postId});
                if(post){
                    Session.set("DocumentTitle", post.title + " | uhs.life");
                    Session.setPersistent('post_data', post);
                }
            });
        }
        window.scrollTo(0, 0);
        BlazeLayout.render('applicationLayout',{main: 'details'});
    }
});

admin.route('/dashboard',{
    action: function () {
        Session.set("DocumentTitle","Administrative Dashboard | uhs.life");
        BlazeLayout.render('dashboard',{dash: 'dashHome'});
    }
});

loggedIn.route('/course/:courseId',{
    action: function (params) {
        let tokenJson = Session.get('token');
        console.log(tokenJson);
        tokenJson.subject_id = params.courseId;
        Meteor.call('getTeachAssistCourseDetails', tokenJson, function (err, data) {
            if(err || data.ERROR){
                if(err.error === 400){
                    Modal.show('teachAssistPass');
                }else{
                    alertError('Something went wrong', 'We are having problems talking to teach assist. You can visit ta.yrdsb.ca for more details on your mark.');
                }
            }else{
                console.log(data);
                let a = Meteor.user().private.courses;
                console.log(a);
                let found;
                let entry;
                for (let index = 0; index < a.length; ++index) {
                    entry = a[index];
                    if (entry.subject_id === params.courseId) {
                        found = entry;
                        break;
                    }
                }
                Session.setPersistent('displayMark', found.mark);
                Session.setPersistent('courseData', data);
                window.scrollTo(0, 0);
                BlazeLayout.render('applicationLayout',{main: 'course'});
            }
        });
    },
    name: 'course'
});

loggedIn.route( '/big-picture', {
    action: function() {
        Session.set('DocumentTitle', 'Big Picture Mode | uhs.life');
        BlazeLayout.render('applicationLayout', {main: 'bigPicture'});
    },
    name: 'bigPicture'
});

loggedIn.route( '/', {
    action: function() {
        Session.set("DocumentTitle", "Stream | uhs.life");
        BlazeLayout.render('applicationLayout', {main: 'stream'});
    },
    name: 'root' 
});

loggedIn.route( '/stream', {
    action: function() {
        Session.set("DocumentTitle", "Stream | uhs.life");
        BlazeLayout.render('applicationLayout', {main: 'stream'});
    },
    name: 'stream' 
});

loggedIn.route('/logout',{
    action: () => {
        Session.set("DocumentTitle","Logging out...");
        Meteor.logout(function() {
            Session.clear();
            FlowRouter.go('/');
            if (Meteor.isCordova) {
                window.location.replace('https://accounts.google.com/Logout');
            }
        });
    },
    name: 'logout'
});

loggedIn.route('/welcome', {
    action: function () {
        Session.set("DocumentTitle","Welcome to uhs.life!");
        Tracker.autorun(function () {
            let user = Meteor.user();
            if(user){
                if(user.profile.init){
                    FlowRouter.go('/');
                }else{
                    BlazeLayout.render('applicationLayout',{main: 'firstTime'});
                }
            }
        });
    },
    name: 'first'
});

checkTokenExpiry = function () {
    const now = new Date();
    let diff = Math.abs(now - Session.get('tokenExpiry'));
    let minutes = Math.floor((diff/1000)/60);
    return minutes < 15;
};