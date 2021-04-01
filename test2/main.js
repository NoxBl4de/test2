
// Varibales used to avoid collision and to get back to the original place
var currentPosA = { x: 0, y: 0 };
var currentPosB = { x: 0, y: 0 };
var currentPosC = { x: 0, y: 0 };
var zdivs = {
    a: currentPosA,
    b: currentPosB,
    c: currentPosC
};

var items = [
    ".a",
    ".b",
    ".c"
]

function init() {

    animateDiv(".a");
    animateDiv(".b");
    animateDiv(".c");

    function updateScroll(){
        var h = $("#cons")[0].scrollHeight;
        $("#cons")[0].scrollTop = h;
        // after some time, cleanup the history
        if(h>=3000) {
            $("#cons").text("");
                updateScroll();
        }
    }

    function getRotationDegrees(obj) {
        var matrix = obj.css("transform");
        if(matrix !== 'none') {
            var values = matrix.split('(')[1].split(')')[0].split(',');
            var a = values[0];
            var b = values[1];
            var angle = Math.round(Math.atan2(b, a) * (180/Math.PI));
        } else { var angle = 0; }
        return (angle < 0) ? angle + 360 : angle;
    }

    function addRotate(zdiv,add) {
        $(zdiv).css({ 'transform': 'rotate('+(getRotationDegrees($(zdiv))+1)+'deg)' });
    }

    function makeNewPosition(zdiv){
        // Get viewport dimensions (remove the dimension of the div)
        var h = $(window).height() - 100;
        var w = $(window).width() - 100;
        var nh = Math.floor(Math.random() * h);
        var nw = Math.floor(Math.random() * w);
        
        // We store the ancient position in variables in order to access it
        switch($(zdiv).attr('class')) {
            case "a":
                currentPosA.x = $(zdiv).offset().top;
                currentPosA.y = $(zdiv).offset().left;
                break;
            case "b":
                currentPosB.x = $(zdiv).offset().top;
                currentPosB.y = $(zdiv).offset().left;
                break;
            case "c":
                currentPosC.x = $(zdiv).offset().top;
                currentPosC.y = $(zdiv).offset().left;
                break;
            default:
                break;
        }

        return [nh,nw];    
    }

    function animateDiv(zdiv){
        var newq = makeNewPosition(zdiv);
        var oldq = $(zdiv).offset();
        var speed = calcSpeed([oldq.top, oldq.left], newq);
        $(zdiv).animate(
            { top: newq[0], left: newq[1] },
            {
                duration: speed,
                step: function(){ 
                    addRotate(zdiv,1);
                    detectAvoidCollisions();
                    /* hint... */ 
                },
                complete: function(){ 
                    animateDiv(zdiv);
                }
            }
            );
        $("#cons").append(zdiv+" going to ["+newq[0]+","+newq[1]+"]<br/>");
        updateScroll();
    };

    function calcSpeed(prev,next) {
        var x = Math.abs(prev[1] - next[1]);
        var y = Math.abs(prev[0] - next[0]);
        var greatest = x > y ? x : y;
        var speedModifier = Math.random()/2;
        if(speedModifier<0.05) speedModifier = 0.05;
        var speed = Math.ceil(greatest/speedModifier);
        return speed;
    }

    function detectAvoidCollisions() {
        var div1;
        var div2;
        for (var i = 0; i < items.length; i++) {
            div1 = items[i];

            for (var j = i + 1; j < items.length; j++) {
                div2 = items[j];

                if (isColliding($(div1).offset().top, $(div1).offset().left, $(div2).offset().top,
                $(div2).offset().left)) {
                        $("#cons").append("Collision detected between " + $(div1).attr('class') +  " and " + $(div2).attr('class') + " ! " +  
                        "[" + $(div1).offset().top + ", " + $(div1).offset().left + "]  [" + $(div2).offset().top + ", " + $(div2).offset().left + "]<br/>");
                        updateScroll();

                        var infoDiv1;

                        switch($(div1).attr('class')) {
                            case "a":
                                infoDiv1 = zdivs.a
                                break;
                            case "b":
                                infoDiv1 = zdivs.b
                                break;
                            case "c":
                                infoDiv1 = zdivs.c
                                break;
                            default:
                                break;
                        }

                        // var infoDiv2;

                        // switch($(div2).attr('class')) {
                        //     case "a":
                        //         infoDiv2 = zdivs.a
                        //         break;
                        //     case "b":
                        //         infoDiv2 = zdivs.b
                        //         break;
                        //     case "c":
                        //         infoDiv2 = zdivs.c
                        //         break;
                        //     default:
                        //         break;
                        // }
                        
                        // We stop the first division to avoid the collision
                        $(div1).stop();

                        // We make it go back to its originla position
                        $(div1).offset({
                            top: infoDiv1.x,
                            left: infoDiv1.y
                        });

                        animateDiv(div1);
                    }

            }
        }
    }

    function isColliding(x1, y1, x2, y2) {
        if (((x2 > 100 + x1) || (x1 > 100 + x2) || (y2 > 100 + y1) || (y1 > 100 + y2))) {
            return false;
        }

        return true;
    }

}

