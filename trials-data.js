// Trials Data
// This file contains all the trial configurations for the AAC sentence building game

const TRIALS_DATA = [
    {
        gif: "images/dog_smelling.gif",
        correctWho: "The dog",
        whoImg: "symbols/dog.png",
        correctDoing: "is smelling",
        doingImg: "symbols/smell.png",
        distWho: "The cat",
        distWhoImg: "symbols/cat.png",
        distDoing: "is sleeping",
        distDoingImg: "symbols/sleep.png"
    },
    {
        gif: "images/girl_running.gif",
        correctWho: "The girl",
        whoImg: "symbols/girl.png",
        correctDoing: "is running",
        doingImg: "symbols/run.png",
        distWho: "The boy",
        distWhoImg: "symbols/boy.png",
        distDoing: "is eating",
        distDoingImg: "symbols/eat.png"
    },
    {
        gif: "images/cat_jumping.gif",
        correctWho: "The cat",
        whoImg: "symbols/cat.png",
        correctDoing: "is jumping",
        doingImg: "symbols/jump.png",
        distWho: "The bird",
        distWhoImg: "symbols/bird.png",
        distDoing: "is flying",
        distDoingImg: "symbols/fly.png"
    },
    {
        gif: "images/boy_eating.gif",
        correctWho: "The boy",
        whoImg: "symbols/boy.png",
        correctDoing: "is eating",
        doingImg: "symbols/eat.png",
        distWho: "The teacher",
        distWhoImg: "symbols/teacher.png",
        distDoing: "is writing",
        distDoingImg: "symbols/write.png"
    },
    {
        gif: "images/baby_crying.gif",
        correctWho: "The baby",
        whoImg: "symbols/baby.png",
        correctDoing: "is crying",
        doingImg: "symbols/cry.png",
        distWho: "The man",
        distWhoImg: "symbols/man.png",
        distDoing: "is washing",
        distDoingImg: "symbols/wash.png"
    },
    {
        gif: "images/bird_flying.gif",
        correctWho: "The bird",
        whoImg: "symbols/bird.png",
        correctDoing: "is flying",
        doingImg: "symbols/fly.png",
        distWho: "The dog",
        distWhoImg: "symbols/dog.png",
        distDoing: "is talking",
        distDoingImg: "symbols/talk.png"
    },
    {
        gif: "images/fish_looking.gif",
        correctWho: "The fish",
        whoImg: "symbols/fish.png",
        correctDoing: "is looking",
        doingImg: "symbols/look.png",
        distWho: "The octopus",
        distWhoImg: "symbols/octopus.png",
        distDoing: "is dancing",
        distDoingImg: "symbols/dance.png"
    },
    {
        gif: "images/man_cutting.gif",
        correctWho: "The man",
        whoImg: "symbols/man.png",
        correctDoing: "is cutting",
        doingImg: "symbols/cut.png",
        distWho: "The woman",
        distWhoImg: "symbols/woman.png",
        distDoing: "is holding",
        distDoingImg: "symbols/hold.png"
    },
    {
        gif: "images/man_washing.gif",
        correctWho: "The man",
        whoImg: "symbols/man.png",
        correctDoing: "is washing",
        doingImg: "symbols/wash.png",
        distWho: "The baby",
        distWhoImg: "symbols/baby.png",
        distDoing: "is crying",
        distDoingImg: "symbols/cry.png"
    },
    {
        gif: "images/girl_reading.gif",
        correctWho: "The girl",
        whoImg: "symbols/girl.png",
        correctDoing: "is reading",
        doingImg: "symbols/read.png",
        distWho: "The cat",
        distWhoImg: "symbols/cat.png",
        distDoing: "is flying",
        distDoingImg: "symbols/fly.png"
    }
];

// Validate trial data structure
function validateTrialData(trials) {
    const requiredFields = [
        'gif', 'correctWho', 'whoImg', 'correctDoing', 'doingImg',
        'distWho', 'distWhoImg', 'distDoing', 'distDoingImg'
    ];
    
    trials.forEach((trial, index) => {
        requiredFields.forEach(field => {
            if (!trial[field]) {
                console.error(`Trial ${index + 1} missing required field: ${field}`);
            }
        });
    });
}

// Validate on load
if (typeof TRIALS_DATA !== 'undefined') {
    validateTrialData(TRIALS_DATA);
}
