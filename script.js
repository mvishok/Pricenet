console.clear();
const getStartedBtn = document.querySelector('#get-started-btn')
const getStartedSection = document.querySelector('#get-started');


if (getStartedBtn) {
  getStartedBtn.addEventListener('click', () => {
    window.scroll({
      top: getStartedSection.getBoundingClientRect().y + window.scrollY,
      left: 0,
      behavior: 'smooth'
    })
  })
}

//after load, #qry input value should be url decoded
document.addEventListener('DOMContentLoaded', function() {
  document.querySelector('#qry').value = decodeURIComponent(document.querySelector('#qry').value);
});