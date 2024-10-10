const axios = require('axios');
const { PrismaClient } = require('@prisma/client');
const express = require('express');
const cors = require('cors');

const prisma = new PrismaClient();
const app = express();
const PORT = 3820;
app.use(express.static('web'))
app.use(cors());

let cache = {};

async function main() {
    request()
    setInterval(request, 1000 * 60 * 5);
    console.log("Started")
}

async function request() {
    const response = await axios.get('https://diawars.de/api/fond/count');
    if (!response.data.red) return;

    const data = response.data;

    await prisma.data.create({
        data: {
            data: data
        }
    })
    cache = {}
    console.log("Added new Data")
}

app.get('/api', async (req, res) => {
    if (!cache.length) {
        const data = await prisma.data.findMany();
        cache = data
    }
    res.send(cache)
})

main()

app.listen(PORT, () => {
    console.log(`Server started on port ${PORT}`)
})