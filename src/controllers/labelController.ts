import express from 'express';
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
                id = oldLabel._id;
            } else {
                const label = await labelService.createLabel({name} as LabelModel);
                id = label._id;
            }
            return res.status(200).send({
                id: id,
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
        const labelId = req.params.id as string;

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
        const labelId = req.params.id as string;
        await labelService.deleteLabel({_id: labelId});
        return res.status(200).send({});
    }

    // get label for post
    // get label for user
}

const labelController = new LabelController();

export default labelController;
