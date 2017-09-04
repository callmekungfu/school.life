/**
* Created by Yonglin Wang on 8/4/2017.
*/

import { Images } from '../../api/images/images.js';

import './editor.html';
let operationStack = ['.editor-open'];
let hasUnsplash = false;
Template.editor.onRendered(function (){
    $(document).ready(function () {
        $('.category-select').select2({
            placeholder: "Click to select matching categories",
            allowClear: true
        });
        $('.visibility-select').select2({
            placeholder: "Click to select the scope of this post",
        });
        $('.input-daterange').datepicker({
            startDate: '+0d'
        });
        $('.input-date').datepicker({
            startDate: '+0d'
        });
    });
    let $editor = $('.editable');
    $editor.froalaEditor({
        scaytAutoload: false,
        //This setting can be completely ignored.
        scaytOptions: {
            enableOnTouchDevices: false,
            localization:'en',
            extraModules: 'ui',
            DefaultSelection: 'American English',
            spellcheckLang: 'en_US',
            contextMenuSections: 'suggest|moresuggest',
            serviceProtocol: 'https',
            servicePort:'80',
            serviceHost:'svc.webspellchecker.net',
            servicePath:'spellcheck/script/ssrv.cgi',
            contextMenuForMisspelledOnly: true,
            scriptPath: 'https://demo.webspellchecker.net/froala/customscayt.js'
        },
        //ignore end
        toolbarButtons: ['fullscreen','|', 'paragraphFormat', 'bold', 'italic', 'underline', 'strikeThrough', 'subscript', 'superscript', '|', 'align', 'formatOL', 'formatUL', 'outdent', 'indent', 'quote', '-', 'insertLink', 'insertImage', 'insertFile', 'insertVideo', 'insertTable', '|', 'emoticons', 'specialCharacters', 'insertHR', '|', 'print', 'help', '|', 'undo', 'redo'],
        toolbarButtonsSM: ['fullscreen', '|', 'bold', 'italic', 'underline', '|', 'paragraphFormat', 'align', 'formatOL', 'formatUL', 'outdent', 'indent', 'quote', '-', 'insertLink', 'insertImage', 'insertFile', 'insertVideo', 'insertTable', '|',  'specialCharacters', 'insertHR', 'selectAll', 'clearFormatting', '|', 'print', 'help', '|', 'undo', 'redo'],
        placeholderText: 'Tell your story here...',
        tableStyles: {
            class1: 'table',
        },
        paragraphFormat: {
            N: 'Normal',
            H2: 'Title',
            PRE: 'Code'
        },
        fileAllowedTypes: ['application/pdf', 'application/msword']
    });
    $editor.on('froalaEditor.image.beforeUpload', function (e, editor, images) {
        let self = $(this);

        Images.insert(images[0], function (err, fileObj) {
            //console.log("editor ",  editor);
            //console.log("after insert:", fileObj._id);
            Tracker.autorun(function (c) {
                fileObj = Images.findOne(fileObj._id);
                let url = fileObj.url();
                if (url) {
                    let imgList = $('img.fr-fic');
                    self.froalaEditor('image.insert', url, true);
                    imgList[imgList.length-1].remove();
                    return {
                        link: url
                    };
                }
            });
        });
    });
    if (Meteor.isClient){
       let arrayOfImageIds = [];
       Dropzone.autoDiscover = false;
       $(".tags").tagsinput('items');
       let blogDrop = initDropZone('dropzone',{
          number:1,
          size: 8,
          message: "Drop an image here to be the featured image, or click to select an image using the browser.",
       });
       let suggestionDrop = initDropZone('suggestionImage',{
          number:1,
          size: 8
       });
       let announcementDrop = initDropZone("announcementImage", {
          number:1,
          size: 8,
          message: "Drop your poster here, or click to select an image using the browser.",
       });
       let announcementImageTwo = new Dropzone("#announcementImageTwo", {
          number:1,
          size: 8,
          message: "Drop your poster here, or click to select an image using the browser."
       });
    }
});
Template.announcementOptions.onRendered(function () {
   this.$(".announce-tags").tagsinput('items');
});


/* Events */
Template.editor.events({
   'click #openEditor': function () {
      swapElements('.editor-open', '.editor-main');
      if(operationStack.length === 1){
         operationStack.push('.blog-intro');
      }
      $('html, body').css({
         overflow: 'hidden'
      }); // Disables the Scrolling
   },
   'click #startNewDraft': function () {
      swapElements('.blog-intro','.post-type');
      operationStack.push('.post-type');
   },
   'click #checkDrafts': function () {
      swapElements('.blog-intro', '.blog-drafts');
      operationStack.push('.blog-drafts');
   },
   'click #startBlog': function () {
      swapElements('.post-type', '.blog-editor');
      operationStack.push('.blog-editor');
      Session.set('announcementType', 'blog');
   },
   'click #startAnnouncement': function () {
      swapElements('.post-type', '.announcement-menu');
      operationStack.push('.announcement-menu');
   },
   'click #startSuggestion': function () {
      swapElements('.post-type', '.suggestions');
      operationStack.push('.suggestions');
      Session.set('announcementType', 'suggestion');
   },
   'click .editor-close': function () {
      swapElements('.editor-main', '.editor-open');
      $('html, body').css({
         overflow: 'visible'
      }); // Disables the Scrolling
   },
   'click .editor-back': function () {
      if(operationStack.length-2 === 0){
         swapElements('.editor-main','.editor-open');
         $('html, body').css({
            overflow: 'visible'
         }); // Enables the Scrolling
      }else{
         swapElements(operationStack[operationStack.length-1],operationStack[operationStack.length-2]);
      }
      operationStack.pop();
   },
   'click #imageOnly': function () {
      swapElements('.announcement-menu', '.image-only');
      operationStack.push('.image-only');
      Session.set('announcementType', 'imageOnly');
   },
   'click #textOnly': function () {
      swapElements('.announcement-menu', '.text-only');
      operationStack.push('.text-only');
      Session.set('announcementType', 'textOnly');
   },
   'click #textAndImage': function () {
      swapElements('.announcement-menu', '.text-and-image');
      operationStack.push('.text-and-image');
      Session.set('announcementType', 'textAndImage');
   },
   'input .announcement-text': function (evt) {
      let maxlength = $(evt.target).attr("maxlength");
      let length = $(evt.target).val().length;

      if( length >= maxlength ){
         console.log("You have reached the maximum number of characters.");
         $('.announcement-counter').text(0);
      }else{
         $('.announcement-counter').text(maxlength - length);
      }
   },
   'click .priority-toggle': function (evt) {
      let priority = $(evt.target).attr('data-priority');
      $('.is-checked').removeClass('is-checked');
      $(evt.target).addClass('is-checked');
      Session.set('priority', priority);
   },
   'click .publish' : function(event, template) {
      let title = $('#blogTitle').val() + " (This is a preview)";
      let subtitle = $('#blogSubTitle').val();
      let content = $('.editable').froalaEditor('html.get');
      let str = $(".tags").val();
      let separators = [' , ', ', ', ',', ' ,'];
      let tags = str.split(new RegExp(separators.join('|'), 'g'));
      let imgId = (hasUnsplash) ? Session.get('unsplash_img') : Session.get('newImageId');
      let releaseDate = $('.input-date').val();
      let draftedDate = new Date();
      let categories = $('.category-select').val();
      let authorId = Meteor.userId();
      let imageFirst = null;
      //meta
      let visibility = $('visibility-select').val();

      let json = {
         type: 'blog',
         releaseDate: releaseDate,
         draftedDate: draftedDate,
         editable: editable,
         title: title,
         subtitle: subtitle,
         content: content,
         tags: tags,
         categories: categories,
         imgId: imgId,
         meta: {
            imageFirst: imageFirst,
            hasUnsplash: hasUnsplash,
            visibility: visibility
         }
      }
   },
   'click #getFeaturedUnsplash': function (evt, template) {
      $('#unsplashPrompt').html("<i class='fa fa-spinner fa-pulse fa-fw'></i> Please Wait...");
      Meteor.call('setupUnsplash', function (err) {
         if(err){
            console.log(err);
         }else{
            Meteor.call('searchKeyword', "nature",function (err,data) {
               if(err){
                  console.log(err);
                  $('#unsplashPrompt').html("Sorry... We failed to find an image for you. Please upload one.");
               }else{
                  console.log(data);
                  let num = getRandomInt(0,9);
                  Session.set('unsplash_img', data.results[num].id);
                  hasUnsplash = true;
                  $('#dropzone').replaceWith("<img src='"+data.results[num].urls.regular+"' class='img-responsive unsplash-container'/>");
                  $('#unsplashPrompt').html("Here you go! This will be your featured image, if you want another one <a href='' id='newUnsplash'>Click Here</a>");
               }
            })
         }
      })
   },
   'click #newUnsplash': function () {
      $('#unsplashPrompt').html("<i class='fa fa-spinner fa-pulse fa-fw'></i> Please Wait...");
      Meteor.call('getRandomPhoto',function (err,data) {
         if(err){
            console.log(err);
            $('.unsplash-container').replaceWith("<form action='/file-upload' class='dropzone' id='dropzone'></form>");
            $('#unsplashPrompt').html("Sorry... We failed to find an image for you. Please upload one instead.");
         }else{
            console.log(data);
            Session.set('unsplash_img', data.id);
            $('.unsplash-container').replaceWith("<img src='"+data.urls.regular+"' class='img-responsive unsplash-container'/>");
            $('#unsplashPrompt').html("Here you go! Want a differnt one? <a href='' id='newUnsplash'>Click Here</a>. Changed your mind? click here to upload a new image");
         }
      })
   },
   'click .btn-preview': function () {
      let imageID = (hasUnsplash) ? Session.get('unsplash_img') : Session.get('newImageId');
      let previewPost = {
         title: $('#blogTitle').val() + " (This is a preview)",
         subtitle: $('#blogSubTitle').val(),
         content: $('.editable').froalaEditor('html.get'),
         tags: $(".tags").val(),
         featured: imageID,
         hasUnsplash: hasUnsplash
      };
      console.log(imageID);
      Session.setPersistent('preview_json', previewPost);
      $('html, body').css({
         overflow: 'visible'
      }); // Disables the Scrolling
      window.open('/blog/preview', '_blank');
   }
});
Template.announcementOptions.events({
   'click .btn-post': function (event, template) {
      let type = Session.get('announcementType');
      console.log('submitting ' + type);

      if (type === "imageOnly") {
         let headline = $('#imageOnlyHeadline').val();
         let imgId = Session.get('newImageId');
         let separators = [' , ', ', ', ',', ' ,'];
         let tags = $(".announce-tags")[0].value.split(new RegExp(separators.join('|'), 'g'));
         let options = $('.category-select')[1].options;
         let categories = [];
         for (let i = 0; i < options.length; i++) {
            let opt = options[i];
            if (opt.selected) {
               categories.push(opt.value);
            }
         }
         let authorId = Meteor.userId();
         let startDate = $('.startDate')[0].value;
         let endDate = $('.endDate')[0].value;
         let draftedDate = new Date();

         //meta

         if (!imgId) {
            alertError('Post Incomplete!', "You haven't uploaded an image yet!")
         }
         if (!headline) {
            //TODO
            alertError('Post Incomplete!', "You haven't added a headline!")
         }

         let json = {
            author: authorId,
            type: 'announcement',
            subType: 'imageOnly',
            startDate: startDate,
            endDate: endDate,
            draftedDate: draftedDate,
            headline: headline,
            tags: tags,
            categories: categories,
            imgId: imgId,
            meta: {
               hasUnsplash: hasUnsplash,
            }
         };

         Meteor.call('postImage', json, function (err) {
            if(err){
               alertError('Post Failed!', err.message);
            }else{
               alertSuccess('Success!', 'The post has been submitted.');

               if(operationStack.length-2 === 0){
                  swapElements('.editor-main','.editor-open');
                  $('html, body').css({
                     overflow: 'visible'
                  }); // Enables the Scrolling
               }else{
                  swapElements(operationStack[operationStack.length-1],operationStack[operationStack.length-2]);
               }
               operationStack.pop();
            }
         });

      } else if (type === "textOnly") {
         let headline = $('#textOnlyHeadline').val();
         let content = $('.announcement-text')[0].value;
         let str = $(".announce-tags")[1].value;
         let separators = [' , ', ', ', ',', ' ,'];
         let tags = str.split(new RegExp(separators.join('|'), 'g'));

         let options = $('.category-select')[2].options;
         let categories = [];

         for (let i = 0; i < options.length; i++) {
            let opt = options[i];
            if (opt.selected) {
               categories.push(opt.value);
            }
         }

         let authorId = Meteor.userId();
         let startDate = $('.startDate')[1].value;
         let endDate = $('.endDate')[1].value;
         let draftedDate = new Date();

         //meta

         if (!headline) {
            //TODO
            console.log('No headline entered');
         }
         if (!content) {
            //TODO
            console.log('No content entered')
         }

         let json = {
            author: authorId,
            type: 'announcement',
            subType: 'textOnly',
            startDate: startDate,
            endDate: endDate,
            draftedDate: draftedDate,
            headline: headline,
            content: content,
            tags: tags,
            categories: categories,
            meta: {
               hasUnsplash: hasUnsplash,
            }
         };

         Meteor.call('postText', json, function (err) {
            if(err){
               alertError('Post Failed!', err.message);
            }else{
               alertSuccess('Success!', 'The post has been submitted.');
               if(operationStack.length-2 === 0){
                  swapElements('.editor-main','.editor-open');
                  $('html, body').css({
                     overflow: 'visible'
                  }); // Enables the Scrolling
               }else{
                  swapElements(operationStack[operationStack.length-1],operationStack[operationStack.length-2]);
               }
               operationStack.pop();
            }
         });
      } else if (type === 'textAndImage'){
         let headline = $('#textImageHeadline').val();
         let content = $('.announcement-text')[1].value;
         let imgId = Session.get('newImageId');
         let str = $(".announce-tags")[2].value;
         let separators = [' , ', ', ', ',', ' ,'];
         let tags = str.split(new RegExp(separators.join('|'), 'g'));

         let options = $('.category-select')[3].options;
         let categories = [];

         for (let i = 0; i < options.length; i++) {
            let opt = options[i];
            if (opt.selected) {
               categories.push(opt.value);
            }
         }

         let authorId = Meteor.userId();
         let startDate = $('.startDate')[2].value;
         let endDate = $('.endDate')[2].value;
         let draftedDate = new Date();

         //meta
         let priority = Session.get('priority');

         if (!imgId) {
            //TODO
            console.log('No image uploaded');
         }
         if (!headline) {
            //TODO
            console.log('No headline entered');
         }
         if (!content) {
            //TODO
            console.log('No content entered')
         }

         let json = {
            author: authorId,
            type: 'announcement',
            subType: 'imageText',
            headline: headline,
            content: content,
            startDate: startDate,
            endDate: endDate,
            draftedDate: draftedDate,
            tags: tags,
            categories: categories,
            imgId: imgId,
            meta: {
               priority: priority,
               hasUnsplash: hasUnsplash,
            }
         };
         Meteor.call('postImageText', json, function (err) {
            console.log('posted');
            if(err){
               alertError('Post Failed!', err.message);
            }else{
               alertSuccess('Success!', 'The post has been submitted.');
               if(operationStack.length-2 === 0){
                  swapElements('.editor-main','.editor-open');
                  $('html, body').css({
                     overflow: 'visible'
                  }); // Enables the Scrolling
               }else{
                  swapElements(operationStack[operationStack.length-1],operationStack[operationStack.length-2]);
               }
               operationStack.pop();
            }
         });
      }
   }
});

Template.suggestionEditor.events({
   'click .btn-post' : function() {
      let headline = $('#suggestionHeadline').val();
      let content = $('.announcement-text')[2].value;
      let imgId = Session.get('newImageId');

      let authorId = Meteor.userId();
      let draftedDate = new Date();

      if (!imgId) {
         //TODO
         console.log('No image uploaded');
      }
      if (!headline) {
         //TODO
         console.log('No headline entered');
      }
      if (!content) {
         //TODO
         console.log('No content entered')
      }

      let json = {
         author: authorId,
         type: 'suggestion',
         headline: headline,
         content: content,
         draftedDate: draftedDate,
         imgId: imgId
      };
      console.log(json);

      Meteor.call('postSuggestion', json, function (err) {
         console.log('posted');
         if(err){
            alertError('Post Failed!', err.message);
         }else{
            alertSuccess('Success!', 'The post has been submitted.');
            if(operationStack.length-2 === 0){
               swapElements('.editor-main','.editor-open');
               $('html, body').css({
                  overflow: 'visible'
               }); // Enables the Scrolling
            }else{
               swapElements(operationStack[operationStack.length-1],operationStack[operationStack.length-2]);
            }
            operationStack.pop();
         }
      });
   }
});

function initDropZone(id, info){
   return new Dropzone("form#"+id, {
      maxFiles:info.number || 1,
      maxFilesize: info.size || 8,
      thumbnailWidth: 400,
      dictDefaultMessage: info.message || "Drop your image here, or click to select an image using the browser.",
      accept: function(file, done){
         let FSFile = new FS.File(file);
         
         Images.insert(FSFile, function (err, fileObj) {
            if (err){
               console.log(err);
            } else {
               //remove the currently uploaded image
               //if there is none, this will not do anything
               Images.remove({_id:Session.get('newImageId')}, function(err) {
                  if(err) {
                     console.log("error removing image:\n" + err);
                  }
               });
               //retreive file extension
               hasUnsplash = false;
               Session.set('newFileType', fileObj.extension());   //update the file type
               Session.set('newImageId', fileObj._id); //update the image id to current image
               done();
            }
         });
      }
   });
}
function swapElements(a,b){
   $(a).fadeOut('fast', function () {
      $(b).fadeIn("slow");
   });
}
function getRandomInt(min, max) {
   return Math.floor(Math.random() * (max - min + 1)) + min;
}
