/* jshint esversion: 6, browser: true */

let timelineContainer = document.getElementById('harmonogram');
let info1 = document.getElementById('info');
let info2 = document.getElementById('info2');

let timelineOptions = {
    align: 'auto',
    moveable: false,
    orientation: {
        axis: 'bottom'
    },
    margin: {
        axis: 0,
        item: {
            horizontal: 0,
            vertical: 0
        }
    },
    showCurrentTime: false,
    stack: false,
    start: 0,
};

let timeline;

document.getElementById('inputJson').addEventListener('change', function(e) {

    let fr = new FileReader();
    fr.readAsText(this.files[0], 'UTF-8');

    fr.addEventListener('load', () => {
        let data = JSON.parse(fr.result);
        
        let groups = [
            {id: 1, content: 'M1'},
            {id: 2, content: 'M2'},
            {id: 3, content: 'M3'}
        ];

        let dominated = true;

        if(data.M1.length !== data.M2.length || data.M1.length !== data.M3.length){
            info1.innerText = 'Machines don\'t have same amount of jobs.';
            info1.style = 'color: red';
        } else if(!isM2dominated(data.M1, data.M2)){
            if(!isM2dominated(data.M3, data.M2)){
                dominated = false;
            }
        } 

        if(dominated) {
            let items = modifyJohnson(data.M1, data.M2, data.M3);
            timeline = new vis.Timeline(timelineContainer, items, groups, timelineOptions);
        } else {
            info1.innerText = 'M2 is not dominated by other machines jobs.';
            info1.style = 'color: red';
        }
    });
});
