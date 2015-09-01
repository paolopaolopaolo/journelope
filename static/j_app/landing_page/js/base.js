var LandingPage = function () {

  // @desc: Runs $.fn.imgTxtHybrid() on Textbox
  // @params: None
  // @returns: None
  this._imtifyTextBox = function () {
    this.$text_box.imgTxtHybrid({imagecss: {borderRadius: '5px', cursor: 'grab'}});
    this.$text_box.empty();
  };


  // @desc: Saves what is in text_box to local storage
  // @params: None
  // @returns: None
  this._saveToLocalStorage = function () {
    if (localStorage.getItem('demo-entry-text') !== null || 
        localStorage.getItem('demo-entry-img') !== null) {
      localStorage.clear();
    }
    localStorage.setItem('demo-entry-text', this.$text_box.stringConvHTMLtoJS());
    localStorage.setItem('demo-entry-img', JSON.stringify(this.$text_box.imgSrc()));
    
  };

  // @desc: Creates event bound to $send_button that
  //        submits the contents of $text_box to localStorage
  //        and then navigates over to user auth page
  // @params: None
  // @returns: None
  this._setSendBehavior = function () {
    this.$send_button.on('click', function (event) {
      this._saveToLocalStorage();
    }.bind(this));

  };

  // @desc: Sets jQuery objects in the page
  // @params: None
  // @returns: None
  this._setEntities = function () {
    this.$send_button = $('.save-sample-text');
    this.$text_box = $('.sample-text-input');

  };

  // @desc: If localStorage has data, preset the Text Box with stuff
  // @params: None
  // @returns: None
  this._presetTextbox = function () {
    var img, imgs, text;
    if (localStorage.getItem('demo-entry-text') !== null && 
        localStorage.getItem('demo-entry-img') !== null) {
      text = localStorage.getItem('demo-entry-text');
      imgs = JSON.parse(localStorage.getItem('demo-entry-img'));
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

  // @desc: Initializes JS portion of Landing Page 
  // @params: None
  // @returns: None
  this.initialize = function () {
    this._setEntities();
    this._imtifyTextBox();
    this._presetTextbox();
    this._setSendBehavior();
  };
};

$(document).ready(function () {
  TopLevelApplication.LandingPageView = new LandingPage();
  TopLevelApplication.LandingPageView.initialize();
});