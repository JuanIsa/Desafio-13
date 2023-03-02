import express from "express";
import { fork } from 'child_process';

const app = express();

let contador = 0;

const calculoPesado = () => {
    let sum = 0
    for (let i = 0; i < 5e9; i++) {
        sum += 1;
    }
    return sum;
};

app.get('/', (req, res) => { 
    res.send({ message: "Está página se visitó: " + contador++ });
});

app.get('/info', (req, res) => { 
    res.send({
        Ruta: process.cwd(),
        ID: process.pid,
        SO: process.platform,
        Memoria: `${process.memoryUsage().rss / 1024/1024} Mb`
    });
});
app.get('/api/randoms', (req, res) => { 
    const child = fork('./calculo.js');
    child.send(Number(req.query['cant']));
    child.on('message', value => {
        res.send(value)
    })
});


app.get('/calculobloqueante', (req, res) => { 
    const result = calculoPesado();
    res.send({ message: "El cálculo da: " + result });
});

app.get('/calculofork', (req, res) => { 
    const child = fork('./calculo.js');
    child.send('Ejectutate');
    child.on('message', value => {
        res.send({ message: "El cálculo da: " + value })
    })
});

app.listen(8080, () => { 
    console.log('Server corriendo en puerto 8080');
});