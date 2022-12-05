import { readFileSync, promises as fsPromises } from 'fs';

/* Load data from file. Called by buildStack. */

function loadData(filename: string) {
    console.log("reading...")
    const fileData = readFileSync(filename, 'utf-8');
    const data = fileData.split(/\r?\n/);
    console.log(data)
    return data
}


/* Building the stack of containers by parsing the first lines of the input data. Each stack
of containers is an array in a map, where the position of each stack is the key (number) */

function buildStack() {
    const container = new Map<number, string[]>()
    const park = loadData('data')
    park.forEach(function (value) {
        for (let c = 1; c < value.length; c+=4) {
            if (value[c] != " " && value[c].match(/[^a-z0-9]/gm)) {
                const stack : number = Math.floor(c / 4) + 1;
                queueBoxes(stack, value[c], container)
            }
        }
    }
    );
    // rearrange(container, park) // part 1
    rearrange2(container, park)
    console.log("Result (Part 2): ", result(container));
}

/* After the input is read, the boxes are placed in the stacks according to the information
in the input file. */

function queueBoxes(count : number, box : string, container : Map<number, string[]>) {
    if (container.has(count)) {
        let boxes = container.get(count)
        boxes?.unshift(box)
    } else {
        let boxes : string[] = []
        boxes.unshift(box)
        container.set(count, boxes)
    }
}

/* Part 1. The movement of each box is determined through regex. */

function rearrange(container : Map<number, string[]>, park : string[]) {
    park.forEach(function (value) {
        if (value.match(/^[m]/gm)) {
            const move : number = parseInt(value.match(/\s\d*\s/gm)![0])
            const from : number = parseInt(value.match(/\s\d*\s/gm)![1])
            const to : number = parseInt(value.match(/\s\d*$/gm)![0])

            for (let m = 1; m <= move; m++) {
                let source : string[] = container.get(from)!
                let target : string[] = container.get(to)!
                target.push(source.pop()!)
            }
        }
    })
}

/* Part 2, very similar to part 1. Except that the list is spliced from the source
and attached to the target. */

function rearrange2(container : Map<number, string[]>, park : string[]) {
    park.forEach(function (value) {
        if (value.match(/^[m]/gm)) {
            const move : number = parseInt(value.match(/\s\d*\s/gm)![0])
            const from : number = parseInt(value.match(/\s\d*\s/gm)![1])
            const to : number = parseInt(value.match(/\s\d*$/gm)![0])

            let source : string[] = container.get(from)!;
            let target : string[] = container.get(to)!;
            let moving = source.splice(source.length-move, move);
            moving.forEach(function (value) {
                target.push(value);
            })
        }
    })
}

/* The result is calculated by traversing the map by key. */

const result = (container : Map<number, string[]>) : string => {
    let r : string = ""
    for (let entry = 1; entry < container.size+1; entry++) {
        let boxes : string[] = container.get(entry)!;
        let c : string = boxes.pop()!
        r = r + c;
    }
    return r;
}
   

buildStack();
