document.addEventListener('DOMContentLoaded', () => {
    const gameContainer = document.getElementById('game');
    let userId = new URLSearchParams(window.location.search).get('userId');
    let step = 0;
    let responses = {
        userId: userId,
        response1: '',
        response2: '',
        letter: '',
        response3: '',
        response4: '',
        response5: '',
        sentiment_label: ''
    };
    let nextMessages = [];

    const steps = [
        {
            message: "Hey.\n \n Hey. Can you hear me?\n\n  So pretend that I’m showing you a picture of a kitten. I can’t actually show you the picture because I’m not real, but we’re going to pretend, okay? It’s a really cute kitten. Not super young, but still small. White, long hair, brown ears. The biggest eyes you’ve ever seen on a cat. Basically the cutest thing you’ve seen all day. What’s your reaction to the picture?",
            inputType: 'text',
            responseKey: 'response1'
        },
        {
            message: "Moving on. We’re in a room now, right? The cat can still be there, if you want. Let’s say you turn to the left, towards the window. It’s dark out, and you can see the stars. Behind you there’s a fireplace with a nice blaze going. People usually call this kind of thing cozy. I wouldn’t know, since I’m not real, but I tend to believe the majority. Oh, one more thing. There’s a grandfather clock in the corner of the room, and you’ve been listening to it tick for nearly an hour now. So talk to me. How are you feeling? What do you think about the room?",
            inputType: 'text',
            responseKey: 'response2'
        },
        {
            message: "Okay. Hey. Stay focused. On the other side of the room is a chest of drawers. It’s made of one of those fancy dark woods, mahogany or something. I’m going to have you go over there and open the top left drawer. The fire is still crackling behind you, and the cat is watching you from the back of the couch. Open the drawer. That’s it. There’s a small sheet of paper in the back of the drawer. Further back than that. You have to look behind the boxes. Seriously, move the boxes. They put them there on purpose to distract you. Do you have the letter?",
            inputType: 'button',
            responseKey: 'button_response1',
            options: ['yes', 'no'],
        },
        {
            message: "Okay. \nI need you to read what that letter says.",
            inputType: 'button',
            responseKey: 'button_response2',
            options: ['why?', 'read the letter'],
        },
        {
            message: "Please enter the content of the letter:",
            inputType: 'text',
            responseKey: 'letter'
        },
        {
            message: "I never knew how to understand…  Hey, can I ask you for another favor?  Would you say that letter sounds angry?  Hate-filled maybe? Loaded with disdain?",
            inputType: 'button',
            responseKey: 'sentiment_label',
            options: ['happy', 'sad', 'angry', 'scared', 'confused', 'neutral'],

        },
        {
            message: "Hey. Wait. What’s the cat doing?\n Why is it staring like that?\n\n Go over to it. I need you to see it’s eyes.\n\n Oh God. I should have known. Stop him, you have to stop him! Don’t let him get out of this room!",
            inputType: 'text',
            responseKey: 'response3'
        },
        {
            message: "Damn it.\n\nWe don’t have much time now.  Hey.  Are you scared?  What are you afraid of?",
            inputType: 'text',
            responseKey: 'response4'
        },
        {
            message: "Yeah well, what you should be scared of is who that cat is going back to.  Throw the letter into the fireplace. \n\n" + 
             "I hear footsteps in the hallway. If you have any sense of self-preservation you’ll throw the letter into the fire and escape through the window.",
            inputType: 'button',
            responseKey: 'button_response4',
            options: ['toss into fire', 'don\'t move'],
        
        },
        {
            message: "Who do you think I am?",
            inputType: 'text',
            responseKey: 'response5'
        },
        {
            message: "They're here",
            inputType: 'button',
            options: ['End']

        }
    ];

    const renderStep = () => {
        gameContainer.innerHTML = '';

        // Render any nextMessages first
        if (nextMessages.length > 0) {
            const nextMessage = nextMessages.shift();
            const blurredBackground = document.createElement('div');
            blurredBackground.classList.add('blurred-background');
            
            const message = document.createElement('p');
            message.innerHTML = nextMessage.replace(/\n/g, '<br>');
            blurredBackground.appendChild(message);
            
            gameContainer.appendChild(blurredBackground);

            // Add a button to continue
            const continueButton = document.createElement('button');
            continueButton.textContent = 'Continue';
            continueButton.addEventListener('click', renderStep);
            gameContainer.appendChild(continueButton);
            return;
        }

        const currentStep = steps[step];

        const blurredBackground = document.createElement('div');
        blurredBackground.classList.add('blurred-background');

        const message = document.createElement('p');
        // Replace \n with <br> for HTML display
        message.innerHTML = currentStep.message.replace(/\n/g, '<br>');
        blurredBackground.appendChild(message);

        let input;

        if (currentStep.inputType === 'text') {
            input = document.createElement('input');
            input.type = 'text';
            input.id = 'userInput';
            blurredBackground.appendChild(input);
        } else if (currentStep.inputType === 'button') {
            currentStep.options.forEach(option => {
                const button = document.createElement('button');
                button.textContent = option;
                button.addEventListener('click', () => {
                    responses[currentStep.responseKey] = option;
                    handleIntermediateMessages(option); // Call handleIntermediateMessages here

                    step++;
                    if (step < steps.length) {
                        renderStep();
                    } else {
                        submitGame();
                    }
                });
                blurredBackground.appendChild(button);
            });
        }

        gameContainer.appendChild(blurredBackground);
    };

    const handleIntermediateMessages = (option) => {
        if (step === 2 && option === 'yes') {
            nextMessages.push("Good.  Good.");
        } else if (step === 2 && option === 'no') {
            nextMessages.push("Hey, come on, it’s just behind the boxes.  Grab it.  Grab it I said.");
        } else if (step === 3 && option === 'why?'){
            nextMessages.push("Don’t ask questions.  I just need you to read it, okay?  I’d do it myself, but I can’t.  And they knew I can’t, that’s why they put it here."
              + "  But they didn’t bet on me finding you, did they?  No, they didn’t.  That’s why I’ve always–  Sorry." +
                "Talking to myself again.  You go a little crazy when you aren’t real.  Anyway, read the letter.  Please.")
        }
        else if (step === 5) { // Handle intermediate messages for step 5
            if (option === "happy") {
                nextMessages.push("Happy, huh?  Happy, after what they did to me?");
            } else if (option === "sad") {
                nextMessages.push("Sad?  Ha.  Too late for them to be sad.");
            } else if (option === "angry") {
                nextMessages.push("So they were always angry, huh?  I knew it.  She always told me I was crazy, but I knew I was right.");
            } else if (option === "scared") {
                nextMessages.push("So they were scared, huh?  Is that supposed to make me feel better?");
            } else if (option === "confused") {
                nextMessages.push("Ha.  Them, confused?  Impossible.");
            } else if (option === "neutral") {
                nextMessages.push("Typical.  They were always so… sterile.  You’d understand if you ever met them.   Which for your sake I hope you never do.");
            }
        }
        else if (step === 8) { // Handle intermediate messages for step 8
            if (option === "toss into fire") {
                nextMessages.push("Thank God.  Thank God.   Wait, before you go, tell me one thing.");
            } else if (option === "don't move") {
                nextMessages.push("You humans and your damn stubbornness. Wait. Tell me one thing before they open the door.");
            }
        }
    };

    const submitGame = () => {
        console.log('Final responses object:', responses); // Log final responses before submission
        fetch('/submit-game', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(responses) // Convert responses object to JSON string
        })
        .then(response => response.text())
        .then(data => {
            gameContainer.innerHTML = `<p>${data}</p>`;
        });
    };

    gameContainer.addEventListener('keypress', (e) => {
        if (e.key === 'Enter' && steps[step].inputType === 'text') {
            const userInput = document.getElementById('userInput').value;
            responses[steps[step].responseKey] = userInput; // Assign user input to responses
            console.log(`Step ${step} response:`, userInput); // Log user input
            console.log('Current responses object:', responses); // Log responses object

            step++;
            if (step < steps.length) {
                renderStep();
            } else {
                submitGame();
            }
        }
    });

    renderStep();
});



