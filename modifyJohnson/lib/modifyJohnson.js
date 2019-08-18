/* jshint esversion: 6, browser: true */

// Author: Paweł Mach
// Modified Johnson Alghoritm

const isM2dominated = (M, M2) => {
    for(let i = 0; i < M.length; i++){
        if(M2.filter(m2 => m2.p > M[i].p).length !== 0){
            return false;
        }
    }
    return true;
};
    
const modifyJohnson = (M1, M2, M3) => {
   
    let t1 = [];
    let t2 = [];

    for(let i = 0; i < M2.length; i++){
        t1.push(M1[i].p + M2[i].p);
        t2.push(M3[i].p + M2[i].p);
    }

    let N1 = [];
    let N2 = [];

    for(let i = 0; i < M2.length; i++){
        if(t1[i] < t2[i]){
            N1.push({id: i, t: t1[i]});
        } else {
            N2.push({id: i, t: t2[i]});
        }
    }

    N1.sort((a, b) => a.t - b.t);
    N2.sort((a, b) => b.t - a.t);

    let time = 0;
    let timeline = [];
    for(let i = 0; i < N1.length; i++){

        let z1 = M1[N1[i].id];
        let z2 = M2[N1[i].id];
        let z3 = M3[N1[i].id];

        let item1 = {
            group: 1, 
            content: z1.label, 
            start: time,
            end: time + z1.p
        };

        let item2 = {
            group: 2,
            content: z2.label,
            start: item1.end,
            end: item1.end + z2.p
        };

        let item3 = {
            group: 3,
            content: z3.label,
            start: item2.end,
            end: item2.end + z3.p
        };

        timeline.push(item1, item2, item3);
        time = item1.end;
    }
    for(let i = 0; i < N2.length; i++){
        
        let z1 = M1[N2[i].id];
        let z2 = M2[N2[i].id];
        let z3 = M3[N2[i].id];

        let item1 = {
            group: 1, 
            content: z1.label, 
            start: time,
            end: time + z1.p
        };

        let item2 = {
            group: 2,
            content: z2.label,
            start: item1.end,
            end: item1.end + z2.p
        };

        let item3 = {
            group: 3,
            content: z3.label,
            start: item2.end,
            end: item2.end + z3.p
        };

        timeline.push(item1, item2, item3);
        time = item1.end;
    }

    return timeline;
};