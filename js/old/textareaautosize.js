window.textarea_autosize = {

    init: function () {
        // Resize all textareas with data-autosize attribute
        document.querySelectorAll('textarea[data-autosize]').forEach(function(elem) {
            textarea_autosize.resize(elem);
        });

        // Listen for input and change events on textareas with data-autosize
        document.addEventListener('input', function(event) {
            if (event.target && event.target.matches('textarea[data-autosize]')) {
                textarea_autosize.resize(event.target);
            }
        });
        document.addEventListener('change', function(event) {
            if (event.target && event.target.matches('textarea[data-autosize]')) {
                textarea_autosize.resize(event.target);
            }
        });

        // Listen for DOMSubtreeModified event to resize textareas without data-autosize="true"
        // document.addEventListener('DOMSubtreeModified', function() {
        //     document.querySelectorAll('textarea[data-autosize]:not([data-autosize="true"])').forEach(function(elem) {
        //         textarea_autosize.resize(elem);
        //     });
        // });
    },

    resize: function (elem) {
        if (elem) {
            elem.style.height = 'auto';
            elem.style.height = (elem.scrollHeight + 5) + 'px';

            if (elem.getAttribute('data-autosize') !== 'true') {
                elem.setAttribute('data-autosize', 'true');
            }
        }
    }

};

// Initialize on DOMContentLoaded
document.addEventListener('DOMContentLoaded', function() {
    textarea_autosize.init();
});
