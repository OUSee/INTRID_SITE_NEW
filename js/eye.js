
document.addEventListener('DOMContentLoaded',  () =>{
    
        const eye = {};
        const n_eye = document.querySelector(".eye");
        const n_iris = n_eye.querySelector(".iris");
        const size = n_eye.clientWidth;
        const form = document.querySelector("[data-eye]")
        console.log('=> form', form)

        const rect = n_eye.getBoundingClientRect();    
        eye.x = rect.left + size / 2;
        eye.y = rect.top + size / 2;
        
        window.onresize = () => {
        	eye.x = n_eye.offsetLeft + size / 2;
        	eye.y = n_eye.offsetTop + size / 2;
        }

        form.onmouseout = form.onmouseleave = () => {
        	n_iris.setAttribute("class", "iris anim");
        }

        form.ontouchend = e => {
        	if (e.touches.length == 0) form.onmouseout();
        }

        form.onmousemove = (e) => {
        	n_iris.setAttribute("class", "iris");
            // console.log('=> e(x, y)', e.clientX, e.clientY, 'eye', eye)
            const rect = n_eye.getBoundingClientRect();
            eye.x = rect.left + size / 2;
            eye.y = rect.top + size / 2;
    
        	const m = {
        		x: e.clientX - eye.x,
        		y: e.clientY - eye.y
        	};
        	const dist = Math.min(70, Math.max(-70, Math.sqrt(m.x**2 + m.y**2) / 3));
        	const dir = Math.atan2(m.x, m.y);
        	m.rx = dist * -Math.cos(dir);
        	m.ry = dist * Math.sin(dir);
            // console.log('=> m.rx',m.rx , 'm.ry', m.ry, 'dir', dir, 'dist', dist, 'm', m)
        	n_iris.style.transform = `rotateX(${m.rx}deg) rotateY(${m.ry}deg) translateZ(68px) scale(0.6)`;
        }

        form.ontouchmove = form.ontouchstart = e => form.onmousemove(e.touches[0])
    
})