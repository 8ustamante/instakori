const timeZone = 'America/Bogota';

function getStates() {
    let usuario = document.getElementById('usuario').value;
    let nameUserProfile = document.getElementById('nameUserProfile');
    let userNameProfile = document.getElementById('userNameProfile');
    let imgProfile = document.getElementById('imgProfile');
    let historiasDiv = document.getElementById('historias');
    let loadingMessage = document.getElementById('loadingMessage');
    let historiasContainer = document.getElementById('historiasContainer');
    let countStory = document.getElementById('countStory');

    // Mostrar mensaje de cargando
    loadingMessage.style.display = 'block';
    historiasContainer.style.display = 'none';
    historiasDiv.innerHTML = ''; // Limpiar el contenido previo

    const options = {
        method: 'GET',
        headers: {
            'x-rapidapi-key': 'a051849697mshbc9ab4789512cbep19ec55jsn87de702b9930',
            'x-rapidapi-host': 'instagram-scraper-api2.p.rapidapi.com'
        }
    };
    const url = `https://instagram-scraper-api2.p.rapidapi.com/v1/stories?username_or_id_or_url=${usuario}&url_embed_safe=true`;

    fetch(url, options)
        .then((res) => res.json())
        .then(data => {
            if (data.data && data.data.items.length > 0) {
                let historiasHTML = '';
                data.data.items.forEach(item => {
                    let mediaElement = '';

                    // Verificar si es una imagen o un video
                    if (item.media_type == 1) { // Imagen
                        mediaElement = `<img src="${item.thumbnail_url}" class="card-img-top" alt="Imagen de historia">`;
                    } else if (item.media_type == 2) { // Video
                        mediaElement = `<video controls class="card-img-top">
                                          <source src="${item.video_url}" type="video/mp4">
                                          Tu navegador no soporta la reproducción de videos.
                                        </video>`;
                    }

                    // Tarjeta para cada historia
                    historiasHTML += `
                        <div class="card" style="width: 18rem; margin: 10px;">
                            ${mediaElement}
                            <div class="card-body" style="background-color: #D9D9D9;">
                                <p class="card-title">
                                    Publicado: ${convertEpochToTimeZone(item.taken_at, timeZone)}
                                </p>
                                <a href="${item.media_type == 1 ? item.thumbnail_url : item.video_url}" class="btn btn-dark" download>Download</a>
                            </div>
                        </div>`;
                });

                historiasDiv.innerHTML = historiasHTML;
                countStory.textContent = data.data.count;
            } else {
                historiasDiv.innerHTML = '<p>No hay historias disponibles.</p>';
                countStory.textContent = 0;
            }

            // Mostrar el perfil del usuario
            const user = data.data.additional_data.user;
            nameUserProfile.innerHTML = user.full_name;
            userNameProfile.innerHTML = user.username;
            imgProfile.src = user.profile_pic_url;

            // Ocultar mensaje de carga y mostrar historias
            loadingMessage.style.display = 'none';
            historiasContainer.style.display = 'block';
        })
        .catch(err => {
            console.error(err);
            historiasDiv.innerHTML = '<p>Error al obtener historias. Inténtalo de nuevo.</p>';
            countStory.textContent = 0;
            loadingMessage.style.display = 'none';
        });
}

function convertEpochToTimeZone(epochTime, timeZone) {
    const date = new Date(epochTime * 1000);
    if (isNaN(date.getTime())) {
        return "Fecha no válida";
    }

    const options = {
        year: 'numeric',
        month: 'long',
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit',
        second: '2-digit',
        hour12: false,
        timeZone: timeZone
    };

    const formatter = new Intl.DateTimeFormat('es-CO', options);
    return formatter.format(date);
}
