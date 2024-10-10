const axios = require('axios');
const { PrismaClient } = require('@prisma/client');

const prisma = new PrismaClient();

async function main() {
    setInterval(request, 1000 * 60 * 5);
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
}

main()