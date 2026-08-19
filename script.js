const localVideo = document.getElementById("localVideo");
const remoteVideo = document.getElementById("remoteVideo");

const muteButton = document.getElementById("muteButton");
const cameraButton = document.getElementById("cameraButton");

const muteIcon = document.getElementById("muteIcon");
const cameraIcon = document.getElementById("cameraIcon");

const cameraOff = document.getElementById("cameraOff");

const callTime = document.getElementById("callTime");
const endCallButton = document.getElementById("endCallButton");

let localStream = null;
let microphoneEnabled = true;
let cameraEnabled = true;

let seconds = 0;


/* =========================
   CAMERA
========================= */

async function startCamera() {

    try {

        localStream = await navigator.mediaDevices.getUserMedia({
            video: {
                width: {
                    ideal: 1280
                },
                height: {
                    ideal: 720
                },
                facingMode: "user"
            },

            audio: true
        });

        localVideo.srcObject = localStream;

    } catch (error) {

        console.error("Camera access failed:", error);

        cameraOff.classList.add("active");

        cameraIcon.textContent = "🚫";

        alert(
            "Camera access was denied or is unavailable. " +
            "Please allow camera access in your browser settings."
        );
    }
}


/* =========================
   MUTE
========================= */

muteButton.addEventListener("click", () => {

    if (!localStream) {
        return;
    }

    const audioTracks = localStream.getAudioTracks();

    if (audioTracks.length === 0) {
        return;
    }

    microphoneEnabled = !microphoneEnabled;

    audioTracks.forEach(track => {
        track.enabled = microphoneEnabled;
    });

    if (microphoneEnabled) {

        muteIcon.textContent = "🎤";

        muteButton.style.background =
            "rgba(50, 50, 50, 0.8)";

    } else {

        muteIcon.textContent = "🔇";

        muteButton.style.background =
            "rgba(255, 255, 255, 0.25)";
    }
});


/* =========================
   CAMERA TOGGLE
========================= */

cameraButton.addEventListener("click", () => {

    if (!localStream) {
        return;
    }

    const videoTracks = localStream.getVideoTracks();

    if (videoTracks.length === 0) {
        return;
    }

    cameraEnabled = !cameraEnabled;

    videoTracks.forEach(track => {
        track.enabled = cameraEnabled;
    });

    if (cameraEnabled) {

        cameraOff.classList.remove("active");

        cameraIcon.textContent = "📹";

        cameraButton.style.background =
            "rgba(50, 50, 50, 0.8)";

    } else {

        cameraOff.classList.add("active");

        cameraIcon.textContent = "🚫";

        cameraButton.style.background =
            "rgba(255, 255, 255, 0.25)";
    }
});


/* =========================
   CALL TIMER
========================= */

function updateTimer() {

    seconds++;

    const minutes = Math.floor(seconds / 60);

    const remainingSeconds = seconds % 60;

    callTime.textContent =
        String(minutes).padStart(2, "0") +
        ":" +
        String(remainingSeconds).padStart(2, "0");
}

setInterval(updateTimer, 1000);


/* =========================
   END CALL
========================= */

endCallButton.addEventListener("click", () => {

    if (localStream) {

        localStream.getTracks().forEach(track => {
            track.stop();
        });

        localStream = null;
    }

    localVideo.srcObject = null;

    document.querySelector(".call-screen").innerHTML = `
        <div class="call-ended">
            <div class="ended-icon">☎</div>

            <h2>Call ended</h2>

            <p>
                You ate together for
                <strong>${callTime.textContent}</strong>
            </p>

            <button onclick="location.reload()">
                Call again
            </button>
        </div>
    `;

});


/* =========================
   START
========================= */

remoteVideo.play().catch(() => {
    console.log("Autoplay requires user interaction.");
});

startCamera();