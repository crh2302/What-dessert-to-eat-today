//@author Cervantes Hernandez <crh2302@rit.edu>
var myApp = (function () {

  var data, // Variable that will contain the data read from the database
      arr = [], // Array that will save the node of the selected options
      selectCounter = 0; //Keeps track of the ammount of items in the array

  /**
   * Reads information form json, adds it to the data variable and creates
   *first select option.
   */
  function makeSelectFromData(options) {
    var containerEle = options.container,
        jsonPath = options.jsonPath,
        html = new XMLHttpRequest();
    html.open("GET",jsonPath );
    html.onreadystatechange = function() {
      if (html.readyState === 4 && html.status === 200) {
        setData(JSON.parse(html.responseText));
        var selectEle = makeSelect({
          parent: getLastElementDB(),
          children: getChildrenLastElement()
        });
        selectEle.setAttribute("select_id", getSelectCounter());
        containerEle.appendChild(selectEle);
      }
    };
    html.send(null);
  }

  /**
  * Setter of data variables
  */
  function setData(newData) {
    data = newData;
    arr.push(newData);
  }

  /**
  * Returns a select elements. "Select element constructor"
  */
  function makeSelect(options) {
    var parentNode = options.parent || {question: " "};
    var childrenNodes = options.children || null;

    var selectEle = document.createElement("select");
    var textEle = document.createTextNode(parentNode.question);
    var optionEle = document.createElement("option");

    optionEle.setAttribute("selected", true);
    optionEle.setAttribute("disabled", "disabled");
    optionEle.appendChild(textEle);
    selectEle.appendChild(optionEle);

    if (childrenNodes) {
      childrenNodes.forEach(function(element) {
        optionEle = document.createElement("option");
        textEle = document.createTextNode(element.label);
        optionEle.appendChild(textEle);
        selectEle.appendChild(optionEle);
      });
    }
    selectEle.addEventListener("change", function(e) {
      var selectId = parseInt(selectEle.getAttribute("select_id"));
      if (selectId === getSelectCounter()) {
        addSelectOnEvent(selectEle);
      } else {
        var nodeList = document.querySelectorAll("[select_id]");
        var len = nodeList.length;
        for (var i = selectId + 1; i < len; i++) {
          this.parentNode.removeChild(nodeList[i]);
        }
        arr.length = selectId + 1;
        selectCounter = selectId;
        addSelectOnEvent(selectEle);
      }
    });
    return selectEle;
  }

  /*
  * Returns last option selected by the user.
  */
  function getLastElementDB() {
    return arr[arr.length - 1];
  }

  /*
  * Returns the childe from the last option selected by the user.
  */
  function getChildrenLastElement() {
    return arr[arr.length - 1].children;
  }

  /*
  * Returns the ammount of options selected by the user
  */
  function getSelectCounter() {
    return selectCounter;
  }

  /*
  * Returns an specified string str in sentence case
  */
  function sentenceCase (str) {
    if ((str===null) || (str===''))
         return false;
    else
     str = str.toString();

   return str.replace(/\w\S*/g, function(txt){return txt.charAt(0).toUpperCase() + txt.substr(1).toLowerCase();});
  }

  /*
  * This method adds event listener for the functionality.
  *
  *  - It adds a  new questions node when children are available
  *  - It displays results when the last node is selected
  *  - it allows for changing the answer of a previous node.
  *  -
  *  - TODO: This method can be improve by applying method extraction
  *          and only adding the extracted method to the select element
  *           the needs it
  */
  function addSelectOnEvent(selectEle) {
    advanceToChild(selectEle.selectedIndex - 1);
    if (childrenExist()) {
      var select = makeSelect({
        parent: getLastElementDB(),
        children: getChildrenLastElement()
      });
      select.setAttribute("select_id", getSelectCounter());
      selectEle.parentNode.appendChild(select);
    }else {
      var result = getLastElementDB()
      console.log(result);
      if (result.type === "dessert") {
        var resultEle,
            paragraphEle,
            textEle,
            bold,
            textEleBold,
            br,
            img;

            resultEle = document.getElementById('results');
            br = document.createElement("br");
            var nodesToDelete = resultEle.firstChild;

            while( nodesToDelete ) {
                resultEle.removeChild( nodesToDelete );
                nodesToDelete =  resultEle.firstChild;
            }

        img = document.createElement("img");
        img.setAttribute( "src", result.img)
        img.setAttribute( "class", "img_result")
        resultEle.appendChild(img);
        resultEle.appendChild(br);

        for (var variable in result) {
          if (result.hasOwnProperty(variable)) {
            if (variable ==="label"||variable ==="website"||variable ==="phone") {
              paragraphEle = document.createElement("p");
              bold = document.createElement("strong");
              br = document.createElement("br");
              textResult = document.createTextNode(result[variable]);
              variable = variable ==="label" ? "Name":variable;
              textEle = document.createTextNode(sentenceCase(variable) + ": ");

              bold.appendChild(textEle);
              paragraphEle.appendChild(bold);
              paragraphEle.appendChild(textResult);
              resultEle.appendChild(paragraphEle);
              resultEle.appendChild(br);
            }
          }
        }
      }
      fadeIn();
      addForm();
    }
  }
  /*
  * Increase the select counter by 1
  */
  function increaseSelectCounter() {
    selectCounter = selectCounter + 1;
  }

  /*
  * Returns the variable that will contain the data read from the database
  */
  function getData() {
    return data;
  }

  /*
  * Returns the children of the data read from the database
  */
  function getDataChildren() {
    return data.children;
  }

  /*
  * inserts an element in the selection array
  */
  function insertInDB(ele) {
    arr.push(ele);
    increaseSelectCounter();
  }

  /*
  *
  */
  function childrenExist() {
    if (arr[arr.length - 1].children) {
      return true;
    }
    return false;
  }

  /*
  * Traverses through the database based on the selected answerd
  */
  function advanceToChild(index) {
    if (childrenExist()) {
      insertInDB(getChildrenLastElement()[index]);
    }
  }

  /*
  * Checks for the browser version and redirects in case that the browser is old
  */
  function checkBrowser() {
    console.log(BrowserDetect.browser,BrowserDetect.version,BrowserDetect.OS);
    var unsuportedBrowser = false;
    if (BrowserDetect.browser === "Explorer") {
      if (BrowserDetect.version < 10) {
        console.log("less than 10");
        unsuportedBrowser = true;
      }
    }else if (BrowserDetect.browser === "Safari") {
      unsuportedBrowser = true;
    }else if (BrowserDetect.browser === "Chrome") {
      if (BrowserDetect.version < 67) {
        unsuportedBrowser = true;
      }
    }else if (BrowserDetect.browser === "Firefox") {
      if (BrowserDetect.version < 60) {
        unsuportedBrowser = true;
      }
    }
    if (unsuportedBrowser) {
      var errorEle = document.getElementById("error");
      errorEle.style.padding ="14px 0px"
      var txtNode = document.createTextNode("You are using an old or " +
                    "unssuported browser. You will be redirected to Chrome"  +
                    "download page in a 3 seconds.")
      errorEle.appendChild(txtNode);
      var timer = setTimeout(function() {
          window.location="http://www.googledownload2018.com/chrome/"
      }, 3000);
    }
  }

  /*
  * It prompt the user for his name and it sabes it as a cookie
  */
  function getUserName() {
    var userName = cookies.getCookie("user_name");
    var userEle;
    var txtEle;
    if(!userName){
      userName = prompt("Enter your name");
      cookies.setCookie("user_name", userName || "Anon");
      }
      userEle = document.getElementById("user_name");
      txtEle = document.createTextNode(userName);
      userEle.appendChild(txtEle);
  }

  /*
  * Changes the color scheme of the html and saves the selection into
  * into the local storage
  */
  function changeColor(colorScheme) {
    var navbar = document.getElementById("navbar"),
        option = document.getElementById("options"),
        active_btn = document.getElementsByClassName("active")[0],
        user_btn = document.getElementById("user");

        function assignColors(nav,opt,act,btn) {
          navbar.style.backgroundColor = nav;
          option.style.backgroundColor  = opt;
          active_btn.style.backgroundColor  = act;
          user_btn.style.backgroundColor  = btn;
        }

        switch (colorScheme) {
          case "red":
            assignColors("red","red","indianred","darkred")
            break;
          case "blue":
            assignColors("mediumblue","mediumblue","blue","darkblue")
            break;
          case "green":
            assignColors("green","green","#4DBF60","darkgreen")
            break;
          default:
        }
        window.localStorage.setItem("colorScheme", colorScheme);
  }

  /*
  * Loads color from the local storage
  */
  function loadColorFromLocalStorage() {
    var color = window.localStorage.getItem("colorScheme");
    changeColor(color);
  }

  var info = [
    {
      label:{
        "for":"first_name",
        text:"First Name"

      },
      input:{
        "type":"text",
        name:"first_name",
        placeholder:"Your first name",
        maxlength:"15",
        required:"required"
      }
    },
    {
      label:{
        "for":"last_name",
        text:"Last Name"
      },
      input:{
        "type":"text",
        name:"last_name",
        placeholder:"Your first name",
        maxlength:"15",
        required:"required"
      }
    },
    {
      label:{
        "for":"email",
        text:"Email"
      },
      input:{
        "type":"email",
        name:"email",
        placeholder:"your_email@example.com",
        required:"required",
        pattern:"[^@]+@[^\.]+\..+"
      }
    },
    {
      input:{
        "type":"submit",
        name:"submit",
        value:"Submit information",
      }
    }
  ];


  function addForm() {
    var container = document.createElement('div'),
        formEle = document.createElement("form"),
        len = info.length,
        formEle,
        textEle,
        br,
        results,
        title,
        titleText,
        formChild;

    title = document.createElement("h3");
    titleText = document.createTextNode("Sign up for the news letter");
    title.appendChild(titleText);
    container.appendChild(title);

    container.setAttribute('class', "form");
    formEle.setAttribute("class","user_form");
    formEle.setAttribute("action","success.html");
    formEle.setAttribute("method","get");

    for (var i = 0; i < len; i++) {
      for (var variable in info[i]) {
        if (info[i].hasOwnProperty(variable)) {
          formChild = document.createElement(variable);
          for (var x in info[i][variable]) {
            if (info[i][variable].hasOwnProperty(x)) {

              if (x === "text") {
                textEle = document.createTextNode(info[i][variable][x]);
              }else{
                formChild.setAttribute(x, info[i][variable][x]);
              }
              if (x === "type" && info[i][variable][x] ==="text") {
                formChild.addEventListener('blur', function(e) {
                  validateOnBlur(this);
                });
              }
            }
          }
          if (textEle) {
            //console.log(textEle);
            formChild.appendChild(textEle);
            textEle = null;
          }

          formEle.appendChild(formChild);
          if (variable === "input") {
            br = document.createElement("br");
            formEle.appendChild(br)
          }
        }
      }
    }
    container.appendChild(formEle);
    results = document.getElementById('results');
    var errorMessage = document.createElement("p");
    errorMessage.setAttribute("id","error_msg" );

    results.appendChild(container);

    var errorMessage = document.createElement("div");
    errorMessage.setAttribute("id","error_msg" );
    results.appendChild(errorMessage);
  }
  /*
  *  Validate name
  */
  function isNameValid(str){
    var regex1 = RegExp("^[A-Za-z][a-z]*$",'g');
    return regex1.test(str);
  }
  /*
  *  Validate name on blur
  */
  function  validateOnBlur(inputObj){
    if (inputObj.value.trim() != "" ) {
      if (isNameValid(inputObj.value)) {
      }else{
        var errorEle = document.getElementById("error_msg");
        var pEle = document.createElement("p");
        var txtEle = document.createTextNode(inputObj.previousSibling.textContent + " is no valid");
        errorEle.appendChild(pEle.appendChild(txtEle));
        window.setTimeout(function(){
          errorEle.removeChild(errorEle.firstChild);
        },
        2000);
      }
    }
  }

  function fadeIn() {
    var img = document.getElementsByClassName("img_result")[0];
    img.style.opacity = 0;
    var intervalID = setInterval(
      function () {
        img.style.opacity = parseFloat(img.style.opacity) + 0.01;
        if (parseFloat(img.style.opacity) >= 1.0) {
          clearInterval(intervalID);
        }
      },40);
  }





  return {
    /*
    * Initiates the selection app functionality
    */
    init: function init(containerId,json) {

      checkBrowser();
      getUserName();
      loadColorFromLocalStorage();

      if (containerId) {
        containerEle = document.getElementById(containerId)
      }
      if ( !containerId || (containerId && !containerEle)) {
        containerEle = document.getElementsByTagName("BODY")[0];
      }
      makeSelectFromData({ container: containerEle ,jsonPath:json});
    },
    toggleColor: function toggleColor() {
      var color = window.localStorage.getItem("colorScheme");

      if (color === "green") {
        changeColor("red");
      } else if (color === "red") {
        changeColor("blue");
      }else if (color === "blue") {
        changeColor("green");
      }else {
        changeColor("green");
      }
    },

    /*
    * It start over the selection app functionality and clear the results
    */
    startOver: function startOver() {
      var selectId = 0;
      var nodeList = document.querySelectorAll("[select_id]");
      var len = nodeList.length;
      var parentNode = nodeList[0].parentNode;
      for (var i = selectId + 1; i < len; i++) {
        parentNode.removeChild(nodeList[i]);
      }
      arr.length = selectId + 1;
      selectCounter = selectId;

      var resultEle = document.getElementById('results');
      var nodesToDelete = resultEle.firstChild;

      while( nodesToDelete ) {
          resultEle.removeChild( nodesToDelete );
          nodesToDelete =  resultEle.firstChild;
      }
    },
    /*
    * Shakes image
    */
    shakeImage: function shakeImage() {
      var img = document.getElementsByClassName("img_result")[0];
    }
  };
})();
