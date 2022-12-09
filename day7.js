const {default: nodeTest} = require('node:test');

fs = require('fs')

function day7() {
    fs.readFile('./day7data.txt', 'utf8', function (err, data) {
        if (err) {
            console.log(err);
        }
        let input = data.split('\n');
        class Directory {
            constructor(name, parent) {
                this.name = name;
                this.parent = parent;
                this.children = []; // contains only directory children
                this.files = []; // contains only file children
                this.value = 0; // a sum of all file children values
            }
            addChild(child) {
                this.children.push(child);
            }
            addFile(file) {
                this.files.push(file);
                this.value += file.value; // TODO: turn it into a number
            }
        }
        class File {
            constructor(name, value) {
                this.name = name;
                this.value = Number(value);
                // files are leaf nodes
                // they have no children
            }
        }
        let root = new Directory('/', 'no parent');
        let currentDir = root;
        let currentLineNum = 1; // skip first row
        let currentLine = input[currentLineNum];

        while (currentLine) { // while there is still a row, keep looping
            if (currentLine === '$ ls') { // '$ ls' --> no action
            } else if (currentLine === '$ cd ..') { // move up a level
                currentDir = currentDir.parent;
            } else if (currentLine.indexOf('$ cd') === 0) { // move into dir
                let targetDir = currentLine.split(' ')[2];
                currentDir.children.forEach(child => {
                    if (child.name === targetDir) {
                        currentDir = child;
                    }
                })
            } else if (currentLine.indexOf('dir') === 0) { // add new dir
                let dirName = currentLine.slice(4);
                currentDir.addChild(new Directory(dirName, currentDir))
            } else { // add a new File
                let file = currentLine.split(' ');
                currentDir.addFile(new File(file[1], file[0]));
            } currentLineNum += 1;
            currentLine = input[currentLineNum];
        }
        // console.log(root)

        // part two: traverse through the tree
        let counter = 0;

        function recurse(node) {
            if (node.children.length === 0) { // base case: no children. return 'value'
                if(node.value < 100000) counter += node.value;
                return node.value;
            } else { // for each node, find the total value. if it's < 100000, add it to the counter
                let valueOfNode = node.value;
                node.children.forEach(child => {
                    let childValue = recurse(child);
                    valueOfNode += childValue;
                })
                if(valueOfNode <= 100000){
                    counter += valueOfNode;
                }
                return valueOfNode
            }
        }
        recurse(root)
        console.log('counter',counter)
        // console.log(root)
    });
}
console.log(day7());
