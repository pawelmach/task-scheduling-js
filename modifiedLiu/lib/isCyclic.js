/* jshint esversion: 6, node: true */

const isGraphCyclic = (vertex, visited, stack, nodeMap) => {
    visited[vertex] = true;
    stack[vertex] = true;

    for(let i = 0; i < nodeMap[vertex].next.length; i++){
        let adj = nodeMap[vertex].next[i];
        if(!visited[adj] && isGraphCyclic(adj, visited, stack, nodeMap)){
            return true;
        } else if(stack[adj]){
            return true;
        }
    }

    stack[vertex] = false;
    return false;
};

const isCyclic = (nodes, edges) => {

    let nodeMap = [];
    
    nodes.forEach(node => 
        nodeMap.push({
            id: node.id, 
            next: edges.filter(x => x.from === node.id).map(x => x.to - 1)
        })
    );
            
    let visited = Array(nodeMap.length).fill(false);
    let stack = Array(nodeMap.length).fill(false);

    for(let i = 0; i < nodeMap.length; i++){
        if(isGraphCyclic(i, visited, stack, nodeMap)){
            return true;
        }
    }

    return false;
};