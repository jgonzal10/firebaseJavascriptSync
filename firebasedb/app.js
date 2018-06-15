
  // Initialize Firebase
  var config = {

  };
  firebase.initializeApp(config);

const dbRef = firebase.database().ref();
const canvasRef = dbRef.child('canvas');

readCanvasData();



function readCanvasData() {

	const canvasListUI = document.getElementById("canvasList");

	canvasRef.on("value", snap => {
       

		canvasListUI.innerHTML = ""

		snap.forEach(childSnap => {

			let key = childSnap.key,
			value = childSnap.val()
          //  console.log(value);
			let $li = document.createElement("li");

			// edit icon
			let editIconUI = document.createElement("span");
			editIconUI.class = "edit-canvas";
			editIconUI.innerHTML = " ✎";
			editIconUI.setAttribute("userId", key);
			editIconUI.addEventListener("click", editButtonClicked)

			// delete icon
			let deleteIconUI = document.createElement("span");
			deleteIconUI.class = "delete-canvas";
			deleteIconUI.innerHTML = " ☓";
			deleteIconUI.setAttribute("canvasid", key);
			deleteIconUI.addEventListener("click", deleteButtonClicked)
		
			$li.innerHTML = value.book_page;
			$li.append(editIconUI);
		//	$li.append(deleteIconUI);

			$li.setAttribute("canvas-key", key);
			$li.addEventListener("click", canvasClicked)
			canvasListUI.append($li);

 		});


	})

}

//CANVAS INFORMATION
function canvasClicked(e) {

    var canvasID = e.target.getAttribute("canvas-key");
  
    const canvasRef = dbRef.child('canvas/' + canvasID);
  
    const canvasDetailUI = document.getElementById("canvasDetail");
    
  


    canvasRef.on("value", snap => {

        canvasDetailUI.innerHTML = ""

        snap.forEach(childSnap => {
           // console.log(childSnap)
            var $p = document.createElement("p");
            $p.innerHTML = childSnap.key  + " - " +  childSnap.val();
            canvasDetailUI.append($p);
        })

    });
  
  }

  const addCanvasBtnUI = document.getElementById("add-canvas-btn");
  addCanvasBtnUI.addEventListener("click", addCanvasBtnClicked);

 function addCanvasBtnClicked(){

    
    const canvasRef = dbRef.child('canvas');
    
    const addCanvasInputsUI = document.getElementsByClassName("canvas-input");
    
    // this object will hold the new canvas information
    let newCanvas = {};
    
    // loop through View to get the data for the model 
    for (let i = 0, len = addCanvasInputsUI.length; i < len; i++) {
    
        let key = addCanvasInputsUI[i].getAttribute('data-key');
        let value = addCanvasInputsUI[i].value;
        newCanvas[key] = value;
        }
    console.log(newCanvas)
        canvasRef.push(newCanvas, function(){
            console.log("data has been inserted");
          })


 } 



 function editButtonClicked(e){

    document.getElementById('edit-canvas-module').style.display = "block";
    document.querySelector(".edit-canvasid").value = e.target.getAttribute("userId");

    const canvasRef = dbRef.child('canvas/' + e.target.getAttribute("userId"));
    const editCanvasInputsUI = document.querySelectorAll(".edit-canvas-input");

    canvasRef.on("value", snap => {
   
        for(var i = 0, len = editCanvasInputsUI.length; i < len; i++) {
            console.log(editCanvasInputsUI[i].value)
         var key = editCanvasInputsUI[i].getAttribute("data-key");
         editCanvasInputsUI[i].value = snap.val()[key];
        }
       });

       const saveBtn = document.querySelector("#edit-canvas-btn");
       saveBtn.addEventListener("click", saveCanvasBtnClicked)
   
 }

 function saveCanvasBtnClicked(e) {
 
	const canvasID = document.querySelector(".edit-canvasid").value;
	const canvasRef = dbRef.child('canvas/' + canvasID);

	var editedCanvasObject = {}

	const editUserInputsUI = document.querySelectorAll(".edit-canvas-input");

	editUserInputsUI.forEach(function(textField) {
        console.log(textField)
		let key = textField.getAttribute("data-key");
		let value = textField.value;
        editedCanvasObject[textField.getAttribute("data-key")] = textField.value
	});



	canvasRef.update(editedCanvasObject);

	document.getElementById('edit-canvas-module').style.display = "none";


}


function deleteButtonClicked(e) {
    e.stopPropagation();
    const canvasID = e.target.getAttribute("canvasId");
    const canvasRef = dbRef.child('canvas/' + canvasID);
    canvasRef.remove()
  }