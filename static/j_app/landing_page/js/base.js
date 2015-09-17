var LandingPage = function () {

  // @desc: Create GUID (thanks, StackOverflow)
  // @params: None
  // @void: String
  this._generateGUID = function () {
    function s4() {
      return Math.floor((1 + Math.random()) * 0x10000)
                 .toString(16)
                 .substring(1);
      }
    return s4() + s4() + '-' + s4() + '-' + s4() + '-' +
    s4() + '-' + s4() + s4() + s4();
  },

  // @desc: Runs $.fn.imgTxtHybrid() on Textbox
  // @params: None
  // @returns: None
  this._imtifyTextBox = function () {
    this.$text_box.imgTxtHybrid({imagecss: {borderRadius: '5px', cursor: 'grab'}});
    this.$text_box.empty();
  };

  // @desc: Sets a cookie 'j_app_guid' that will be saved in database along with data
  // @params: None
  // @returns: None
  this._saveToLocalStorage = function () {
    var guid, $text_input, $img_input, $guid;
    guid = this._generateGUID();

    // Set cooke on front-end
    $.cookie('j_app_guid', guid);

    $guid = $('<input />').attr('type', 'hidden')
                          .attr('name', 'guid')
                          .attr('value', guid);
    
    $text_input = $('<input />').attr('type', 'hidden')
                                .attr('name', 'text')
                                .attr('value', this.$text_box.text());
    $img_input = $('<input />').attr('type', 'hidden')
                               .attr('name', 'imgs')
                               .attr('value', JSON.stringify(this.$text_box.imgSrc()));

    // Append inputs to form
    this.$form.append($text_input);
    this.$form.append($img_input);
    this.$form.append($guid);
  };

  // @desc: Creates event bound to $send_button that
  //        submits the contents of $text_box to localStorage
  //        and then navigates over to user auth page
  // @params: None
  // @returns: None
  this._setSendBehavior = function () {
    this.$send_button.on('click', function (event) {
      event.preventDefault();
      this._saveToLocalStorage();
      this.$form.submit();
    }.bind(this));
  };

  // @desc: Sets jQuery objects in the page
  // @params: None
  // @returns: None
  this._setEntities = function () {
    this.$form = $('.landing-page-form');
    this.$send_button = $('.save-sample-text');
    this.$text_box = $('.sample-text-input');
  };

  // @desc: If localStorage has data, preset the Text Box with stuff
  // @params: None
  // @returns: None
  this._presetTextbox = function () {
    var img, imgs, text;
    if (window.localStorage.getItem('demo-entry-text') !== null && 
        window.localStorage.getItem('demo-entry-img') !== null) {
      text = window.localStorage.getItem('demo-entry-text');
      imgs = JSON.parse(window.localStorage.getItem('demo-entry-img'));
      this.$text_box.html(stringConvJStoHTML(text));
      function identity(Obj) {
        return function () { return Obj;};
      };
      for (img in imgs) {
        if (imgs.hasOwnProperty(img)) {
          img = imgs[img];  
          createAndAppendImgDivs(
              identity(img.id),
              "data:image/png;base64," + img.data, 
              {
                top: img.top,
                left: img.left,
                height: img.height,
                width: img.width
              },
              this.$text_box);
          this.$text_box.refreshImgInteractions();
        }
      }
    }
  };

  // @desc: Initializes WOW reveal stuff
  // @params: None
  // @returns: None
  this._initializeWOWJS = function () {
    new WOW().init();
  };

  // @desc: Initializes JS portion of Landing Page 
  // @params: None
  // @returns: None
  this.initialize = function () {
    this._setEntities();
    this._imtifyTextBox();
    this._presetTextbox();
    this._setSendBehavior();
    this._initializeWOWJS();
  };
};

$(document).ready(function () {
  TopLevelApplication.LandingPageView = new LandingPage();
  TopLevelApplication.LandingPageView.initialize();
});