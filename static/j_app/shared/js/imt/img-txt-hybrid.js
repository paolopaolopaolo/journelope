/* 
  imgTxtHybrid jQuery Extension 
  author: Dean Mercado
*/

// Initialize GLOBAL SETTINGS variables and Browser Hack variables
var RESIZE_OBJECT_SETTINGS, IMG_SETTINGS, UtilityHiddenFunctions,
    is_firefox,
    is_chrome,
    is_explorer,
    is_Opera,
    is_safari;

// Determine browser hack
// FIND OUT HOW TO USE FEATURE DETECTION TO DIFFERENTIATE THE BELOW
is_chrome = navigator.userAgent.indexOf('Chrome') > -1;
is_explorer = window.hasOwnProperty("ActiveXObject");
is_firefox = navigator.userAgent.indexOf('Firefox') > -1;
is_safari = navigator.userAgent.indexOf("Safari") > -1;
is_Opera = navigator.userAgent.indexOf("Presto") > -1;
if (is_chrome && is_safari) {is_safari = false; }

// alert("is_chrome: " + is_chrome + "\n" +
//      "is_explorer: "+ is_explorer + "\n" +
//      "is_firefox: "+ is_firefox + "\n"+
//      "is_safari: " + is_safari + "\n" +
//      "is_Opera:" + is_Opera);


/////////////////////////////////////////////
// jQuery Extension Function Encapsulation //
/////////////////////////////////////////////

;
(function ($, doc, win) {
    "use strict";

    // Suppress default dragover and dragenter
    // behavior to prevent browser
    // reloading with just the image
    $.fn.suppressDefaults = function () {
        this.on("dragover", function (e) {
            e.stopPropagation();
            e.preventDefault();
        });
        this.on("dragenter", function (e) {
            e.stopPropagation();
            e.preventDefault();
        });
    };

    // Append a DELETE button to Drag and Drop Elements
    $.fn.attachDeleteButton = function () {
        // Set variables 
        var $TARGET, button, $button;
        // Set target as variable
        $TARGET = this;

        if (this.find(".delImg").length < 1) {
            // Create button jQuery object
            button = document.createElement('input');
            button.setAttribute('type', 'submit');
            button.setAttribute('value', 'X');
            button.setAttribute('class', 'delImg');
            $button = $(button);
            // Set element id of button
            $button.attr('id', 'delImg_' + $TARGET[0].id);

            // Set styling for button
            $button.css({
                'position': 'relative',
                'bottom': '99%',
                'float': 'right',
                'right': '1px',
                'display': 'none'
            });
            // Attach button to target element
            $TARGET.append($button);
        } else {
            $button = $("#" + 'delImg_' + $TARGET[0].id.replace(".", "\\."));
            console.log($button);
        }

        // Add event listener for hiding/showing button 
        $TARGET.hover(function () {
            $button.show();
        }, function () {
            $button.hide();
        });

        // Add event listener for deleting target element with button
        $button.on('click', function (event) {
            event.preventDefault();
            event.stopPropagation();
            $(this).parent().remove();
        });
    };

    // Helper Method: Appends soon-to-be interactive image to target element
    function createAndAppendImage(imgsrc, file, $TARGET) {
        // Function Variables 
        var $new_image_entity,
            $div_wrapper,
            new_div_entity,
            new_image_entity,
            final_width,
            final_height,
            target_height,
            randomized_id,
            randomized_id_2;

        // setup randomized ID
        randomized_id = Math.random()
                 .toString()
                 .slice(2);
        randomized_id_2 = Math.random()
                 .toString()
                 .slice(2);

        randomized_id +=  "_" + randomized_id_2;

        // Branch for HD Sourced Images, else Branch for Internet Sourced imgs
        if (file !== undefined) {
            // create new image and set src to base64 string
            new_image_entity = new Image();
            $new_image_entity = $(new_image_entity);
            $new_image_entity.attr('src', imgsrc);
        } else {
            // Create jquery new img entity 
            // off of imgsrc (which should be img tag)
            $new_image_entity = $(imgsrc);
        }

        // Wait for img to load before continuing everything else
        $new_image_entity[0].onload = function () {
            // Check img for errors, make alert
            if ($new_image_entity[0].width <= 0 || $new_image_entity[0].height <= 0) {
                alert('Upload Error! Try again\n');
                return false;
            }
            // Initialize and set styling for $div variable
            new_div_entity = doc.createElement('div');
            new_div_entity.setAttribute('contenteditable', 'false');
            new_div_entity.setAttribute('class', 'upload-image');
            $div_wrapper = $(new_div_entity);
            target_height = parseInt($TARGET.css('height').replace('px', ''), 10);

            // Automatically resize image if the image is larger than the container
            // "target" element
            if ($new_image_entity[0].height > target_height) {
                // set div height to half the container height
                final_height = target_height / 2;
                // set width, keeping h:w ratio constant
                final_width = ($new_image_entity[0].width / $new_image_entity[0].height) * final_height;
            } else {
                // propagate the same h:w sizes
                final_height = $new_image_entity[0].height;
                final_width = $new_image_entity[0].width;
            }


            // set styling for div wrapper
            $div_wrapper.css({
                'top': $TARGET.scrollTop().toString() + "px",
                'left': "10px",
                'width': final_width + "px",
                'height': final_height + "px"
            });
            // Set ID on div to random number (FIX TO INCREASE POSSIBLE COMBINATIONS)
            $div_wrapper.attr('id', randomized_id);
            // Apply object settings/ append img to div
            $div_wrapper.objectSettings(RESIZE_OBJECT_SETTINGS);
            $new_image_entity.objectSettings(IMG_SETTINGS);
            $div_wrapper.append($new_image_entity);
            // Enable div draggable and sizeable/ attach delete button
            $div_wrapper.imgInteract();
            // Attach div+img onto target element 
            $TARGET.append($div_wrapper);
        };
    }

    /* METHODS that handle the data transfer from various 
       upload techniques */

      // Helper Function: takes drop event and target 
      // and appends the image to the target
    function fileDropHandler(event, $TARGET) {
        var data,
            files,
            src,
            i;

        // Prevent default behavior from browser/ propagation
        event.preventDefault();
        event.stopPropagation();
        // Load data transfer array and set files variable
        // to the files in data array
        data = event.originalEvent.dataTransfer;
        files = data.files;

        if (files.length <= 0) {
            src = event.originalEvent.dataTransfer.getData("URL");
        }

        // Function for handling multiple read files
        function handleReadFile(file) {
            var readFile = new FileReader();
            // Set onload and error methods of FileReader
            // object to run the following routines:
            readFile.onload = function (event) {
                // Prevent default actions / propagation up the tree
                event.preventDefault();
                event.stopPropagation();
                createAndAppendImage(readFile.result,
                          file,
                          $TARGET,
                          RESIZE_OBJECT_SETTINGS,
                          IMG_SETTINGS);
            };
            // ... setting onError method
            readFile.onerror = function () {
                alert("Upload Failed! Try again.");
            };
            // Start loading the file
            readFile.readAsDataURL(file);
        }

        // IN_PROGRESS: Conditional branch for Internet sourced vs HD sourced images
        // if src !== undefined -- > internet sourced
        if (src !== undefined) {
            alert("Try copy-pasting the image instead!");
        } else {
            for (i = 0; i < files.length; i++) {
                handleReadFile(files[i]);
            }
        }
        $TARGET.attr('contenteditable', 'true');
    }

    // Helper Function: for handling img-paste events, takes event and target
    // and appends image to target
    function filePasteHandler(event, $TARGET) {
        // initialize variables
        var imgsrc,
            source,
            result,
            plaintext,
            img_format,
            base64_format,
            htmlfrag_format;

        // Set pattern for image file
        img_format = /[^\.\\\/?<>:*|"']*\.(jpg|jpeg|gif|png|bmp|tiff)*/gi;
        base64_format = /data:image\/[\w]+;base64,[^,\:\"]+/gi;
        htmlfrag_format = /<!--StartFragment-->(<img[^>]*>)<!--EndFragment-->/;

        // prevents default pasting
        event.preventDefault();

        if (win.clipboardData) {
            // IE
            // Get the URL from pasted data
            source = win.clipboardData.getData('URL');
            // Construct img tag with sourceURL
            imgsrc = "<img src='" + source + "'/>";
            plaintext = win.clipboardData.getData('text');
            // Check to see if source is empty string or undefined
            if (source === "" || source === undefined) {
                result = plaintext;
            } else { // If not, test the source for an image format
                if (img_format.test(source)) {
                    // If there's an image, set result to imgsrc
                    result = imgsrc;
                } else { //If not, set result to plaintext
                    result = plaintext;
                }
            }
        } else if (event.originalEvent.clipboardData) {
            // Chrome & Safari & Firefox
            // Get text/html data from clipboard
            source = event.originalEvent.clipboardData.getData('text/html');
            // ALSO create a plaintext variable that has text/plain clipboard data
            plaintext = event.originalEvent.clipboardData.getData('text/plain');
            // alert("source: " + source + "\n" +
            //       "plaintext: " + plaintext);

            // Chrome and Safari
            // See if there's a regex match for imgs
            if (is_chrome || is_safari) {
                imgsrc = source.match(htmlfrag_format);
                // If there's a match, inspect imgsrc for an image file
                if (imgsrc !== null) {
                    // If imgsrc has a match for imgs, make imgsrc[1] the result
                    if (img_format.test(imgsrc[1]) || base64_format.test(imgsrc[1])) {
                        // alert('img passed');
                        result = imgsrc[1];
                    } else {// if not, set result to plaintext
                        result = plaintext;
                    }
                } else {
                    result = plaintext;
                }
            } else {
                // Firefox: the source should be an img tag
                imgsrc = source;
                // Test imgsrc for images
                if (img_format.test(imgsrc) || base64_format.test(imgsrc)) {
                    result = imgsrc;
                } else {// if none, set result to plaintext
                    result = plaintext;
                }
            }
        }

        // If there's no source and result is as of yet  undefined...
        if (source === "" || result === undefined) {
            // Check plaintext. If there's no plaintext, it might be
            // a copypaste attempt from the hard drive
            if (plaintext === "") {
                alert("Try dragging and dropping the image!");
                plaintext = "";
            }
            result = plaintext;
        }

        // If we're looking at an img tag from the internet
        if (result.indexOf("<img") > -1) {
            // Create and append the image
            createAndAppendImage(result,
                      undefined,
                      $TARGET,
                      RESIZE_OBJECT_SETTINGS,
                      IMG_SETTINGS);
        } else {
            // If we're looking at regular text
            try {
                if (win.document.execCommand) {
                    win.document.execCommand('insertText', false, result);
                } else if (doc.execCommand) {
                    doc.execCommand('insertText', false, result);
                }
            } catch (ignore) { }
        }
        // DEBUG AIDE 
        // alert(result);
    }

    // Creates an ondrop/onpaste event listener to do the following for each file:
    $.fn.imgEvent = function () {
        // Sets Variable for Target
        var $TARGET = this;
        // Sets the ondrop event
        $TARGET.on('drop', function (event) {
            fileDropHandler(event, $TARGET);
        });

        // Sets the onpaste event
        $TARGET.on('paste', function (event) {
            filePasteHandler(event, $TARGET);
        });
    };

    // Enables Inserting Tab AN OTHER Whitespace
    $.fn.tabEnable = function () {
        var $TARGET = this;
        $TARGET.on('keydown', function (e) {
            // Pressing TAB 
            if (e.which === 9) {
                // Prevents focusing on next element
                e.preventDefault();
                if (!is_firefox) {
                    win.document.execCommand('insertText', false, "\t");
                } else {
                    doc.execCommand('insertHTML', false, "&emsp;");
                }
            }
        });
    };

    // Enable Key Shortcut Text Formatting (Firefox only)
    $.fn.ctrlFormatting = function () {
        var $TARGET = this;
        $TARGET.on('keydown', function (press) {
            // Pressing CTRL + ...
            if (press.ctrlKey) {
                if (press.key === 'b') {
                    press.preventDefault();
                    doc.execCommand('bold', false);
                }
                if (press.key === 'i') {
                    press.preventDefault();
                    doc.execCommand('italic', false);
                }
                if (press.key === 'u') {
                    press.preventDefault();
                    doc.execCommand('underline', false);
                }
            }
        });
    };

    // Make images in an element interactive \
    //(ie draggable, resizeable, delete buttons)
    $.fn.imgInteract = function () {
        this.draggable({containment: 'parent'});
        this.resizable({
            containment: "parent",
            handles: "s, e, se, w, sw"
        });

        this.attachDeleteButton();

        // Chrome Fix: Take ui-icon class out to fix
        // resizing se-icon problem
        if (is_chrome) {
            this.find('.ui-icon-gripsmall-diagonal-se').attr({
                'class': ['ui-resizable-handle ui-res',
                          'izable-se ui-icon-gripsmal',
                          'l-diagonal-se'].join('')
            });
        }
    };

    // Primes first line of imgTxtHybrid item with div
    $.fn.primeDivs = function () {
        if (!is_firefox) {
            this.html('<div><br></div>');
        }
    };

    // Takes copy data and makes it text only
    $.fn.setCopyData = function () {
        var currentSel;
        // SELECT ALL EVENT
        this.on("keydown", function (event) {
            if (event.ctrlKey || (event.which === 17)) {
                if (event.key === 'a' || event.which === 65) {
                    event.preventDefault();
                    if (doc.execCommand) {
                        doc.execCommand('selectAll', true, null);
                    } else if (win.document.execCommand) {
                        win.document.execCommand('selectAll', true, null);
                    }
                }
            }
        });

        // COPY EVENT
        this.on("copy", function (event) {
            // Override default behavior
            event.preventDefault();
            // Alert for DEBUG
            // alert('copy');

            // get and set selection based on features
            if (win.getSelection) {
                currentSel = win.getSelection().toString();
            } else if (doc.selection) {
                currentSel = doc.selection.createRange();
            }

            // Set data to text
            if (win.clipboardData) {// IE
                win.clipboardData.setData("Text", currentSel);
            } else if (event.originalEvent.clipboardData) { // errthing else
                event.originalEvent.clipboardData.setData("text/plain", currentSel);
            }
            doc.execCommand('copy');
        });

    };

    // UTILITY: Apply settings with JS objects
    $.fn.objectSettings = function (setting_object) {
        var $TARGET = this;
        $TARGET.css(setting_object);
    };
}(jQuery, document, window));

// Hidden helper functions to support Utility Functions
UtilityHiddenFunctions = {
    repeatEscape: function (pattern, text) {
        "use strict";
        // Initialize variables
        var result_is_null_buf, result_is_null, buffer_string;

        // Set null counter and null counter buffer to false
        result_is_null_buf = false;
        result_is_null = false;
        // Set buffer string to first found pattern
        buffer_string = pattern.exec(text);

        // This while loop stops when both the null counter and null counter
        // buffer evaluate to True. That way, this ensures all matches are
        // found. Since text is replaced when there are matches, there is
        // little chance of the loop becoming non-convergent
        while (!(result_is_null_buf && result_is_null)) {
            // If the buffer string is found to be null, set null counter buffer to True
            // and if null counter buffer is already true, set null counter to true
            if (buffer_string === null) {
                if (result_is_null_buf) {
                    result_is_null = true;
                }
                result_is_null_buf = true;
            } else {
                // If buffer string is not null, replace the escaped brackets around the
                // matched segment with unescaped HTML brackets and reset 
                text = text.replace(buffer_string[0], "<" + buffer_string[1] + ">");
                result_is_null = false;
                result_is_null_buf = false;
            }
            buffer_string = pattern.exec(text);
        }
        return text;
    },
    sanitizeText: function (text) {
        "use strict";
        // Initialize Variables
        var bracket_pattern,
            whitelist_pattern,
            span_pattern,
            buffer_string;

        // Set Patterns for detection
        bracket_pattern = /<([^>]*)>/gm;
        whitelist_pattern = /&lt;(\/*[biu]|br)&gt;/gm;
        span_pattern = /&lt; *(\/*span[ \w\d\-\_="`':]*) *&gt;/gm;

        // First pattern: replace all brackets with escaped HTML charrefs 
        buffer_string = bracket_pattern.exec(text);
        while (buffer_string !== null) {
            // console.log("buffer_string: " + buffer_string); 
            text = text.replace(buffer_string[0], "&lt;" + buffer_string[1] + "&gt;");
            buffer_string = bracket_pattern.exec(text);
        }
        // Second pattern: re-replace all escaped i,u,b and br tags with unescaped equivalents
        text = this.repeatEscape(whitelist_pattern, text);
        // Third pattern: the above procedure is repeated but with the span pattern
        text = this.repeatEscape(span_pattern, text);
        return text;
    }
};

// UTILITY: Function that, when called, automatically
// reloads and refreshes interactivity on any uploaded images
$.fn.refreshImgInteractions = function () {
    "use strict";
    var $upload_images, idx;

    $upload_images = this.find(".upload-image");
    for (idx = 0; idx < $upload_images.length; idx++) {
        // Remove the old resize-handle div handles before calling imgInteract
        $($upload_images[idx]).contents().remove('div.ui-resizable-handle');
        $($upload_images[idx]).unbind();
        $($upload_images[idx]).imgInteract();
    }
    $upload_images.on('click', function () {
        $upload_images.css('z-index', '0');
        $(this).css('z-index', '10');
    });
};

// Function for creating new Ids
function newId() {
    "use strict";
    var randomized_id, randomized_id_2;
    randomized_id = Math.random().toString().slice(2);
    randomized_id_2 = Math.random().toString().slice(2);
    return randomized_id + "_" + randomized_id_2;
}

// UTILITY: Create ".upload-image" div
// Based slightly off of encapsulated 
// createAndAppendImg() function. Will attempt to replace the encapsulated
// function with this one.
// Use this function to create drag-and-resize-(and-delete)-able images
// based on data received from backend
function createAndAppendImgDivs(idGenFunction, img_source_str, css_obj, $target) {
    "use strict";
    // Function Generated Variables
    var $div_wrapper,
        $new_image,
        genIdFunction;

    // If an id-generating function is not supplied, 
    // use the generic randomized ID function
    if (idGenFunction !== undefined) {
        genIdFunction = idGenFunction;
    } else {
        genIdFunction = newId;
    }

    // Set div and img objects with appropriate attrs and css
    $div_wrapper = $(document.createElement('div'));
    $div_wrapper.attr({
        'id': genIdFunction(),
        'class': 'upload-image'
    });

    $new_image = $(document.createElement('img'));
    $new_image.attr('src', img_source_str);

    // Apply global setings to div and img objects AND
    // any specific CSS stylings to be applied to the 
    // div wrapper
    $div_wrapper.objectSettings(RESIZE_OBJECT_SETTINGS);
    $div_wrapper.css(css_obj);
    $new_image.css(IMG_SETTINGS);

    // Append img to div and append div to target
    $div_wrapper.append($new_image);
    $target.append($div_wrapper);
}


// UTILITY: returns an object array of the srcs of the uploaded images in a given element
$.fn.imgSrc = function () {
    "use strict";
    var result,
        img_list,
        item_obj,
        img_id,
        img_top,
        img_left,
        img_height,
        img_width,
        base64data_source,
        base64data_start,
        base64data,
        img_idx;

    result = [];
    img_list = this.find('img');

    for (img_idx = 0; img_idx < img_list.length; img_idx++) {
        // Get and store img id
        img_id =  $(img_list[img_idx]).parent().attr('id');
        img_top = $(img_list[img_idx]).parent().css('top');
        img_left = $(img_list[img_idx]).parent().css('left');
        img_height = $(img_list[img_idx]).parent().css('height');
        img_width = $(img_list[img_idx]).parent().css('width');

        // Isolate and store data information of img
        base64data_source = img_list[img_idx].src;

        if (base64data_source.indexOf('base64') > -1) {
            // If base64data_source has base64 marker, then extract the data...
            base64data_start = base64data_source.indexOf('base64') + 7;
            base64data = base64data_source.slice(base64data_start, base64data_source.length);
        } else {
            // ... otherwise, feed the http string to the 'data' parameter of the object
            base64data = base64data_source;
        }

        // Populate object with stored styling, data and format data
        item_obj = {
            'id': img_id,
            'top': img_top,
            'left': img_left,
            'height': img_height,
            'width': img_width,
            'data': base64data
        };
        // Append object to the result array
        result.push(item_obj);
    }
    return result;
};

// UTILITY: From the HTML, go to JS String
$.fn.stringConvHTMLtoJS = function () {
    "use strict";
    var result, buffer, $TARGET, string, str_end;
    result = "";
    buffer = "";
    // Split actions based on browser.
    if (!is_firefox) {
        // If NOT Firefox...
        // Get jQuery array of elements that are not uploaded images
        $TARGET = this.contents().not(".upload-image");
        // Go through elements and add the containing text + newline to buffer str
        $TARGET.each(function () {
            buffer += $(this).html() + "\n";
        });
        // replace all HTML spaces with JS spaces and add buffer to result
        buffer = UtilityHiddenFunctions.sanitizeText(buffer.replace(/&nbsp;/g, " "));
        result += buffer;
    } else {
        // If Firefox...
        // Take the html of the target element
        $TARGET = this;
        string = $TARGET.html();
        // Firefox HACK: 
        // Establish end of string portion at beginning of the first child DIV
        str_end = string.indexOf('<div');
        // Slice the string from the beggining to the index of the first
        // child Div. Replace all <br> tags with \n
        result += UtilityHiddenFunctions.sanitizeText(string.slice(0, str_end).replace(/<br>/g, '\n'));
    }
    return result;
};

// UTILITY: Based on Browser, handle line breaks 
// when going from JS strings to HTML
function stringConvJStoHTML(multiline_str) {
    "use strict";
    var result,
        strings,
        insert_item,
        str;
    // return a simple replacement if Firefox
    if (is_firefox) {
        return UtilityHiddenFunctions.sanitizeText(multiline_str)
                                     .replace(/<br>/g, "")
                                     .replace(/\n/g, '<br>');
    }

    // initialize result AND split strings by newline
    result = "";
    strings = multiline_str.split("\n");

    // For each item in strings, initialize the insert item
    // and then either insert <br> or the source string replaced with 
    // html whitespace markup. Couch the insert item in div tags
    for (str = 0; str < strings.length; str++) {
        if (strings[str] === "") {
            insert_item = "<br>";
        } else {
            insert_item = UtilityHiddenFunctions.sanitizeText(strings[str]);
        }
        result += "<div>" + insert_item + "</div>";
    }
    return result;
}

// The main function! 
$.fn.imgTxtHybrid = function (obj_settings) {
    "use strict";
    var BASE_SETTINGS,
        property,
        img_set;

    BASE_SETTINGS = {
        'overflow': 'hidden',
        'position': 'absolute',
        'white-space': 'pre-wrap',
        'display': 'inline-block'
    };

    // FIRST: set global object variables 

    // Run default object style settings if no arguments are passed
    // Else pass any parameter object style settings 

    RESIZE_OBJECT_SETTINGS = BASE_SETTINGS;

    if (obj_settings.imagecss !== undefined) {
        // Catch errors that happen when uploading your own styling
        try {
            // Set object to base settings
            RESIZE_OBJECT_SETTINGS = BASE_SETTINGS;
            // get and store user-defined imagecss setting 
            img_set = obj_settings.imagecss;
            for (property in img_set) {
                if (img_set.hasOwnProperty(property)) {
                    RESIZE_OBJECT_SETTINGS[property] = img_set[property];
                }
            }
        } catch (error) {
            console.log(error);
        }
    }

    // Set global img settings (cannot be messed with or it wont work out)
    IMG_SETTINGS = {
        'display': 'block',
        'width': 100 + '%',
        'height': 100 + '%'
    };

    // Start with ContentEditable native widget
    this.attr('contenteditable', 'true');

    // Force this element to be relative and have overflow:auto
    this.css({
        'position': 'relative',
        'overflow': 'auto',
        'white-space': 'pre-wrap'
    });

    // Run the encapsulated functions
    this.suppressDefaults();
    this.primeDivs();
    this.imgEvent();
    this.tabEnable();
    this.ctrlFormatting();
    this.setCopyData();
};