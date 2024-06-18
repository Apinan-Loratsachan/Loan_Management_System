document.addEventListener('DOMContentLoaded', (event) => {
    const particles = document.querySelectorAll('.particles li');

    for (i = 0; i < 10; i++) {
        const randomSize = getRandomInt(20, 150);
        // document.getElementById(`particle${i}`).style.borderRadius = getRandomInt(0, 70) + '%'
        document.getElementById(`particle${i}`).style.left = `${getRandomInt(0, 100)}%`;
        document.getElementById(`particle${i}`).style.width = randomSize + 'px'
        document.getElementById(`particle${i}`).style.height = randomSize + 'px'
    }

    particles.forEach(particle => {
        particle.addEventListener('animationiteration', () => {
            const randomSize = getRandomInt(20, 150);
            particle.style.left = `${getRandomInt(0, 100)}%`;
            // particle.style.borderRadius = getRandomInt(0, 70) + '%'
            particle.style.width = randomSize + 'px'
            particle.style.height = randomSize + 'px'
        });
    });
});

function getRandomInt(min, max) {
    return Math.floor(Math.random() * (max - min + 1)) + min;
}