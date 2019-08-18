/* jshint esversion: 6, browser: true */

let graphContainer = document.getElementById('AN');
let timelineContainer = document.getElementById('harmonogram');
let info1 = document.getElementById('info');
let info2 = document.getElementById('info2');

let graphOptions = {
    autoResize: true,
    height: '400px',
    width: '100%',
    layout: {
        hierarchical: {
            enabled: true,
            direction: 'LR',
            sortMethod: 'directed'
        },
    },
    edges: {
        arrows: {
            to: {
                enabled: true
            }
        }
    },
    manipulation: {
        enabled: true,
    },
    physics: {
        enabled: false
    },
};

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

let network, timeline;

document.getElementById('inputJson').addEventListener('change', function(e) {

    let fr = new FileReader();
    fr.readAsText(this.files[0], 'UTF-8');

    fr.addEventListener('load', () => {
        let data = JSON.parse(fr.result);

        let GraphData = {
            nodes: new vis.DataSet(data.nodes),
            edges: new vis.DataSet(data.edges)
        };
        network = new vis.Network(graphContainer, GraphData, graphOptions);


        if(isCyclic(data.nodes, data.edges)){
            info1.innerText = 'Graph is cyclic, cannot procede';
            info1.style = 'color: red';
        } else {
            let result = modifyLiu(data.nodes, data.edges);
            let items = result.tt;

            info2.innerText = `Lmax = ${result.lmax}`;

            document.getElementById('nodes').appendChild(prettyPrint(data.nodes));

            let groups = [
                {id: 1, content: 'M1'},
            ];
    
            timeline = new vis.Timeline(timelineContainer, items, groups, timelineOptions);
        }
    });
});
