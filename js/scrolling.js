function initializeScrolling(){
    fullpage.initialize('#fullpage', {
        anchors: ['foodChoice', 'foodCo2', 'globalWarming', 'chainCo2', 'landUse'],
        'css3': true,
        'menu': false,
        'scrollingSpeed': 700,
        'autoScrolling': true,
        'easingcss3': 'ease',
        'loopHorizontal': true,
        'touchSensitivity': 5,
        'sectionSelector': 'section',
        'slideSelector': '.slide',
        
        //events
        'afterLoad': function(anchorLink, index){
    
            switch(anchorLink){
                case "foodChoice":
                    foodchoice_OnEnter();
                    break;
                case "foodCo2":
                    foodco2_OnEnter();
                    break;
                case "globalWarming":
                    globalwarming_OnEnter();
                    break;
                case "chainCo2":
                    chainco2_OnEnter();
                    break;
                case "landUse":
                    land_OnEnter();
                    break;
            }
        },
        'onLeave': function(index, nextIndex, direction){
            switch(index){
                case 1:
                    foodchoice_OnLeave(direction);
                    break;
                case 2:
                    foodco2_OnLeave(direction);
                    break;
                case 3:
                    globalwarming_OnLeave(direction);
                    break;
                case 4:
                    chainco2_OnLeave(direction);
                    break;
                case 5:
                    land_OnLeave(direction);
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