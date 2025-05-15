document.addEventListener('DOMContentLoaded', ()=>{
    document.querySelectorAll('[data-tooltip]').forEach((el)=>{
        el.addEventListener('mouseenter', ()=> {
            let text = el.getAttribute('data-tooltip')

            let tooltip = document.getElementById('custom-tooltip');
            if(!tooltip) {
                tooltip = document.createElement('div');
                tooltip.id = 'custom-tooltip';
                
                tooltip.classList.add('tooltip-after');
                document.body.appendChild(tooltip)
            }
            

            tooltip.textContent = text;
            tooltip.classList.add('visible');


            const rect = el.getBoundingClientRect();
            const tooltipRect = tooltip.getBoundingClientRect();
            let top = window.scrollY + rect.bottom + 8; // 8px offset
            let left = window.scrollX + rect.left;

            // Check right overflow
            if (left + tooltipRect.width > window.scrollX + window.innerWidth) {
              left = window.scrollX + window.innerWidth - tooltipRect.width - 8;
            }
            // Check left overflow
            if (left < window.scrollX) {
              left = window.scrollX + 8;
            }
            // Check bottom overflow
            if (top + tooltipRect.height > window.scrollY + window.innerHeight) {
              top = window.scrollY + rect.top - tooltipRect.height - 8;
            }
            // Check top overflow
            if (top < window.scrollY) {
              top = window.scrollY + 8;
            }
        
            tooltip.style.top = `${top}px`;
            tooltip.style.left = `${left}px`;
        })

        el.addEventListener('mouseleave', () => {
            let tooltip = document.getElementById('custom-tooltip');
             if (tooltip) tooltip.classList.remove('visible');
          });
    })
})