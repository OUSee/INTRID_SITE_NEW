// opacity header onscroll
const header = document.getElementById('header');
const preloader = document.getElementById('preloader')

window.addEventListener('scroll', function () {
    if (window.scrollY > 50) {
      header.classList.add('scrolled');
    } else {
      header.classList.remove('scrolled');
    }
  });

document.addEventListener('DOMContentLoaded', () => {
  setTimeout(()=>{
    preloader.style.display = 'none' 
  }, 3000)
})  
  