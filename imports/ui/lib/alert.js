/** 
 * This library contains dialogues options used to communicate with users.
 * 
 * The alerts are powered by a Meteor library called Bootbox. Boot box library uses Bootstrap
 * modals as the platform for more intuitive alerts than the default options provided by browsers
 * 
 * Author: Yong Lin Wang
 * Created: 8/8/2017
 * */

alertError = function (title, body) {
    bootbox.alert({
        title: "<i class='fa fa-5x fa-times-circle-o'></i>",
        message: "<h3>"+title+"</h3><p>"+ body +"</p>",
        buttons: {
            ok:{
                label:"Got it",
                className: 'btn-confirm'
            }
        }
    });
};

alertSuccess = function (title, body) {
    bootbox.alert({
        title: "<i class='fa fa-5x fa-check-circle-o'></i>",
        message: "<h3>"+title+"</h3><p>"+ body +"</p>",
        buttons: {
            ok:{
                label:"Got it",
                className: 'btn-confirm'
            }
        }
    });
    $(".modal-header").css('background','#4caf50');
    $(".btn-confirm").css('background','#4caf50');
};

alertConfirm = function (title, body, callback) {
    bootbox.confirm({
        title: "<i class='fa fa-5x fa-question-circle-o'></i>",
        message: "<h3>"+title+"</h3><p>"+ body +"</p>",
        buttons: {
            confirm: {
                label: 'Yes I\'m Sure',
                className: 'btn-success'
            },
            cancel: {
                label: 'No, I\'m Not',
                className: 'btn-grey'
            }
        },
        callback: function (result) {
            callback(result);
        }
    });
    $(".modal-header").css('background','#2196F3');
};

alertPrompt = function (title, callback) {
    bootbox.prompt({
        title: title,
        inputType: 'textarea',
        callback: function (result) {
            callback(result)
        }
    });
};