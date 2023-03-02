process.on('message', message => {
    let numarray = [];
    let data = {};
    let cant = 1000000;
    if (message !== null) {
        cant = message;
    }
    for (let i = 0; i < cant; i++) {
        numarray.push(Math.trunc(Math.random() * 1000+1));
    }
    for (let i = 0; i <= 1000; i++) {
        let verf = numarray.filter(num => num === i).length
        if (verf> 0) {
            data[`El número ${i} aparece:`] = `${verf} ve${verf > 1 ? 'ces':'z'}.`;
        }
    }
    process.send(data);
});