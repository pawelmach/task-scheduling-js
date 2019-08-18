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
    start: 0,
};

let network;
let timeline;

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

            let items = [];
            let groups = [
                {id: 1, content: 'Critical Path', options: {stack: false}},
                {id: 2, content: 'Other tasks'}
            ];

            let cp = cpm(data.nodes, data.edges);
            cp.forEach(node => {
                items.push( {
                    start: node.es - 0.1,
                    end: node.ef - 0.1,
                    content: node.label.split(',')[0],
                    group: 1
                });
            });

            data.nodes.filter(n => !cp.map(n => n.id).includes(n.id))
            .forEach(node => {
                items.push({
                    start: node.es,
                    end: node.ef,
                    content: node.label.split(',')[0],
                    group: 2
                });
            });

            timeline = new vis.Timeline(timelineContainer, items, groups, timelineOptions);
        }

    });

});

