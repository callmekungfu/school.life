import { Session } from 'meteor/session'
import { FlowRouter } from 'meteor/kadira:flow-router';
import { BlazeLayout } from 'meteor/kadira:blaze-layout';

FlowRouter.route( '/', {
    action: function() {
        var authentication = 0;
        //parseInt(Cookie.get('auth'));
        if(authentication != 1){
            Session.set("DocumentTitle","Welcome to uhs.life");
            BlazeLayout.render( 'applicationLayout', { main: 'base' } );
        }else{
            BlazeLayout.render( 'applicationLayout', { main: 'overview' } );
        }
    },
    name: 'home' // Optional route name.
});

FlowRouter.route( '/login', {
    action: function() {
        var authentication = 0;
            //parseInt(Cookie.get('auth'));
        if(authentication != 1){
            Session.set("DocumentTitle","Please Login - uhs.life");
            BlazeLayout.render( 'applicationLayout', { main: 'login' } );
        }else{
            BlazeLayout.render( 'applicationLayout', { main: 'overview' } );
        }
    },
    name: 'login' // Optional route name.
});

FlowRouter.route( '/signup', {
    action: function() {
        var authentication = 0;
        //parseInt(Cookie.get('auth'));
        if(authentication != 1){
            Session.set("DocumentTitle","Please Login - uhs.life");
            BlazeLayout.render( 'applicationLayout', { main: 'signup' } );
        }else{
            BlazeLayout.render( 'applicationLayout', { main: 'overview' } );
        }
    },
    name: 'login' // Optional route name.
});

FlowRouter.route( '/home', {
    action: function() {
        var authentication = 0;
        //parseInt(Cookie.get('auth'));
        if(authentication != 1){
            BlazeLayout.render( 'applicationLayout', { main: 'home' } );
        }else{
            BlazeLayout.render( 'applicationLayout', { main: 'overview' } );
        }
    },
    name: 'login' // Optional route name.
});