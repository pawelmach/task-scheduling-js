/* jshint esversion: 6, browser: true */

const isCyclic = (edges) => {
    
    let visited = [];
    let stack = [];
    
    stack.push(edges[0].from);
    visited.push(edges[0].from);
    
    while(stack.length !== 0) {
        let t = stack.pop();
        console.log(t);
        
        let children = edges.filter(e => e.from === t)
        .map(x => x.to)
        .filter(n => !visited.includes(n));
        
        if(children.length === 0 && stack.length === 0) {
            console.log('false');
        }

        children.forEach(y => {
            visited.push(y);
            stack.push(y);
        });
    }
    
    return true;
};

const cpm = (nodes, edges) => {

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

    const isConnected = (arr, id) => {
        arr = arr.map(n => n.id).filter(n => n !== id);
        arr.forEach(x => {
            if(!edges.find(v => (v.from === id && v.to === x) || (v.to === id && v.from === x) )){
                return false;
            }
            return true;
        });
    };
    
    //planowanie w przod
    while(nodes.find(n => n.es === undefined || isNaN(n.es)) !== undefined){
        nodes.forEach(node => {
            let prevNodes = findPrevNodes(node.id);
            if(prevNodes.length === 0) {
                node.es = 0;
                node.ef = node.p;
            } else {
                let prevEFs = prevNodes.map(node => node.ef);
                node.es = Math.max(...prevEFs);
                node.ef = node.es + node.p;
            }
        });
    }
    
    //szukanie cmax
    let lastNode;
    let Cmax = 0;
    nodes.forEach(node => {
        if(node.ef > Cmax){
            Cmax = node.ef;
            lastNode = node;
        }
    });
    
    //planowanie w tyl
    lastNode.lf = Cmax;
    lastNode.ls = Cmax - lastNode.p;
    
    let prevNodes = findPrevNodes(lastNode.id);
    while(prevNodes.length !== 0){
        let newPrevNodes = [];
        prevNodes.forEach(node => {
            let nextLss = findNextNodes(node.id).map(n => n.ls);
            node.lf = Math.min(...nextLss);
            node.ls = node.lf - node.p;
            findPrevNodes(node.id).forEach(n => {
                if(!newPrevNodes.find(nd => nd.id === n)){
                    newPrevNodes.push(n);
                }
            });
            
        });
        prevNodes = newPrevNodes;
    }

    //odfiltrowanie sciezki krytycznej
    let cp = nodes.filter(n => n.es === n.ls && n.ef === n.lf && n.es === 0);
    while(cp.find(n => n.id === lastNode.id) === undefined){
        let last = cp.pop();
        let w = findNextNodes(last.id).filter(n => n.es === n.ls && n.ef === n.lf);
        if(w.length !== 0){
            cp.push(last);
            cp.push(w[0]);
        }
    }

    console.log(nodes);
    return cp;
};

