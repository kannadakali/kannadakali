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
const statusMessage = document.getElementById('statusMessage'); // Status message element

quizForm.addEventListener('submit', function (e) {
    e.preventDefault();

    // Display a starting message
    statusMessage.textContent = 'Starting to send...';
    statusMessage.style.color = 'blue';

    const userName = document.getElementById('userName').value;
    const audioBlob = audioData.files[0];
    const reader = new FileReader();

    reader.onloadend = function() {
        const base64AudioMessage = reader.result.toString().split(',')[1];

        // Display a sending message
        statusMessage.textContent = 'Sending...';
        statusMessage.style.color = 'blue';

        fetch('https://us-central1-kannada-kali-site.cloudfunctions.net/sendEmail', {
            method: 'POST',
            body: JSON.stringify({ userName, audioData: base64AudioMessage }),
            headers: {
                'Content-Type': 'application/json'
            }
        })
        .then(response => response.json())
        .then(data => {
            // Display success message
            statusMessage.textContent = 'Submission successful!';
            statusMessage.style.color = 'green';
            alert(data.message);
        })
        .catch(error => {
            // Display error message
            console.error('Error:', error);
            statusMessage.textContent = 'Error sending submission.';
            statusMessage.style.color = 'red';
        });
    };

    // Start reading the audio data
    reader.readAsDataURL(audioBlob);
});


})