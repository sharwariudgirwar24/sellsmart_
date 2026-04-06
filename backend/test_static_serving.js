import fetch from 'node-fetch';

const testFile = async () => {
    const url = "http://localhost:5000/uploads/file-be2d607b-661c-4d7b-ac90-7c85d5c5c5d3.jfif";
    try {
        const res = await fetch(url);
        console.log(`URL: ${url}`);
        console.log(`Status: ${res.status}`);
        console.log(`Content-Type: ${res.headers.get('content-type')}`);
        process.exit();
    } catch (e) {
        console.error("Fetch failed:", e.message);
        process.exit(1);
    }
};

testFile();
