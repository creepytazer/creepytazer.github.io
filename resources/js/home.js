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
  window.addEventListener('scroll',shrinkHeaderAndContent)

  slides = document.getElementsByClassName("slideshow-images")[0].getElementsByTagName("div");
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

  // shrinkHeaderAndContent()
  addProjectEventListeners();
}
function homeHTML() {
  var html = `
  <div id="transition-wall"></div>
    <header id="home-backing">
      <div>
        <span>Tyler Riggs</span>
      </div>
    </header>
    <div id="home-cover">
      <div id="home-scroll-down">
        <i class="fa-solid fa-angles-down"></i>
      </div>
      <div id="home-content">
        <div id="home-content-top"></div>
        <div class="project-section">
          <h2 class="section-header">Projects</h2>
        </div>
        <div class="slideshow">
          <div class="arrow" style="left: -40px">
            <i class="arrow-left fa-solid fa-caret-left"></i>
          </div>
          <div class="arrow" style="right: -40px">
            <i class="arrow-right fa-solid fa-caret-right"></i>
          </div>
          <div class="slideshow-images">
            <div id="project-maze" class="slide-in-left">
              <img src="resources/images/maze-thumb.jpg" alt="Maze Image">
              <span class="home-project-banner">Maze Game</span>
            </div>
            <div id="project-botstacle">
              <img src="resources/projects/botstacle course/images/stage1.png" alt="Botstacle Image">
              <span class="home-project-banner">Botstacle Course</span>
            </div>
            <div>
              <img src="resources/images/green.jpg" alt="Image 3">
              <span class="home-project-banner">Green Game</span>
            </div>
          </div>
        </div>
        <div id="about-section">
          <h2 id="about-top">
            <span>About Me</span>
          </h2>
          <div class="collapsible about-text" style="height: 0px;">
            <p>Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Est ullamcorper eget nulla facilisi etiam dignissim diam quis enim. Cras tincidunt lobortis feugiat vivamus. Lectus urna duis convallis convallis tellus id interdum. Cras ornare arcu dui vivamus arcu felis bibendum. Dolor sit amet consectetur adipiscing elit. Amet porttitor eget dolor morbi non. Non tellus orci ac auctor augue mauris augue neque gravida. Sit amet nisl suscipit adipiscing bibendum est. Mus mauris vitae ultricies leo integer. Nec tincidunt praesent semper feugiat nibh sed. Luctus accumsan tortor posuere ac ut consequat. At tempor commodo ullamcorper a lacus vestibulum sed arcu.
              
                            Id volutpat lacus laoreet non curabitur gravida. Commodo ullamcorper a lacus vestibulum sed arcu. A lacus vestibulum sed arcu non. Elementum tempus egestas sed sed. Molestie ac feugiat sed lectus vestibulum mattis ullamcorper velit sed. Turpis nunc eget lorem dolor sed viverra ipsum. Ipsum consequat nisl vel pretium lectus quam id. Penatibus et magnis dis parturient montes nascetur ridiculus. Platea dictumst vestibulum rhoncus est pellentesque elit ullamcorper. Velit scelerisque in dictum non consectetur a erat. Aliquam faucibus purus in massa tempor. Fames ac turpis egestas maecenas pharetra. Fringilla est ullamcorper eget nulla facilisi etiam. Velit dignissim sodales ut eu sem integer vitae. Ultrices gravida dictum fusce ut. In nulla posuere sollicitudin aliquam ultrices sagittis orci. Urna duis convallis convallis tellus. Quam adipiscing vitae proin sagittis. Egestas diam in arcu cursus euismod quis viverra nibh.</p>
          </div>
          <h2 id="about-bottom">
            <i id="about-drop" class="drop fa-solid fa-caret-down"></i>
          </h2>
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
      <div id="construction-banner">
        <span>Website Under Construction</span>
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
    event.target.classList.remove('fa-caret-down')
    event.target.classList.add('fa-minus')
    parts[2].style.background = 'linear-gradient(to bottom left,#222222 0%, #555555 90%)'
  } else {
    collapse(parts[1])
    event.target.classList.remove('fa-minus')
    event.target.classList.add('fa-caret-down')
    parts[2].style.background = 'linear-gradient(to top left,#222222 0%, #555555 90%)'

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
  var scrollPosition = window.scrollY;
  document.getElementById('home-content').style.opacity = (scrollPosition / document.documentElement.clientHeight) * 3
  document.getElementById('home-scroll-down').style.opacity = 1 - (scrollPosition / document.documentElement.clientHeight) * 5
}

function addProjectEventListeners() {
  document.getElementById('project-maze').addEventListener('click', () => {
    window.removeEventListener('scroll', shrinkHeaderAndContent)
    mazeTransition()})
  document.getElementById('project-botstacle').addEventListener('click', () => {
    window.removeEventListener('scroll', shrinkHeaderAndContent)
    BotstacleTransition()})
}