// Initialisation de la reconnaissance vocale en fonction du navigateur
// Pour l'instant, seul Google Chrome le supporte


var SpeechRecognition = SpeechRecognition || webkitSpeechRecognition;

                   
var SpeechGrammarList = SpeechGrammarList || webkitSpeechGrammarList;

var recognition;
var lastStartedAt;
var speechRecognitionList;
var oeil ="droit"; 
var nb_letter_max= 30; 

var nb_letter_said = 0 ; 
var letter_on_line=5;
var letter_to_guess;
var bad_letter = 0 ;
var line =0;
var score_by_line = [0,0,0,0,0,0,0,0,0,0,0,0,0,0,0];
var nb_line_max = 14;
var tailles = ['0.58cm','0.484cm',' 0.3635cm ',' 0.2905cm ', '0.2325cm','0.1815cm','0.1455cm',' 0.116cm ',' 0.092cm ', '0.0654cm','0.058cm','0.046cm',' 0.03635cm ',' 0.02905cm '];
var stop=false; 
var old_letter;

var testData = {
    etdrs_d: 0,
    av_d: 0,
    etdrs_g: 0,
    av_g: 0
};

if (!SpeechRecognition) {
    console.log('Pas de reconnaissance vocale disponible');
    alert('Pas de reconnaissance vocale disponible');
} else {
     
    // Arrêt de l'ensemble des instances déjà démarrées
        if (recognition && recognition.abort) {
        recognition.abort();
        }
     
    // Initialisation de la reconnaissance vocale
    recognition = new SpeechRecognition();

    // Reconnaissance en continue
    recognition.continuous = false;
    // Langue française
    recognition.lang = 'fr-FR';
    recognition.interimResults = false;
    recognition.maxAlternatives = 50;
     
    // Evènement de début de la reconnaissance vocale
    recognition.onstart = function() {
        console.log('Démarrage de la reconnaissance'); 
    };
     
    // Evènement de fin de la reconnaissance vocale
    // A la fin de la reconnaissance (timeout), il est nécessaire de la redémarrer pour avoir une reconnaissance en continu
    // Ce code a été repris de annyang
    recognition.onend = function() {
        console.log('Fin de la reconnaissance');
        var timeSinceLastStart = new Date().getTime()-lastStartedAt;
        if(!stop){
            if (timeSinceLastStart < 3000) {
                setTimeout(function(){
                    lastStartedAt = new Date().getTime();
                    recognition.start();
                }, 3000-timeSinceLastStart);
            } else {
                
                // Démarrage de la reconnaissance vocale
                lastStartedAt = new Date().getTime();
                recognition.start();
            }
        }
    };
    

    // Evènement de résultat de la reconnaissance vocale
    recognition.onresult = function (event) {
        var found = false  ;
        for (var i = event.resultIndex; i < event.results.length; ++i) {
            j=0;
            
            while(event.results[i][j]!=null && !found){
                var texteReconnu = event.results[i][j].transcript;
                if(texteReconnu==letter_to_guess){
                    found=true;
                }
                j++;
            }
                console.log('Résultat = ' + texteReconnu);
            }
            analyse_recog(found);
            next_letter(tailles[line]);
            /* Synthèse vocale de ce qui a été reconnu
            var u = new SpeechSynthesisUtterance();
            u.text = texteReconnu;
            u.lang = 'fr-FR';
            u.rate = 1.2;
            speechSynthesis.speak(u);*/
            
            };
}


function analyse_recog(found){
    nb_letter_said++;
    if(!found){
        document.getElementById("affichage_lettre").style.color="red";
        bad_letter++;
        console.log("bad_letter : " + bad_letter);
        //startReco();
    }
   
    if((bad_letter==2)||(line==nb_line_max)){
        score_by_line[line]=nb_letter_said-bad_letter;
        end();
    }
    else{
        if(nb_letter_said==letter_on_line){
            score_by_line[line]=nb_letter_said-bad_letter;
            console.log("score_by_line["+ line +"] " + score_by_line[line]);
            line++;
            nb_letter_said=0;
            bad_letter=0;
       }
    }
    
}

function end(){
    stop =true;
    var total_correct=0;
    var last_correct_line=0;
    var i = 0 ;
    while(score_by_line[i]!=0){
        console.log("score line "+ i + " = " + score_by_line[i]);
        total_correct+=score_by_line[i];
        if(score_by_line[i]>3)last_correct_line=i;
        i++;
    }
    if(total_correct>20) total_correct+=30;
    //else alert("votre score est : " + total_correct + " \n il faut faire un autre test (-1m) et l'ajouter a votre score");  
    
    var av="";
    last_correct_line+=1; // les lignes commencent à 0 dans le tableau
    switch(last_correct_line){
            case 1:
                av="20/200";
                break;
            case 2:
                av="20/160";
                break;
            case 3:
                av="20/125";
                break;
            case 4:
                av="20/100";
                break;
            case 5:
                av="20/80";
                break;
            case 6:
                av="20/63";
                break;
            case 7:
                av="20/50";
                break;
            case 8:
                av="20/40";
                break;
            case 9:
                av="20/32";
                break;  
            case 10:
                av="20/25";
                break;
            case 11:
                av="20/20";
                break;
            case 12:
                av="20/16";
                break;
            case 13:
                av="20/13";
                break;
            case 14:
                av="20/10";
                break;

    }

    //console.log("LCL : " + last_correct_line);
    console.log("score ETDRS : " + total_correct);
    console.log("AV = " + av);

    bad_letter = 0 ;
    line =0;
    score_by_line = [0,0,0,0,0,0,0,0,0,0,0,0,0,0,0];
    stop=false;
    nb_letter_said = 0 ;

    if(oeil=="droit"){
        testData.etdrs_d = total_correct;
        total_correct = 0;
        testData.av_d = av;
        document.getElementById("affichage_lettre").innerHTML= 'Passons &agrave; l&apos;&oelig;il gauche, veuillez cacher votre &oelig;il droit (<i class="fas fa-eye-slash"></i><i class="fas fa-eye"></i>)'
        oeil="gauche";
        setTimeout(next_letter,8000);// on attend 8 sec avant de passer a l'autre oeil puis on lance le test 
        //erreur console !!!!
        //micro !!!!
        startReco();
    }
    else{
        stop=true;
        testData.etdrs_g = total_correct;
        testData.av_g = av;
        oeil="droit";
        alert("Résultats : \n\u0153il droit: ETDRS : " + testData.etdrs_d + " et AV : " + testData.av_d + "\n\u0153il gauche: ETDRS : " + testData.etdrs_g + " et AV : " + testData.av_g); 
        //document.getElementById("affichage_lettre").innerHTML= 'Résultats :<br>&oelig;il droit: ETDRS : ' + testData.etdrs_d + ' et AV : ' + testData.av_d + '<br>&oelig;il gauche: ETDRS : ' + testData.etdrs_g + ' et AV : ' + testData.av_g + '<br><button class="btn btn-primary my-2 my-sm-0" type="button" ng-click="createTest(testData)"><h2>Accueil</h2></button>'
        angular.element(document.getElementById("ctrlforjs")).scope().createTest(testData);
        
        //résultat
    }


}

function startReco() {
    // Démarrage de la reconnaissance vocale
    
    nb_letter_max= 30; 
    stop=false; 
    nb_letter_said = 0 ; 
    letter_on_line=5;
    letter_to_guess;
    bad_letter = 0 ;
    line =0;
    score_by_line = [0,0,0,0,0,0,0,0,0,0,0,0,0,0,0];
    nb_line_max = 14;
    old_letter="";
    lastStartedAt = new Date().getTime();
    recognition.start();
    
}
function next_letter(size){
    
    document.getElementById("affichage_lettre").style.color="black";
    var dice;
    var letter; 
    dice = Math.floor((Math.random() * 9) + 1);
    switch(dice){
        case 1:
            letter ="S";
            break;
        case 2:
            letter ="C";
            break; 
        case 3:
            letter ="D";
            break; 
        case 4:
            letter ="K";
            break; 
        case 5:
            letter ="V";
            break; 
        case 6:
            letter ="R";
            break; 
        case 7:
            letter ="H";
            break; 
        case 8:
            letter ="N";
            break; 
        case 9:
            letter ="O";
            break; 
    }

    document.getElementById("affichage_lettre").style.fontSize=size;
    document.getElementById("affichage_lettre").innerHTML=letter;
    //startReco(letter);
    console.log("letter is " + letter );
    letter_to_guess=letter;
    if(old_letter==letter)next_letter(size);
    old_letter=letter;
    //startReco();
}





