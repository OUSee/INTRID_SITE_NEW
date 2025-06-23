class orbRotation {
  constructor(orbElem) {
    this.orbElem = orbElem;
    this.visionArea = orbElem.closest('form');
    this.currentAngle = 0;

    if (window.getComputedStyle(orbElem).display !== 'none') {
      this.init();
    }
  }

  init() {
    this.visionArea.addEventListener('mouseenter', () => {
      this.orbElem.style.transition = `0.25s ease-in-out`;
    });
    this.visionArea.addEventListener('mousemove', (e) =>
      this.handleMouseMove(e)
    );
    this.visionArea.addEventListener('mouseleave', () =>
      this.handleMouseLeave()
    );
  }

  handleMouseMove(e) {
    const rect = this.visionArea.getBoundingClientRect();
    const rectOrb = this.orbElem.getBoundingClientRect();
    const centerX = rect.left + (rectOrb.left + rectOrb.width / 2);
    const centerY = rect.top + rect.height / 2;
    const angle =
      (Math.atan2(e.clientY - centerY, e.clientX - centerX) * 180) / Math.PI +
      180;

    let deltaAngle = angle - this.currentAngle;

    if (deltaAngle > 180) {
      deltaAngle -= 360;
    } else if (deltaAngle < -180) {
      deltaAngle += 360;
    }
    this.currentAngle += deltaAngle;

    this.orbElem.style.transform = `rotate(${this.currentAngle}deg)`;

    setTimeout(() => {
      this.orbElem.style.transition = `0.05s cubic-bezier(.78,.14,.59,1.04)`;
    }, 250);
  }
  
  handleMouseLeave() {
    this.currentAngle = 0;
    this.orbElem.style.transform = `rotate(${this.currentAngle}deg)`;
    this.orbElem.style.transition = `0.25s ease-in-out`;
  }
}

const orbElems = document.querySelectorAll('[vision-orb]');

if (orbElems.length > 0) {
  orbElems.forEach((orbElem) => {
    new orbRotation(orbElem);
  });
}
