/**
 * Apply a rotation to the parallax container
 * @param x Percentage of the max angle on the X axis (1 = 100%)
 * @param y Percentage of the max angle on the Y axis (1 = 100%)
 */
function rotate(x, y) {
  const MAX_ANGLE = 5;
  const transform = `rotateX(${MAX_ANGLE * x}deg) rotateY(${MAX_ANGLE * y}deg)`;

  const container = document.querySelector(".parallax-base");

  container.setAttribute("style", `transform: ${transform}`);
}

/**
 * Activate the gyroscope if existing
 * @returns
 */
async function activateGyro() {
  return new Promise((resolve, reject) => {
    if (
      typeof DeviceOrientationEvent !== undefined &&
      typeof DeviceOrientationEvent.requestPermission === "function"
    ) {
      // If a Gyro exist on the device, we can ask for the permission to use it
      DeviceOrientationEvent.requestPermission()
        .then((response) => {
          // If the user accept
          if (response === "granted") {
            // Apply rotation on device tilt
            window.addEventListener("deviceorientation", (event) => {
              const angle_y = event.gamma;
              const angle_x = event.beta;

              const percent_x = Math.max(Math.min(angle_x, 40), -40) / 40;
              const percent_y = Math.max(Math.min(angle_y, 40), -40) / 40;

              rotate(percent_x, percent_y);
            });
          }

          resolve();
        })
        .catch(reject);
    } else resolve();
  });
}

document.addEventListener("click", async () => {
  // This must be done on click for "security reasons" and can't be done on load
  await activateGyro();
});

// Apply rotation on mouse move (for desktop)
document.addEventListener("mousemove", (ev) => {
  const percent_x = (ev.pageX / window.innerWidth) * 2 - 1;
  const percent_y = (ev.pageY / window.innerHeight) * 2 - 1;

  rotate(-percent_y, percent_x);
});
