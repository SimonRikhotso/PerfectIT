function escapeVideoText(value = "") {
    return String(value)
        .replaceAll("&", "&amp;")
        .replaceAll("<", "&lt;")
        .replaceAll(">", "&gt;")
        .replaceAll('"', "&quot;")
        .replaceAll("'", "&#039;");
}

function createVideoPlayer(video) {
    const title = escapeVideoText(video.title || "PerfectIT video");
    const source = escapeVideoText(video.source || "");

    if (video.type === "youtube") {
        return `
            <div class="responsive-video">
                <iframe
                    src="${source}"
                    title="${title}"
                    loading="lazy"
                    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                    allowfullscreen>
                </iframe>
            </div>`;
    }

    const poster = video.poster
        ? ` poster="${escapeVideoText(video.poster)}"`
        : "";

    const captions = video.captions
        ? `<track kind="captions" src="${escapeVideoText(video.captions)}" srclang="en" label="English">`
        : "";

    return `
        <div class="responsive-video">
            <video controls preload="metadata" playsinline${poster}>
                <source src="${source}" type="video/mp4">
                ${captions}
                Your browser does not support HTML video.
            </video>
        </div>`;
}

function createHomeBrandAdvert(video) {
    const title = escapeVideoText(video.title || "Discover PerfectIT");
    const source = escapeVideoText(video.source || "");
    const poster = video.poster
        ? ` poster="${escapeVideoText(video.poster)}"`
        : "";
    const captions = video.captions
        ? `<track kind="captions" src="${escapeVideoText(video.captions)}" srclang="en" label="English">`
        : "";

    return `
        <article class="site-video-card home-brand-video-card">
            <div class="home-brand-player">
                <video
                    class="home-brand-video"
                    preload="metadata"
                    playsinline
                    ${video.autoplay ? "autoplay" : ""}
                    ${video.loop ? "loop" : ""}
                    ${video.startMuted !== false ? "muted" : ""}${poster}
                    aria-label="${title}">
                    <source src="${source}" type="video/mp4">
                    ${captions}
                    Your browser does not support HTML video.
                </video>

                <div class="home-video-overlay">
                    <button class="home-video-sound-button" type="button" data-home-video-sound>
                        <span aria-hidden="true">🔊</span>
                        Play with sound
                    </button>
                </div>

                <div class="home-video-controls">
                    <button type="button" data-home-video-toggle aria-label="Pause advert">Pause</button>
                    <button type="button" data-home-video-mute aria-label="Turn sound on">Sound on</button>
                </div>
            </div>

            <div class="site-video-copy home-brand-video-copy">
                <span class="video-label">PerfectIT in action</span>
                <h3>${title}</h3>
                ${video.description ? `<p>${escapeVideoText(video.description)}</p>` : ""}
                <p class="home-video-note">The advert repeats automatically while this page remains open.</p>
            </div>
        </article>`;
}

function setupHomeBrandAdvert(card) {
    const video = card.querySelector(".home-brand-video");
    const overlay = card.querySelector(".home-video-overlay");
    const soundButton = card.querySelector("[data-home-video-sound]");
    const toggleButton = card.querySelector("[data-home-video-toggle]");
    const muteButton = card.querySelector("[data-home-video-mute]");

    if (!video) return;

    const playVideo = async () => {
        try {
            await video.play();
            if (toggleButton) {
                toggleButton.textContent = "Pause";
                toggleButton.setAttribute("aria-label", "Pause advert");
            }
        } catch (error) {
            console.info("Autoplay is waiting for visitor interaction.");
        }
    };

    playVideo();

    soundButton?.addEventListener("click", async () => {
        video.muted = false;
        video.volume = 1;
        overlay?.classList.add("is-hidden");
        if (muteButton) {
            muteButton.textContent = "Mute";
            muteButton.setAttribute("aria-label", "Mute advert");
        }
        await playVideo();
    });

    toggleButton?.addEventListener("click", async () => {
        if (video.paused) {
            await playVideo();
        } else {
            video.pause();
            toggleButton.textContent = "Play";
            toggleButton.setAttribute("aria-label", "Play advert");
        }
    });

    muteButton?.addEventListener("click", async () => {
        video.muted = !video.muted;
        muteButton.textContent = video.muted ? "Sound on" : "Mute";
        muteButton.setAttribute("aria-label", video.muted ? "Turn sound on" : "Mute advert");
        if (!video.muted) overlay?.classList.add("is-hidden");
        await playVideo();
    });

    document.addEventListener("visibilitychange", () => {
        if (document.hidden) {
            video.pause();
        } else {
            playVideo();
        }
    });
}

async function loadPageVideos() {
    const section = document.querySelector("[data-video-page]");
    if (!section) return;

    const page = section.dataset.videoPage;
    const grid = section.querySelector("[data-video-grid]");
    if (!grid) return;

    try {
        const response = await fetch("../data/videos.json");
        if (!response.ok) throw new Error(`Video data request failed: ${response.status}`);

        const videoData = await response.json();
        const videos = (videoData[page] || []).filter(video => video.enabled && video.source);

        if (videos.length === 0) {
            section.hidden = true;
            return;
        }

        if (page === "home" && videos[0].presentation === "brand-advert" && videos[0].type === "local") {
            grid.innerHTML = createHomeBrandAdvert(videos[0]);
            section.hidden = false;
            setupHomeBrandAdvert(grid.querySelector(".home-brand-video-card"));
            return;
        }

        grid.innerHTML = videos.map(video => `
            <article class="site-video-card">
                ${createVideoPlayer(video)}
                <div class="site-video-copy">
                    ${video.program ? `<span class="video-label">${escapeVideoText(video.program)}</span>` : ""}
                    <h3>${escapeVideoText(video.title)}</h3>
                    ${video.description ? `<p>${escapeVideoText(video.description)}</p>` : ""}
                </div>
            </article>
        `).join("");

        section.hidden = false;
    } catch (error) {
        section.hidden = true;
        console.error("Unable to load page videos:", error);
    }
}

document.addEventListener("DOMContentLoaded", loadPageVideos);
