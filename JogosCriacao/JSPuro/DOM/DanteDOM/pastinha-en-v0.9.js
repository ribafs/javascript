/**
* Biblioteca Javascript to Folder with Tabs
*
* To use the library, call the file folder-v0.9.js in the <head> of your page and use custom HTML tags <one-folder> and <one-tab>, respectively closed with the tags </one-folder> and
* </one-tab>, to create the structure of Folders with tabs inside the Folders.
*/

// Function to look up attribute of a class in CSS stylesheets
function  findsAttribute(classes, attribute){
    if(classes.trim().length < 1){ var returns = "!cne";  return(returns); }
    if(attribute.trim().length < 1){ var returnsNr = "!ane";  return(returnsNr); }
    if(document.styleSheets.length===0){ var returnsNr = "!cne";  return(returnsNr); } //classe não encontrada 
    
    var classesArray = classes.split(" ");        
    
    for(var j=0; j<classesArray.length; j++) { 
        
        if(classesArray[j].trim().length > 0){ 
            
            for(var i=0; i<document.styleSheets.length; i++) {
                var sheet = document.styleSheets[i];
                
                var c1 = 0;
                for (var n = 0; n < sheet.cssRules.length; n++){ 
                    
                    if (sheet.cssRules[n].selectorText == "."+classesArray[j].trim()){ 
                        var cssText = sheet.cssRules[n].cssText;
                        var innerRules =  ( cssText.split("{")[1] ).split("}") ;    
                        
                        var regras = innerRules[0].split(";"); 
                        
                        var c2 = 0;
                        for (x = 0; x < regras.length-1; x++){
                            var atribArray = regras[x].split(":");
                            var attribName = atribArray[0].trim(); 
                            if(attribName == attribute){
                                c2++; 
                                return(atribArray[1]);
                            }
                        }
                        
                        c1++;     
                    }
                } // end of for that looks for the class                         
            } // end of loop looking for StyleSheets                                 
        } // if not just a blank        
    } // end of multi-class loop  
    
    if ( c2 == 0) {
        var returnsNr = "!ane"; //attribute not found
        return(returnsNr);                  
    } 
    
    if ( c1 == 0) {
        var returnsNr = "!cne"; //classe not found
        return(returnsNr);                  
    }                        
    
} // end function findsAttribute


function doThisFirst(myCallbackFunction) {    
    alert(myCallbackFunction);
    
    // Now call the function passed in
    myCallbackFunction();
}

// Function to change the focused tab of a folder
function focusedTabSwap(folderId, tabOrder){ 
    
    let tabsArray = document.getElementById(folderId).getElementsByTagName('one-tab');
    
    for(var i = 0; i < tabsArray.length; i++){ 
        if(tabsArray[i].parentElement.id == folderId){
            if(tabsArray[i].order == tabOrder){
                document.getElementById(folderId+'tabBody'+tabsArray[i].order).style.display = 'block';			     
                document.getElementById(folderId+'tabEar'+tabsArray[i].order).style.cursor = "default"; 
                if(document.getElementById(folderId).colorTabEarFocus != 'same') { 
                    document.getElementById(folderId+'tabEar'+tabsArray[i].order).style.backgroundColor = document.getElementById(folderId).colorTabEarFocus;
                }else{
                    document.getElementById(folderId+'tabEar'+tabsArray[i].order).style.backgroundColor = document.getElementById(folderId+'tabBody'+tabsArray[i].order).earColor;	 
                }
            }else{
                document.getElementById(folderId+'tabBody'+tabsArray[i].order).style.display = 'none';
                document.getElementById(folderId+'tabEar'+tabsArray[i].order).style.backgroundColor =  document.getElementById(folderId+'tabBody'+tabsArray[i].order).earColor;	 
                document.getElementById(folderId+'tabEar'+tabsArray[i].order).style.cursor = "pointer";
            }   
        }
        
    }
    document.getElementById(folderId).tabFocus = tabOrder;
    
    // Checking if there is an "extra" function to be performed in the OnClick of the tab ear, passed by the attribute "earClick"
    var myFunction =  document.getElementById(folderId+'tabBody'+tabOrder).clickEar;
    if (document.getElementById(folderId+'tabBody'+tabOrder).clickEar != 'nofunction'){
        document.getElementById(folderId+'tabEar'+tabOrder).setAttribute("onclick",myFunction) ; // change OnClick
        document.getElementById(folderId+'tabEar'+tabOrder).click(); // simule click
        document.getElementById(folderId+'tabEar'+tabOrder).setAttribute( "onclick","focusedTabSwap('"+ folderId +"', '"+ tabOrder +"')" ) ;  //restore the original OnClick        
    } 
    
}

// Function to onMouseOver
function mouseOverEar(earId){
    if(document.getElementById(earId).parentElement.tabFocus != document.getElementById(earId).order){
        document.getElementById(earId).style.backgroundColor = document.getElementById(earId).parentElement.colorTabEarHover;
    }
}

// Function to onMouseOut
function mouseOutEar(folderId, order){
    var earId =  folderId+"tabEar"+order;
    var tabId = folderId+"tabBody"+order;
    
    if(document.getElementById(earId).parentElement.tabFocus == document.getElementById(earId).order){
        document.getElementById(earId).style.backgroundColor = document.getElementById(earId).parentElement.colorTabEarFocus;
    }else{
        document.getElementById(earId).style.backgroundColor = document.getElementById(tabId).earColor;
        
    }
    
}

//############################################################################################################
// classe Tab
//############################################################################################################
class Tab extends HTMLElement  {	
    connectedCallback(){ 
        this.title = this.getAttribute('title');
        
        this.earColor = this.getAttribute('ear-color'); 
        if (this.earColor == null){ this.earColor = this.parentElement.earColorsTabsDefault; } 
        
        // The click-ear attribute can be used to pass an "extra" function (passed without a semicolon) to be executed after the original onclick of the tab's ear (which changes the selected tab)
        if ( this.hasAttribute('click-ear') ){ this.clickEar = this.getAttribute('click-ear');  }else{ this.clickEar ='nofunction'; }
        
        this.style.position = "absolute";			
        
        this.style.top =  this.parentElement.bodyTop;
        
        this.style.left = "0%";
        this.style.display = "block";
        this.style.width = "99%";
        this.style.height= "86%";
        this.style.paddingTop= "2%";
        this.style.paddingLeft= "1%";
        this.style.zIndex= "1";				 
        this.style.borderTopLeftRadius = "1px";
        this.style.borderTopRightRadius = "1px";
        this.style.borderBottomLeftRadius = "1px";
        this.style.borderBottomRightRadius = "1px";
        this.style.display = "block";
        
        let tabArray = this.parentElement.getElementsByTagName('one-tab');	 
        let tabArraySameNivel = new Array(); // array to filter only the tabs that are on the same level as the current tab, i.e. on the first level of the parentElement
        
        for(var i = 0; i < tabArray.length; i++){	
            if(tabArray[i].parentElement == this.parentElement){ tabArraySameNivel.push(tabArray[i]); }
        }
        
        let amountTabs = tabArraySameNivel.length;
        this.order = amountTabs; // defining the order number of the tab inside the folder
        
        if (this.title == null){
            this.title='Tab '+amountTabs ;
        }

        this.title = this.title.trim();
        
        this.id = this.parentElement.id+"tabBody"+this.order;
        
        
        var colorTabBody = this.style.backgroundColor+" ";
        colorTabBody = colorTabBody.trim();
        if (colorTabBody.length < 1){
            var returnsNr = findsAttribute(this.className, "background-color"); // looking for attribute background-color in CSS stylesheets for the tab class (no problem if the tab has no assigned class)
            if ( (returnsNr != "!cne") && (returnsNr != "!ane")){ colorTabBody = returnsNr.trim(); }else{ colorTabBody = this.parentElement.colorDefaultTabBody;}
        }
        
        this.style.backgroundColor =  colorTabBody;
        
        
        var borderBody = this.style.border+" ";
        borderBody = borderBody.trim();
        if (borderBody.length < 1){
            var returnsNr = findsAttribute(this.className, "border"); // looking for attribute border in CSS stylesheets for the tab class (no problem if the tab has no class assigned)
            if ( (returnsNr != "!cne") && (returnsNr != "!ane")){
                borderBody = returnsNr.trim();
            }else{
                borderBody = this.parentElement.borderDefaultTabBody 
            } 
        }
        this.style.border = borderBody;
        
        // Verify CSS border        
        var borderRay = this.parentElement.style.borderRadius+" ";
        borderRay = borderRay.trim();
        
        if (borderRay.length < 1){
            var returnsNr = findsAttribute(this.parentElement.className, "border-radius"); // looking for attribute border-radius in CSS stylesheets for folder class (no problem if folder has no class assigned)
            if ( (returnsNr != "!cne") && (returnsNr != "!ane")){
                borderRay = returnsNr.trim();
            }else{
                borderRay = "defaultvalues";
            }
        }
        
        var borderRayTopLeft = this.parentElement.style.borderTopLeftRadius+" "; // this variable will store the radius of the upper left edge of the BODY of each tab and the EAR of the first tab
        borderRayTopLeft = borderRayTopLeft.trim(); 
        
        if (borderRayTopLeft.length < 1){
            var returnsNr = findsAttribute(this.parentElement.className, "border-top-left-radius");
            if ( (returnsNr != "!cne") && (returnsNr != "!ane")){ borderRayTopLeft = returnsNr.trim(); }else{ borderRayTopLeft = "defaultvalue";}
        }
        if(borderRayTopLeft=="defaultvalue"){ if(borderRay == "defaultvalues"){ borderRayTopLeft = "15px";}else{ borderRayTopLeft = borderRay; }  } // default value is 10px        
        
        var borderRayTopRight = this.parentElement.style.borderTopRightRadius+" "; // this variable will store the radius of the upper right edge of the BODY of each tab and of the EAR of the last tab
        borderRayTopRight = borderRayTopRight.trim(); 
        
        if (borderRayTopRight.length < 1){
            var returnsNr = findsAttribute(this.parentElement.className, "border-top-right-radius");
            if ( (returnsNr != "!cne") && (returnsNr != "!ane")){ borderRayTopRight = returnsNr.trim(); }else{ borderRayTopRight = "defaultvalue";}
        }
        if(borderRayTopRight=="defaultvalue"){ if(borderRay == "defaultvalues"){ borderRayTopRight = "15px";}else{ borderRayTopRight = borderRay; }  } // default vaue is 0px
        
        var borderRayBottomLeft = this.parentElement.style.borderBottomLeftRadius+" "; // this variable will store the radius of the lower left edge of the BODY of each tab
        borderRayBottomLeft = borderRayBottomLeft.trim(); 
        
        if (borderRayBottomLeft.length < 1){
            var returnsNr = findsAttribute(this.parentElement.className, "border-bottom-left-radius");
            if ( (returnsNr != "!cne") && (returnsNr != "!ane")){ borderRayBottomLeft = returnsNr.trim(); }else{ borderRayBottomLeft = "defaultvalue";}
        }
        if(borderRayBottomLeft=="defaultvalue"){ if(borderRay == "defaultvalues"){ borderRayBottomLeft = "15px";}else{ borderRayBottomLeft = borderRay; }  } // default value is 10px        
        
        var borderRayBottomRight = this.parentElement.style.borderBottomRightRadius+" "; // this variable will store the radius of the lower right edge of the BODY of each tab
        var raioBordaInferiorDireita = this.parentElement.style.borderBottomRightRadius+" ";
        borderRayBottomRight = borderRayBottomRight.trim(); 
        
        if (borderRayBottomRight.length < 1){
            var returnsNr = findsAttribute(this.parentElement.className, "border-bottom-right-radius");
            if ( (returnsNr != "!cne") && (returnsNr != "!ane")){ borderRayBottomRight = returnsNr.trim(); }else{ borderRayBottomRight = "defaultvalue";}
        }
        if(borderRayBottomRight=="defaultvalue"){ if(borderRay == "defaultvalues"){ borderRayBottomRight = "15px";}else{ borderRayBottomRight = borderRay; }  } // default value is 10px
        
        this.style.borderTopLeftRadius = borderRayTopLeft;
        this.style.borderTopRightRadius = borderRayTopRight;
        this.style.borderBottomLeftRadius = borderRayBottomLeft;
        this.style.borderBottomRightRadius = borderRayBottomRight;
        
    }// end of connectedCallback()
    
} // end of Folder classe


var dividOrderIndex = new Array(); // array to store a order of folders zIndex

//############################################################################################################
//classe Folder
//############################################################################################################
class Folder extends HTMLElement  {
    
    // helper function that swaps the ear text of a tab
    changeEarText(order, newText){
        document.getElementById(this.id + "tabEar" + order).innerHTML = newText;
    } 
    
    // main function
    connectedCallback(){ 	
        var returnsNr;
        
        this.tabFocus = 1;
        
        this.id = this.getAttribute('id'); 
        if (this.id.toString() == "null"){ this.id = "Folder" + Math.floor( (Math.random() * (9000000000-2)) + 1000000001 ); }
        
        this.style.display = "block";	 	
        this.style.zIndex = 10;	 	 	
        this.style.position = "absolute";
        
        // checks if the Folder has the draggable attribute
        if ( this.hasAttribute('draggable') ){
            this.draggable = 'y';
    	}else{
            this.draggable = 'n';
        }
        
        if (this.hasAttribute('offset-right')) {
            this.offsetRigh = parseInt(this.getAttribute('offset-right'));
        }else{
            this.offsetRigh = 2;
        }  
        if (this.hasAttribute('offset-left')) {
            this.offsetLef = parseInt(this.getAttribute('offset-left'));
        }else{
            this.offsetLef = 0;
        }  
        
        this.earColorsTabsDefault = this.getAttribute('default-color-ear-tab');
        if ( this.earColorsTabsDefault == null){  this.earColorsTabsDefault = "#8B0000" ; }
        
        this.colorTabEarHover = this.getAttribute('color-hover-ear-tab');
        if ( this.colorTabEarHover == null){ this.colorTabEarHover = "#FF8C00"; }
        
        this.colorTabEarFocus = this.getAttribute('ear-color-selected-tab');
        if ( this.colorTabEarFocus == null){ this.colorTabEarFocus = "#DC143C"; }
        
        this.colorDefaultTabBody = this.getAttribute('default-color-body-tab');
        if ( this.colorDefaultTabBody == null){ 	 this.colorDefaultTabBody = "#F5DEB3";	 }
        
        this.borderDefaultTabBody = this.getAttribute('default-border-tab-body');
        if ( this.borderDefaultTabBody == null){ 	 this.borderDefaultTabBody = "2px solid #8B0000"; } 
        
        var FolderTop = this.style.top+" ";
        FolderTop = FolderTop.trim();
        
        if (FolderTop.length < 1){
            returnsNr = findsAttribute(this.className, "top"); // looking for attribute top in CSS stylesheets for Folder class (no problem if Folder has no class assigned)
            if ( (returnsNr == "!cne") || (returnsNr == "!ane")){ this.style.top = "2%";}  //top default value is 2% if not set otherwise in inline CSS or class CSS
        }
        
        var FolderLeft = this.style.left+" ";
        FolderLeft = FolderLeft.trim();
        
        if (FolderLeft.length < 1){
            returnsNr = findsAttribute(this.className, "left"); // looking for attribute left in CSS stylesheets for Folder class (no problem if Folder has no class assigned)
            if ( (returnsNr == "!cne") || (returnsNr == "!ane")){ this.style.left = "2%";}  //default value of left is 2% if not set otherwise in inline CSS or class CSS
        }
        
        var folderWidth = this.style.width+" ";
        folderWidth = folderWidth.trim();
        
        if (folderWidth.length < 1){
            returnsNr = findsAttribute(this.className, "width"); // looking for attribute width in CSS stylesheets for Folder class (no problem if Folder has no class assigned)
            if ( (returnsNr == "!cne") || (returnsNr == "!ane")){ this.style.width = "50%";}  //default width value is 50% if not set otherwise in inline CSS or class CSS
        }   
        
        var folderHeight= this.style.height+" ";
        folderHeight = folderHeight.trim();
        
        if (folderHeight.length < 1){
            returnsNr = findsAttribute(this.className, "height"); // looking for attribute height in CSS stylesheets for Folder class (no problem if Folder has no class assigned)
            if ( (returnsNr == "!cne") || (returnsNr == "!ane")){ this.style.height = "50%";}  //default height value is 50% if not set otherwise in inline CSS or class CSS
        }
        
        //default font size on tab ears
        this.defaultSizeEaarFont = this.getAttribute('font-size-tab-ear');
        if ( this.defaultSizeEaarFont == null){  
            if( (this.offsetHeight - this.offsetTop) > ( window.innerHeight * 0.4 ) ){ this.defaultSizeEaarFont = "20px" ;  }else{ this.defaultSizeEaarFont = "18px" ; }            
        }
        
        // defining the default height that the ears of the tabs should have, according to the height of the Folder     
        if( (this.offsetHeight - this.offsetTop) > ( window.innerHeight * 0.4 ) ){ 
            this.earHeight = "10%"; 
            var numHeight = 10;
        }else{  
            this.earHeight = "15%"; 
            var numHeight = 15;        
        }           
        
        // calculating the Top attribute of the body of the flaps according to the height of the ears + the attribute sep-ear-body (if any)
        if (this.hasAttribute('sep-ear-body')) { var separation = this.getAttribute('sep-ear-body'); }else { var separation = "0%"; }  
        
        if ( (separation.slice(separation.length - 1))=='x' ){
            var sepNumPixels = parseInt(  separation.split("p")[0] );
            var sepPercent = ( (sepNumPixels / window.innerHeight ) * 100 );
            this.bodyTop = (numHeight + sepPercent)+"%";
            
        } else if( (separation.slice(separation.length - 1))=='%' ){
            numHeight = numHeight + parseFloat( separation.split("%")[0] ) 
            this.bodyTop = numHeight+"%"; 
        }
        
        dividOrderIndex.push(this.id); // putting the div in the order control array of zIndex        
    } // end of connectedCallback()    
} // end of Folder classe


//############################################################################################################
// function that makes Folders draggable
//############################################################################################################
function makesDraggable(elmnt) {
    
    var pos1 = 0, pos2 = 0, pos3 = 0, pos4 = 0;
    
    document.getElementById(elmnt.id + "tomove").onmousedown = dragMouseDown;
    
    document.getElementById(elmnt.id).onmousedown = function(){
        for (let i = dividOrderIndex.indexOf(elmnt.id); i < dividOrderIndex.length-1 ;i++){ //loop starts at the index of the clicked element and goes to the penultimate index
            dividOrderIndex[i] = dividOrderIndex[i+1]; // copy the id of the next index in the array
            document.getElementById(dividOrderIndex[i]).style.zIndex =  i+10; //takes the element that has the id that is now stored in this array position and changes the zIndex to the current index (plus 10)            
        }
        
        dividOrderIndex[dividOrderIndex.length-1]  = elmnt.id; // a id of the clicked element is thrown to the highest value index of the array
        elmnt.style.zIndex = (dividOrderIndex.length-1)+10;  // zIndex of the clicked element is set to the value of the last array index (plus 10)
    }
    
    function dragMouseDown(e) {  
        e = e || window.event;
        e.preventDefault();        
        
        for (let i = dividOrderIndex.indexOf(elmnt.id); i < dividOrderIndex.length-1 ;i++){ //loop starts at the index of the clicked element and goes to the penultimate index
            dividOrderIndex[i] = dividOrderIndex[i+1]; // copy the id of the next index in the array
            document.getElementById(dividOrderIndex[i]).style.zIndex =  i+10; //takes the element that has the id that is now stored in this array position and changes the zIndex to the current index (plus 10)            
        }
        
        dividOrderIndex[dividOrderIndex.length-1]  = elmnt.id; // a id of the clicked element is thrown to the highest value index of the array
        elmnt.style.zIndex = (dividOrderIndex.length-1)+10;  // zIndex of the clicked element is set to the value of the last array index (plus 10)
        
        // get the location of the mouse cursor at the time of the mousedown event:
        pos3 = e.clientX;
        pos4 = e.clientY;
        
        document.onmouseup = closeDragElement;
        
        // function called each time the cursor moves:
        document.onmousemove = elementDrag;
    }
    
    function elementDrag(e) {
        e = e || window.event;
        e.preventDefault();
        
        // calculates the new cursor position:
        pos1 = pos3 - e.clientX;
        pos2 = pos4 - e.clientY;
        
        pos3 = e.clientX;
        pos4 = e.clientY;
        
        if(elmnt.parentElement.toString() != "[object HTMLBodyElement]"){   // se o parentElement não for o body
            
            //checking if it is within the limits of the parentElement
            
            if(elmnt.offsetTop > 0 ){
                if(elmnt.offsetLef > 0){
                    if( (elmnt.offsetTop + elmnt.offsetHeight) < elmnt.parentElement.offsetHeight ) {
                        if( (elmnt.offsetLef + elmnt.offsetWidth) <  elmnt.parentElement.offsetWidth ) {
                            elmnt.style.top = (elmnt.offsetTop - pos2) + "px";
                            elmnt.style.left = (elmnt.offsetLef - pos1) + "px"; 
                        }else{
                            elmnt.style.left = (elmnt.parentElement.offsetWidth - (elmnt.offsetWidth+7))  + "px";  
                            closeDragElement(); 
                        }
                    } else{
                        elmnt.style.top = (elmnt.parentElement.offsetHeight - (elmnt.offsetHeight+22)) + "px";  
                        closeDragElement();     
                    }    
                    
                }else{
                    elmnt.style.left =  "1px";
                    closeDragElement();                      
                }
            }else{ 
                elmnt.style.top = "1px";
                closeDragElement();                       
            }                        
        }else{
            //sets the new position of the element:
            elmnt.style.top = (elmnt.offsetTop - pos2) + "px";
            elmnt.style.left = (elmnt.offsetLef - pos1) + "px";
        }        
    }
    
    function closeDragElement() {
        
        document.onmouseup = null;
        document.onmousemove = null;
    }
}

//#################################################################################################################################################
// function called every 250 milliseconds if the document has not finished loading, if it has finished it inserts the tabs' ears
//#################################################################################################################################################
function insertEars(){
    if (document.readyState === 'complete'){
        
        var foldersArray = document.getElementsByTagName('one-folder');
        
        for(var i=0; i<foldersArray .length; i++) { 
            
            let tabArray = foldersArray[i].getElementsByTagName('one-tab');	 
            let tabArraySameNivel = new Array(); // array to filter only the tabs that are on the first level of the Folder
            
            for(var n = 0; n < tabArray.length; n++){	
                if(tabArray[n].parentElement == foldersArray[i]){ tabArraySameNivel.push(tabArray[n]); }
            }            
            
            for(var x = 0; x < tabArraySameNivel.length; x++){
                
                //creating the tab to move the Folder (if it is draggable)
                if(x == 0){
                    if(foldersArray[i].draggable=='y'){
                        var dragDiv = document.createElement("div");
                        dragDiv.id = foldersArray[i].id+"tomove";
                        dragDiv.title = "click and drag to to-move the Folder";                         
                        dragDiv.style.position = "absolute";
                        dragDiv.style.display = "block";
                        dragDiv.style.backgroundColor = "#B0E0E6";
                        dragDiv.style.cursor = "move";
                        dragDiv.style.height = "8%";
                        dragDiv.style.width = "3%";                            
                        if (foldersArray[i].earHeight == "15%"){ dragDiv.style.top = "7%"; } else { dragDiv.style.top = "3%"; }                            
                        dragDiv.style.left = foldersArray[i].offsetRigh+"%";                               
                        dragDiv.style.borderTopLeftRadius = "90%";
                        dragDiv.style.borderLeft = "solid 2px #8B0000";
                        dragDiv.style.borderTop = "solid 2px #8B0000"; 
                        
                        document.getElementById(foldersArray[i].id).appendChild(dragDiv);    
                        makesDraggable(document.getElementById(foldersArray[i].id)); // calling the function that makes draggable
                    }
                }                              
                
                //snippet that hides the BODY of the tabs that are not focused and shows the BODY of the focused tab:
                if(tabArraySameNivel[x].order==1){ tabArraySameNivel[x].style.display='block'; }else{ tabArraySameNivel[x].style.display='none'; }   
                
                // creating and styling the tab ears divs
                var earDiv = document.createElement("div");
                earDiv.id = foldersArray[i].id+"tabEar"+tabArraySameNivel[x].order;
                earDiv.order = tabArraySameNivel[x].order;
                earDiv.style.width = ( ((95 - foldersArray[i].offsetRigh) - foldersArray[i].offsetLef)/tabArraySameNivel.length)+"%";
                //left of each ear calculated according to your order number in the Folder
                earDiv.style.left = ( 3 + foldersArray[i].offsetRigh + ( (tabArraySameNivel[x].order - 1) * ( ((95 - foldersArray[i].offsetRigh) - foldersArray[i].offsetLef) / tabArraySameNivel.length)) )+"%" ;
                earDiv.style.position = "absolute";
                earDiv.style.display = "block";
                earDiv.style.top = "0%";
                earDiv.style.backgroundColor =  tabArraySameNivel[x].earColor;  
                earDiv.style.border = "2px solid #8B0000"; 
                earDiv.style.height = foldersArray[i].earHeight ;
                earDiv.style.padding = "2px";
                earDiv.style.display = "flex";
                earDiv.style.justifyContent = "center";  
                earDiv.style.alignItems = "center";
                earDiv.style.lineHeight = "100%"; 
                earDiv.style.cursor = "pointer";
                earDiv.style.fontFamily = "Arial"; 
                earDiv.style.fontSize = foldersArray[i].defaultSizeEaarFont;
                earDiv.style.color = "white";                        
                earDiv.style.zIndex = "2";      
                earDiv.innerHTML = tabArraySameNivel[x].title; 
                earDiv.title = tabArraySameNivel[x].title;   

                if(tabArraySameNivel[x].order == 1){ 
                    earDiv.style.borderTopLeftRadius = tabArraySameNivel[x].style.borderTopLeftRadius;  
                    earDiv.style.backgroundColor =  foldersArray[i].colorTabEarFocus;  
                    earDiv.style.cursor = "default";
                }

                if(tabArraySameNivel[x].order == tabArraySameNivel.length){ earDiv.style.borderTopRightRadius = tabArraySameNivel[x].style.borderTopRightRadius;   }
                earDiv.setAttribute("onclick","focusedTabSwap('" + foldersArray[i].id +"', "+tabArraySameNivel[x].order +");");
                earDiv.setAttribute("onmouseover","mouseOverEar('"+earDiv.id +"');");
                earDiv.setAttribute("onmouseout","mouseOutEar('"+ foldersArray[i].id+"', '"+earDiv.order+"');");
                
                document.getElementById(foldersArray[i].id).appendChild(earDiv);    
            } 
        }         
    }else{ setTimeout(insertEars, 250);}    
} // fim da função insertEars

customElements.define("one-tab", Tab);
customElements.define("one-folder", Folder);
setTimeout(insertEars, 250);

