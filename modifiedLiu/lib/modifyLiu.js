/* jshint esversion: 6, browser: true */

    
const modifyLiu = (nodes, edges) => {
    
	const findPrevNodes = (id) => {
		return edges.filter(edge => edge.to === id)
				.map(e => e.from)
				.map(n => nodes.find(node => node.id === n));
	};
	
	const findNextNodes = (id) => {
		return edges.filter(edge => edge.from === id)
				.map(e => e.to)
				.map(n => nodes.find(node => node.id === n));
    };

    nodes.forEach(node => {
        let nextNodes = findNextNodes(node.id);
        let d = [node.d];
        while(nextNodes.length !== 0){
            let newNextNodes = [];
            nextNodes.forEach(n => {
                d.push(n.d);
                findNextNodes(n.id).forEach(x => {
                    if(!newNextNodes.find(nd => nd.id === x.id)){
                        newNextNodes.push(x);
                    }
                });
            });
            nextNodes = newNextNodes;
        }
        node.newD = Math.min(...d);
    });

    let finished = 0;
    let time = 0;
    let avaible = [];
    let timetable =[];

    nodes.forEach(x => x.doneP = 0);
    while(finished !== nodes.length){
        nodes.filter(node => node.r <= time)
            .filter(node => findPrevNodes(node.id).filter(n => n.doneP !== n.p).length === 0)
            .filter(node => !avaible.includes(node))
            .filter(node => node.p !== node.doneP)
            .forEach(node => avaible.push(node));
        time++; 

        if(avaible.length > 0){
            avaible.sort((a, b) => a.newD - b.newD);
            
            let item = timetable.pop();
            if(item === undefined){
                item = {content: avaible[0].label, start: time - 1, end: time};
            } else if(item.content === avaible[0].label){
                item.end = time;
            } else {
                timetable.push(item);
                item = {content: avaible[0].label, start: time - 1, end: time};
            }
            timetable.push(item);
            
            avaible[0].doneP++;
            if(avaible[0].doneP === avaible[0].p){
                avaible.splice(0,1);
                finished++;
            }
        }
    }
    //Lmax

    nodes.forEach(n => {
        let t = timetable.filter(x => x.content === n.label)
            .map(x => x.end);
        n.L = Math.max(...t) - n.d;
    });

    let Lmax = Math.max(...nodes.map(x => x.L));

    timetable.forEach(x => x.group = 1);
    return {tt: timetable, lmax: Lmax};
};