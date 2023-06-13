var switching = false
var slideIndex = 0;
var slides = null
var content = null
var header = null
function initializeHome() {
  homeHTML()
  setTimeout(() => {
    window.scrollTo(0, 0); 
  }, 300)
  header = document.getElementById("myHeader");
  content = document.getElementById("content");
  window.onscroll = function() { shrinkHeaderAndContent(header) };

  
  slides = document.getElementsByClassName("slideshow-images")[0].getElementsByTagName("img");
  var arrowLeft = document.getElementsByClassName("arrow-left")[0];
  var arrowRight = document.getElementsByClassName("arrow-right")[0];
  

  arrowLeft.addEventListener("click", previousSlide);
  arrowRight.addEventListener("click", nextSlide);

  var drops = document.getElementsByClassName('drop')
  for (var i = 0; i < drops.length; i++) {
    drops[i].addEventListener("click", toggleDrop)
  }

  var contactIcon = document.getElementById('contact-info')
  var contactInfo = document.getElementById('contact-popup')
  contactIcon.addEventListener('click', function() {
    if (window.getComputedStyle(contactInfo).getPropertyValue("opacity") == 0) {
      contactInfo.classList.add('open')
      contactInfo.classList.remove('close')
      contactInfo.focus({ focusVisible: false })
    }
  })

  contactInfo.addEventListener('focusin', function() {
    contactInfo.classList.add('open');
    contactInfo.classList.remove('close')

  });

  contactInfo.addEventListener('focusout', function() {
    if (!contactInfo.contains(document.activeElement)) {
      contactInfo.classList.remove('open');
      contactInfo.classList.add('close')
    }
  });

  shrinkHeaderAndContent()
  addProjectEventListeners();
}
function homeHTML() {
  var html = `
  <div id="transition-wall"></div>
    <header id="myHeader">
      <h1>Tyler Riggs</h1>
    </header>

    <div id="content">
      <div class="project-section">
        <h2>Projects</h2>
      </div>
      <div class="slideshow">
        <div class="arrow" style="left: -40px">
          <i class="arrow-left fa-solid fa-caret-left"></i>
        </div>
        <div class="arrow" style="right: -40px">
          <i class="arrow-right fa-solid fa-caret-right"></i>
        </div>
        <div class="slideshow-images">
          <img id="project-red" class="slide-in-left" src="resources/images/maze-thumb.jpg" alt="Image 1">

          <img src="resources/images/blue.jpg" alt="Image 2">
          <img src="resources/images/green.jpg" alt="Image 3">
        </div>
      </div>
      <div id="about-section">
        <h2>
          <span>About Me
          </span>
          <i id="about-drop" class="drop fa-solid fa-caret-down"></i>
        </h2>
        <div id="contacts" class="collapsible about-text" style="height: 0px;">
          <p>filler text</p>
        </div>
      </div>
      <div id="socials">
        <a href="/index.html" class="social-clickable">
          <i class="icon twitter fa-brands fa-twitter"></i>
        </a>
        <a href="https://www.linkedin.com/in/tyler-riggs-20bab926b/" target="_blank" class="social-clickable">
          <i class="icon linkedin fa-brands fa-linkedin-in"></i>
        </a>
        <a href="https://github.com/creepytazer" target="_blank" class="social-clickable">
          <i class="icon github fa-brands fa-github"></i>
        </a>
        <div style="position: relative;">
          <a id="contact-info" class="social-clickable">
            <i class="icon email fa-solid fa-envelope"></i>
          </a>
          <div id="contact-popup" tabindex="-1">
            <a id="mail-info" href="mailto: tylerriggslfw@gmail.com" tabindex="-1">tylerriggslfw@gmail.com</a>
          </div>
        </div>
      </div>
    </div>
    `
  document.getElementsByTagName('body')[0].innerHTML = html
}

function collapse(target) {
  var height = target.scrollHeight;
  var targetTransition = target.style.transition;

  requestAnimationFrame(function() {
      target.style.height = height + 'px';
      target.style.transition = targetTransition
      requestAnimationFrame(function() {
          target.style.height = '0px'
      })
  })
}

function unCollapse(target) {
  var sectionHeight = target.scrollHeight;

  target.style.height = sectionHeight + 'px';

  var func = function(event) {
    target.removeEventListener('transitionend', func);
    target.style.height = null;
  }
    target.addEventListener('transitionend', func);
}

function toggleDrop(event) {
  var section = event.target.parentElement.parentElement
  var parts = section.children
  if (parts[1].style.height == '0px') {
    unCollapse(parts[1])
    parts[0].children[1].classList.remove('fa-caret-down')
    parts[0].children[1].classList.add('fa-minus')    
  } else {
    collapse(parts[1])
    parts[0].children[1].classList.remove('fa-minus')
    parts[0].children[1].classList.add('fa-caret-down')
  }
}

function nextSlide() {
  if (!switching) {
    slideIndex++;
    showSlide(slideIndex, slideIndex - 1, "right");
  }
}

function previousSlide() {
  if (!switching) {
  slideIndex--;
  showSlide(slideIndex, slideIndex + 1, "left");
  }
}

function showSlide(n, prev, direction) {
  if (n >= slides.length) {
    slideIndex = 0;
  } else if (n < 0) {
    slideIndex = slides.length - 1;
  }

  slides[prev].classList.remove("slide-in-left");
  slides[prev].classList.remove("slide-in-right");
  slides[prev].classList.add("slide-out-" + direction);

  slides[slideIndex].classList.remove("slide-out-left");
  slides[slideIndex].classList.remove("slide-out-right");
  if (direction === "left") {
    slides[slideIndex].classList.add("slide-in-left");
  } else if (direction === "right") {
    slides[slideIndex].classList.add("slide-in-right");
  }
  switching = true
  setTimeout(() => {
    switching = false
  }, 1000)
}

function shrinkHeaderAndContent() {  
  var scrollPosition = window.pageYOffset;
  var cap = document.documentElement.clientHeight * 0.8 + 38;
  var maxShrinkAmount = 70;
  var shrinkAmount = Math.min(scrollPosition / 3, maxShrinkAmount);

  // Apply the calculated shrinkage to the header
  header.style.padding = (20 - shrinkAmount) + "px";
  header.style.fontSize = (48 - (shrinkAmount / 3)) + "px";
  
  // Adjust the height of the header based on the scroll position
  header.style.height = (80 - shrinkAmount) + "vh";
  var dist = window.pageYOffset + header.getBoundingClientRect().top + header.offsetHeight
  if (scrollPosition < 220) {
    content.style['margin-top'] = dist + 'px'
  } 
}

function addProjectEventListeners() {
  document.getElementById('project-red').addEventListener('click', mazeTransition)
}