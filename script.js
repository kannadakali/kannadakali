document.addEventListener("DOMContentLoaded", function () {
    // Hardcoded story and quiz content for demonstration
    const storyText = "Your story text goes here...";
    document.getElementById('storyContent').innerText = storyText;

    const quizQuestions = `
        <p>Question 1: <input type="radio" name="q1" value="A"> Option A</p>
        <p>Question 2: <input type="radio" name="q2" value="B"> Option B</p>
        <!-- Add more questions as needed -->
    `;
    document.getElementById('quizContainer').innerHTML = quizQuestions;

    // Audio recording setup
    let mediaRecorder;
    let audioChunks = [];
    const recordButton = document.getElementById('recordButton');
    const audioPlayback = document.getElementById('audioPlayback');
    const audioData = document.getElementById('audioData');

    recordButton.addEventListener('click', function () {
        if (!mediaRecorder || mediaRecorder.state === 'inactive') {
            navigator.mediaDevices.getUserMedia({ audio: true })
                .then(stream => {
                    mediaRecorder = new MediaRecorder(stream);
                    mediaRecorder.ondataavailable = e => audioChunks.push(e.data);
                    mediaRecorder.onstop = () => {
                        const audioBlob = new Blob(audioChunks, { type: 'audio/mp3' });
                        const audioUrl = URL.createObjectURL(audioBlob);
                        audioPlayback.src = audioUrl;
                        audioPlayback.hidden = false;
                        audioChunks = [];

                        // Prepare the audio file for upload
                        audioData.files = [new File([audioBlob], "audio-recording.mp3", { type: 'audio/mp3' })];
                    };
                    mediaRecorder.start();
                    recordButton.textContent = 'Stop Recording';
                });
        } else {
            mediaRecorder.stop();
            recordButton.textContent = 'Start Recording';
        }
    });

    // Form submission logic
    const quizForm = document.getElementById('quizForm');
    quizForm.addEventListener('submit', function (e) {
        e.preventDefault();

        const formData = new FormData(this);
        formData.append('audioData', audioData.files[0]);

        // Send the data to the server
        fetch('/send-email', {
            method: 'POST',
            body: formData
        })
        .then(response => response.json())
        .then(data => alert(data.message))
        .catch(error => console.error('Error:', error));
    });
});
