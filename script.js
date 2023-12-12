document.addEventListener("DOMContentLoaded", function () {
  // Fetch the story content
  fetch('story.txt')
      .then(response => response.text())
      .then(content => {
          const storyContent = document.getElementById('storyContent');
          const paragraphs = content.split('\n');
          const parsedParagraphs = paragraphs.map(parseParagraph);
          storyContent.innerHTML = parsedParagraphs.join('');
      });

  // Fetch quiz questions
  fetch('quiz_questions.txt')
      .then(response => response.text())
      .then(questionsContent => {
          const quizContainer = document.getElementById('quizContainer');
          const questions = questionsContent.split('\n');
          const parsedQuestions = questions.map(parseQuestion);
          quizContainer.innerHTML = parsedQuestions.join('');
      });

  // Audio recording functionality
  let mediaRecorder;
  let audioChunks = [];

  document.getElementById('recordButton').addEventListener('click', function () {
      if (!mediaRecorder || mediaRecorder.state === 'inactive') {
          navigator.mediaDevices.getUserMedia({ audio: true })
              .then(stream => {
                  mediaRecorder = new MediaRecorder(stream);
                  mediaRecorder.ondataavailable = e => {
                      audioChunks.push(e.data);
                  };
                  mediaRecorder.onstop = e => {
                      const audioBlob = new Blob(audioChunks, { type: 'audio/mp3' });
                      const audioUrl = URL.createObjectURL(audioBlob);
                      document.getElementById('audioPlayback').src = audioUrl;
                      document.getElementById('audioData').value = audioUrl;
                      document.getElementById('audioPlayback').hidden = false;
                      audioChunks = [];
                  };
                  mediaRecorder.start();
                  this.textContent = 'Stop Recording';
              });
      } else {
          mediaRecorder.stop();
          this.textContent = 'Start Recording';
      }
  });

  // Quiz form submission functionality
  const quizForm = document.getElementById("quizForm");
  quizForm.addEventListener("submit", function (e) {
      e.preventDefault(); // Prevent the default form submission

      const results = document.querySelector(".quiz-result");
      const questions = document.querySelectorAll(".quiz-question");

      let correctAnswers = 0;
      questions.forEach((question) => {
          const selectedOption = question.querySelector(`input[type="radio"]:checked`);
          if (selectedOption && selectedOption.dataset.correct === "true") {
              correctAnswers++;
          }
      });

      const totalQuestions = questions.length;
      const resultText = `You answered ${correctAnswers} out of ${totalQuestions} questions correctly.`;
      results.textContent = resultText;

      const userName = document.getElementById("userName").value;

      // Add code to handle the form data, including the audio
      // You will need to adjust this to match your server-side logic
      // This is a simple example to illustrate the process
      fetch("/send-email", {
          method: "POST",
          headers: {
              "Content-Type": "application/json",
          },
          body: JSON.stringify({
              userName,
              score: correctAnswers,
              // You may need to handle the audio data differently depending on your server setup
          }),
      })
          .then(response => response.json())
          .then(data => console.log(data))
          .catch(error => console.error(error));
  });
});


function parseQuestion(question) {
  const options = question.split('|');
  const questionText = options.shift();

  // Shuffle the options randomly
  const shuffledOptions = shuffleArray(options);

  // Find the index of the correct answer (the first option)
  const correctAnswerIndex = shuffledOptions.indexOf(options[0]);

  const optionsHtml = shuffledOptions.map((option, index) => {
    const isCorrect = index === correctAnswerIndex ? 'true' : 'false'; // 'true' for correct answer, 'false' for others
    return `<li><input type="radio" name="${questionText}" value="${option}" data-correct="${isCorrect}">${option}</li>`;
  }).join('');

  const questionHtml = `<strong>${questionText}</strong>`;
  return `<div class="quiz-question">${questionHtml}<ul class="quiz-options">${optionsHtml}</ul></div>`;


  // return `<div class="quiz-question">${questionText}<ul class="quiz-options">${optionsHtml}</ul></div>`;
}

// Function to shuffle an array
function shuffleArray(array) {
  const shuffledArray = [...array];
  for (let i = shuffledArray.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [shuffledArray[i], shuffledArray[j]] = [shuffledArray[j], shuffledArray[i]];
  }
  return shuffledArray;
}

function parseParagraph(paragraph) {
  // Check if the paragraph starts with '{' and ends with '}'
  if (paragraph.startsWith('{') && paragraph.endsWith('}')) {
    // Extract the title and author
    const titleAuthor = paragraph.slice(1, -1).split(', ');
    const title = titleAuthor[0];
    const author = titleAuthor[1];

    // Create HTML for the title and author with appropriate classes
    return `
      <h2 class="title">${title}</h2>
      <h3 class="author">${author}</h3>
    `;
  } else {
    // Process regular paragraphs as before
    const wordPattern = /{([^,]+), ([^}]+)}/g;
    const parsedParagraph = paragraph.replace(wordPattern, (_, kannadaWord, englishMeaning) => {
      return `<span class="word-tooltip" title="${englishMeaning}"><u>${kannadaWord}</u></span>`;
    });
    return `<p>${parsedParagraph}</p>`;
  }
}


let mediaRecorder;
let audioChunks = [];

document.getElementById('recordButton').addEventListener('click', function() {
    if (!mediaRecorder || mediaRecorder.state === 'inactive') {
        navigator.mediaDevices.getUserMedia({ audio: true })
        .then(stream => {
            mediaRecorder = new MediaRecorder(stream);
            mediaRecorder.ondataavailable = e => {
                audioChunks.push(e.data);
            };
            mediaRecorder.onstop = e => {
                const audioBlob = new Blob(audioChunks, { type: 'audio/mp3' });
                const audioUrl = URL.createObjectURL(audioBlob);
                document.getElementById('audioPlayback').src = audioUrl;
                document.getElementById('audioData').value = audioUrl;
                document.getElementById('audioPlayback').hidden = false;
                audioChunks = [];
            };
            mediaRecorder.start();
            this.textContent = 'Stop Recording';
        });
    } else {
        mediaRecorder.stop();
        this.textContent = 'Start Recording';
    }
});

// hei
