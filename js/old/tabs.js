// tabs init
document.querySelectorAll('.prices-block--buttons input[type="radio"]').forEach(radio => {
  radio.addEventListener('change', function() {
    const tabId = this.id.replace('btn-', '');
    document.querySelectorAll('[id^="tab-slide-"]').forEach(tab => {
      tab.classList.remove('active');
    });
    document.getElementById(tabId).classList.add('active');
  });
});