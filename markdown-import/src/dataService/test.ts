import fs from "fs";
import path from "path";
import { dataProvider } from ".";

(async function test() {
    dataProvider.initialize();
    const filePath = process.cwd() + '/test.txt';
    const buffer = fs.readFileSync(filePath);
    console.log(buffer);
    const file = {
        name: path.basename(filePath),
        type: 'text/plain', // replace with actual MIME type
        size: buffer.length,
        buffer: buffer
    };

    const medium = await dataProvider.uploadMedium(file as any, 'en');
    console.log(medium);

    const url = await dataProvider.getFileURL(medium.id);
    console.log("FILE URL:", url);
})();