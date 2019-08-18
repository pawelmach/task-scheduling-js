/* jshint esversion: 6, browser: true */

const isCyclic = (edges) => {
    
    let visited = [];
    let stack = [];
    
    stack.push(edges[0].from);
    visited.push(edges[0].from);
    
    while(stack.length !== 0) {
        let t = stack.pop();
        
        let children = edges.filter(e => e.from === t)
        .map(x => x.to)
        .filter(n => !visited.includes(n));
        
        if(children.length === 0) {
            return false;
        }
        children.forEach(y => {
            visited.push(y);
            stack.push(y);
        });
    }
    
    return true;
};

const coffGrah = (nodes, edges) => {
	
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

	for(let i = 1; i <= nodes.length; i++){

		let A = nodes.filter(node => {
			if(node.L){
				return false;
			}
			let nextNodes = findNextNodes(node.id);
			let len = nextNodes.length;
			if(len === 0){
				return true;
			}
			if(nextNodes.filter(x => x.L).length === len){
				return true;
			}
			return false;
		});

		A.forEach(node => {
			node.s_list = findNextNodes(node.id).map(node => node.L).sort((a, b) => a - b).reverse().toString();
		});

		A.sort((a, b) => {
			if(a.s_list < b.s_list){
				return -1;
			}
			if(a.s_list > b.s_list){
				return 1;
			}
			return 0;
		})[0].L = i;
	}

	console.log(nodes);

	nodes.sort((a, b) => b.L - a.L);

	let m1 = [];
	let m2 = [];
	
	nodes.forEach(node => {
		let item = {content: node.label};
		let good = findPrevNodes(node.id).filter(x => !x.v).length === 0;

		if(m1.length === m2.length && good){
			m1.push(item);
		} else if(m1.length < m2.length){
			if(good){
				m1.push(item);
			} else {
				m2.push(item);
			}
		} else {
			if(good){
				m2.push(item);
			} else {
				m1.push(item);
			}
		}
		node.v = true;
	});
	
	let items = [];

	m1.forEach((item, i) => {
		item.start = i;
		item.end = i + 1;
		item.group = 1;
		items.push(item);
	});

	m2.forEach((item, i) => {
		item.start = i;
		item.end = i + 1;
		item.group = 2;
		items.push(item);
	});

	return items;
};

