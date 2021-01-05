#! /usr/bin/env node

const { default: axios } = require('axios');

const readline = require('readline').createInterface({
    input: process.stdin,
    output: process.stdout,
    prompt: 'enter command > ',
});

readline.prompt();
readline.on('line', line => {
    switch (line.trim()) {
        case 'list vegan foods' :
            {
                axios.get(`http://localhost:3001/food`).then(({data}) => {
                    idx = 0;
                    const veganOnly = data.filter(food => {
                        return food.dietary_preferences.includes('vegan');
                    });
                    const veganIterable = {
                        [Symbol.iterator]() {
                            return {
                                [Symbol.iterator]() {return this;},
                                next() {
                                    const current = veganOnly[idx];
                                    idx++;
                                    if (current) {
                                        return {value: current, done: false}
                                    } else {
                                        return {value: current, done: true}
                                    }
                                },
                            };
                        },
                    };
                    for (let val of veganIterable) {
                        console.log(val.name);
                    }
                    readline.prompt();
                }).catch((error) => {
                    console.log("something isn't right");
                });

                console.log('vegan food list');
                
            }
            break;
        case 'log' :
            {
                readline.question(`What would you like to log today? `, async (item) => {
                    const {data} = await axios.get(`http://localhost:3001/food`);
                    const it = data[Symbol.iterator]();
                    let position = it.next();
                
                    while (!position.done) {
                        const food = position.value.name;
                        if (food === item) {
                            console.log(`${item} has ${position.value.calories} calories`);
                        }
                        position = it.next();
                    }
                
                    console.log(item);
                    readline.prompt();
                });
            }
    }
});

