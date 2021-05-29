import express from 'express';
import { v4 as uuidv4 } from 'uuid';
import { labelService } from '../services/labelService';
import { LabelModel } from '../models/Label';

class LabelController {
    async createLabel(req: express.Request, res: express.Response) {
        const name = req.body.name as string;
        if (!name || !name.trim()) {
            return res.status(400).send({
                type: 'ERROR',
                message: 'Invalid label data'
            });
        }

        try {
            const oldLabel = await labelService.findLabelBy({name});
            let id;
            if (oldLabel) {
                id = oldLabel.id;
            } else {
                id = uuidv4();
                await labelService.createLabel({name, id} as LabelModel);
            }
            return res.status(200).send({
                id,
                name
            })
        } catch (e) {
            return res.status(500).send({
                type: 'ERROR',
                message: 'Error occurs adding label'
            });
        }
    }

    async updateLabel(req: express.Request, res: express.Response) {
        const name = req.body.name as string;
        const labelId = req.params.labelId as string;

        if (!name || !name.trim()) {
            return res.status(400).send({
                type: 'ERROR',
                message: 'Invalid label data'
            });
        }

        try {
            await labelService.updateLabel(labelId, {name} as LabelModel);
            return res.status(200).send({
                id: labelId,
                name
            })
        } catch (e) {
            return res.status(500).send({
                type: 'ERROR',
                message: 'Error occurs during post creation'
            });
        }

    }

    async readLabels(req: express.Request, res: express.Response) {
        const labels = await labelService.getAllLabels();
        return res.status(200).send(labels || []);
    }

    async deleteLabel(req: express.Request, res: express.Response) {
        const labelId = req.params.labelId as string;
        await labelService.deleteLabel({id: labelId});
        return res.status(200).send({});
    }

    // TODO
    // get label for post
    // get label for user
}

const labelController = new LabelController();

export default labelController;
