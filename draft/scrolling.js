function initializeScrolling(){
    new fullpage('#fullpage', {
        anchors: ['foodChoice_', 'foodCo2_', 'globalWarming_', 'chainCo2_', 'land_'],
        'css3': true,
        'menu': false,
        'scrollingSpeed': 700,
        'autoScrolling': true,
        'easingcss3': 'ease',
        'loopHorizontal': true,
        'touchSensitivity': 5,
        'sectionSelector': 'section',
        'slideSelector': '.slide',
        'scrolldOverflow': true,
        // scrollOverflowReset: true,
		// scrollOverflowResetKey: 'YWx2YXJvdHJpZ28uY29tXzlRaGMyTnliMnhzVDNabGNtWnNiM2RTWlhObGRBPT14Ykk=',
        
        //events
        'afterLoad': function(anchorLink, index){
    
            switch(anchorLink){
                case "foodChoice_":
                    // foodchoice_OnEnter();
                    break;
                case "foodCo2_":
                    // foodco2_OnEnter();
                    break;
                case "globalWarming_":
                    // globalwarming_OnEnter();
                    break;
                case "chainCo2_":
                    // chainco2_OnEnter();
                    break;
                case "land_":
                    // land_OnEnter();
                    break;
            }
        },
        'onLeave': function(index, nextIndex, direction){
            switch(index){
                case 1:
                    // foodchoice_OnLeave(direction);
                    break;
                case 2:
                    // foodco2_OnLeave(direction);
                    break;
                case 3:
                    // globalwarming_OnLeave(direction);
                    break;
                case 4:
                    // chainco2_OnLeave(direction);
                    break;
                case 5:
                    // land_OnLeave(direction);
                    break;
            }
        },
        'afterRender': null,
        'afterResize': null,
        'afterReBuild': null,
        'afterSlideLoad': null,
        'onSlideLeave': null
    });
}