window.onload = showList();
window.onload = populateOptions();

let selectedFiles = [];

/* ELEMENT DISPLAYER */

function showList() {
  document.getElementById("myDropdown").classList.toggle("show");
}

/* SEARCHBAR WORD FILTER*/

function wordFilter() {
  var input, filter, a, i;

  input = document.getElementById("myInput");
  filter = input.value.toUpperCase();
  div = document.getElementById("myDropdown");
  a = div.getElementsByTagName("a");

  for (i = 0; i < a.length; i++) {
    txtValue = a[i].textContent || a[i].innerText;
    if (txtValue.toUpperCase().indexOf(filter) > -1) {
      a[i].style.display = "";
    } else {
      a[i].style.display = "none";
    }
  }
}

/* PROGRESS BAR */

var i = 0;
function progress() {
  if (i == 0) {
    showList();
    i = 1;
    var elem = document.getElementById("progressBar");
    var width = 1;
    var id = setInterval(frame, 60);
    function frame() {
      if (width >= 100) {
        clearInterval(id);
        i = 0;
        document.getElementById('progressBar').style.display = 'none';
        document.getElementById('content').style.display = 'block';
        location.reload();
      } else {
        width++;
        elem.style.width = width + "%";
        document.getElementById('progressBar').style.display = 'block';
      }

    }
  }
}

/* INITIAL ELEMENT LOADER */

const checkElements = function () {
  var file = $(this).val().trim();

  if (this.checked) {
    selectedFiles.push(file);
  } else {
    var index = selectedFiles.indexOf(file);

    if (index > -1) {
      selectedFiles.splice(index, 1);
    }

    for (var i = 0; i < selectedFiles.length; i++) {
      if (selectedFiles[i] === file) {
        selectedFiles.splice(i, 1);
        break;
      }
    }
  }
}




/* ANIMATIONS */

ScrollReveal().reveal('.reveal', { distance: '60px', duration: 1500, easing: 'cubic-bezier(.215,.61,.355,1)', interval: 600 });

let outline = document.querySelector('.outline');
let cursor = document.querySelector('.cursor');
let links = document.querySelectorAll('a');

document.addEventListener('mousemove', function (event) {

  let x = event.clientX;
  let y = event.clientY;

  outline.style.transform = `translate(calc(${x}px - 50%), calc(${y}px - 50%) )`;

  links.forEach((link) => {
    link.addEventListener("mouseover", function () {
      outline.classList.add('hover');
      cursor.classList.add('hover');
    });
  });
  links.forEach((link) => {
    link.addEventListener("mouseleave", function () {
      outline.classList.remove('hover');
      cursor.classList.remove('hover');
    });
  });

});

/* API OPERATIONS */

const sendFiles = () => {
  if (selectedFiles.length > 0) {
    progress();

    selectedFiles.forEach(item => {
      console.log("Selected Item: " + item);
    });

    const data = { items: selectedFiles };

    fetch("http://localhost:5000", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      cache: "no-cache",
      body: JSON.stringify(data),
    })
      .then((response) => response.json())
      .then((data) => {
        console.log("Success:", data);
      })
      .catch((error) => {
        console.error("Error:", error);
      });

    this.selectedFiles = [];

  } else {
    console.log("No files selected");
  }
};


function populateOptions() {
  fetch("https://ora-allevamenti-static-web-pagina.s3.amazonaws.com/", {
    method: "GET",
    headers: {
      "Content-Type": "text/html",
    },
    mode:'no-cors',
  })
  //.then((response) => response.json() )
  .then((data) => { 

    console.log(data)
                        var markUp = "";
                        data.body.forEach((file) => {
                              markUp += `<a class="item">
                                          ${file.name}<input type="checkbox" id="myCheck" value="${file.name}" style="margin-left: 300px;">
                                        </a>`;
                        })

                        document.getElementById("myDropdown").innerHTML = markUp;
   
})
                  
  .then(() => {
    $('input:checkbox').click(checkElements);
  })
  .catch((error) => console.error("Error: "+ error) );

}


