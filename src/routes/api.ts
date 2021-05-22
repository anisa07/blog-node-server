import { Router } from 'express';
import * as fs from "fs";
import swaggerUi from 'swagger-ui-express';
import { swaggerDocument } from '../swagger';

const router = Router();

router.use('/', swaggerUi.serve);
router.get('/', swaggerUi.setup(swaggerDocument));
router.get('/download/swagger/json', (req, res) => {
    const swagger = JSON.stringify(swaggerDocument);
    const dir = `${__dirname}/${process.env.API_VERSION}`;
    if (!fs.existsSync(dir)){
        fs.mkdirSync(dir, { recursive: true });
    }
    fs.writeFile(`${dir}/swagger.json`, swagger, (err) => {
        if(err) {
            return console.log(err);
        }
        const file = `${__dirname}/${process.env.API_VERSION}/swagger.json`;
        res.download(file);
    });
})

export default router;
