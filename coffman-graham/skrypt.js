/* jshint esversion: 6, browser: true */

let graphContainer = document.getElementById('AN');
let timelineContainer = document.getElementById('harmonogram');

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

        if(isCyclic(data.nodes)){
            document.getElementById('info').innerHTML = 'Graph is cyclic, cannot procede.';
        } else {

            let items = coffGrah(data.nodes, data.edges);
            let groups = [
                {id: 1, content: 'M1'},
                {id: 2, content: 'M2'}
            ];

            timeline = new vis.Timeline(timelineContainer, items, groups, timelineOptions);

        }
    });
});
