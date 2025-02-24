document.addEventListener("DOMContentLoaded", () => {
                
    let quizData = []
    // Image zoom and pan functionality
    let scale = 1;
    let falseIdentified = false;
    let points = 0;
    let questionNumber = 0;
    let title = "novice";
    const jsConfetti = new JSConfetti()
    const maxPoints = 20;
    const difficultySelect = document.getElementById("difficulty");
    const quizImg = document.getElementById("quiz-img");
    const answersContainer = document.querySelector(".answer-buttons");
    const resultText = document.querySelector(".result");
    const progressFill = document.querySelector(".progress-fill");
    const progressLabel = document.querySelector(".progress-label")

    // Fetch quiz data from metadata.json
    fetch("metadata.json")
        .then(response => response.json())
        .then(data => {
            quizData = data;
            difficultySelect.addEventListener("change", loadQuiz)
        })
        .catch(error => console.error("Error loading quiz data:", error));


    function loadQuiz() {
        const randomIndex = Math.floor(Math.random() * quizData.length);
        const question = quizData[randomIndex];
        const difficulty = difficultySelect.value;

        resultText.innerHTML = ""

        updateProgressBar();

        if (questionNumber == maxPoints){
            answersContainer.innerHTML = '<div></div>'
            showResult();
            return
        }

        quizImg.src = question["image-URL"];
        questionNumber += 1;
        scale = 1;
        quizImg.style.transform = `scale(${scale})`;
        falseIdentified = false;

        let answerOptions = [...question.falseType[difficulty], question.pollenType];
        answerOptions = shuffleArray(answerOptions);

        renderAnswerButtons(answerOptions, question.pollenType);
    }

    function renderAnswerButtons(options, correctAnswer) {
        answersContainer.innerHTML = '<div></div>';

        options.forEach(option => {
            const button = document.createElement("button");
            button.classList.add("multiplechoice");
            button.textContent = option;
            button.addEventListener("click", () => checkAnswer(option, correctAnswer, button));
            answersContainer.appendChild(button);
        });
    }

    async function checkAnswer(selected, correct, button) {
        if (selected === correct) {
            resultText.innerHTML = "✔ Correct!";
            resultText.style.color = "green";
            await new Promise(resolve => setTimeout(resolve, 750));
            if (!falseIdentified){points += 1;}
            loadQuiz();
            resultText.innerHTML = "";
            resultText.style.color = "black";
        } else {
            falseIdentified = true;
            button.disabled = true;  // Disable the clicked button
            button.style.opacity = "0.5";  // Reduce opacity to indicate it's inactive
            resultText.innerHTML = "&#x274C; Incorrect! Try again!";
            resultText.style.color = "red";
            await new Promise(resolve => setTimeout(resolve, 1500));
            resultText.innerHTML = "";
            resultText.style.color = "black";
        }  
    }

    function shuffleArray(array) {
        for (let i = array.length - 1; i > 0; i--) {
            const j = Math.floor(Math.random() * (i + 1));
            [array[i], array[j]] = [array[j], array[i]];
        }
        return array;
    }

    function updateProgressBar() {
        
        progressFill.style.width = (points/maxPoints)*100 + '%'
        progressLabel.textContent = points + " Answers correct:"

        switch(points){
            case 4:
                title = "amateur"
                jsConfetti.addConfetti({
                    emojis: ['🫡', '⚡️', '👌', '🫣', '🥳', '🤭'],
                })
                break;
            
            case 10:
                title = "intermediate"
                jsConfetti.addConfetti({
                    emojis: ['🫡', '😍', '🙀', '🤯', '🥳', '🙌'],
                })
                break;

            case 16:
                title = "expert"
                jsConfetti.addConfetti({
                    emojis: ['👾', '😍', '🙀', '🤩', '👩‍🎓', '🙌'],
                })
                break;
        }
    }

    function showResult(){
        let text = ""
        switch (difficultySelect.value){
            case "novice":
                switch (title){
                    case "novice":
                        text = "You are a " + title + " palynologist! You've got much to learn!"
                        break;

                    case "amateur":
                        text = "You are an " + title + " palynologist! You've improved! But still a long way to go!"
                        break;

                    case "intermediate":
                        text = "You are an " + title + " palynologist! Time to step up to the next level!"
                        break;

                    case "expert":
                        text = "You are an " + title + " palynologist! Pfff this is to easy! Are you scared of the harder quizes?"
                        break;
                }
                break;

            case "amateur":
                switch (title){
                    case "novice":
                        text = "You are a " + title + " palynologist! Maybe this is too hard for you ..."
                        break;

                    case "amateur":
                        text = "You are an " + title + " palynologist! You have much to learn!"
                        break;

                    case "intermediate":
                        text = "You are an " + title + " palynologist! Time to step up to the next level!"
                        break;

                    case "expert":
                        text = "You are an " + title + " palynologist! Pfff this is to easy! Are you scared of the harder quizes?"
                        break;
                }
                break;

            case "intermediate":
                switch (title){
                    case "novice":
                        text = "You are a " + title + " palynologist! This Level is too hard for you..."
                        break;

                    case "amateur":
                        text = "You are an " + title + " palynologist! Maybe you should step back to an easier level"
                        break;

                    case "intermediate":
                        text = "You are an " + title + " palynologist! You know your pollen well!"
                        break;

                    case "expert":
                        text = "You are an " + title + " palynologist! Ready to step up the game and become an expert?"
                        break;
                }
                break;

            case "expert":
                switch (title){
                    case "novice":
                        text = "You are a " + title + " palynologist! You definitely overestimated yourself!"
                        break;

                    case "amateur":
                        text = "You are an " + title + " palynologist! Maybe you should step back to an easier level"
                        break;

                    case "intermediate":
                        text = "You are an " + title + " palynologist! You know your pollen well! But not as an expert!"
                        break;

                    case "expert":
                        text = "You are an " + title + " palynologist! You've reached the peak! 🥳"
                        break;
                }
                break;
        }
        console.log(text)
        document.getElementById("result-title").innerHTML = title;
        document.getElementById("result-text").innerHTML = text;
        document.getElementById("result-screen").style.opacity = 1;
        document.getElementById("result-screen").style.pointerEvents = "all";
    }

    quizImg.addEventListener("wheel", (event) => {
        event.preventDefault();
    
        let zoomFactor = 1.05; // Smooth zoom
        if (event.deltaY > 0) {
            scale /= zoomFactor; // Zoom out
        } else {
            scale *= zoomFactor; // Zoom in
        }
    
        scale = Math.min(Math.max(0.5, scale), 3); // Keep scale in range
    
        quizImg.style.transform = `scale(${scale})`;
    });    

});
