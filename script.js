document.getElementById("seal").addEventListener("click", function () {
  document.getElementById("wrapper").classList.add("open");
  document.getElementById("seal").classList.add("hide-seal");
});

document.addEventListener('DOMContentLoaded', () => {
    const seal = document.getElementById('seal');
    const invitationContent = document.getElementById('invitationContent');
    const backgroundMusic = document.getElementById('background-music');

    seal.addEventListener('click', () => {
        // Mostrar invitación con animación (asumiendo ya tienes este código funcionando)
        invitationContent.classList.add('show');

        // Iniciar música en el momento del click
        backgroundMusic.play().catch(err => {
            console.log('Error al reproducir música:', err);
        });
    });
});


window.addEventListener('message', (event) => {
    const backgroundMusic = document.getElementById('background-music');

    if (event.data === 'toggle-music') {
        if (backgroundMusic.paused) {
            fadeAudio(backgroundMusic, 0, 1, 1000);
            backgroundMusic.play().catch(err => console.log('Error al reanudar música:', err));
            // Notificar al iframe que está reproduciendo
            document.querySelector('iframe').contentWindow.postMessage('music-playing', '*');
        } else {
            fadeAudio(backgroundMusic, 1, 0, 1000, () => backgroundMusic.pause());
            // Notificar al iframe que está pausado
            document.querySelector('iframe').contentWindow.postMessage('music-paused', '*');
        }
    }
});

// Confeti al presionar sello
document.getElementById('seal').addEventListener('click', () => {
  // Lanza confeti en forma de ráfaga
  confetti({
    particleCount: 150,
    spread: 70,
    origin: { y: 0.6 }
  });
});

